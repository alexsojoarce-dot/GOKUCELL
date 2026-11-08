<?php
/* Inventario y catálogo.
 * GET ?publico=1  → catálogo público (sin precios ni costos, sin sesión)
 * GET / POST / PUT ?id= / DELETE ?id= → administración (requiere sesión) */

require_once __DIR__ . "/../backend/helpers.php";

function mapear(array $f): array
{
    return [
        "id"       => (int)$f["id"],
        "name"     => $f["nombre"],
        "code"     => $f["codigo"] ?? "",
        "category" => $f["categoria"],
        "brand"    => $f["marca"] ?? "",
        "qty"      => $f["existencias"] !== null ? (int)$f["existencias"] : null,
        "min"      => (int)$f["minimo"],
        "cost"     => $f["costo"] !== null ? (float)$f["costo"] : null,
        "price"    => $f["precio"] !== null ? (float)$f["precio"] : null,
        "photo"    => $f["foto"] ?? "",
        "featured" => (bool)$f["destacado"],
    ];
}

function numero_o_null($v, bool $entero = false)
{
    if ($v === null || $v === "") { return null; }
    if (!is_numeric($v) || $v < 0) { fallo("Los números no pueden ser negativos."); }
    return $entero ? (int)$v : round((float)$v, 2);
}

// Catálogo público: no requiere sesión.
if (metodo() === "GET" && isset($_GET["publico"])) {
    $filas = $conexion->query("SELECT id, nombre, codigo, categoria, marca, foto
        FROM productos WHERE destacado = 1 OR existencias > 0 ORDER BY categoria, nombre")->fetchAll();
    exito(array_map(fn($f) => [
        "id" => (int)$f["id"], "name" => $f["nombre"], "code" => $f["codigo"] ?? "",
        "category" => $f["categoria"], "brand" => $f["marca"] ?? "", "photo" => $f["foto"] ?? ""
    ], $filas));
}

requerir_sesion();
$id = (int)($_GET["id"] ?? 0);

function obtener(PDO $c, int $id): ?array
{
    $s = $c->prepare("SELECT * FROM productos WHERE id = ?");
    $s->execute([$id]);
    return $s->fetch() ?: null;
}

function validar(array $d): array
{
    $v = [
        "nombre"      => texto($d["name"] ?? "", 120),
        "codigo"      => texto($d["code"] ?? "", 30) ?: null,
        "categoria"   => texto($d["category"] ?? "", 60),
        "marca"       => texto($d["brand"] ?? "", 60) ?: null,
        "existencias" => numero_o_null($d["qty"] ?? null, true),
        "minimo"      => numero_o_null($d["min"] ?? 3, true) ?? 3,
        "costo"       => numero_o_null($d["cost"] ?? null),
        "precio"      => numero_o_null($d["price"] ?? null),
        "destacado"   => !empty($d["featured"]) ? 1 : 0,
    ];
    if ($v["nombre"] === "") { fallo("El nombre del producto es obligatorio."); }
    if (!in_array($v["categoria"], CATEGORIAS_PRODUCTO, true)) { fallo("Elegí una categoría válida."); }
    return $v;
}

function guardar(PDO $c, string $sql, array $params): void
{
    try {
        $c->prepare($sql)->execute($params);
    } catch (PDOException $e) {
        if ($e->getCode() === "23000") { fallo("Ya existe un producto con ese código.", 409); }
        throw $e;
    }
}

switch (metodo()) {

    case "GET":
        $filas = $conexion->query("SELECT * FROM productos ORDER BY id DESC")->fetchAll();
        exito(array_map("mapear", $filas));

    case "POST":
        $d = entrada();
        $v = validar($d);
        $foto = guardar_foto($d["photo"] ?? null, "prod");
        guardar($conexion, "INSERT INTO productos
            (codigo, nombre, categoria, marca, existencias, minimo, costo, precio, foto, destacado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [$v["codigo"], $v["nombre"], $v["categoria"], $v["marca"], $v["existencias"],
             $v["minimo"], $v["costo"], $v["precio"], $foto, $v["destacado"]]);
        exito(mapear(obtener($conexion, (int)$conexion->lastInsertId())), "Producto agregado.", 201);

    case "PUT":
        $actual = $id ? obtener($conexion, $id) : null;
        if (!$actual) { fallo("Producto no encontrado.", 404); }
        $d = entrada();
        $v = validar($d);
        $foto = $actual["foto"];
        $nueva = guardar_foto($d["photo"] ?? null, "prod");
        guardar($conexion, "UPDATE productos SET codigo=?, nombre=?, categoria=?, marca=?, existencias=?,
            minimo=?, costo=?, precio=?, foto=?, destacado=? WHERE id=?",
            [$v["codigo"], $v["nombre"], $v["categoria"], $v["marca"], $v["existencias"],
             $v["minimo"], $v["costo"], $v["precio"], $nueva ?: $foto, $v["destacado"], $id]);
        if ($nueva) { borrar_foto($foto); }
        exito(mapear(obtener($conexion, $id)), "Producto actualizado.");

    case "DELETE":
        $actual = $id ? obtener($conexion, $id) : null;
        if (!$actual) { fallo("Producto no encontrado.", 404); }
        $conexion->prepare("DELETE FROM productos WHERE id = ?")->execute([$id]);
        borrar_foto($actual["foto"]);
        exito(null, "Producto eliminado.");

    default:
        fallo("Método no permitido.", 405);
}