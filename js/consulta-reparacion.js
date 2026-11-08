(() => {
  const form=document.getElementById("repairLookupForm");
  if(!form)return;
  const input=document.getElementById("repairLookupCode");
  const result=document.getElementById("repairLookupResult");
  const api=window.GokuAPI;
  const escapeHTML=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const date=value=>{if(!value)return "—";const p=value.split("-");return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:value;};
  form.addEventListener("submit",async event=>{
    event.preventDefault();
    const code=input.value.trim().toUpperCase();
    result.hidden=false;
    result.className="repair-lookup-result";
    result.textContent="Consultando…";
    try{
      const phone=await api.pedir(`telefonos/consulta.php?codigo=${encodeURIComponent(code)}`);
      result.innerHTML=`<div class="lookup-result-top"><strong>ESTADO DE TU EQUIPO</strong><span class="lookup-status">${escapeHTML(phone.status)}</span></div><div class="lookup-result-meta"><div><span>Equipo</span><br><strong>${escapeHTML(phone.brand)} ${escapeHTML(phone.model)}</strong></div><div><span>Servicio reportado</span><br><strong>${escapeHTML(phone.problem)}</strong></div><div><span>Fecha de recepción</span><br><strong>${date(phone.received)}</strong></div></div>`;
    }catch(err){
      result.className="repair-lookup-result is-error";
      result.textContent=err.message==="No encontramos una reparación con ese código."
        ?"No encontramos una reparación con ese código. Verificá que esté escrito correctamente o contactá a GOKUCELL."
        :err.message;
    }
  });
})();