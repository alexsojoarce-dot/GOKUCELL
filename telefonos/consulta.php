<?php
/* Consulta PÚBLICA del estado de una reparación por código (GOK-XXXXXX).
 * Solo expone equipo, servicio reportado, estado y fecha de recepción. */

require_once __DIR__ . "/../backend/helpers.php";

if (metodo() !== "GET") { fallo("Método no permitido.", 405); }

// Límite básico contra adivinar códigos: 20 intentos cada 10 minutos por sesión.
$ahora = time();
$_SESSION["consultas"] = array_values(array_filter(
    $_SESSION["consultas"] ?? [], fn($t) => $t > $ahora - 600
));
if (count($_SESSION["consultas"]) >= 20) {
    fallo("Demasiados intentos. Esperá unos minutos e intentá de nuevo.", 429);
}
$_SESSION["consultas"][] = $ahora;

$codigo = strtoupper(trim($_GET["codigo"] ?? ""));
if (!preg_match('/^GOK-[A-Z0-9]{6}$/', $codigo)) {
    fallo("Escribí el código con el formato GOK-XXXXXX.", 422);
}

$s = $conexion->prepare("SELECT marca, modelo, problema, estado, fecha_recepcion
                         FROM telefonos WHERE codigo_consulta = ?");
$s->execute([$codigo]);
$t = $s->fetch();

if (!$t) { fallo("No encontramos una reparación con ese código.", 404); }

exito([
    "brand"    => $t["marca"],
    "model"    => $t["modelo"],
    "problem"  => $t["problema"],
    "status"   => $t["estado"],
    "received" => $t["fecha_recepcion"],
]);