const players = ["Sam", "Tom", "Micah", "Alyssa", "Ben"];
const rounds = [
  [["Micah", "Sam"], ["Alyssa", "Tom"]],
  [["Ben", "Micah"], ["Sam", "Tom"]],
  [["Ben", "Alyssa"], ["Micah", "Tom"]],
  [["Ben", "Tom"], ["Alyssa", "Sam"]],
  [["Ben", "Sam"], ["Micah", "Alyssa"]],
];
const byes = ["Ben", "Alyssa", "Sam", "Micah", "Tom"];
const initialResults = { "1-1": "Micah", "1-2": "Tom" };
const dataKey = "draft-round-robin-results-v1.json";
const jsonHeaders = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };

function isOwner(request, env) {
  const email = request.headers.get("oai-authenticated-user-email")?.toLowerCase();
  return Boolean(email && env.OWNER_EMAIL && email === env.OWNER_EMAIL.toLowerCase());
}
function reply(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: jsonHeaders });
}
async function readResults(env) {
  const object = await env.BUCKET.get(dataKey);
  if (!object) return { ...initialResults };
  const parsed = await object.json();
  return { ...initialResults, ...parsed };
}
const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#111b19"><title>Draft Night · Round Robin</title>
<style>
:root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#eee9da;background:#101a18}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at 90% 0%,#254235 0,transparent 34%),#101a18}button{font:inherit;cursor:pointer}a{color:#d8bd79}header{border-bottom:1px solid #40534a;max-width:1160px;margin:auto;padding:25px 26px;display:flex;justify-content:space-between;align-items:center;gap:12px}.brand{font-size:.74rem;letter-spacing:.18em;text-transform:uppercase;color:#c7ad70;font-weight:800}.brand b{color:#e9e6d6;font-weight:800}.status{font-size:.78rem;color:#a5b2a5;border:1px solid #526255;border-radius:20px;padding:7px 11px}main{max-width:1160px;margin:auto;padding:42px 26px 80px}.eyebrow{color:#d1b675;letter-spacing:.15em;font-size:.73rem;font-weight:800;text-transform:uppercase}.hero{display:flex;justify-content:space-between;align-items:end;gap:30px;margin-bottom:36px}h1{font-family:Georgia,serif;font-size:clamp(2.6rem,6vw,5.1rem);font-weight:400;letter-spacing:-.05em;line-height:1.02;margin:12px 0}p{color:#acb9ad;line-height:1.5;margin:0}.hero p{max-width:520px}.bigstat{min-width:170px;border-left:1px solid #546257;padding-left:22px}.bigstat strong{font-size:2.9rem;font-family:Georgia,serif;font-weight:400;display:block}.bigstat span{color:#afbbad;font-size:.78rem;text-transform:uppercase;letter-spacing:.08em}.layout{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(275px,.8fr);gap:22px;align-items:start}.panel{background:#1b2924;border:1px solid #405247;border-radius:14px;overflow:hidden}.panelhead{display:flex;align-items:center;justify-content:space-between;padding:22px 24px;border-bottom:1px solid #405247}.panelhead h2{font-size:1rem;margin:0;font-weight:700}.panelhead span{color:#b9c2b3;font-size:.75rem}.round{border-bottom:1px solid #3e5045}.round:last-child{border-bottom:0}.roundhead{padding:18px 24px 9px;display:flex;justify-content:space-between;align-items:center}.roundhead b{color:#dbc187;font-size:.8rem;letter-spacing:.1em;text-transform:uppercase}.bye{font-size:.75rem;color:#a7b9a9}.match{display:flex;align-items:center;gap:10px;padding:8px 24px 16px}.versus{color:#7f9587;font-size:.73rem}.player{background:#23362e;border:1px solid #456052;border-radius:9px;color:#e5e7da;min-height:45px;flex:1;text-align:left;padding:9px 12px;display:flex;justify-content:space-between;align-items:center}.player.won{border-color:#d4b56f;background:#3a3929;color:#f4dfaa}.player:hover:enabled{border-color:#e3c47d}.player:disabled{cursor:default}.player small{font-size:.69rem;color:#d8bf80}.pending{font-size:.71rem;color:#91a294}.matchgroup{display:grid;grid-template-columns:1fr 1fr;gap:6px}.standings{padding-bottom:10px}.tablehead,.row{display:grid;grid-template-columns:28px 1fr 40px 40px 54px;gap:7px;align-items:center;padding:13px 20px}.tablehead{font-size:.65rem;color:#91a596;text-transform:uppercase;letter-spacing:.09em}.row{border-top:1px solid #35493d;font-size:.88rem}.row:first-of-type{border-top:0}.rank{color:#b8a77f}.row strong{font-weight:650}.num{text-align:center;font-variant-numeric:tabular-nums}.pct{text-align:right;color:#d9c085}.note{padding:18px 20px;color:#a6b5a7;font-size:.72rem;line-height:1.5;border-top:1px solid #405247}.tools{display:flex;gap:12px;align-items:center}.edit-link{font-size:.78rem;background:none;border:none;color:#dec487;text-decoration:underline;padding:0}.notice{min-height:20px;margin:0 0 14px;color:#e8c879;font-size:.8rem}@media(max-width:830px){.layout{grid-template-columns:1fr}.hero{align-items:start}.bigstat{display:none}}@media(max-width:600px){header{padding:18px}.brand{font-size:.64rem}main{padding:30px 16px 60px}.panelhead,.roundhead{padding-left:16px;padding-right:16px}.match{padding-left:16px;padding-right:16px}.matchgroup{grid-template-columns:1fr}.hero{margin-bottom:26px}}
</style></head><body><header><div class="brand">✦ <b>Draft Night</b> / Tournament Tracker</div><div class="tools"><button class="edit-link" id="signin" hidden>Owner sign in</button><span class="status" id="mode">Loading…</span></div></header><main><div class="eyebrow">Magic: The Gathering · Five Players</div><div class="hero"><div><h1>Round Robin</h1><p>Every player faces every other player once. Pick a winner after each match and the standings update for everyone.</p></div><div class="bigstat"><strong id="progress">2 / 10</strong><span>Matches complete</span></div></div><div class="notice" id="notice"></div><div class="layout"><section class="panel"><div class="panelhead"><h2>Match schedule</h2><span>5 rounds · 10 matches</span></div><div id="schedule"></div></section><aside class="panel standings"><div class="panelhead"><h2>Standings</h2><span>Wins → win rate</span></div><div class="tablehead"><span>#</span><span>Player</span><span class="num">W</span><span class="num">L</span><span style="text-align:right">Win %</span></div><div id="standings"></div><div class="note">Ranks use wins, then win percentage. Ties remain tied until more matches are played. A bye does not count as a win or loss.</div></aside></div></main>
<script>
const players=${JSON.stringify(players)};
const rounds=${JSON.stringify(rounds)};
const byes=${JSON.stringify(byes)};
let results={};let owner=false;
const el=id=>document.getElementById(id);
function key(round,match){return (round+1)+'-'+(match+1)}
function render(){
 const completed=Object.values(results).filter(Boolean).length;el('progress').textContent=completed+' / 10';
 el('schedule').replaceChildren();
 rounds.forEach((matches,ri)=>{const section=document.createElement('div');section.className='round';const head=document.createElement('div');head.className='roundhead';head.innerHTML='<b>Round '+(ri+1)+'</b><span class="bye">'+byes[ri]+' has a bye</span>';section.append(head);const group=document.createElement('div');group.className='matchgroup';matches.forEach((pair,mi)=>{const box=document.createElement('div');box.className='match';pair.forEach((name,pi)=>{if(pi){const vs=document.createElement('span');vs.className='versus';vs.textContent='vs';box.append(vs)}const btn=document.createElement('button');btn.className='player'+(results[key(ri,mi)]===name?' won':'');btn.disabled=!owner;btn.innerHTML='<span>'+name+'</span><small>'+(results[key(ri,mi)]===name?'WINNER':'')+'</small>';btn.setAttribute('aria-label',owner?'Set '+name+' as winner of round '+(ri+1):name);btn.onclick=()=>save(key(ri,mi),name);box.append(btn)});group.append(box)});section.append(group);el('schedule').append(section)});
 const stats=players.map((name,index)=>({name,index,w:0,l:0}));for(let ri=0;ri<rounds.length;ri++)for(let mi=0;mi<2;mi++){const win=results[key(ri,mi)];if(!win)continue;const pair=rounds[ri][mi];stats.find(s=>s.name===win).w++;stats.find(s=>s.name===pair.find(n=>n!==win)).l++}stats.sort((a,b)=>b.w-a.w||(b.w/(b.w+b.l||1))-(a.w/(a.w+a.l||1))||a.index-b.index);el('standings').replaceChildren();stats.forEach((s,i)=>{const row=document.createElement('div');row.className='row';const pct=s.w+s.l?Math.round(100*s.w/(s.w+s.l))+'%':'—';row.innerHTML='<span class="rank">'+String(i+1).padStart(2,'0')+'</span><strong>'+s.name+'</strong><span class="num">'+s.w+'</span><span class="num">'+s.l+'</span><span class="pct">'+pct+'</span>';el('standings').append(row)})}
async function load(){try{const response=await fetch('/api/state',{cache:'no-store'});if(!response.ok)throw new Error('Could not load results');const state=await response.json();results=state.results;owner=state.owner;el('mode').textContent=owner?'Owner · edit mode':'Live standings · view only';el('signin').hidden=owner;render()}catch(error){el('notice').textContent=error.message}}
async function save(id,winner){if(!owner)return;const previous=results[id];results[id]=winner;render();try{const response=await fetch('/api/matches/'+id,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({winner})});if(!response.ok)throw new Error('Could not save this result');results=(await response.json()).results;render();el('notice').textContent='Result saved';setTimeout(()=>{if(el('notice').textContent==='Result saved')el('notice').textContent=''},2200)}catch(error){results[id]=previous;render();el('notice').textContent=error.message}}
el('signin').onclick=()=>{location.href='/signin-with-chatgpt?return_to=%2F'};load();setInterval(load,30000);
</script></body></html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/") return new Response(page, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
    if (url.pathname === "/api/state" && request.method === "GET") {
      return reply({ results: await readResults(env), owner: isOwner(request, env) });
    }
    const match = /^\/api\/matches\/(\d-\d)$/.exec(url.pathname);
    if (match && request.method === "PUT") {
      if (!isOwner(request, env)) return reply({ error: "Owner access required" }, 403);
      const [roundIndex, matchIndex] = match[1].split("-").map(Number);
      const pair = rounds[roundIndex - 1]?.[matchIndex - 1];
      if (!pair) return reply({ error: "Unknown match" }, 404);
      let body;
      try { body = await request.json(); } catch { return reply({ error: "Invalid JSON" }, 400); }
      if (!pair.includes(body?.winner)) return reply({ error: "Winner must be in this match" }, 400);
      const results = await readResults(env);
      results[match[1]] = body.winner;
      await env.BUCKET.put(dataKey, JSON.stringify(results), { httpMetadata: { contentType: "application/json" } });
      return reply({ results });
    }
    return new Response("Not found", { status: 404 });
  },
};
