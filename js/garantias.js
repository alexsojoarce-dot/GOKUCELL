(() => {
const $=id=>document.getElementById(id),api=window.GokuAPI;let rows=[];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const today=()=>{const d=new Date();return new Date(d.getFullYear(),d.getMonth(),d.getDate())};
const status=x=>{const d=Math.ceil((new Date(x.end+"T00:00:00")-today())/86400000);return d<0?"Vencida":d<=30?"Por vencer":"Vigente"};
const fmt=s=>s?new Date(s+"T00:00:00").toLocaleDateString("es-CR"):"—";
async function load(){try{rows=await api.pedir("garantias/index.php")}catch(e){api.avisar(e.message,"error");rows=[]}render()}
function render(){const q=$("warSearch").value.toLowerCase(),f=$("warFilter").value;const list=rows.filter(x=>[x.client,x.contact,x.item].join(" ").toLowerCase().includes(q)&&(!f||status(x)===f));const states=rows.map(status);
 const totals={warTotal:rows.length,warActive:states.filter(x=>x==="Vigente").length,warSoon:states.filter(x=>x==="Por vencer").length,warExpired:states.filter(x=>x==="Vencida").length};
 Object.entries(totals).forEach(([id,value])=>window.GokuUI?.count?window.GokuUI.count($(id),value):$(id).textContent=value);
 $("warRows").innerHTML=list.map(x=>{const s=status(x);return `<tr><td><strong class="table-primary">${esc(x.client)}</strong><br><small>${esc(x.contact||"Sin contacto")}</small></td><td><strong>${esc(x.item)}</strong><br><small>${x.automatic?"Servicio entregado":"Garantía"}</small></td><td>${fmt(x.start)}</td><td>${fmt(x.end)}</td><td>${esc(x.durationMonths??"—")} mes(es)</td><td><span class="phone-status ${s==="Vigente"?"ready":s==="Por vencer"?"review":"delivered"}">${s}</span></td><td><div class="phone-row-actions"><button data-edit="${x.id}">Editar</button></div></td></tr>`}).join("");
 $("warEmpty").hidden=list.length>0;$("warTable").hidden=!list.length;if(rows.length&&!list.length){$("warEmpty").querySelector("strong").textContent="No se encontraron garantías";$("warEmpty").querySelector("small").textContent="Probá con otro término o estado."}else{$("warEmpty").querySelector("strong").textContent="Aún no hay garantías";$("warEmpty").querySelector("small").textContent="Al cambiar el estado de un teléfono a “Entregado”, su garantía aparecerá automáticamente."}
}
function addMonths(iso,n){const [y,m,d]=iso.split("-").map(Number);const month=m-1+n,yy=y+Math.floor(month/12),mm=((month%12)+12)%12,last=new Date(yy,mm+1,0).getDate(),out=new Date(yy,mm,Math.min(d,last));return `${out.getFullYear()}-${String(out.getMonth()+1).padStart(2,"0")}-${String(out.getDate()).padStart(2,"0")}`}
function open(x){$("warForm").reset();$("warId").value=x.id;$("warModalTitle").textContent="Editar garantía";$("warClient").value=x.client||"";$("warContact").value=x.contact||"";$("warItem").value=x.item||"";$("warStart").value=x.start||"";$("warEnd").value=x.end||"";$("warDuration").value=x.durationMonths??1;$("warNotes").value=x.notes||"";$("warModal").classList.add("open");$("warModal").setAttribute("aria-hidden","false");document.body.classList.add("modal-open")}
function close(){$("warModal").classList.remove("open");$("warModal").setAttribute("aria-hidden","true");document.body.classList.remove("modal-open")}
$("warClose").onclick=close;$("warCancel").onclick=close;$("warSearch").oninput=render;$("warFilter").onchange=render;
$("warDuration").addEventListener("input",()=>{const start=$("warStart").value,n=Number($("warDuration").value);if(start&&Number.isInteger(n)&&n>=0&&n<=120)$("warEnd").value=addMonths(start,n)});
$("warStart").addEventListener("change",()=>{const n=Number($("warDuration").value||1);if($("warStart").value)$("warEnd").value=addMonths($("warStart").value,n)});
$("warForm").onsubmit=async e=>{e.preventDefault();const id=$("warId").value,start=$("warStart").value,end=$("warEnd").value;if(end<start){alert("El vencimiento no puede ser anterior a la fecha de entrega.");return;}
 try{await api.pedir(`garantias/index.php?id=${encodeURIComponent(id)}`,{method:"PUT",cuerpo:{client:$("warClient").value.trim(),contact:$("warContact").value.trim(),item:$("warItem").value.trim(),start,end,durationMonths:Number($("warDuration").value),notes:$("warNotes").value.trim()}});close();await load();api.avisar("Garantía actualizada correctamente.","success")}catch(err){alert(err.message)}};
$("warRows").onclick=e=>{const ed=e.target.closest("[data-edit]");if(ed){const x=rows.find(r=>String(r.id)===ed.dataset.edit);if(x)open(x)}};
$("warModal").onclick=e=>{if(e.target===$("warModal"))close()};document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});load();
})();