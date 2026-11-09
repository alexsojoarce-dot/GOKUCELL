 GOKUCELL

Sistema web para un taller de reparación de celulares: registro de equipos,
inventario de accesorios, garantías y consulta pública del estado de reparación.

 Tecnologías
HTML, CSS, JavaScript, PHP y MySQL (XAMPP).

 Instalación
1. Copiar la carpeta del proyecto a C:\xampp\htdocs\GOKUCELL.
2. Iniciar Apache y MySQL desde el panel de XAMPP.
3. Importar Basedatos/gokucell.sql en phpMyAdmin (pestaña Importar).
4. Abrir http://localhost/GOKUCELL/ para el sitio público y
   http://localhost/GOKUCELL/admin/login.html para el panel administrativo.

El usuario inicial del panel es admin. La contraseña es de desarrollo y debe
cambiarse antes de un uso real.

 Aporte de Alexander: PHP y Backend

 Conexión con MySQL
- backend/basedatos.php: conexión de PHP con MySQL mediante PDO. Si la base
  no está disponible, responde un error en formato JSON.

 Login y sesiones
- backend/login.php: valida el usuario y la contraseña (cifrada con
  password_verify, inicia la sesión y bloquea el acceso tras 5 intentos
  fallidos seguidos durante 5 minutos.
- backend/logout.php: cierra la sesión.
- backend/verificarsesion.php: indica al Front End si hay una sesión activa.
- Todos los endpoints del panel exigen sesión iniciada; si no la hay, responden
  que la sesión expiró y el sistema devuelve al administrador al login.

Funciones compartidas
- backend/helpers.php: validación de sesión, respuestas JSON uniformes,
  manejo de errores, validación de datos, generación del código de consulta
  GOK-XXXXXX y guardado seguro de fotografías (solo JPG, PNG o WEBP, con
  verificación del contenido real de la imagen).

 Operaciones para registrar, consultar, editar y eliminar
- telefonos/index.php: teléfonos en reparación. Permite registrar, listar,
  editar y eliminar equipos, con fotografía. Al cambiar un equipo al estado
  "Entregado" se registra la fecha de entrega y se crea automáticamente su
  garantía de 1 mes.
- garantias/index.php: consulta y edición de garantías (fechas, duración,
  datos del cliente y observaciones).
- productos/index.php: inventario. Permite agregar, listar, editar y eliminar
  productos con fotografía. Controla que no se repitan los códigos de producto.
- backend/estado.php: totales y estadísticas para el dashboard y los reportes
  (teléfonos por estado, inventario, stock bajo y garantías vigentes, por
  vencer y vencidas).

 Consulta pública del estado de reparación
- telefonos/consulta.php: el cliente ingresa su código `GOK-XXXXXX` y ve el
  equipo, el servicio reportado, el estado y la fecha de recepción. No expone
  datos personales y limita los intentos para evitar que se adivinen códigos.
- productos/index.php?publico=1: catálogo público de productos, sin precios ni
  costos y sin necesidad de iniciar sesión.

 Comunicación entre el Front End y la base de datos
- js/api.js: módulo común que envía las peticiones al servidor, maneja los
  errores y prepara las fotografías (reducción de tamaño antes de enviarlas,
  de modo que sirven fotos tomadas directamente con el celular).
- Se conectaron a MySQL, reemplazando el almacenamiento local del navegador, los
  módulos telefonos.js, inventario.js, garantias.js, dashboard.js,
  reportes.js, catalogo.js y consulta-reparacion.js.

 Funcionalidades terminadas
- Login, cierre de sesión y protección de las páginas del panel
- Registro, edición y eliminación de teléfonos, con fotografía
- Código de consulta único por equipo
- Garantías automáticas al entregar un equipo, editables desde el panel
- Inventario con fotografías y catálogo público
- Dashboard y reportes con datos reales
- Consulta pública del estado de reparación

 Funcionalidades pendientes
- Crear y eliminar garantías manualmente desde el panel (hoy se crean solo al
  entregar un equipo).
- Cambio de contraseña y administración de más usuarios.
- Registro de movimientos de inventario (entradas y salidas de stock).
- Exportar los reportes a PDF o Excel.

 Diagrama de la base de datos
 Diagrama relacional=(docs/diagrama-bd)

Integrantes
- Alexander: PHP y Backend