/* Comunicación con el servidor PHP (compartido por todas las pantallas). */
window.GokuAPI = (() => {
  // La carpeta raíz del sitio es la carpeta superior a /js/
  const raiz = new URL("../", document.currentScript.src);
  const url = ruta => new URL(ruta, raiz).href;

  async function pedir(ruta, { method = "GET", cuerpo } = {}) {
    let respuesta;
    try {
      respuesta = await fetch(url(ruta), {
        method,
        credentials: "same-origin",
        headers: cuerpo ? { "Content-Type": "application/json" } : {},
        body: cuerpo ? JSON.stringify(cuerpo) : undefined
      });
    } catch (e) {
      throw new Error("No se pudo conectar con el servidor.");
    }
    let datos;
    try { datos = await respuesta.json(); }
    catch (e) { throw new Error("El servidor devolvió una respuesta inválida."); }

    if (respuesta.status === 401 && location.pathname.includes("/admin/")) {
      location.replace(url("admin/login.html"));
    }
    if (!respuesta.ok || datos.success === false) {
      throw new Error(datos.message || "Ocurrió un error inesperado.");
    }
    return datos.datos;
  }

  // Ruta de imagen guardada en la base → URL usable en <img>
  const foto = ruta => !ruta ? "" : /^(https?:|data:)/.test(ruta) ? ruta : url(ruta);

  // Lee una imagen (por ejemplo una foto tomada con el teléfono), la reduce
  // y la devuelve como data URL JPEG liviana.
  function leerFoto(archivo, maximo = 1000) {
    return new Promise((resolver, rechazar) => {
      const direccion = URL.createObjectURL(archivo);
      const img = new Image();
      img.onerror = () => {
        URL.revokeObjectURL(direccion);
        rechazar(new Error("No se pudo leer la fotografía. Usá una imagen JPG, PNG o WEBP (las fotos HEIC de iPhone deben convertirse a JPG)."));
      };
      img.onload = () => {
        const escala = Math.min(1, maximo / Math.max(img.width, img.height));
        const lienzo = document.createElement("canvas");
        lienzo.width = Math.round(img.width * escala);
        lienzo.height = Math.round(img.height * escala);
        lienzo.getContext("2d").drawImage(img, 0, 0, lienzo.width, lienzo.height);
        URL.revokeObjectURL(direccion);
        resolver(lienzo.toDataURL("image/jpeg", 0.8));
      };
      img.src = direccion;
    });
  }

  const avisar = (mensaje, tipo = "info") => window.GokuUI?.toast?.(mensaje, tipo);

  return { url, pedir, foto, leerFoto, avisar };
})();