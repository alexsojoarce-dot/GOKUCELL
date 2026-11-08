(() => {
  const $ = id => document.getElementById(id);
  const api = window.GokuAPI;
  const count = (id, value) => {
    const el = $(id);
    if (window.GokuUI?.count) window.GokuUI.count(el, value);
    else if (el) el.textContent = value;
  };

  async function render(avisar) {
    let d;
    try { d = await api.pedir("backend/estado.php"); }
    catch (e) { api.avisar(e.message, "error"); return; }

    const statuses = ["Recibido","En revisión","En reparación","Listo para entregar","Entregado"];
    count("repPhones", d.telefonos.total);
    count("repProducts", d.productos.total);
    count("repDelivered", d.telefonos.porEstado["Entregado"] || 0);
    count("repWarranties", d.garantias.vigentes);

    const values = statuses.map(status => ({ status, total: d.telefonos.porEstado[status] || 0 }));
    const max = Math.max(1, ...values.map(item => item.total));
    $("phoneReport").innerHTML = values.map(item => `
      <div class="report-bar-row">
        <span>${item.status}</span>
        <div class="report-bar-track"><i data-bar-value="${(item.total / max) * 100}"></i></div>
        <strong>${item.total}</strong>
      </div>`).join("");
    requestAnimationFrame(() => {
      document.querySelectorAll("[data-bar-value]").forEach(bar => {
        bar.style.width = `${bar.dataset.barValue}%`;
      });
    });

    $("stockReport").innerHTML = `
      <div><span>Unidades disponibles</span><strong>${d.productos.unidades}</strong></div>
      <div><span>Productos con stock bajo</span><strong>${d.productos.stockBajo}</strong></div>
      <div><span>Valor de compra estimado</span><strong>₡${d.productos.valor.toLocaleString("es-CR",{maximumFractionDigits:2})}</strong></div>`;

    $("warrantyReport").innerHTML = `
      <div><span>Garantías registradas</span><strong>${d.garantias.total}</strong></div>
      <div><span>Por vencer en 30 días</span><strong>${d.garantias.porVencer}</strong></div>
      <div><span>Garantías vencidas</span><strong>${d.garantias.vencidas}</strong></div>`;

    if (avisar) api.avisar("Reportes actualizados", "success");
  }

  $("refreshReports").onclick = () => render(true);
  $("printReports").onclick = () => window.print();
  render(false);
})();