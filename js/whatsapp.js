(() => {
  // WhatsApp se utiliza únicamente en enlaces de contacto y consultas específicas.
  // No se agrega botón flotante ni se modifican los enlaces de navegación.
  const number = "50688716632";
  const base = `https://wa.me/${number}`;
  document.querySelectorAll("[data-whatsapp-message]").forEach(link => {
    const message = link.getAttribute("data-whatsapp-message") || "Hola GOKUCELL, quisiera hacer una consulta.";
    link.href = `${base}?text=${encodeURIComponent(message)}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
})();
