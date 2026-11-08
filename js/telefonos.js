(() => {
  const $ = (id) => document.getElementById(id);
  const api = window.GokuAPI;
  const form = $("phoneForm");
  const modal = $("phoneModal");
  const detailModal = $("detailModal");
  let phones = [];
  let newPhoto = "";      // data URL de una foto recién elegida (se envía al guardar)
  let currentPhoto = "";  // ruta de la foto ya guardada (solo para mostrar)

  function todayISO() { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; }
  function escapeHTML(value="") { return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  function formatDate(value) { if(!value)return "—"; const parts=value.split("-"); return parts.length===3?`${parts[2]}/${parts[1]}/${parts[0]}`:value; }
  function statusClass(status) { return {"Recibido":"received","En revisión":"review","En reparación":"repair","Listo para entregar":"ready","Entregado":"delivered"}[status]||"received"; }

  async function load() {
    try { phones = await api.pedir("telefonos/index.php"); }
    catch (e) { api.avisar(e.message, "error"); phones = []; }
    render();
  }

  function updateStats() {
    $("totalCount").textContent=phones.length;
    $("reviewCount").textContent=phones.filter(p=>p.status==="En revisión").length;
    $("repairCount").textContent=phones.filter(p=>p.status==="En reparación").length;
    $("readyCount").textContent=phones.filter(p=>p.status==="Listo para entregar").length;
  }
  function render() {
    updateStats(); const term=$("phoneSearch").value.trim().toLowerCase(),status=$("statusFilter").value;
    const filtered=phones.filter(p=>[p.customer,p.contact,p.brand,p.model,p.problem,p.ticketCode].join(" ").toLowerCase().includes(term)&&(!status||p.status===status));
    $("phoneTableBody").innerHTML=filtered.map(p=>`<tr><td><div class="phone-device-cell">${p.photo?`<img src="${escapeHTML(api.foto(p.photo))}" alt="">`:`<span class="device-placeholder">▣</span>`}<span><strong>${escapeHTML(p.brand)} ${escapeHTML(p.model)}</strong><small>${escapeHTML(p.problem)}</small><small class="ticket-code-inline">Código: ${escapeHTML(p.ticketCode||"Pendiente")}</small></span></div></td><td><strong class="table-primary">${escapeHTML(p.customer)}</strong></td><td>${formatDate(p.received)}</td><td><span class="phone-status ${statusClass(p.status)}">${escapeHTML(p.status)}</span></td><td>${escapeHTML(p.contact)}</td><td><div class="phone-row-actions"><button type="button" data-action="detail" data-id="${p.id}">Ver</button><button type="button" data-action="edit" data-id="${p.id}">Editar</button><button type="button" class="delete-action" data-action="delete" data-id="${p.id}">×</button></div></td></tr>`).join("");
    $("phoneEmpty").hidden=filtered.length>0; $("phoneTableBody").closest("table").hidden=filtered.length===0;
    if(phones.length&&!filtered.length){$("phoneEmpty").querySelector("strong").textContent="No se encontraron resultados";$("phoneEmpty").querySelector("small").textContent="Probá con otro término o cambiá el filtro de estado.";$("emptyAddBtn").hidden=true;}
    else{$("phoneEmpty").querySelector("strong").textContent="No hay teléfonos registrados";$("phoneEmpty").querySelector("small").textContent="Cuando agregués un equipo, aparecerá en esta lista.";$("emptyAddBtn").hidden=false;}
  }
  function showPreview(src) {
    $("photoPreview").src = src || "";
    $("photoPreview").hidden = !src;
  }
  function openModal(phone=null) {
    form.reset();newPhoto="";currentPhoto="";$("phoneId").value="";showPreview("");
    $("modalTitle").textContent=phone?"Editar teléfono":"Registrar teléfono";form.querySelector('[type="submit"]').textContent=phone?"Guardar cambios":"Guardar registro";
    $("receivedDate").value=todayISO();
    if(phone){$("phoneId").value=phone.id;$("customerName").value=phone.customer;$("customerPhone").value=phone.contact;$("phoneBrand").value=phone.brand;$("phoneModel").value=phone.model;$("receivedDate").value=phone.received;$("phoneStatus").value=phone.status;$("phoneProblem").value=phone.problem;$("phoneDiagnosis").value=phone.diagnosis||"";currentPhoto=phone.photo||"";showPreview(api.foto(currentPhoto));}
    modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");$("customerName").focus();
  }
  function closeModal(target=modal){target.classList.remove("open");target.setAttribute("aria-hidden","true");if(!document.querySelector(".phone-modal-backdrop.open"))document.body.classList.remove("modal-open");}
  function showDetail(phone){
    $("detailTitle").textContent=`${phone.brand} ${phone.model}`;
    $("phoneDetailContent").innerHTML=`<div class="detail-top">${phone.photo?`<img src="${escapeHTML(api.foto(phone.photo))}" alt="Equipo">`:`<div class="detail-placeholder">▣</div>`}<div><span class="phone-status ${statusClass(phone.status)}">${escapeHTML(phone.status)}</span><h3>${escapeHTML(phone.customer)}</h3><p>${escapeHTML(phone.contact)}</p></div></div><div class="detail-grid"><div class="ticket-code-detail"><small>CÓDIGO DE CONSULTA PARA EL CLIENTE</small><strong>${escapeHTML(phone.ticketCode||"Código pendiente")}</strong><button type="button" class="ticket-copy-btn" id="copyTicketCodeBtn">Copiar código</button></div><div><small>Marca y modelo</small><strong>${escapeHTML(phone.brand)} ${escapeHTML(phone.model)}</strong></div><div><small>Fecha de ingreso</small><strong>${formatDate(phone.received)}</strong></div><div class="detail-full"><small>Problema reportado</small><p>${escapeHTML(phone.problem)}</p></div><div class="detail-full"><small>Diagnóstico / notas</small><p>${escapeHTML(phone.diagnosis||"Sin diagnóstico registrado.")}</p></div>${phone.warrantyId?`<div class="detail-full warranty-inline"><small>Garantía asociada</small><p>Vence el ${formatDate(phone.warrantyEnd)} · <a href="garantias.html">Ver garantía</a></p></div>`:""}</div><div class="phone-form-actions"><button class="phone-secondary-btn" type="button" id="detailCloseAction">Cerrar</button><button class="admin-primary-btn" type="button" id="detailEditAction">Editar registro</button></div>`;
    detailModal.classList.add("open");detailModal.setAttribute("aria-hidden","false");document.body.classList.add("modal-open");
    $("detailCloseAction").onclick=()=>closeModal(detailModal);$("detailEditAction").onclick=()=>{closeModal(detailModal);openModal(phone);};
    $("copyTicketCodeBtn").onclick=async()=>{
      const code=phone.ticketCode||"";
      try{ await navigator.clipboard.writeText(code); api.avisar("Código copiado.","success"); }
      catch{ window.prompt("Copiá el código de consulta:",code); }
    };
  }
  $("newPhoneBtn").onclick=()=>openModal();$("emptyAddBtn").onclick=()=>openModal();$("closeModalBtn").onclick=()=>closeModal();$("cancelModalBtn").onclick=()=>closeModal();$("closeDetailBtn").onclick=()=>closeModal(detailModal);
  modal.addEventListener("click",e=>{if(e.target===modal)closeModal();});detailModal.addEventListener("click",e=>{if(e.target===detailModal)closeModal(detailModal);});
  $("phoneSearch").oninput=render;$("statusFilter").onchange=render;
   $("phonePhoto").onchange=async e=>{
    const file=e.target.files[0]; if(!file)return;
    if(file.size>40000000){alert("La fotografía debe pesar menos de 40 MB.");e.target.value="";return;}
    try{ newPhoto=await api.leerFoto(file,1000); showPreview(newPhoto); }
    catch(err){ alert(err.message); e.target.value=""; }
  };
  form.onsubmit=async e=>{
    e.preventDefault();
    const id=$("phoneId").value, button=form.querySelector('[type="submit"]');
    const previous=phones.find(p=>String(p.id)===id);
    const body={customer:$("customerName").value.trim(),contact:$("customerPhone").value.trim(),brand:$("phoneBrand").value,model:$("phoneModel").value.trim(),received:$("receivedDate").value,status:$("phoneStatus").value,problem:$("phoneProblem").value.trim(),diagnosis:$("phoneDiagnosis").value.trim(),photo:newPhoto||null};
    button.disabled=true;
    try{
      const saved=await api.pedir(id?`telefonos/index.php?id=${encodeURIComponent(id)}`:"telefonos/index.php",{method:id?"PUT":"POST",cuerpo:body});
      closeModal();
      await load();
      if(id){
        api.avisar("Registro del teléfono actualizado.","success");
      }else{
        showDetail(saved);
        api.avisar("Teléfono registrado. Entregá al cliente el código que aparece en la ficha.","success");
      }
      if(saved.status==="Entregado" && !previous?.warrantyId) api.avisar("La garantía de un mes se agregó automáticamente.","info");
    }catch(err){ alert(err.message); }
    finally{ button.disabled=false; }
  };
  $("phoneTableBody").onclick=async e=>{
    const b=e.target.closest("button[data-action]");if(!b)return;
    const p=phones.find(x=>String(x.id)===b.dataset.id);if(!p)return;
    if(b.dataset.action==="detail")showDetail(p);
    if(b.dataset.action==="edit")openModal(p);
    if(b.dataset.action==="delete"&&confirm(`¿Querés eliminar el registro de ${p.brand} ${p.model}?`)){
      try{ await api.pedir(`telefonos/index.php?id=${p.id}`,{method:"DELETE"}); await load(); api.avisar("Registro eliminado.","info"); }
      catch(err){ alert(err.message); }
    }
  };
  document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal(modal);closeModal(detailModal);}});
  load();
})();