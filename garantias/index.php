<?php
/* Garantías. Solo administradores. GET (lista) · PUT ?id= (editar) */

require_once __DIR__ . "/../backend/helpers.php";
requerir_sesion();

function mapear(array $f): array
{
    return [
        "id"             => (int)$f["id"],
        "sourcePhoneId"  => $f["telefono_id"] ? (int)$f["telefono_id"] : null,
        "client"         => $f["cliente"],
        "contact"        => $f["contacto"] ?? "",
        "item"           => $f["equipo"],
        "type"           => $f["tipo"],
        "start"          => $f["fecha_inicio"],
        "end"            => $f["fecha_vencimiento"],
        "durationMonths" => $f["duracion_meses"] !== null ? (int)$f["duracion_meses"] : null,
        "notes"          => $f["observaciones"] ?? "",
        "automatic"      => (bool)$f["automatica"],
    ];
}

switch (metodo()) {

    case "GET":
        $filas = $conexion->query("SELECT * FROM garantias ORDER BY fecha_vencimiento ASC, id DESC")->fetchAll();
        exito(array_map("mapear", $filas));

    case "PUT":
        $id = (int)($_GET["id"] ?? 0);
        $d = entrada();
        $inicio = texto($d["start"] ?? "", 10);
        $fin = texto($d["end"] ?? "", 10);
        $cliente = texto($d["client"] ?? "", 100);
        $equipo = texto($d["item"] ?? "", 150);
        $meses = isset($d["durationMonths"]) ? (int)$d["durationMonths"] : null;

        if ($cliente === "" || $equipo === "") { fallo("Completá cliente y equipo."); }
        if (!fecha_valida($inicio) || !fecha_valida($fin)) { fallo("Las fechas no son válidas."); }
        if ($fin < $inicio) { fallo("El vencimiento no puede ser anterior a la fecha de entrega."); }
        if ($meses !== null && ($meses < 0 || $meses > 120)) { fallo("Duración no válida."); }

        $s = $conexion->prepare("UPDATE garantias SET cliente=?, contacto=?, equipo=?, fecha_inicio=?,
            fecha_vencimiento=?, duracion_meses=?, observaciones=? WHERE id=?");
        $s->execute([$cliente, texto($d["contact"] ?? "", 60) ?: null, $equipo, $inicio, $fin,
            $meses, texto($d["notes"] ?? "", 5000) ?: null, $id]);

        $f = $conexion->prepare("SELECT * FROM garantias WHERE id = ?");
        $f->execute([$id]);
        $fila = $f->fetch();
        if (!$fila) { fallo("Garantía no encontrada.", 404); }
        exito(mapear($fila), "Garantía actualizada.");

    default:
        fallo("Método no permitido.", 405);
}