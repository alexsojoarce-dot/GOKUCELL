<?php
/*
 * Módulo de administración de usuarios GOKUCELL.
 * GET: listar usuarios.
 * POST: registrar usuario.
 * PUT ?id=: modificar usuario.
 * DELETE ?id=: eliminar usuario.
 */
require_once __DIR__ . "/../backend/helpers.php";
requerir_sesion();

function usuario_valido(string $usuario): bool
{
    return (bool)preg_match('/^[A-Za-z0-9_.-]{3,50}$/', $usuario);
}

function obtener_usuario(PDO $conexion, int $id): ?array
{
    $consulta = $conexion->prepare(
        "SELECT id, usuario, nombre FROM usuarios WHERE id = ? LIMIT 1"
    );
    $consulta->execute([$id]);
    $fila = $consulta->fetch();
    return $fila ?: null;
}

function responder_duplicado(PDOException $error): void
{
    if ($error->getCode() === "23000") {
        fallo("Ese nombre de usuario ya está registrado.", 409);
    }
    throw $error;
}

switch (metodo()) {
    case "GET":
        $usuarios = $conexion->query(
            "SELECT id, usuario, nombre FROM usuarios ORDER BY nombre, usuario"
        )->fetchAll();

        exito([
            "usuarios" => array_map(static function ($fila) {
                return [
                    "id" => (int)$fila["id"],
                    "usuario" => $fila["usuario"],
                    "nombre" => $fila["nombre"]
                ];
            }, $usuarios),
            "usuarioActualId" => (int)$_SESSION["usuario_id"]
        ]);

    case "POST":
        $datos = entrada();
        $usuario = texto($datos["usuario"] ?? "", 50);
        $nombre = texto($datos["nombre"] ?? "", 100);
        $contrasena = (string)($datos["contrasena"] ?? "");

        if (!usuario_valido($usuario)) {
            fallo("El usuario debe tener entre 3 y 50 caracteres y solo puede usar letras, números, punto, guion o guion bajo.");
        }
        if ($nombre === "") {
            fallo("El nombre completo es obligatorio.");
        }
        if (strlen($contrasena) < 10) {
            fallo("La contraseña debe tener al menos 10 caracteres.");
        }

        $hash = password_hash($contrasena, PASSWORD_DEFAULT);

        try {
            $insertar = $conexion->prepare(
                "INSERT INTO usuarios (usuario, nombre, contrasena) VALUES (?, ?, ?)"
            );
            $insertar->execute([$usuario, $nombre, $hash]);
        } catch (PDOException $error) {
            responder_duplicado($error);
        }

        exito(
            obtener_usuario($conexion, (int)$conexion->lastInsertId()),
            "Usuario registrado correctamente.",
            201
        );

    case "PUT":
        $id = (int)($_GET["id"] ?? 0);
        if ($id < 1 || !obtener_usuario($conexion, $id)) {
            fallo("No se encontró el usuario solicitado.", 404);
        }

        $datos = entrada();
        $usuario = texto($datos["usuario"] ?? "", 50);
        $nombre = texto($datos["nombre"] ?? "", 100);
        $contrasena = (string)($datos["contrasena"] ?? "");

        if (!usuario_valido($usuario)) {
            fallo("El usuario debe tener entre 3 y 50 caracteres y solo puede usar letras, números, punto, guion o guion bajo.");
        }
        if ($nombre === "") {
            fallo("El nombre completo es obligatorio.");
        }
        if ($contrasena !== "" && strlen($contrasena) < 10) {
            fallo("La nueva contraseña debe tener al menos 10 caracteres.");
        }

        try {
            if ($contrasena !== "") {
                $hash = password_hash($contrasena, PASSWORD_DEFAULT);
                $actualizar = $conexion->prepare(
                    "UPDATE usuarios SET usuario = ?, nombre = ?, contrasena = ? WHERE id = ?"
                );
                $actualizar->execute([$usuario, $nombre, $hash, $id]);
            } else {
                $actualizar = $conexion->prepare(
                    "UPDATE usuarios SET usuario = ?, nombre = ? WHERE id = ?"
                );
                $actualizar->execute([$usuario, $nombre, $id]);
            }
        } catch (PDOException $error) {
            responder_duplicado($error);
        }

        exito(obtener_usuario($conexion, $id), "Usuario actualizado correctamente.");

    case "DELETE":
        $id = (int)($_GET["id"] ?? 0);
        if ($id < 1 || !obtener_usuario($conexion, $id)) {
            fallo("No se encontró el usuario solicitado.", 404);
        }

        if ($id === (int)$_SESSION["usuario_id"]) {
            fallo("No podés eliminar la cuenta con la que tenés la sesión iniciada.", 403);
        }

        try {
            $conexion->beginTransaction();

            $cantidad = (int)$conexion->query(
                "SELECT COUNT(*) FROM usuarios FOR UPDATE"
            )->fetchColumn();

            if ($cantidad <= 1) {
                $conexion->rollBack();
                fallo("No se puede eliminar el último usuario administrador.", 409);
            }

            $eliminar = $conexion->prepare("DELETE FROM usuarios WHERE id = ?");
            $eliminar->execute([$id]);
            $conexion->commit();
        } catch (Throwable $error) {
            if ($conexion->inTransaction()) {
                $conexion->rollBack();
            }
            throw $error;
        }

        exito(null, "Usuario eliminado correctamente.");

    default:
        fallo("Método no permitido.", 405);
}
