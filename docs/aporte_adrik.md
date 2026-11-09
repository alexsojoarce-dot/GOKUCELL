# Aporte de Adrik: administración de usuarios

## Objetivo
Incorporar al sistema GOKUCELL un módulo para administrar las cuentas que tienen acceso al panel administrativo.

## Funcionalidades
- Consultar el listado de usuarios registrados.
- Registrar nuevos usuarios.
- Modificar nombre, nombre de usuario y, opcionalmente, contraseña.
- Eliminar usuarios, impidiendo eliminar la cuenta de la sesión actual o el último usuario administrador.
- Validar datos y evitar nombres de usuario duplicados.
- Almacenar contraseñas mediante `password_hash()` de PHP.

## Archivos incorporados
- `usuarios/index.php`
- `administración/usuarios.html`
- `js/usuarios.js`

## Base de datos
Se reutiliza la tabla `usuarios` existente con los campos `id`, `usuario`, `nombre` y `contrasena`. No requiere crear columnas nuevas.

## Integración
El módulo utiliza la conexión y las funciones comunes existentes en `backend/helpers.php`, además del cliente HTTP `js/api.js`.

## Evidencia pendiente
Agregar capturas de las pruebas locales: listado, registro, modificación y eliminación de usuarios. Confirmar el funcionamiento con Apache, MySQL y una sesión iniciada.
