<?php

require_once __DIR__ . "/helpers.php";

if (metodo() !== "POST") {
    fallo("Método no permitido.", 405);
}

// Máximo 5 intentos fallidos cada 5 minutos por sesión.
$ahora = time();
$_SESSION["intentos_login"] = array_values(array_filter(
    $_SESSION["intentos_login"] ?? [], fn($t) => $t > $ahora - 300
));
if (count($_SESSION["intentos_login"]) >= 5) {
    fallo("Demasiados intentos. Esperá unos minutos e intentá de nuevo.", 429);
}

$datos = entrada();
$usuario = texto($datos["usuario"] ?? "", 50);
$contrasena = (string)($datos["contrasena"] ?? "");

if ($usuario === "" || $contrasena === "") {
    fallo("Debes completar todos los campos.");
}

$stmt = $conexion->prepare(
    "SELECT id, usuario, nombre, contrasena FROM usuarios WHERE usuario = ? LIMIT 1"
);
$stmt->execute([$usuario]);
$administrador = $stmt->fetch();

if ($administrador && password_verify($contrasena, $administrador["contrasena"])) {

    session_regenerate_id(true);
    $_SESSION["usuario_id"] = $administrador["id"];
    $_SESSION["usuario"] = $administrador["usuario"];
    $_SESSION["nombre"] = $administrador["nombre"];
    $_SESSION["intentos_login"] = [];

    exito(null, "Inicio de sesión correcto.");
}

$_SESSION["intentos_login"][] = $ahora;
fallo("Usuario o contraseña incorrectos.", 401);