(() => {
  const $ = id => document.getElementById(id);
  const api = window.GokuAPI;
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const setCount = (id, value) => {
    const el = $(id);
    if (window.GokuUI?.count) window.GokuUI.count(el, value);
    else if (el) el.textContent = value;
  };

  api.pedir("backend/estado.php").then(d => {
    setCount("dashPhones", d.telefonos.total);
    setCount("dashRepair", d.telefonos.porEstado["En reparación"] || 0);
    setCount("dashReady", d.telefonos.porEstado["Listo para entregar"] || 0);
    setCount("dashProducts", d.productos.total);

    const tbody = document.querySelector(".admin-dashboard-grid .admin-table tbody");
    if (!tbody) return;
    const recent = d.telefonos.recientes;
    tbody.innerHTML = recent.length ? recent.map(p => `
      <tr>
        <td><div class="dash-device-cell">${p.photo
          ? `<img class="dash-phone-thumb" src="${esc(api.foto(p.photo))}" alt="">`
          : `<span class="dash-phone-placeholder">▣</span>`}
          <span>${esc(p.brand)} ${esc(p.model)}</span></div></td>
        <td>${esc(p.customer)}</td>
        <td><span class="dash-status">${esc(p.status)}</span></td>
        <td class="dash-date">${esc(p.received || "—")}</td>
      </tr>`).join("") :
      '<tr><td colspan="4" class="empty-row"><span class="empty-symbol">▣</span><strong>Aún no hay teléfonos registrados</strong><small>Cuando agregués un equipo, aparecerá aquí.</small><a href="telefonos.html">Registrar primer teléfono ↗</a></td></tr>';
  }).catch(e => api.avisar(e.message, "error"));
})();