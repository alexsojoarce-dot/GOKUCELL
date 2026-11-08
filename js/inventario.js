(() => {
const $=id=>document.getElementById(id),api=window.GokuAPI;let rows=[];let newPhoto="",currentPhoto="";
const money=n=>"₡"+Number(n||0).toLocaleString("es-CR",{maximumFractionDigits:2});const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const isNull=v=>v===null||v===undefined||v==="";
async function load(){try{rows=await api.pedir("productos/index.php")}catch(e){api.avisar(e.message,"error");rows=[]}render()}
function render(){const term=$("invSearch").value.toLowerCase(),cat=$("invCategory").value,filtered=rows.filter(x=>(!term||[x.name,x.code,x.brand].join(" ").toLowerCase().includes(term))&&(!cat||x.category===cat));
 const totals={invTotal:rows.length,invLow:rows.filter(x=>!isNull(x.qty)&&+x.qty<=+x.min).length,invAvailable:rows.filter(x=>!isNull(x.qty)&&+x.qty>0).length};
 Object.entries(totals).forEach(([id,value])=>window.GokuUI?.count?window.GokuUI.count($(id),value):$(id).textContent=value);
 const inventoryValue=rows.reduce((a,x)=>a+(Number(x.qty)||0)*(Number(x.cost)||0),0);
 if(window.GokuUI?.count)window.GokuUI.count($("invValue"),inventoryValue,{prefix:"₡",decimals:0});else $("invValue").textContent=money(inventoryValue);
 $("invRows").innerHTML=filtered.map(x=>`<tr><td><div class="phone-device-cell">${x.photo?`<img src="${esc(api.foto(x.photo))}" alt="">`:`<span class="device-placeholder">▤</span>`}<span><strong>${esc(x.name)}</strong><small>${esc(x.brand||"Sin marca")}</small></span></div></td><td>${esc(x.code||"—")}</td><td>${esc(x.category)}</td><td>${isNull(x.qty)?"—":x.qty}</td><td>${isNull(x.price)?"—":money(x.price)}</td><td><span class="phone-status ${isNull(x.qty)?"review":+x.qty===0?"delivered":+x.qty<=+x.min?"review":"ready"}">${isNull(x.qty)?"Por actualizar":+x.qty===0?"Agotado":+x.qty<=+x.min?"Stock bajo":"Disponible"}</span></td><td><div class="phone-row-actions"><button data-edit="${x.id}">Editar</button><button class="delete-action" data-del="${x.id}">×</button></div></td></tr>`).join("");
 $("invEmpty").hidden=filtered.length>0;$("invTable").hidden=!filtered.length;$("invEmpty").querySelector("strong").textContent=rows.length&&!filtered.length?"No se encontraron productos":"No hay productos registrados";$("invEmpty").querySelector("small").textContent=rows.length&&!filtered.length?"Probá con otro término o categoría.":"Agregá el primer producto al inventario.";$("invEmptyAdd").hidden=rows.length>0&&!filtered.length;
}
function close(){$("invModal").classList.remove("open");$("invModal").setAttribute("aria-hidden","true");document.body.classList.remove("modal-open")}
function open(x){$("invForm").reset();newPhoto="";currentPhoto=x?.photo||"";$("invId").value=x?.id||"";$("invModalTitle").textContent=x?"Editar producto":"Agregar producto";$("invName").value=x?.name||"";$("invCode").value=x?.code||"";$("invCat").value=x?.category||"";$("invBrand").value=x?.brand||"";$("invQty").value=x?.qty??"";$("invMin").value=x?.min??3;$("invCost").value=x?.cost??"";$("invPrice").value=x?.price??"";const src=api.foto(currentPhoto);$("invPhotoPreview").src=src;$("invPhotoPreview").hidden=!src;$("invModal").classList.add("open");$("invModal").setAttribute("aria-hidden","false");document.body.classList.add("modal-open")}
$("invAdd").onclick=()=>open();$("invEmptyAdd").onclick=()=>open();$("invClose").onclick=close;$("invCancel").onclick=close;$("invSearch").oninput=render;$("invCategory").onchange=render;
  $("phonePhoto").onchange=async e=>{
    const file=e.target.files[0]; if(!file)return;
    if(file.size>40000000){alert("La fotografía debe pesar menos de 40 MB.");e.target.value="";return;}
    try{ newPhoto=await api.leerFoto(file,1000); showPreview(newPhoto); }
    catch(err){ alert(err.message); e.target.value=""; }
  };try{newPhoto=await api.leerFoto(file,1000);$("invPhotoPreview").src=newPhoto;$("invPhotoPreview").hidden=false}catch(err){alert(err.message);e.target.value=""}};
$("invForm").onsubmit=async e=>{e.preventDefault();const id=$("invId").value,previous=rows.find(a=>String(a.id)===id),button=$("invForm").querySelector('[type="submit"]');
 const body={name:$("invName").value.trim(),code:$("invCode").value.trim(),category:$("invCat").value,brand:$("invBrand").value.trim(),qty:$("invQty").value,min:$("invMin").value,cost:$("invCost").value,price:$("invPrice").value,photo:newPhoto||null,featured:!!previous?.featured};
 button.disabled=true;
 try{await api.pedir(id?`productos/index.php?id=${encodeURIComponent(id)}`:"productos/index.php",{method:id?"PUT":"POST",cuerpo:body});close();await load();api.avisar(id?"Producto actualizado correctamente.":"Producto agregado al inventario.","success")}catch(err){alert(err.message)}finally{button.disabled=false}};
$("invRows").onclick=async e=>{const ed=e.target.closest("[data-edit]"),del=e.target.closest("[data-del]");if(ed)open(rows.find(x=>String(x.id)===ed.dataset.edit));if(del){const x=rows.find(x=>String(x.id)===del.dataset.del);if(x&&confirm(`¿Eliminar ${x.name} del inventario?`)){try{await api.pedir(`productos/index.php?id=${x.id}`,{method:"DELETE"});await load();api.avisar("Producto eliminado del inventario.","info")}catch(err){alert(err.message)}}}};
$("invModal").onclick=e=>{if(e.target===$("invModal"))close()};document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});load();
})();