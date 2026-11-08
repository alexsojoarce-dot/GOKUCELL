(() => {
  const $ = id => document.getElementById(id);
  const api = window.GokuAPI;
  let products = [];
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  async function load() {
    try { products = await api.pedir("productos/index.php?publico=1"); }
    catch (e) { products = []; }
    render();
  }

  function render() {
    const q = $("catalogSearch").value.toLowerCase().trim();
    const cat = $("catalogCategory").value;
    const list = products.filter(p =>
      (!q || [p.name, p.brand, p.code, p.category].join(" ").toLowerCase().includes(q)) &&
      (!cat || p.category === cat)
    );
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
    const select = $("catalogCategory"), current = select.value;
    select.innerHTML = '<option value="">Todas las categorías</option>' + cats.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join("");
    select.value = cats.includes(current) ? current : "";

    $("catalogGrid").innerHTML = list.map(p => `
      <article class="catalog-card">
        <div class="catalog-image">
          ${p.photo ? `<img src="${esc(api.foto(p.photo))}" alt="${esc(p.name)}" loading="lazy">` : `<div class="catalog-no-image">▤<small>Imagen próximamente</small></div>`}
          <span>${esc(p.category)}</span>
        </div>
        <div class="catalog-card-info">
          <small>${esc(p.brand || "GOKUCELL")}</small>
          <h3>${esc(p.name)}</h3>
          <a href="https://wa.me/50688716632?text=${encodeURIComponent(`Hola GOKUCELL, me interesa ${p.name}. ¿Me confirman su disponibilidad?`)}" target="_blank" rel="noopener noreferrer" class="catalog-ask">Consultar disponibilidad ↗</a>
        </div>
      </article>`).join("");

    $("catalogEmpty").hidden = list.length > 0;
    $("catalogGrid").hidden = !list.length;
    if (products.length && !list.length) {
      $("catalogEmpty").querySelector("h3").textContent = "No encontramos ese producto";
      $("catalogEmpty").querySelector("p").textContent = "Probá con otra búsqueda o categoría.";
    } else {
      $("catalogEmpty").querySelector("h3").textContent = "Estamos preparando el catálogo";
      $("catalogEmpty").querySelector("p").textContent = "Pronto vas a poder ver aquí las fotografías y los detalles de nuestros productos. Consultanos por disponibilidad.";
    }
  }

  $("catalogSearch").oninput = render;
  $("catalogCategory").onchange = render;
  load();
})();