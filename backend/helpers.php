<?php
/*
 * Funciones compartidas por todos los endpoints del panel.
 * Uso:  require_once __DIR__ . "/../backend/helpers.php";
 */

// Nunca mostrar errores de PHP en pantalla: rompen el JSON.
ini_set("display_errors", "0");
error_reporting(E_ALL);

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

header("Content-Type: application/json; charset=UTF-8");
header("Cache-Control: no-store");

require_once __DIR__ . "/basedatos.php";

// Cualquier error inesperado se responde como JSON limpio.
set_exception_handler(function ($e) {
    error_log("GOKUCELL: " . $e->getMessage());
    responder(["success" => false, "message" => "Error interno del servidor."], 500);
});

const ESTADOS_TELEFONO = [
    "Recibido", "En revisión", "En reparación", "Listo para entregar", "Entregado"
];

const CATEGORIAS_PRODUCTO = [
    "Estuches", "Cargadores", "Cables", "Audífonos", "Protectores", "Power banks",
    "Bocinas", "Cargadores inalámbricos", "Pilas", "Repuestos", "Otros"
];

function responder(array $datos, int $codigo = 200): void
{
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function exito($datos = null, string $mensaje = "OK", int $codigo = 200): void
{
    responder(["success" => true, "message" => $mensaje, "datos" => $datos], $codigo);
}

function fallo(string $mensaje, int $codigo = 400): void
{
    responder(["success" => false, "message" => $mensaje], $codigo);
}

function requerir_sesion(): void
{
    if (empty($_SESSION["usuario_id"])) {
        fallo("Tu sesión expiró. Iniciá sesión de nuevo.", 401);
    }
}

function metodo(): string
{
    return strtoupper($_SERVER["REQUEST_METHOD"] ?? "GET");
}

function entrada(): array
{
    $datos = json_decode(file_get_contents("php://input"), true);
    return is_array($datos) ? $datos : [];
}

function texto($valor, int $max = 255): string
{
    return mb_substr(trim((string)($valor ?? "")), 0, $max);
}

function fecha_valida($valor): bool
{
    $d = DateTime::createFromFormat("Y-m-d", (string)$valor);
    return $d && $d->format("Y-m-d") === $valor;
}

function sumar_meses(string $fecha, int $meses): string
{
    [$y, $m, $d] = array_map("intval", explode("-", $fecha));
    $mes = $m - 1 + $meses;
    $anio = $y + intdiv($mes, 12);
    $mes = (($mes % 12) + 12) % 12;
    $ultimo = (int)date("t", mktime(0, 0, 0, $mes + 1, 1, $anio));
    return sprintf("%04d-%02d-%02d", $anio, $mes + 1, min($d, $ultimo));
}

// Código público del tipo GOK-XXXXXX (10 caracteres, único).
function generar_codigo(PDO $conexion): string
{
    $alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    $existe = $conexion->prepare("SELECT 1 FROM telefonos WHERE codigo_consulta = ?");
    do {
        $token = "";
        for ($i = 0; $i < 6; $i++) {
            $token .= $alfabeto[random_int(0, strlen($alfabeto) - 1)];
        }
        $codigo = "GOK-" . $token;
        $existe->execute([$codigo]);
    } while ($existe->fetch());
    return $codigo;
}

/*
 * Guarda una imagen recibida como data URL (data:image/jpeg;base64,...) en
 * img/subidas/ y devuelve la ruta relativa para guardar en la base de datos.
 */
function guardar_foto(?string $dataUrl, string $prefijo): ?string
{
    if (!$dataUrl || strpos($dataUrl, "data:image/") !== 0) {
        return null;
    }
    if (!preg_match('#^data:image/(jpeg|png|webp);base64,(.+)$#s', $dataUrl, $m)) {
        fallo("Formato de imagen no permitido. Usá JPG, PNG o WEBP.");
    }
    $binario = base64_decode($m[2], true);
    if ($binario === false || strlen($binario) > 3 * 1024 * 1024) {
        fallo("La imagen es inválida o supera 3 MB.");
    }
    $info = @getimagesizefromstring($binario);
    $tipos = [IMAGETYPE_JPEG => "jpg", IMAGETYPE_PNG => "png", IMAGETYPE_WEBP => "webp"];
    if (!$info || !isset($tipos[$info[2]])) {
        fallo("El archivo no es una imagen válida.");
    }
    $carpeta = dirname(__DIR__) . "/img/subidas";
    if (!is_dir($carpeta) && !mkdir($carpeta, 0755, true)) {
        fallo("No se pudo preparar la carpeta de imágenes.", 500);
    }
    $nombre = $prefijo . "_" . bin2hex(random_bytes(8)) . "." . $tipos[$info[2]];
    if (file_put_contents($carpeta . "/" . $nombre, $binario) === false) {
        fallo("No se pudo guardar la imagen.", 500);
    }
    return "img/subidas/" . $nombre;
}

// Solo borra archivos subidos por el panel, nunca las imágenes del sitio.
function borrar_foto(?string $ruta): void
{
    if ($ruta && preg_match('#^img/subidas/[A-Za-z0-9_.-]+$#', $ruta)) {
        $archivo = dirname(__DIR__) . "/" . $ruta;
        if (is_file($archivo)) { @unlink($archivo); }
    }
}