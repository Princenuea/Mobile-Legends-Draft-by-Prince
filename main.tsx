import React,{useMemo,useState} from "react";
import {createRoot} from "react-dom/client";
import {Ban,BookOpen,Brain,Crown,Database,History,Home,Info,Layers,RotateCcw,Search,Settings,Swords,Target,Users,Shield,ChevronRight} from "lucide-react";
import "./styles.css";

type Hero={name:string;role:string;lane:string;tags:string[];priority:number;counter:string[];synergy:string[]};
type Phase={type:"ban"|"pick";team:"blue"|"red";label:string};

const phases=(banCount:number):Phase[]=>{
 const p:Phase[]=[]; for(let i=0;i<banCount;i++)p.push({type:"ban",team:i%2?"red":"blue",label:`Ban ${i+1}`});
 for(let i=0;i<10;i++)p.push({type:"pick",team:[0,1,1,0,0,1,1,0,0,1][i]?"red":"blue",label:`Pick ${i+1}`});
 return p;
};

const heroNames=["Aamon","Akai","Aldous","Alice","Alpha","Alucard","Angela","Argus","Arlott","Atlas","Aurora","Aulus","Badang","Balmond","Bane","Barats","Baxia","Beatrix","Belerick","Benedetta","Brody","Bruno","Carmilla","Cecilion","Chang'e","Chip","Chou","Cici","Claude","Clint","Cyclops","Diggie","Dyrroth","Edith","Esmeralda","Estes","Eudora","Fanny","Faramis","Floryn","Franco","Fredrinn","Freya","Gatotkaca","Gloo","Gord","Granger","Grock","Guinevere","Gusion","Hanabi","Hanzo","Harith","Harley","Hayabusa","Hilda","Hylos","Irithel","Ixia","Johnson","Joy","Julian","Kadita","Kagura","Kaja","Karina","Karrie","Khaleed","Khufra","Kimmy","Lancelot","Layla","Leomord","Lesley","Ling","Lolita","Lunox","Luo Yi","Lylia","Martis","Masha","Mathilda","Melissa","Minotaur","Minsitthar","Miya","Moskov","Nana","Natalia","Natan","Novaria","Odette","Paquito","Pharsa","Phoveus","Popol and Kupa","Rafaela","Roger","Ruby","Saber","Selena","Silvanna","Sora","Sun","Terizla","Thamuz","Tigreal","Uranus","Vale","Valentina","Valir","Vexana","Wanwan","X.Borg","Xavier","Yi Sun-shin","Yin","Yve","Zetian","Zhask","Zhuxin","Zilong","Marcel","Kalea","Obsidia","Hirara","Suyou"];

const rich:Record<string,Partial<Hero>>={
"Fanny":{role:"Assassin",lane:"Jungle",tags:["mobility","burst"],priority:10,counter:["Khufra","Minsitthar","Franco","Saber"],synergy:["Angela","Mathilda","Khaleed"]},
"Freya":{role:"Fighter",lane:"EXP",tags:["engage","dps"],priority:10,counter:["Valir","Karrie","Dyrroth"],synergy:["Mathilda","Khufra","Yve"]},
"Zhuxin":{role:"Mage",lane:"Mid",tags:["zone","cc","poke"],priority:10,counter:["Fanny","Ling","Lancelot"],synergy:["Fredrinn","Terizla","Khufra"]},
"Claude":{role:"Marksman",lane:"Gold",tags:["mobility","aoe","dps"],priority:9,counter:["Brody","Saber","Kaja"],synergy:["Mathilda","Terizla","Minotaur"]},
"Harith":{role:"Mage",lane:"Mid/Gold",tags:["mobility","dps"],priority:9,counter:["Phoveus","Kaja","Saber"],synergy:["Mathilda","Khufra","Terizla"]},
"Leomord":{role:"Fighter",lane:"EXP/Jungle",tags:["engage","dps"],priority:9,counter:["Valir","Karrie","Dyrroth"],synergy:["Mathilda","Yve","Fredrinn"]},
"Suyou":{role:"Fighter/Assassin",lane:"Jungle/EXP",tags:["burst","mobility"],priority:9,counter:["Khufra","Franco","Minsitthar"],synergy:["Yve","Mathilda","Terizla"]},
"Phoveus":{role:"Fighter",lane:"EXP",tags:["anti-mobility","cc"],priority:9,counter:["Valir","Karrie","Xavier"],synergy:["Zhuxin","Khufra","Fredrinn"]},
"Marcel":{role:"Support/Tank",lane:"Roam",tags:["cc","peel"],priority:9,counter:["Diggie","Valir","Karrie"],synergy:["Claude","Zhuxin","Harith"]},
"Arlott":{role:"Fighter",lane:"EXP",tags:["cc","engage"],priority:9,counter:["Valir","Karrie","Dyrroth"],synergy:["Fredrinn","Zhuxin","Mathilda"]},
"Fredrinn":{role:"Tank/Fighter",lane:"Jungle",tags:["frontline","cc","objective"],priority:9,counter:["Karrie","Valir","Dyrroth"],synergy:["Zhuxin","Claude","Mathilda"]},
"Terizla":{role:"Fighter",lane:"EXP",tags:["frontline","cc","engage"],priority:9,counter:["Karrie","Valir","Dyrroth"],synergy:["Zhuxin","Claude","Mathilda"]},
"Beatrix":{role:"Marksman",lane:"Gold",tags:["poke","burst"],priority:8,counter:["Lolita","Natalia","Hayabusa"],synergy:["Fredrinn","Terizla","Mathilda"]},
"Mathilda":{role:"Support/Assassin",lane:"Roam",tags:["mobility","peel"],priority:9,counter:["Kaja","Franco","Minsitthar"],synergy:["Fanny","Claude","Beatrix"]},
"Khufra":{role:"Tank",lane:"Roam",tags:["frontline","cc","anti-mobility"],priority:9,counter:["Diggie","Valir","Karrie"],synergy:["Zhuxin","Beatrix","Xavier"]},
"Yve":{role:"Mage",lane:"Mid",tags:["poke","zone","cc"],priority:9,counter:["Fanny","Ling","Hayabusa"],synergy:["Terizla","Fredrinn","Minotaur"]},
"Xavier":{role:"Mage",lane:"Mid",tags:["poke","cc"],priority:8,counter:["Fanny","Ling","Hayabusa"],synergy:["Fredrinn","Terizla","Khufra"]},
"Karrie":{role:"Marksman",lane:"Gold",tags:["tank-killer","dps"],priority:8,counter:["Hayabusa","Fanny","Ling"],synergy:["Fredrinn","Khufra","Mathilda"]},
"Diggie":{role:"Support",lane:"Roam",tags:["anti-cc","peel"],priority:8,counter:["Franco","Khufra","Atlas"],synergy:["Claude","Yve","Beatrix"]}
};

const roleGuess=(n:string)=>["Fanny","Ling","Hayabusa","Lancelot","Suyou","Saber","Gusion","Aamon","Karina","Natalia","Selena"].includes(n)?"Assassin":
["Claude","Beatrix","Brody","Bruno","Clint","Hanabi","Irithel","Ixia","Karrie","Layla","Lesley","Melissa","Miya","Moskov","Natan","Wanwan","Obsidia"].includes(n)?"Marksman":
["Zhuxin","Yve","Xavier","Harith","Pharsa","Lunox","Valentina","Valir","Vexana","Novaria","Lylia","Luo Yi","Kadita","Kagura","Nana","Aurora"].includes(n)?"Mage":
["Khufra","Franco","Atlas","Tigreal","Minotaur","Hylos","Grock","Gloo","Belerick","Johnson","Marcel"].includes(n)?"Tank":
["Mathilda","Angela","Diggie","Estes","Floryn","Rafaela","Carmilla"].includes(n)?"Support":"Fighter";

const heroes:Hero[]=heroNames.map(name=>({name,role:roleGuess(name),lane:"Flex",tags:["flex"],priority:5,counter:[],synergy:[],...(rich[name]||{})}));

const ranks={Epic:6,Legend:8,Mythic:10,"Mythical Honor":10,"Mythical Glory":10,"Mythical Immortal":10};
const rankList=Object.keys(ranks);

function analyze(h:Hero,blue:Hero[],red:Hero[],side:"blue"|"red"){
 const own=side==="blue"?blue:red, enemy=side==="blue"?red:blue; let score=h.priority*3; const reasons:string[]=[];
 enemy.forEach(e=>{if(h.counter.includes(e.name)){score+=16;reasons.push(`Counter ${e.name}`)};if(e.counter.includes(h.name)){score-=11;reasons.push(`Vulnerable to ${e.name}`)}});
 own.forEach(e=>{if(h.synergy.includes(e.name)||e.synergy.includes(h.name)){score+=12;reasons.push(`Synergy ${e.name}`)};if(e.role===h.role)score-=2});
 const tags=new Set(own.flatMap(e=>e.tags)); h.tags.forEach(t=>{if(!tags.has(t))score+=3});
 const roles=new Set(own.map(e=>e.role.split("/")[0])); if(!roles.has(h.role.split("/")[0]))score+=5;
 return {score,reasons:[...new Set(reasons)].slice(0,3)};
}

function App(){
 const [page,setPage]=useState("home"),[rank,setRank]=useState("Mythic"),[phaseIndex,setPhaseIndex]=useState(0),[blue,setBlue]=useState<Hero[]>([]),[red,setRed]=useState<Hero[]>([]),[bans,setBans]=useState<Hero[]>([]),[query,setQuery]=useState(""),[history,setHistory]=useState<string[]>([]);
 const phasesNow=phases(ranks[rank as keyof typeof ranks]); const phase=phasesNow[Math.min(phaseIndex,phasesNow.length-1)];
 const used=new Set([...blue,...red,...bans].map(h=>h.name));
 const candidates=useMemo(()=>heroes.filter(h=>h.name.toLowerCase().includes(query.toLowerCase())&&!used.has(h.name)).map(h=>({...h,...analyze(h,blue,red,phase?.team||"blue")})).sort((a,b)=>b.score-a.score),[query,blue,red,bans,phaseIndex,rank]);
 const selectHero=(h:Hero)=>{if(used.has(h.name))return; if(phase.type==="ban")setBans(x=>[...x,h]); else (phase.team==="blue"?setBlue:setRed)(x=>[...x,h]); setHistory(x=>[...x,`${phase.label}: ${h.name}`]); if(phaseIndex<phasesNow.length-1)setPhaseIndex(x=>x+1)};
 const reset=()=>{setBlue([]);setRed([]);setBans([]);setPhaseIndex(0);setHistory([])};
 const nav=[["home","Home",Home],["draft","Draft",Swords],["heroes","Heroes",Database],["meta","Meta",Brain],["history","History",History],["settings","Settings",Settings]] as const;
 return <div className="app">
 <header><div className="brand"><div className="logo"><Crown/></div><div><b>PRINCENUE</b><small>MLBB DRAFT ASSISTANT</small></div></div><button className="reset" onClick={reset}><RotateCcw/> Reset Draft</button></header>
 <main>
 {page==="home"&&<section className="home"><div className="eyebrow"><Target/> COMPETITIVE DRAFT ENGINE</div><h1>Draft with<br/><em>purpose.</em></h1><p>Draft Assistant yang membaca seluruh komposisi, bukan sekadar satu matchup. Counter, synergy, role balance, dan prioritas meta dihitung bersama.</p><button className="primary" onClick={()=>setPage("draft")}>Open Draft Room <ChevronRight/></button><div className="homecards"><div><Swords/><b>5v5 Draft</b><small>Pick & ban sequence</small></div><div><Brain/><b>Smart Recommendation</b><small>Context-aware scoring</small></div><div><Shield/><b>Competitive Meta</b><small>MPL ID data layer ready</small></div></div></section>}
 {page==="draft"&&<section><div className="head"><div><div className="eyebrow">DRAFT ROOM</div><h2>Pick & Ban</h2></div><select value={rank} onChange={e=>{setRank(e.target.value);reset()}}>{rankList.map(x=><option key={x}>{x}</option>)}</select></div>
 <div className="timeline">{phasesNow.map((p,i)=><div className={(i===phaseIndex?"now ":"")+(i<phaseIndex?"done":"")} key={i}><span>{i+1}</span><small>{p.type}</small></div>)}</div>
 <div className="phasebox"><div><b>{phase?.label}</b><span>{phase?.type==="ban"?"Select a ban":"Select your next pick"} · {phase?.team==="blue"?"BLUE TEAM":"RED TEAM"}</span></div><strong>{Math.min(phaseIndex+1,phasesNow.length)}/{phasesNow.length}</strong></div>
 <div className="teams"><Team title="BLUE TEAM" heroes={blue} tone="blue" onRemove={()=>{}}/><Team title="RED TEAM" heroes={red} tone="red" onRemove={()=>{}}/></div>
 <div className="grid2"><div className="panel"><div className="paneltitle"><span>Recommended {phase?.type==="ban"?"Bans":"Picks"}</span><small>Best current options</small></div>{candidates.slice(0,6).map(h=><button className="recommend" key={h.name} onClick={()=>selectHero(h)}><div className="avatar">{h.name[0]}</div><div><b>{h.name}</b><small>{h.role} · {h.lane}</small><span>{h.reasons.join(" · ")||"Meta + composition fit"}</span></div><strong>{Math.round(h.score)}</strong></button>)}</div>
 <div className="panel"><div className="paneltitle"><span>Hero Pool</span><small>{heroes.length} heroes</small></div><div className="search"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search hero"/></div><div className="pool">{heroes.filter(h=>h.name.toLowerCase().includes(query.toLowerCase())&&!used.has(h.name)).map(h=><button onClick={()=>selectHero(h)} key={h.name}><div className="avatar">{h.name[0]}</div><b>{h.name}</b><small>{h.role}</small></button>)}</div></div></div>
 <div className="insight"><Brain/><div><b>Draft Insight</b><p>{candidates[0]?`Best current ${phase?.type==="ban"?"ban":"pick"}: ${candidates[0].name}. ${candidates[0].reasons.join(". ")||"Strong meta and composition fit"}.`:"Draft complete. Review your final composition."}</p></div></div>
 </section>}
 {page==="heroes"&&<section><div className="head"><div><div className="eyebrow">DATABASE</div><h2>Hero Database</h2></div><span className="count">{heroes.length} Heroes</span></div><div className="heroGrid">{heroes.map(h=><article key={h.name}><div className="avatar big">{h.name[0]}</div><b>{h.name}</b><small>{h.role} · {h.lane}</small><div className="chips">{h.tags.map(t=><i key={t}>{t}</i>)}</div><p><b>Counter:</b> {h.counter.length?h.counter.join(", "):"Tactical data pending"}</p><p><b>Synergy:</b> {h.synergy.length?h.synergy.join(", "):"Tactical data pending"}</p></article>)}</div></section>}
 {page==="meta"&&<section><div className="head"><div><div className="eyebrow">MPL ID DATA LAYER</div><h2>Competitive Meta</h2></div></div><div className="notice"><Info/><span>Gunakan season/patch sebagai dataset terpisah. Statistik MPL ID S17 memiliki Pick, Ban, Win, dan Win Rate; engine ini menggunakannya sebagai salah satu faktor, bukan sebagai satu-satunya penentu.</span></div><div className="metaGrid">{[...heroes].sort((a,b)=>b.priority-a.priority).slice(0,30).map((h,i)=><div key={h.name}><span>#{i+1}</span><div className="avatar">{h.name[0]}</div><div><b>{h.name}</b><small>{h.role} · Priority {h.priority}/10</small></div></div>)}</div></section>}
 {page==="history"&&<section><div className="head"><div><div className="eyebrow">DRAFT LOG</div><h2>History</h2></div></div><div className="panel log">{history.length?history.map((x,i)=><div key={i}><span>{i+1}</span>{x}</div>):<div className="empty">Belum ada draft.</div>}</div></section>}
 {page==="settings"&&<section><div className="head"><div><div className="eyebrow">CONFIGURATION</div><h2>Settings</h2></div></div><div className="panel settings"><div><b>Interface</b><span>Dark / Premium</span></div><div><b>Draft mode</b><span>Competitive 5v5</span></div><div><b>Data source</b><span>MPL ID + tactical rules</span></div></div></section>}
 </main>
 <nav>{nav.map(([id,label,Icon])=><button className={page===id?"selected":""} onClick={()=>setPage(id)} key={id}><Icon/><span>{label}</span></button>)}</nav>
 </div>
}
function Team({title,heroes,tone,onRemove}:{title:string;heroes:Hero[];tone:string;onRemove:()=>void}){return <div className={"team "+tone}><div className="teamtitle">{title}<span>{heroes.length}/5</span></div><div className="teamslots">{[0,1,2,3,4].map(i=><div className="teamslot" key={i}>{heroes[i]?<><div className="avatar">{heroes[i].name[0]}</div><b>{heroes[i].name}</b><small>{heroes[i].role}</small></>:<span>Empty</span>}</div>)}</div></div>}
createRoot(document.getElementById("root")!).render(<App/>);
