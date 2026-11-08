<?php

session_start();

header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Pragma: no-cache");

if (!empty($_SESSION["usuario_id"])) {

    echo json_encode([
        "autenticado" => true,
        "usuario"     => $_SESSION["usuario"] ?? "",
        "nombre"      => $_SESSION["nombre"] ?? ""
    ]);

} else {

    http_response_code(401);

    echo json_encode([
        "autenticado" => false,
        "message"     => "No hay una sesión activa."
    ]);
}