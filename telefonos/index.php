<?php
/* Teléfonos en reparación. Solo administradores.
 * GET (lista) · POST (crear) · PUT ?id= (editar) · DELETE ?id= (eliminar) */

require_once __DIR__ . "/../backend/helpers.php";
requerir_sesion();

const SQL_TELEFONO = "SELECT t.*, g.id AS garantia_id, g.fecha_vencimiento AS garantia_fin
                      FROM telefonos t
                      LEFT JOIN garantias g ON g.telefono_id = t.id";

function mapear(array $f): array
{
    return [
        "id"          => (int)$f["id"],
        "ticketCode"  => $f["codigo_consulta"],
        "customer"    => $f["cliente"],
        "contact"     => $f["contacto"],
        "brand"       => $f["marca"],
        "model"       => $f["modelo"],
        "received"    => $f["fecha_recepcion"],
        "status"      => $f["estado"],
        "problem"     => $f["problema"],
        "diagnosis"   => $f["diagnostico"] ?? "",
        "photo"       => $f["foto"] ?? "",
        "deliveredOn" => $f["fecha_entrega"] ?? "",
        "warrantyId"  => $f["garantia_id"] ? (int)$f["garantia_id"] : null,
        "warrantyEnd" => $f["garantia_fin"] ?? null,
    ];
}

function obtener(PDO $c, int $id): ?array
{
    $s = $c->prepare(SQL_TELEFONO . " WHERE t.id = ?");
    $s->execute([$id]);
    $f = $s->fetch();
    return $f ?: null;
}

function validar(array $d): array
{
    $v = [
        "cliente"         => texto($d["customer"] ?? "", 100),
        "contacto"        => texto($d["contact"] ?? "", 60),
        "marca"           => texto($d["brand"] ?? "", 50),
        "modelo"          => texto($d["model"] ?? "", 50),
        "fecha_recepcion" => texto($d["received"] ?? "", 10),
        "estado"          => texto($d["status"] ?? "Recibido", 30),
        "problema"        => texto($d["problem"] ?? "", 5000),
        "diagnostico"     => texto($d["diagnosis"] ?? "", 5000),
    ];
    foreach (["cliente", "contacto", "marca", "modelo", "problema"] as $campo) {
        if ($v[$campo] === "") { fallo("Completá todos los campos obligatorios."); }
    }
    if (!fecha_valida($v["fecha_recepcion"])) { fallo("La fecha de recepción no es válida."); }
    if (!in_array($v["estado"], ESTADOS_TELEFONO, true)) { fallo("Estado no válido."); }
    return $v;
}

// Al entregar un equipo se crea (una sola vez) su garantía inicial de 1 mes.
function asegurar_garantia(PDO $c, int $id): void
{
    $t = obtener($c, $id);
    if (!$t || $t["estado"] !== "Entregado" || $t["garantia_id"]) { return; }
    $inicio = $t["fecha_entrega"] ?: date("Y-m-d");
    $c->prepare("INSERT IGNORE INTO garantias
        (telefono_id, cliente, contacto, equipo, tipo, fecha_inicio, fecha_vencimiento,
         duracion_meses, observaciones, automatica)
        VALUES (?, ?, ?, ?, 'Servicio técnico', ?, ?, 1, ?, 1)")
      ->execute([
        $id, $t["cliente"], $t["contacto"], $t["marca"] . " " . $t["modelo"],
        $inicio, sumar_meses($inicio, 1),
        "Garantía inicial de 1 mes. Podés modificar su período y observaciones desde el módulo Garantías."
      ]);
}

$id = (int)($_GET["id"] ?? 0);

switch (metodo()) {

    case "GET":
        $filas = $conexion->query(SQL_TELEFONO . " ORDER BY t.fecha_recepcion DESC, t.id DESC")->fetchAll();
        exito(array_map("mapear", $filas));

    case "POST":
        $d = entrada();
        $v = validar($d);
        $foto = guardar_foto($d["photo"] ?? null, "tel");
        $entrega = $v["estado"] === "Entregado" ? date("Y-m-d") : null;

        for ($intento = 0; $intento < 5; $intento++) {
            try {
                $conexion->prepare("INSERT INTO telefonos
                    (codigo_consulta, cliente, contacto, marca, modelo, fecha_recepcion,
                     estado, problema, diagnostico, foto, fecha_entrega)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
                  ->execute([generar_codigo($conexion), $v["cliente"], $v["contacto"], $v["marca"],
                    $v["modelo"], $v["fecha_recepcion"], $v["estado"], $v["problema"],
                    $v["diagnostico"] ?: null, $foto, $entrega]);
                break;
            } catch (PDOException $e) {
                if ($e->getCode() !== "23000" || $intento === 4) { throw $e; }
            }
        }
        $nuevo = (int)$conexion->lastInsertId();
        asegurar_garantia($conexion, $nuevo);
        exito(mapear(obtener($conexion, $nuevo)), "Teléfono registrado.", 201);

    case "PUT":
        $actual = $id ? obtener($conexion, $id) : null;
        if (!$actual) { fallo("Registro no encontrado.", 404); }
        $d = entrada();
        $v = validar($d);

        $foto = $actual["foto"];
        $nueva = guardar_foto($d["photo"] ?? null, "tel");
        if ($nueva) { borrar_foto($foto); $foto = $nueva; }

        $entrega = $actual["fecha_entrega"];
        if ($v["estado"] === "Entregado" && !$entrega) { $entrega = date("Y-m-d"); }

        $conexion->prepare("UPDATE telefonos SET cliente=?, contacto=?, marca=?, modelo=?,
            fecha_recepcion=?, estado=?, problema=?, diagnostico=?, foto=?, fecha_entrega=?
            WHERE id=?")
          ->execute([$v["cliente"], $v["contacto"], $v["marca"], $v["modelo"], $v["fecha_recepcion"],
            $v["estado"], $v["problema"], $v["diagnostico"] ?: null, $foto, $entrega, $id]);
        asegurar_garantia($conexion, $id);
        exito(mapear(obtener($conexion, $id)), "Registro actualizado.");

    case "DELETE":
        $actual = $id ? obtener($conexion, $id) : null;
        if (!$actual) { fallo("Registro no encontrado.", 404); }
        borrar_foto($actual["foto"]);
        $conexion->prepare("DELETE FROM telefonos WHERE id = ?")->execute([$id]);
        exito(null, "Registro eliminado.");

    default:
        fallo("Método no permitido.", 405);
}