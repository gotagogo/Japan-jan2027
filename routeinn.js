// 額外資訊：東北滑雪场 × Route Inn 参考表（資料來自 HotelFinder，未改動）
(function(){
const R=window.RI,D=R.D,SK=R.SK,HT=R.HT;
const SKI=SK.map(s=>s[0]),SKI_BY=Object.fromEntries(SK.map(s=>[s[0],s])),H_BY=Object.fromEntries(HT.map(h=>[h[0],h]));
const PREFS=["青森","秋田","岩手","宫城","山形","福岛"];
const SKI_GROUPS={"青森的雪场":["青森"],"秋田·岩手的雪场":["秋田","岩手"],"宫城·山形的雪场":["宫城","山形"]};
const sk=s=>`${s}（${SKI_BY[s][1]}）`,hl=h=>`${h}（${H_BY[h][1]}）`,inRange=(s,h)=>D[s][h]!==undefined;
const winter=m=>`${Math.round(m*1.15)}–${Math.round(m*1.2)} 分`;
const FREE=new Set(HT.filter(h=>h[3]==="免费").map(h=>h[0])),STA=new Set(HT.filter(h=>h[0].includes("駅")).map(h=>h[0]));
const LB={zh:{eyebrow:'額外資訊',title:'東北滑雪场 × Route Inn 参考表',by:'由 HotelFinder 整理',filter:'篩選分店',filterC:'篩選會套用到下面所有表格和地圖。步行到車站是按店名帶「駅」判斷。',free:'只看免費停車',sta:'只看步行可到火車站',map:'地圖',mapC:'示意圖，縣界是粗略輪廓。三角是滑雪場，方塊是 Route Inn；連線是 90 分鐘內的估算車程，相關分店才顯示名字。',pick:'選雪場或分店',skiP:'雪場',bySki:'按雪場查',ski:'滑雪場',byH:'按酒店查',matrix:'總表',matrixC:'先選分店所在縣，再選雪場組；格子是估算分鐘，— 表示超過 90 分鐘。',cover:'每間分店覆蓋幾個雪場',list:'分店資料（官網）',cRI:'Route Inn',cDrive:'估算车程',cDist:'距离',cWin:'冬季预留',cNote:'备注',cSki:'滑雪场',cN:'90 分钟内的雪场数',cPark:'停车',cBf:'早餐',cBr:'分店',cPref:'县',cWeb:'官网页面',none:'沒有符合篩選條件的分店。',src:'資料來源',back:'回首頁'},
en:{eyebrow:'Extra info',title:'Tohoku ski fields × Route Inn reference table',by:'Compiled by HotelFinder (data shown as provided, in Chinese)',filter:'Filter hotels',filterC:'Filters apply to all tables and the map below. "Walk to station" = branch name contains 駅.',free:'Free parking only',sta:'Walk to a train station only',map:'Map',mapC:'Schematic; prefecture outlines are rough. Triangles = ski fields, squares = Route Inn; lines = estimated drives under 90 min.',pick:'Pick a ski field or hotel',skiP:'Ski',bySki:'By ski field',ski:'Ski field',byH:'By hotel',matrix:'Full table',matrixC:'Pick the hotel prefecture, then a ski-field group. Cells are estimated minutes; — means over 90 min.',cover:'Ski fields covered per hotel',list:'Hotel details (official site)',cRI:'Route Inn',cDrive:'Est. drive',cDist:'Distance',cWin:'Winter allowance',cNote:'Notes',cSki:'Ski field',cN:'Ski fields within 90 min',cPark:'Parking',cBf:'Breakfast',cBr:'Branch',cPref:'Pref.',cWeb:'Official page',none:'No hotels match the filters.',src:'Sources',back:'Home'}};
const NOTE='车程是用 OSRM 路网估算的一般路况时间，1 月雪道建议多留 15–20%。冬季封闭的蔵王エコーライン已绕开（すみかわ、えぼし按经遠刈田温泉计算）；八甲田、八幡平、奥入濑一带山路遇暴风雪可能封路。只列估算 90 分钟以内的组合。';
const SUM='清单上 22 个东北滑雪场，各自开车 90 分钟内有哪些 Route Inn、要开多久。车程是估算值，不是实测。';
const SRC=["https://www.route-inn.co.jp/","https://routing.openstreetmap.de/","https://msearch.gsi.go.jp/"];
const S={ski:"安比高原",hotel:"盛岡南IC",free:false,sta:false,map:"s:八甲田",hp:"岩手",sg:"秋田·岩手的雪场"};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const tbl=(cols,rows)=>`<div class="rtw"><table class="rtab"><thead><tr>${cols.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const sel=(id,opts,v)=>`<select class="rsel" onchange="RIset('${id}',this.value)">${opts.map(([a,b])=>`<option value="${esc(a)}"${a==v?' selected':''}>${esc(b)}</option>`).join('')}</select>`;
const seg=(id,opts,v)=>`<div class="rseg">${opts.map(o=>`<button class="${o==v?'on':''}" onclick="RIset('${id}','${o}')">${o}</button>`).join('')}</div>`;
const park=v=>v==="免费"?`<span class="tag g">免费</span>`:esc(v);
function map(selv,hotels){const K=280,MIN=37.62,px=lo=>330+(lo-139.5)*K*.77,py=la=>30+(41.65-Math.max(la,MIN))*K;
const isSki=selv.startsWith('s:'),name=selv.slice(2);
const pairs=isSki?hotels.filter(h=>inRange(name,h)).map(h=>[name,h,D[name][h][0]]):SKI.filter(s=>inRange(s,name)).map(s=>[s,name,D[s][name][0]]);
const lit=new Set(pairs.map(p=>p[1]));if(!isSki)lit.add(name);
let o=`<svg class="rmap" viewBox="0 0 1280 1200">`;
o+=R.OUTLINES.map(p=>`<polygon points="${p.map(q=>px(q[0])+','+py(q[1])).join(' ')}" fill="#eef4fa" stroke="#c9d6e2" stroke-width="1.5"/>`).join('');
o+=R.PREF_LABEL.map(l=>`<text x="${px(l[1])}" y="${py(l[2])}" fill="#8aa0b5" font-size="26" text-anchor="middle">${l[0]}</text>`).join('');
o+=`<line x1="0" x2="1280" y1="${py(MIN)}" y2="${py(MIN)}" stroke="#d3e3f1" stroke-dasharray="4 4"/><text x="8" y="${py(MIN)-6}" fill="#8aa0b5" font-size="22">福岛县（更南的分店放在这条线上）</text>`;
o+=pairs.map(p=>{const a=SKI_BY[p[0]],b=H_BY[p[1]],x1=px(a[2]),y1=py(a[3]),x2=px(b[5]),y2=py(b[6]);return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ff8a3d" stroke-width="2.5" opacity=".75"/><text x="${(x1+x2)/2}" y="${(y1+y2)/2-4}" font-size="22" fill="#33475b" text-anchor="middle" stroke="#fff" stroke-width="4" paint-order="stroke">${p[2]}分</text>`}).join('');
o+=hotels.map(h=>{const c=H_BY[h],x=px(c[5]),y=py(c[6]),on=lit.has(h),me=!isSki&&name==h;return `<rect x="${x-5}" y="${y-5}" width="10" height="10" fill="#1f9d6b" opacity="${on?1:.45}" stroke="${me?'#0f2a44':'none'}" stroke-width="2"/>${on?`<text x="${x+9}" y="${y+14}" font-size="22" fill="#33475b" font-weight="${me?700:400}" stroke="#fff" stroke-width="4" paint-order="stroke">${h}</text>`:''}`}).join('');
o+=SK.map(s=>{const x=px(s[2]),y=py(s[3]),on=isSki&&name==s[0],left=s[2]<140.9;return `<polygon points="${x},${y-9} ${x-8},${y+6} ${x+8},${y+6}" fill="#2f6fa8" stroke="${on?'#0f2a44':'none'}" stroke-width="2"/><text x="${left?x-11:x+11}" y="${y+4}" text-anchor="${left?'end':'start'}" font-size="22" fill="#0f2a44" font-weight="${on?700:400}" stroke="#fff" stroke-width="4" paint-order="stroke">${s[0]}</text>`}).join('');
return o+'</svg>'}
window.RIset=(k,v)=>{S[k]=v;document.getElementById('app').innerHTML=window.routeinn()};
window.routeinn=function(){const L=(document.documentElement.lang||'zh').startsWith('en')?'en':'zh',t=k=>LB[L][k];
const ok=h=>(!S.free||FREE.has(h))&&(!S.sta||STA.has(h));const hl_=HT.map(h=>h[0]).filter(ok);
const cur=hl_.includes(S.hotel)?S.hotel:hl_[0];const selv=S.map.startsWith('h:')&&!hl_.includes(S.map.slice(2))?'s:'+SKI[0]:S.map;
const near=hl_.filter(h=>inRange(S.ski,h)).sort((a,b)=>D[S.ski][a][0]-D[S.ski][b][0]);
const cover=hl_.map(h=>[h,SKI.filter(s=>inRange(s,h)).length]).sort((a,b)=>b[1]-a[1]);
const mH=hl_.filter(h=>H_BY[h][1]===S.hp),mS=SKI.filter(s=>SKI_GROUPS[S.sg].includes(SKI_BY[s][1]));
const sec=(h,c,body)=>`<section class="sec"><div class="sech"><h2>${h}</h2></div>${c?`<p class="note" style="margin-top:-6px">${c}</p>`:''}<div class="card">${body}</div></section>`;
return `<section class="hero"><div class="eyebrow">${t('eyebrow')}</div><h1>${t('title')}</h1><p class="lead">${SUM}</p><p class="note">${t('by')}</p></section>
<section class="sec"><div class="card rcall">${NOTE}</div></section>
${sec(t('filter'),t('filterC'),`<label class="rtg"><input type="checkbox" ${S.free?'checked':''} onchange="RIset('free',this.checked)"> ${t('free')}</label><label class="rtg"><input type="checkbox" ${S.sta?'checked':''} onchange="RIset('sta',this.checked)"> ${t('sta')}</label>`)}
${sec(t('map'),t('mapC'),`<div class="rlab">${t('pick')}</div>${sel('map',[...SKI.map(s=>['s:'+s,`${t('skiP')} · ${sk(s)}`]),...hl_.map(h=>['h:'+h,`Route Inn · ${hl(h)}`])],selv)}${map(selv,hl_)}`)}
${sec(t('bySki'),'',`<div class="rlab">${t('ski')}</div>${sel('ski',SKI.map(s=>[s,sk(s)]),S.ski)}${tbl([t('cRI'),t('cDrive'),t('cDist'),t('cWin')],near.map(h=>[hl(h),`${D[S.ski][h][0]} 分`,`${D[S.ski][h][1]} km`,winter(D[S.ski][h][0])]))}<p class="note">${sk(S.ski)}：${SKI_BY[S.ski][4]}</p>`)}
${sec(t('byH'),'',cur?`<div class="rlab">Route Inn</div>${sel('hotel',hl_.map(h=>[h,hl(h)]),cur)}${tbl([t('cSki'),t('cDrive'),t('cDist'),t('cWin'),t('cNote')],SKI.filter(s=>inRange(s,cur)).sort((a,b)=>D[a][cur][0]-D[b][cur][0]).map(s=>[sk(s),`${D[s][cur][0]} 分`,`${D[s][cur][1]} km`,winter(D[s][cur][0]),esc(SKI_BY[s][4])]))}`:`<p>${t('none')}</p>`)}
${sec(t('matrix'),t('matrixC'),`${seg('hp',PREFS,S.hp)}${seg('sg',Object.keys(SKI_GROUPS),S.sg)}${tbl([t('cRI'),...mS.map(sk)],mH.map(h=>[hl(h),...mS.map(s=>inRange(s,h)?`${D[s][h][0]} 分`:'—')]))}`)}
${sec(t('cover'),'',tbl([t('cRI'),t('cN'),t('cPark'),t('cBf')],cover.filter(c=>c[1]>0).map(c=>[hl(c[0]),String(c[1]),park(H_BY[c[0]][3]),esc(H_BY[c[0]][4])])))}
${sec(t('list'),'',tbl([t('cBr'),t('cPref'),t('cPark'),t('cBf'),t('cWeb')],HT.filter(h=>ok(h[0])).map(h=>[hl(h[0]),h[1],park(h[3]),esc(h[4]),`<a target="_blank" rel="noopener" href="${h[2]}">${h[2]}</a>`]))+`<p class="note">${esc(`没有列入（离所有雪场都超过 90 分钟）：${R.EXCL.join('、')}。花轮、夜越山、藏王Liza 的坐标为大致位置，其余来自 Google 地图链接或国土地理院。多数雪场 2026-27 雪季开放日期尚未公布。`)}</p>`)}
<section class="sec"><p class="note">${t('src')}：${SRC.map(u=>`<a target="_blank" rel="noopener" href="${u}">${u}</a>`).join(' · ')}</p><div class="btns"><a class="btn" href="index.html">${t('back')}</a></div></section>`};
})();
