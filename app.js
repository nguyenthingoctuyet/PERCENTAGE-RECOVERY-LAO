const $=id=>document.getElementById(id);const table=[
[15,[0,.1,.2,.37,.47,.57,.67,.77,.88,.99]],
[16,[1.13,1.24,1.35,1.46,1.57,1.68,1.8,1.92,2.04,2.16]],
[17,[2.31,2.44,2.57,2.7,2.83,2.96,3.1,3.24,3.38,3.52]],
[18,[3.67,3.81,3.96,4.11,4.26,4.41,4.56,4.71,4.87,5.03]],
[19,[5.2,5.37,5.54,5.71,5.88,6.05,6.23,6.41,6.59,6.77]],
[20,[6.95,7.13,7.32,7.51,7.71,7.91,8.11,8.31,8.51,8.71]],
[21,[8.91,9.12,9.34,9.56,9.78,10,10.2,10.4,10.7,10.9]],
[22,[11.1,11.4,11.6,11.9,12.1,12.4,12.6,12.9,13.1,13.4]],
[23,[13.6,13.9,14.2,14.4,14.7,15,15.3,15.6,15.8,16.1]],
[24,[16.4,16.7,17,17.3,17.6,17.9,18.2,18.5,18.8,19.2]],
[25,[19.5,null,null,null,null,null,null,null,null,null]]
];
const tbody=$('mtable').querySelector('tbody');table.forEach(([d,vals])=>{let tr=document.createElement('tr');tr.innerHTML=`<th>${d}</th>`+vals.map(v=>`<td>${v??'—'}</td>`).join('');tbody.append(tr)});
$('date').value=new Date().toISOString().slice(0,10);let current=null;
function calculate(){let sample=+$('sample').value,moist=+$('moist').value,clean=+$('clean').value;if(!(sample>0&&clean>0&&moist>=0)){alert('Vui lòng nhập khối lượng mẫu, độ ẩm và nhân sạch hợp lệ.');return}
let adjusted=clean,adjust=0,method='';
if(Math.abs(moist-14.3)<0.0001){method='Độ ẩm chuẩn 14,3% · Chia trực tiếp'}
else if(moist>14.3){let row=Math.floor(moist),col=Math.round((moist-row)*10);let base=table.find(x=>x[0]===row)?.[1][col];if(base==null){alert('Độ ẩm ngoài phạm vi bảng thủy phần (15,0–25,0%).');return}let pct=base+0.5;adjust=clean*pct/100;adjusted=clean-adjust;method=`Trừ thủy phần ${base}% + chi phí 0,5%`}
else{let ratio=moist/(1+moist/100);let rounded=Math.floor(ratio*10)/10;let diff=12.5-rounded;adjust=clean*diff/100;adjusted=clean+adjust;method=`Cộng chênh lệch ${diff.toFixed(1)}% · Không cộng 0,5%`}
let recovery=sample/adjusted;current={code:$('code').value,date:$('date').value,sample,moist,clean,adjust,adjusted,recovery,method};$('recovery').innerHTML=recovery.toFixed(2)+' <small>kg</small>';$('r-clean').textContent=clean.toFixed(1)+' g';$('r-adjust').textContent=(adjust>=0?'+':'')+adjust.toFixed(2)+' g';$('r-final').textContent=adjusted.toFixed(2)+' g';$('r-method').textContent=method;$('save').disabled=false;$('notice').textContent='Đã tính xong. Hãy lưu mẫu để thêm vào lịch sử.'}
$('calculate').onclick=calculate;$('save').onclick=()=>{if(!current)return;let rows=JSON.parse(localStorage.getItem('nt_samples')||'[]');let idx=rows.findIndex(x=>x.code===current.code&&x.date===current.date);if(idx>=0)rows[idx]=current;else rows.unshift(current);localStorage.setItem('nt_samples',JSON.stringify(rows));render();$('notice').textContent='Đã lưu mẫu trên thiết bị này.'};
function render(){let rows=JSON.parse(localStorage.getItem('nt_samples')||'[]');$('rows').innerHTML=rows.length?rows.map((x,i)=>`<tr><td>${x.code}</td><td>${x.date}</td><td>${x.moist}%</td><td>${x.clean} g</td><td>${x.adjusted.toFixed(2)} g</td><td><b>${x.recovery.toFixed(2)} kg</b></td><td><button onclick="editSample(${i})">Mở / Sửa</button></td></tr>`).join(''):'<tr><td colspan="7" class="muted">Chưa có mẫu được lưu.</td></tr>'}
window.editSample=i=>{let x=JSON.parse(localStorage.getItem('nt_samples')||'[]')[i];$('code').value=x.code;$('date').value=x.date;$('sample').value=x.sample;$('moist').value=x.moist;$('clean').value=x.clean;document.querySelector('[data-tab=calc]').click();calculate()};
$('export').onclick=()=>{let rows=JSON.parse(localStorage.getItem('nt_samples')||'[]');let csv=['Mã mẫu,Ngày,Độ ẩm,Khối lượng mẫu,Nhân sạch,Nhân quy đổi,Thu hồi,Phương pháp',...rows.map(x=>[x.code,x.date,x.moist,x.sample,x.clean,x.adjusted,x.recovery.toFixed(2),x.method].join(','))].join('\n');let a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));a.download='lich-su-thu-hoi.csv';a.click();URL.revokeObjectURL(a.href)};
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab,.page').forEach(x=>x.classList.remove('active'));b.classList.add('active');$(b.dataset.tab).classList.add('active')});
['fresh','actual'].forEach(id=>$(id).oninput=()=>{let f=+$('fresh').value,a=+$('actual').value;$('actualout').textContent=f>0&&a>0?`Thu hồi thực tế: ${(f/a).toFixed(2)} kg cà tươi / 1 kg cà nhân`:'Nhập hai khối lượng để xem thu hồi thực tế.'});
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});render();