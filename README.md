
Informe de aportes al proyecto GOKUCELL
Proyecto: GOKUCELL – Sistema de gestión para servicio técnico de celulares
Curso: Programación V
Tecnologías: HTML, CSS, JavaScript, PHP y MySQL (XAMPP)

==================================================
RESUMEN DE RESPONSABILIDADES
==================================================

- Alexander: PHP y Backend (conexión, login, sesiones, operaciones de teléfonos, garantías e inventario, consulta pública y comunicación con el Front End).
- Landon: Base de datos (diseño, tablas, llaves, relaciones y archivo SQL).
- Adrik Álvarez: Front End (diseño de la página), publicación en hosting y módulo de administración de usuarios.


==================================================
PARTE 1. APORTE DE ALEXANDER: PHP Y BACKEND
==================================================

1.1 Conexión con MySQL

- backend/basedatos.php: conexión de PHP con MySQL mediante PDO. Si la base no está disponible, responde un error en formato JSON.

1.2 Login y sesiones

- backend/login.php: valida el usuario y la contraseña (cifrada, con password_verify), inicia la sesión y bloquea el acceso tras 5 intentos fallidos seguidos durante 5 minutos.
- backend/logout.php: cierra la sesión.
- backend/verificarsesion.php: indica al Front End si hay una sesión activa.
- Todos los endpoints del panel exigen sesión iniciada. Si no la hay, responden que la sesión expiró y el sistema devuelve al administrador al login.

1.3 Funciones compartidas

- backend/helpers.php: validación de sesión, respuestas JSON uniformes, manejo de errores, validación de datos, generación del código de consulta GOK-XXXXXX y guardado seguro de fotografías (solo JPG, PNG o WEBP, con verificación del contenido real de la imagen).

1.4 Operaciones para registrar, consultar, editar y eliminar

- telefonos/index.php: teléfonos en reparación. Permite registrar, listar, editar y eliminar equipos, con fotografía. Al cambiar un equipo al estado "Entregado" se registra la fecha de entrega y se crea automáticamente su garantía de 1 mes.
- garantias/index.php: consulta y edición de garantías (fechas, duración, datos del cliente y observaciones).
- productos/index.php: inventario. Permite agregar, listar, editar y eliminar productos con fotografía. Controla que no se repitan los códigos de producto.
- backend/estado.php: totales y estadísticas para el dashboard y los reportes (teléfonos por estado, inventario, stock bajo y garantías vigentes, por vencer y vencidas).

1.5 Consulta pública del estado de reparación

- telefonos/consulta.php: el cliente ingresa su código GOK-XXXXXX y ve el equipo, el servicio reportado, el estado y la fecha de recepción. No expone datos personales y limita los intentos para evitar que se adivinen códigos.
- productos/index.php?publico=1: catálogo público de productos, sin precios ni costos y sin necesidad de iniciar sesión.

1.6 Comunicación entre el Front End y la base de datos

- js/api.js: módulo común que envía las peticiones al servidor, maneja los errores y prepara las fotografías (reducción de tamaño antes de enviarlas, de modo que sirven fotos tomadas directamente con el celular).
- Se conectaron a MySQL, reemplazando el almacenamiento local del navegador, los módulos telefonos.js, inventario.js, garantias.js, dashboard.js, reportes.js, catalogo.js y consulta-reparacion.js.

1.7 Funcionalidades terminadas

- Login, cierre de sesión y protección de las páginas del panel.
- Registro, edición y eliminación de teléfonos, con fotografía.
- Código de consulta único por equipo.
- Garantías automáticas al entregar un equipo, editables desde el panel.
- Inventario con fotografías y catálogo público.
- Dashboard y reportes con datos reales.
- Consulta pública del estado de reparación.


==================================================
PARTE 2. APORTE DE LANDON: BASE DE DATOS
==================================================

2.1 Creación y diseño

- Creación de la base de datos MySQL gokucell (codificación utf8mb4).
- Diseño de las tablas del sistema y definición de los campos necesarios para cada módulo.
- Entrega del archivo Basedatos/gokucell.sql, que crea la base, las tablas y los datos iniciales, listo para importar desde phpMyAdmin.

2.2 Tablas

- usuarios (módulo Login): administradores del panel (usuario, nombre y contraseña cifrada).
- telefonos (módulo Teléfonos y reparaciones): cliente, contacto, marca, modelo, fecha de recepción, estado, problema, diagnóstico, foto, fecha de entrega y código de consulta.
- garantias (módulo Garantías): cliente, equipo, tipo, fechas de inicio y vencimiento, duración en meses y observaciones.
- productos (módulo Inventario y catálogo): código, nombre, categoría, marca, existencias, mínimo, costo, precio, foto y destacado.

2.3 Llaves y relaciones

- Llave primaria id autoincremental en las cuatro tablas.
- Llave foránea garantias.telefono_id que referencia a telefonos.id (relación uno a uno: cada teléfono entregado tiene una garantía).
- Si se elimina un teléfono, su garantía se conserva con telefono_id en NULL (ON DELETE SET NULL).

2.4 Restricciones para evitar duplicados

- usuarios.usuario único.

2.5 Diagrama de la base de datos

Diagrama relacional: docs/diagrama-bd


==================================================
PARTE 3. APORTE DE ADRIK ÁLVAREZ: FRONT END, PUBLICACIÓN Y MÓDULO DE USUARIOS
==================================================

3.1 Desarrollo de la página web de GOKUCELL

Una de mis principales contribuciones fue trabajar en el desarrollo y diseño de la página web de GOKUCELL.

Se trabajó en la estructura visual del sitio, buscando que tuviera una apariencia profesional, moderna y relacionada con la identidad del negocio.

Entre los trabajos realizados se encuentran:

- Diseño de la interfaz con una temática oscura y los colores de identidad de GOKUCELL.
- Organización de las secciones de la página.
- Adaptación de la interfaz para dispositivos móviles.
- Ajustes visuales en los elementos, tablas, imágenes y componentes.
- Incorporación y ajustes del logotipo.
- Mejoras en la presentación de los productos.
- Ajustes para que la página fuera más cómoda de utilizar desde teléfonos celulares.
- Trabajo en animaciones y elementos visuales para mejorar la experiencia del usuario.

3.2 Funcionalidades trabajadas para la página

Se trabajó en la estructura de diferentes funcionalidades que forman parte de la idea del sistema:

Consulta del estado de los teléfonos
- Consultar el estado de un teléfono mediante un código.
- Mostrar información relacionada con el dispositivo y su proceso de reparación.

Catálogo de productos
- Mostrar accesorios y productos disponibles.
- Incorporar imágenes de los productos.
- Trabajar en la presentación de los artículos, incluyendo productos de la marca 1hora.
- Se decidió no mostrar los precios en el catálogo público.

Garantías
- Se trabajó en la estructura de un módulo de garantías para organizar la información relacionada con los productos y reparaciones.

Contacto y redes sociales
- Se trabajó en la incorporación de enlaces de contacto.
- Vinculación de WhatsApp.
- Enlaces a Instagram y Facebook.

3.3 Publicación de la página web

También trabajé en el proceso de publicación del sitio:

- Creación de una cuenta en InfinityFree.
- Creación de un subdominio.
- Organización de los archivos para subirlos al hosting.
- Carga de los archivos dentro de la carpeta htdocs.
- Revisión de la página una vez publicada.
- Pruebas de visualización desde un teléfono celular.
- Correcciones para mejorar su funcionamiento y presentación.

La página llegó a visualizarse correctamente desde el teléfono. También se trabajó en solucionar el acceso al panel de administración.

Importante: la publicación y visualización del Front End se realizaron, pero la integración completa con la base de datos y el backend debe verificarse por separado.

3.4 Módulo de administración de usuarios

Además del trabajo realizado en la página, desarrollé un aporte independiente para el repositorio de GitHub: el módulo de administración de usuarios.

Este módulo contempla las siguientes operaciones:

- Registrar usuarios.
- Consultar y mostrar usuarios registrados.
- Editar la información de los usuarios.
- Eliminar usuarios.
- Manejar las contraseñas mediante hash.
- Evitar la eliminación del último usuario administrador.

Archivos incorporados

- Carpeta usuarios/: index.php
- Carpeta administración/: usuarios.html
- Carpeta js/: usuarios.js
- Carpeta documentos/: Documentación del aporte

El módulo utiliza la tabla usuarios que ya existe en la base de datos del proyecto, por lo que se tomó en cuenta la estructura existente para evitar crear una tabla duplicada.

3.5 Trabajo realizado en GitHub

Para incorporar mi aporte al repositorio de Alexander, realicé lo siguiente:

- Ingresé al repositorio principal de GOKUCELL.
- Creé una rama independiente llamada aporte-adrik-usuarios.
- Incorporé mis archivos en sus respectivas carpetas.
- Registré los cambios mediante commits.
- Creé un Pull Request para solicitar la integración de mi aporte a la rama main.

GitHub muestra que el Pull Request no presenta conflictos con la rama principal y que la integración puede realizarse automáticamente.

El Pull Request todavía requiere revisión y aprobación antes de integrarse definitivamente.

3.6 Estado de mi contribución

Trabajo realizado:
- Diseño y desarrollo del Front End de la página.
- Ajustes visuales y adaptación para dispositivos móviles.
- Trabajo en la presentación de productos y secciones del sitio.
- Trabajo en la publicación de la página mediante InfinityFree.
- Pruebas de visualización desde dispositivos móviles.
- Desarrollo del módulo de administración de usuarios.
- Organización de los archivos del módulo.
- Incorporación del aporte al repositorio de GitHub.
- Creación del Pull Request.

Pendiente de completar o verificar en conjunto:
- Revisión e integración del Pull Request.
- Pruebas del CRUD de usuarios con la base de datos.
- Verificación de la conexión entre el Front End y el backend.
- Comprobación de las funcionalidades del sistema completo.
- Integración y validación de los módulos desarrollados por los demás integrantes.

3.7 Conclusión

Mi aporte al proyecto GOKUCELL se concentró principalmente en el desarrollo de la página web, su diseño visual, adaptación a dispositivos móviles y publicación inicial en un servicio de hosting.

Adicionalmente, desarrollé el módulo CRUD de administración de usuarios y lo incorporé al repositorio mediante una rama independiente y un Pull Request.

El objetivo fue contribuir tanto a la parte visual del sistema como a su parte administrativa, manteniendo una organización que permita integrar el trabajo de todos los integrantes del equipo.
