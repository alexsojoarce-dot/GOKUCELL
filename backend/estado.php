<?php
/* Resumen para el dashboard y los reportes. Solo administradores. */

require_once __DIR__ . "/helpers.php";
requerir_sesion();

if (metodo() !== "GET") { fallo("Método no permitido.", 405); }

$porEstado = array_fill_keys(ESTADOS_TELEFONO, 0);
foreach ($conexion->query("SELECT estado, COUNT(*) total FROM telefonos GROUP BY estado") as $f) {
    $porEstado[$f["estado"]] = (int)$f["total"];
}

$inv = $conexion->query("SELECT COUNT(*) total,
        COALESCE(SUM(existencias), 0) unidades,
        COALESCE(SUM(existencias * costo), 0) valor,
        SUM(existencias IS NOT NULL AND existencias <= minimo) bajo,
        SUM(existencias > 0) disponibles
    FROM productos")->fetch();

$gar = $conexion->query("SELECT COUNT(*) total,
        COALESCE(SUM(fecha_vencimiento >= CURDATE()), 0) vigentes,
        COALESCE(SUM(fecha_vencimiento >= CURDATE() AND fecha_vencimiento <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)), 0) por_vencer,
        COALESCE(SUM(fecha_vencimiento < CURDATE()), 0) vencidas
    FROM garantias")->fetch();

$recientes = $conexion->query("SELECT marca, modelo, cliente, estado, fecha_recepcion, foto
    FROM telefonos ORDER BY fecha_recepcion DESC, id DESC LIMIT 5")->fetchAll();

exito([
    "telefonos" => [
        "total"     => array_sum($porEstado),
        "porEstado" => $porEstado,
        "recientes" => array_map(fn($f) => [
            "brand" => $f["marca"], "model" => $f["modelo"], "customer" => $f["cliente"],
            "status" => $f["estado"], "received" => $f["fecha_recepcion"], "photo" => $f["foto"] ?? ""
        ], $recientes),
    ],
    "productos" => [
        "total"       => (int)$inv["total"],
        "unidades"    => (int)$inv["unidades"],
        "valor"       => (float)$inv["valor"],
        "stockBajo"   => (int)$inv["bajo"],
        "disponibles" => (int)$inv["disponibles"],
    ],
    "garantias" => [
        "total"     => (int)$gar["total"],
        "vigentes"  => (int)$gar["vigentes"],
        "porVencer" => (int)$gar["por_vencer"],
        "vencidas"  => (int)$gar["vencidas"],
    ],
]);