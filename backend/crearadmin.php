<?php

require_once "basedatos.php";

$usuario = "admin";
$nombre = "Administrador";
$contrasena = "Goku2026!";

$sql = "SELECT id FROM usuarios WHERE usuario = ?";
$stmt = $conexion->prepare($sql);
$stmt->execute([$usuario]);

if ($stmt->fetch()) {

    echo "El administrador ya está registrado.";

} else {

    $hash = password_hash($contrasena, PASSWORD_DEFAULT);

    $sql = "INSERT INTO usuarios
            (usuario, nombre, contrasena)
            VALUES (?, ?, ?)";

    $stmt = $conexion->prepare($sql);
    $stmt->execute([$usuario, $nombre, $hash]);

    echo "Administrador registrado correctamente.";
}
?>