'use client';
import {useEffect,useMemo,useState} from 'react';
import {BrowserRouter,Routes,Route,NavLink,useNavigate,useLocation} from 'react-router-dom';
import {Circle, CircleMarker, MapContainer, Popup, TileLayer, Tooltip as LeafletTooltip, useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {Area,AreaChart,Bar,BarChart,CartesianGrid,Cell,Legend,Line,LineChart,Pie,PieChart,ResponsiveContainer,Tooltip,XAxis,YAxis} from 'recharts';
import {Activity,AlertTriangle,ArrowRight,BarChart3,Bell,BrainCircuit,Check,ChevronRight,Clock3,CloudRain,Cog,Compass,Database,Download,Drill,Eye,FileBarChart,GitCompareArrows,HardHat,Layers3,Menu,Mountain,PanelLeftClose,Play,RotateCcw,Satellite,Search,Settings2,ShieldCheck,SlidersHorizontal,Sparkles,Target,Truck,X,Zap} from 'lucide-react';
import {blocks,equipment,indicators,layers,mines,monthly,production,reports,risks,sources} from './mockData';
import { getDashboard, getEquipment, getProduction, getRisks, getRecommendations, getBlockDetail, simulateProduction } from "./api";

const nfmt=(n:number)=>Math.round(n).toLocaleString('en-IN');
function Badge({children,tone='blue'}:{children:any,tone?:string}){return <span className={`badge ${tone}`}>{children}</span>}
function Button({children,onClick,kind='ghost'}:{children:any,onClick?:()=>void,kind?:string}){return <button className={`button ${kind}`} onClick={onClick}>{children}</button>}
function Modal({title,children,onClose,wide=false}:{title:string,children:any,onClose:()=>void,wide?:boolean}){return <div className="modal-back" onMouseDown={onClose}><div className={`modal ${wide?'wide':''}`} onMouseDown={e=>e.stopPropagation()}><div className="modal-head"><div><span className="kicker">INTELLIGENCE VIEW</span><h2>{title}</h2></div><button className="icon-btn" onClick={onClose}><X/></button></div>{children}</div></div>}
function Toast({text,onDone}:{text:string,onDone:()=>void}){useEffect(()=>{const t=setTimeout(onDone,3500);return()=>clearTimeout(t)},[onDone]);return <div className="toast"><Check/><div><b>Action complete</b><span>{text}</span></div></div>}

const nav=[['/command-center','Command Center',Activity],['/prospectivity','Prospectivity',Mountain],['/production','Production',BarChart3],['/simulator','Simulator',SlidersHorizontal],['/insights','AI Insights',BrainCircuit],['/reports','Reports',FileBarChart]] as const;
function Shell({children}:{children:any}){const [collapsed,setCollapsed]=useState(false);const [mobile,setMobile]=useState(false);const loc=useLocation();const title=nav.find(n=>loc.pathname.startsWith(n[0]))?.[1]||'Operations';return <div className={`app-shell ${collapsed?'collapsed':''}`}><aside className={`sidebar ${mobile?'open':''}`}><div className="side-brand"><NavLink to="/" className="side-brand-home" onClick={()=>setMobile(false)} aria-label="Go to OreSight home"><div className="logo"><Mountain/></div><div><b>ORESIGHT <em>AI</em></b><span>Mining Intelligence Platform</span></div></NavLink><button onClick={()=>setCollapsed(!collapsed)} aria-label="Collapse sidebar"><PanelLeftClose/></button></div><div className="side-label">INTELLIGENCE</div><nav>{nav.map(([to,label,Icon])=><NavLink key={to} to={to} onClick={()=>setMobile(false)}><Icon/><span>{label}</span><i/></NavLink>)}</nav><div className="side-label">OPERATIONS</div><nav className="utility"><NavLink to="/production#equipment"><Truck/><span>Equipment Monitor</span></NavLink><NavLink to="/reports#comparison"><GitCompareArrows/><span>Mine Comparison</span></NavLink><NavLink to="/reports#sources"><Database/><span>Data Sources</span></NavLink></nav><div className="system-card"><span>SYSTEM STATUS</span><b><i/> AI Engine Online</b><small>Synthetic data pipeline · stable</small></div><div className="profile"><div className="avatar">AO</div><div><b>Admin</b><span>Mine Operations</span></div></div></aside><div className="app-main"><header className="topbar"><button className="mobile-menu" onClick={()=>setMobile(!mobile)}><Menu/></button><div><span>ORESIGHT / {title.toUpperCase()}</span><h3>{title}</h3></div><div className="top-actions"><div className="ops-label"><b>MOIL Mining Operations</b><span><i/> Live Demo</span></div><button><Search/></button><button className="notif"><Bell/><i/></button><div className="mini-avatar">AO</div></div></header><main className="page">{children}</main></div></div>}
function PageHead({kicker,title,sub}:{kicker:string,title:string,sub:string}){return <div className="page-head"><div><span className="kicker">{kicker}</span><h1>{title}</h1><p>{sub}</p></div><Badge tone="amber"><ShieldCheck/> SYNTHETIC / DEMO DATA</Badge></div>}
function Metric({label,value,sub,tone=''}:{label:string,value:string,sub?:string,tone?:string}){return <div className={`metric ${tone}`}><span>{label}</span><strong>{value}</strong>{sub&&<small>{sub}</small>}<div className="metric-ticks"><i/><i/><i/><i/><i/></div></div>}

function Terrain({onSelect,selected='',compact=false,scanning=false,showScores=true}:{onSelect?:(id:string)=>void,selected?:string,compact?:boolean,scanning?:boolean,showScores?:boolean}){
  return <div className={`terrain ${compact?'compact':''} ${scanning?'is-scanning':''}`}>
    <div className="terrain-grid"/>
    {scanning&&<div className="scanline"/>}
    <div className="coords">21.1058°N · 79.1268°E</div>
    {blocks.map(b=><button key={b.id} className={`map-zone ${selected===b.id?'selected':''} ${showScores?'revealed':''}`} style={{left:`${b.x}%`,top:`${b.y}%`,'--zone':b.color} as any} onClick={()=>onSelect?.(b.id)} aria-label={`Block ${b.id}`}>
      <i/><b>{b.id}</b>{showScores&&<span>{b.score}%</span>}
    </button>)}
    <div className="map-legend"><span><i className="critical"/> VERY HIGH</span><span><i className="high"/> HIGH</span><span><i className="med"/> MEDIUM</span></div>
  </div>
}
function Landing(){
  const nav=useNavigate();
  const features=[
    [Mountain,'Discover','Find high-probability mineral zones from geological and remote-sensing evidence.'],
    [Satellite,'Predict','Estimate prospectivity, reserves and production risk with confidence ranges.'],
    [BrainCircuit,'Explain','Show the signals behind every AI prediction instead of a black-box score.'],
    [SlidersHorizontal,'Recommend','Test actions in a what-if simulator before operational deployment.']
  ];
  const stats=[['Prospectivity zones','5','demo blocks'],['AI confidence','86%','selected-zone example'],['Production forecast','3,410 T','daily estimate'],['Shortfall risk','HIGH','190 T projected']];
  return <div className="landing">
    <div className="landing-nav">
      <div className="brand"><Mountain/><b>ORESIGHT <em>AI</em></b></div>
      <div className="landing-links"><span>AI + SPACE INTELLIGENCE FOR MINING</span></div>
    </div>

    <section className="landing-hero">
      <div className="hero-copy">
        <div className="hero-eyebrow"><span className="pulse-dot"/> AI-POWERED MINE INTELLIGENCE</div>
        <h1>Turn mine data into <em>decisions.</em></h1>
        <p>Discover mineral potential, predict production risk, explain the cause and test the action — in one decision-support platform.</p>
        <div className="hero-buttons">
          <Button kind="primary" onClick={()=>nav('/prospectivity')}>Explore Mine Intelligence <ArrowRight/></Button>
          <Button onClick={()=>nav('/command-center')}>Open Command Center <ChevronRight/></Button>
        </div>
        <div className="hero-proof"><ShieldCheck/><span><b>DECISION SUPPORT</b> Built around multi-source GeoAI, explainability and human-in-the-loop review.</span></div>
      </div>

      <div className="hero-map">
        <HighQualityExplorationMap compact scanned selected="" active={[]} basemap="satellite" onSelect={()=>nav('/prospectivity')} onSubsurface={()=>nav('/prospectivity')}/>
        <div className="hero-map-badge"><span>LIVE DEMO MAP</span><b>India Mineral Prospectivity</b><small>5 highlighted candidate zones · synthetic data</small></div>
        <div className="hero-map-cta" onClick={()=>nav('/prospectivity')}>OPEN EXPLORATION MAP <ArrowRight/></div>
      </div>
    </section>

    <section className="landing-stats">
      {stats.map(x=><div key={x[0]}><span>{x[0]}</span><b>{x[1]}</b><small>{x[2]}</small></div>)}
    </section>

    <section className="landing-section">
      <div className="section-title"><span>THE ORESIGHT WORKFLOW</span><h2>Discover. Predict. <em>Explain. Recommend.</em></h2></div>
      <div className="feature-grid">
        {features.map(([Icon,label,desc],i)=><div className="feature" key={label as string}>
          <span>0{i+1}</span><Icon/><h3>{label as string}</h3><p>{desc as string}</p><ArrowRight/>
        </div>)}
      </div>
    </section>

    <section className="workflow">
      <div className="section-title"><span>MULTI-SOURCE ARCHITECTURE</span><h2>Evidence flows into <em>action.</em></h2></div>
      <div className="flow-sources">
        {[['Satellite',Satellite],['Geological',Layers3],['Borehole',Drill],['Weather',CloudRain],['Operations',Truck]].map(([x,I])=><div key={x as string}><I/><b>{x as string}</b><i/></div>)}
      </div>
      <div className="flow-engine"><BrainCircuit/><div><span>AI INTELLIGENCE ENGINE</span><b>Predict <i>→</i> Explain <i>→</i> Optimize <i>→</i> Act</b></div></div>
    </section>

    <section className="alert-demo">
      <div><Badge tone="red"><AlertTriangle/> PRODUCTION RISK</Badge><h2>See the risk <em>before the shortfall.</em></h2><p>AI identifies likely contributors and quantifies the impact so operators can compare recovery options.</p><div className="contrib-bars">{[['Equipment downtime',39],['Heavy rainfall',27],['Blasting delay',18],['Other',16]].map(([x,v])=><div key={x as string}><span>{x}<b>{v}%</b></span><i><em style={{width:`${v}%`}}/></i></div>)}</div></div>
      <div className="recommend-panel"><Sparkles/><span>RECOMMENDED ACTION</span><h3>Compare corrective actions before deployment.</h3><p>Expected recovery in this demo scenario <b>+620 T</b></p><Button kind="primary" onClick={()=>nav('/simulator')}>Open What-If Simulator <ArrowRight/></Button></div>
    </section>

    <section className="why"><div><span>BUILT FOR THE JUDGING STORY</span><h2>One continuous path from <em>ore discovery</em> to operational action.</h2></div><div>{['Multi-source GeoAI','Explainable predictions','Uncertainty-aware outputs','Production risk detection','What-if simulation','Human-in-the-loop decisions'].map(x=><p key={x}><Check/>{x}</p>)}</div></section>
  </div>
}
function ProductionChart({monthlyView=false}:{monthlyView?:boolean}){const [range,setRange]=useState(30);const [prod,setProd]=useState<any>(production);useEffect(()=>{getProduction().then(setProd).catch(console.error)},[]);const data=monthlyView?monthly:prod.slice(-range);return <div className="panel chart-panel"><div className="panel-head"><div><span className="kicker">OUTPUT TRAJECTORY</span><h3>{monthlyView?'Actual vs Planned vs AI Forecast':'Production Performance'}</h3></div>{!monthlyView&&<div className="segmented">{[7,30,90].map(n=><button className={range===n?'active':''} onClick={()=>setRange(n)} key={n}>{n}D</button>)}</div>}</div><ResponsiveContainer width="100%" height={310}><AreaChart data={data}><defs><linearGradient id="fc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#45c6d8" stopOpacity={.22}/><stop offset="1" stopColor="#45c6d8" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#202b30" strokeDasharray="3 5"/><XAxis dataKey={monthlyView?'month':'day'} tick={{fill:'#718087',fontSize:10}} axisLine={false}/><YAxis tick={{fill:'#718087',fontSize:10}} axisLine={false} tickFormatter={v=>`${Math.round(v/1000)}k`}/><Tooltip contentStyle={{background:'#0d1417',border:'1px solid #344148'}}/><Legend iconType="plainline" wrapperStyle={{fontSize:11}}/><Line dataKey="planned" name="Planned" stroke="#77858b" strokeDasharray="5 5" dot={false}/><Line dataKey="actual" name="Actual" stroke="#ff9d2e" strokeWidth={2} dot={false}/><Area dataKey="forecast" name="AI Forecast" stroke="#45c6d8" fill="url(#fc)" strokeWidth={2}/></AreaChart></ResponsiveContainer></div>}
function RiskPanel({full=false}:{full?:boolean}){const [data,setData]=useState<any>(risks);useEffect(()=>{getRisks().then(setData).catch(console.error)},[]);const [sel,setSel]=useState(risks[0]);return <div className={`panel risk-panel ${full?'full':''}`}><div className="panel-head"><div><span className="kicker">ROOT CAUSE ATTRIBUTION</span><h3>Why are we missing the target?</h3></div><Badge tone="red">HIGH RISK</Badge></div><div className="risk-body"><div className="donut"><ResponsiveContainer width="100%" height={210}><PieChart><Pie data={data} innerRadius={58} outerRadius={82} paddingAngle={2} dataKey="value" onClick={(d:any)=>setSel(d)}>{data.map((r:any)=><Cell key={r.name} fill={r.color}/>)}</Pie><Tooltip contentStyle={{background:'#0d1417',border:'1px solid #344148'}}/></PieChart></ResponsiveContainer><div><b>190T</b><span>SHORTFALL</span></div></div><div className="risk-list">{data.map((r:any)=><button className={sel.name===r.name?'active':''} key={r.name} onClick={()=>setSel(r)}><i style={{background:r.color}}/><span>{r.name}</span><b>{r.value}%</b></button>)}</div></div><Impact contributor={sel.name}/></div>}
function Impact({contributor}:{contributor:string}){const nav=useNavigate();if(contributor!=='Equipment downtime')return <div className="impact-card"><span>SELECTED CONTRIBUTOR</span><h4>{contributor}</h4><p>{contributor==='Blasting delays'?'Three delayed blast windows reduced face availability by an estimated 1,350 tonnes.':contributor==='Weather'?'Heavy rainfall reduced haul-road velocity and processing continuity.':'Minor scheduling and material-quality variance.'}</p></div>;return <div className="impact-card equipment-impact"><div><span>EQUIPMENT IMPACT</span><h4>EXCAVATOR E-14</h4></div><dl><div><dt>Downtime</dt><dd>18.4 hrs</dd></div><div><dt>Production impact</dt><dd className="negative">−2,100 T</dd></div><div><dt>Availability</dt><dd>61%</dd></div><div><dt>Status</dt><dd>Maintenance</dd></div></dl><Button kind="primary" onClick={()=>nav('/simulator?recovery=E-14')}>Simulate Recovery <ArrowRight/></Button></div>}
function Equipment(){const [items,setItems]=useState<any>(equipment);useEffect(()=>{getEquipment().then(setItems).catch(console.error)},[]);return<div className="panel equipment-panel" id="equipment"><div className="panel-head"><div><span className="kicker">ASSET TELEMETRY</span><h3>Equipment Monitor</h3></div><span className="muted">5 units monitored</span></div><div className="data-table"><div className="tr th"><span>Equipment</span><span>Type</span><span>Status</span><span>Utilization</span></div>{items.map((e:any)=><div className="tr" key={e.id}><b>{e.id}</b><span>{e.type}</span><span className={`status ${e.status.toLowerCase()}`}><i/>{e.status}</span><span><i className="util"><em style={{width:`${e.utilization}%`}}/></i>{e.utilization}%</span></div>)}</div></div>}
function Command(){const nav=useNavigate();const [dashboard,setDashboard]=useState<any>(null);useEffect(()=>{getDashboard().then(setDashboard).catch(console.error)},[]);return <><PageHead kicker="MOIL — MINING INTELLIGENCE COMMAND CENTER" title="Live operational overview" sub="Unified production, risk, asset and geological intelligence for decision support."/><div className="live-row"><span><i/> AI ENGINE ONLINE</span><span><i/> DATA PIPELINE HEALTHY</span><small>Last updated: 2 min ago</small></div><div className="metrics four"><Metric label="TODAY'S OUTPUT" value="3,240 T" sub="↓ 4.8% vs plan"/><Metric label="TODAY'S OUTPUT" value={`${dashboard?.today_output ?? 3240} T`} sub="↓ 4.8% vs plan"/><Metric label="TARGET" value={`${dashboard?.target?.toLocaleString('en-IN') ?? 3600} T`} sub="Daily operating plan"/><Metric label="AI FORECAST" value={`${dashboard?.forecast ?? 3410} T`} sub="94.7% of target" tone="cyan"/><Metric label="SHORTFALL RISK" value={dashboard?.shortfall_risk ?? "HIGH"} sub="190 tonnes projected" tone="danger"/></div><div className="dashboard-grid"><ProductionChart/><RiskPanel/></div><div className="dashboard-grid lower"><div className="panel"><div className="panel-head"><div><span className="kicker">GEO INTELLIGENCE</span><h3>Prospectivity Overview</h3></div><Button onClick={()=>nav('/prospectivity')}>Open map <ArrowRight/></Button></div><Terrain compact onSelect={()=>nav('/prospectivity')}/><div className="mine-strip">{[['Mine A',87],['Mine B',54],['Mine C',21]].map(x=><button key={x[0] as string} onClick={()=>nav('/prospectivity')}><span>{x[0]}</span><b>{x[1]}%</b><small>prospectivity</small></button>)}</div></div><Equipment/></div></>}

function MapLayers({active,setActive}:{active:string[],setActive:(x:string[])=>void}){return <div className="map-layers"><span>MAP LAYERS</span>{layers.map(l=><label key={l}><input type="checkbox" checked={active.includes(l)} onChange={()=>setActive(active.includes(l)?active.filter(x=>x!==l):[...active,l])}/><i><Check/></i>{l}</label>)}</div>}
function ZoneDrawer({id,onAnalyze,onClose}:{id:string,onAnalyze:()=>void,onClose:()=>void}){
  const [b,setB]=useState<any>(()=>blocks.find(x=>x.id===id)!);
  useEffect(()=>{getBlockDetail(id).then(live=>setB((prev:any)=>({...prev,...live}))).catch(console.error)},[id]);
  return<aside className="zone-drawer">
    <button className="drawer-close" onClick={onClose}><X/></button>
    <Badge tone="amber">AI-DETECTED ZONE</Badge>
    <h2>BLOCK {b.id}</h2>
    <p className="drawer-sub">Highest-confidence candidate selected from the current scan.</p>
    <div className="score-ring" style={{'--score':`${b.score*3.6}deg`} as any}><div><b>{b.score}%</b><span>Prospectivity<br/>score</span></div></div>
    <div className="mini-metrics"><div><span>AI Confidence</span><b>{b.confidence}%</b></div><div><span>Data Quality</span><b className="green">HIGH</b></div></div>
    <div className="evidence-title"><span>WHY THIS ZONE?</span><b>Evidence contributing to the prediction</b></div>
    <div className="indicator-list">{indicators.map(([x,v])=><div key={x}><span>{x}<b>{v}%</b></span><i><em style={{width:`${v}%`}}/></i></div>)}</div>
    <div className="analysis-grid"><div><span>PREDICTED MN GRADE</span><b>{b.grade}%</b></div><div><span>CONFIDENCE</span><b>{b.confidence}%</b></div><div><span>ESTIMATED DEPTH</span><b>{b.depth}</b></div></div>
    <div className="drawer-disclaimer"><ShieldCheck/><span>Synthetic demonstration output. This is a prospectivity prediction, not direct underground detection.</span></div>
    <Button kind="primary" onClick={onAnalyze}>Inspect Evidence <ArrowRight/></Button>
  </aside>
}

function IndiaProspectivityMap({scanned=false,onSelect}:{scanned?:boolean,onSelect?:(id:string)=>void}){
  const zones=[
    {id:'B12',state:'Uttar Pradesh',score:94,x:28.4,y:19.8,color:'#ff5b3f'},
    {id:'B17',state:'Madhya Pradesh',score:76,x:24.4,y:39.3,color:'#ffb04a'},
    {id:'B27',state:'West Bengal',score:92,x:51.6,y:48.4,color:'#ff5b3f'},
    {id:'B18',state:'Odisha',score:88,x:44.9,y:58.9,color:'#ff9d3b'},
    {id:'B21',state:'Chhattisgarh',score:81,x:33.3,y:66.4,color:'#ffb04a'},
  ];
  return <div className={`india-prospectivity-map ${scanned?'revealed':''}`}>
    <img src="/report-images/india-map.jpg" alt="India mineral prospectivity demonstration map"/>
    <div className="india-map-overlay"/>
    <div className="india-map-title"><span>INDIA VIEW</span><b>Mineral Prospectivity</b></div>
    <div className="india-map-legend"><span><i className="high"/> High</span><span><i className="medium"/> Medium</span><span><i className="low"/> Low</span></div>
    <div className="india-map-note">Synthetic demonstration data · not for official use</div>
    {scanned&&zones.map(z=><button key={z.id} className="india-zone-point" style={{left:`${z.x}%`,top:`${z.y}%`,'--zone-color':z.color} as any} onClick={()=>onSelect?.(z.id)} title={`${z.state} · ${z.score}% prospectivity`}><i/><b>{z.id}</b><span>{z.score}%</span></button>)}
    {!scanned&&<div className="india-map-empty"><Target/><b>India exploration view ready</b><span>Start AI Scan to reveal mineral prospectivity zones.</span></div>}
  </div>
}

const explorationZones=[
  {id:'B12',place:'Chhatarpur',altitude:'305 m',position:[24.68,79.16] as [number,number]},
  {id:'B17',place:'Sagar',altitude:'427 m',position:[22.78,78.66] as [number,number]},
  {id:'B27',place:'Purulia',altitude:'228 m',position:[23.55,86.48] as [number,number]},
  {id:'B18',place:'Keonjhar',altitude:'480 m',position:[20.52,84.27] as [number,number]},
  {id:'B21',place:'Durg',altitude:'291 m',position:[21.42,81.63] as [number,number]},
];
const indiaMapCenter:[number,number]=[22.45,80.35];

function MapTools({onSubsurface}:{onSubsurface:()=>void}){
  const map=useMap();
  return <div className="map-tools leaflet-tools">
    <button type="button" onClick={()=>map.zoomIn()} aria-label="Zoom in">+</button>
    <button type="button" onClick={()=>map.zoomOut()} aria-label="Zoom out">−</button>
    <button type="button" onClick={()=>map.flyTo(indiaMapCenter,5.45,{duration:.7})} aria-label="Reset India map view"><Compass/></button>
    <button type="button" onClick={onSubsurface}><Layers3/> 3D Subsurface</button>
  </div>
}

function HighQualityExplorationMap({scanned,selected,active,basemap,onSelect,onSubsurface,compact=false}:{scanned:boolean,selected:string,active:string[],basemap:'satellite'|'streets',onSelect:(id:string)=>void,onSubsurface:()=>void,compact?:boolean}){
  const satellite=basemap==='satellite';
  const tileUrl=satellite
    ?'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    :'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const attribution=satellite
    ?'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
    :'© OpenStreetMap contributors';
  return <MapContainer className="high-quality-map" center={indiaMapCenter} zoom={5.45} minZoom={4} maxZoom={18} scrollWheelZoom zoomControl={false} attributionControl>
    <TileLayer url={tileUrl} attribution={attribution} maxZoom={18} maxNativeZoom={satellite?18:19}/>
    {active.includes('Geological Layers')&&explorationZones.map(zone=><Circle key={`geology-${zone.id}`} center={zone.position} radius={72000} pathOptions={{color:'#52c9d8',weight:1,fillColor:'#265b61',fillOpacity:.12}} interactive={false}/>) }
    {active.includes('NDVI')&&<Circle center={[21.85,82.5]} radius={180000} pathOptions={{color:'#67c985',weight:1,fillColor:'#3f9f59',fillOpacity:.14}} interactive={false}/>} 
    {active.includes('Rainfall')&&<Circle center={[23.2,84.7]} radius={210000} pathOptions={{color:'#5ebee4',weight:1,fillColor:'#347da0',fillOpacity:.13}} interactive={false}/>} 
    {scanned&&explorationZones.map(zone=>{
      const block=blocks.find(item=>item.id===zone.id)!;
      const isSelected=selected===zone.id;
      return <CircleMarker key={zone.id} center={zone.position} radius={isSelected?13:10} pathOptions={{color:'#ffffff',weight:2,fillColor:block.color,fillOpacity:1}} eventHandlers={{click:()=>onSelect(zone.id)}}>
        <LeafletTooltip permanent direction="bottom" offset={[0,12]} opacity={1} className="zone-map-label"><b>{zone.place}</b><span>{zone.altitude}</span></LeafletTooltip>
        <Popup><strong>Block {block.id}</strong><br/>{block.score}% prospectivity · {block.confidence}% confidence</Popup>
      </CircleMarker>
    })}
    {!compact&&<MapTools onSubsurface={onSubsurface}/>} 
  </MapContainer>
}

function Prospectivity(){
  const [selected,setSelected]=useState('');
  const [drawer,setDrawer]=useState(false);
  const [active,setActive]=useState(['Mine Boundary','Mineral Prospectivity']);
  const [analysis,setAnalysis]=useState(false);
  const [subsurface,setSubsurface]=useState(false);
  const [query,setQuery]=useState('');
  const [scanning,setScanning]=useState(false);
  const [scanComplete,setScanComplete]=useState(false);
  const [scanStep,setScanStep]=useState(0);
  const [basemap,setBasemap]=useState<'satellite'|'streets'>('satellite');

  const startScan=()=>{
    if(scanning)return;
    setSelected('');setDrawer(false);setScanComplete(false);setScanning(true);setScanStep(1);
    window.setTimeout(()=>setScanStep(2),1200);
    window.setTimeout(()=>setScanStep(3),2600);
    window.setTimeout(()=>{setScanning(false);setScanComplete(true);setScanStep(4)},4300);
  };
  const selectZone=(id:string)=>{if(!scanComplete)return;setSelected(id);setDrawer(true)};
  const search=()=>{const q=query.trim().toUpperCase();if(scanComplete&&blocks.some(b=>b.id===q))selectZone(q)};

  return <><PageHead kicker="GEO INTELLIGENCE" title="Mineral Prospectivity" sub="Scan an exploration area, reveal ranked candidate zones, then inspect the evidence behind each prediction."/>
    <div className="prospectivity-toolbar">
      <div className="scan-intro"><div className="scan-intro-icon"><Sparkles/></div><div><span className="kicker">DISCOVER</span><b>AI-assisted exploration workflow</b><small>{scanning?'Analyzing geological and remote-sensing indicators…':scanComplete?'Five candidate zones detected. Select a zone to inspect the evidence.':'Start a scan to reveal high-probability exploration zones.'}</small></div></div>
      <div className="scan-actions">
        <div className="scan-status"><i className={scanComplete?'done':scanning?'busy':''}/>{scanComplete?'SCAN COMPLETE':scanning?'SCANNING AREA':'READY TO SCAN'}</div>
        {!scanning&&<Button kind={scanComplete?'ghost':'primary'} onClick={startScan}>{scanComplete?<><RotateCcw/> Re-scan Area</>:<><Zap/> Start AI Scan</>}</Button>}
        {scanning&&<div className="toolbar-progress"><i style={{width:`${scanStep===1?28:scanStep===2?62:88}%`}}/></div>}
      </div>
    </div>

    {scanComplete&&<div className="scan-results">
      <div className="scan-results-head"><div><span>AI SCAN RESULTS</span><b>5 candidate zones ranked by prospectivity</b></div><small>Click a zone to inspect evidence</small></div>
      <div className="zone-rank-list">{[...blocks].sort((a,b)=>b.score-a.score).map((b,i)=><button key={b.id} className={selected===b.id?'active':''} onClick={()=>selectZone(b.id)}><span>0{i+1}</span><b>{b.id}</b><strong>{b.score}%</strong><small>{b.confidence}% confidence</small></button>)}</div>
    </div>}

    <div className="map-workspace prospectivity-workspace">
      <div className={`full-map ${active.includes('Geological Layers')?'geology':''} ${active.includes('NDVI')?'ndvi':''} ${active.includes('Rainfall')?'rainfall':''}`}>
        <HighQualityExplorationMap scanned={scanComplete} selected={selected} active={active} basemap={basemap} onSelect={selectZone} onSubsurface={()=>setSubsurface(true)}/>
        <div className="map-search"><Search/><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&search()} placeholder={scanComplete?'Search a detected block...':'Search available after scan'}/><button onClick={search} disabled={!scanComplete}>LOCATE</button></div>
        <div className="map-mode"><button className={basemap==='streets'?'active':''} onClick={()=>setBasemap('streets')}>STREETS</button><button className={basemap==='satellite'?'active':''} onClick={()=>setBasemap('satellite')}>SATELLITE</button></div>
        <div className="map-scale">INDIA VIEW · LIVE HIGH-RESOLUTION BASEMAP</div>
        {scanning&&<div className="map-scan-state"><Zap/><b>Scanning exploration area</b><span>{scanStep<2?'Preparing evidence layers…':scanStep<3?'Fusing multi-source signals…':'Ranking candidate zones…'}</span></div>}
        {!drawer&&scanComplete&&<div className="map-hint"><Target/> Select a detected block to inspect evidence</div>}
        {drawer&&<ZoneDrawer id={selected} onClose={()=>setDrawer(false)} onAnalyze={()=>setAnalysis(true)}/>}
      </div>
    </div>

    {analysis&&<Modal title={`Block ${selected} · evidence analysis`} onClose={()=>setAnalysis(false)} wide><ZoneAnalysis id={selected}/></Modal>}
    {subsurface&&<Modal title="3D Subsurface View" onClose={()=>setSubsurface(false)} wide><Subsurface/></Modal>}
  </>
}
function ZoneAnalysis({id}:{id:string}){const b=blocks.find(x=>x.id===id)!;const d=[18,24,31,35,34.8,33,27,19].map((v,i)=>({depth:20+i*10,grade:v,confidence:92-i*3}));return <div className="zone-analysis"><div className="analysis-note"><ShieldCheck/><span><b>AI PREDICTION / SYNTHETIC DATA</b> This analysis fuses geological compatibility, exploration history and remote-sensing indicators. It does not represent direct underground detection.</span></div><div className="analysis-kpis"><Metric label="PREDICTED MN GRADE" value={`${b.grade}%`}/><Metric label="CONFIDENCE" value={`${b.confidence}%`}/><Metric label="ESTIMATED DEPTH" value={b.depth}/></div><div className="analysis-charts"><div><h3>Predicted Mn grade / depth profile</h3><ResponsiveContainer width="100%" height={230}><AreaChart data={d}><CartesianGrid stroke="#263238"/><XAxis dataKey="depth"/><YAxis/><Tooltip/><Area dataKey="grade" stroke="#ff9d2e" fill="#ff9d2e22"/></AreaChart></ResponsiveContainer></div><div><h3>Geological confidence</h3><ResponsiveContainer width="100%" height={230}><BarChart data={d}><CartesianGrid stroke="#263238"/><XAxis dataKey="depth"/><YAxis/><Tooltip/><Bar dataKey="confidence" fill="#45c6d8"/></BarChart></ResponsiveContainer></div></div></div>}
function Subsurface(){return <div className="subsurface"><div className="sub-grid">{[15,29,47,63,78].map((x,i)=><div className="borehole" style={{left:`${x}%`,height:`${55+i%3*10}%`}} key={x}><i/><span>BH-{12+i}</span></div>)}<div className="layer l1"/><div className="layer l2"/><div className="orebody"><b>PREDICTED ORE-BEARING ZONE</b><span>Confidence: 81%</span></div><div className="depth-scale"><span>0m</span><span>25m</span><span>50m</span><span>75m</span><span>100m</span></div></div><div className="sub-label"><Badge tone="amber">AI PREDICTED / SYNTHETIC VISUALIZATION</Badge><p>Conceptual subsurface model derived from synthetic borehole, geological and indicator data. Not underground scanning.</p></div></div>}

function Production(){return <><PageHead kicker="PRODUCTION INTELLIGENCE" title="Forecast. Explain. Optimize." sub="Synthetic monthly production intelligence with explainable shortfall attribution."/><div className="metrics four"><Metric label="TARGET" value="100,000 T"/><Metric label="AI FORECAST" value="91,500 T" tone="cyan"/><Metric label="SHORTFALL" value="8,500 T" tone="danger"/><Metric label="RISK" value="HIGH" tone="danger"/></div><ProductionChart monthlyView/><RiskPanel full/><Equipment/></>}
function Slider({label,current,value,setValue,min,max,unit}:{label:string,current:string,value:number,setValue:(n:number)=>void,min:number,max:number,unit:string}){return <div className="scenario-slider"><div><span>{label}</span><small>Current: {current}</small><b>{value}{unit}</b></div><input type="range" min={min} max={max} value={value} onChange={e=>setValue(+e.target.value)}/><div className="range"><span>{min}{unit}</span><span>{max}{unit}</span></div></div>}
function Simulator(){const defaults={rain:20,equip:90,delay:6,hours:20};const [v,setV]=useState(defaults);const [toast,setToast]=useState('');const [live,setLive]=useState<any>(null);useEffect(()=>{simulateProduction({rainfall_change_percent:v.rain,equipment_availability_percent:v.equip,blasting_delay_hours:v.delay,operating_hours_per_day:v.hours}).then(setLive).catch(console.error)},[v]);const localExpected=Math.round(91500+(v.equip-82)*620+(12-v.delay)*310+(v.hours-18)*430-v.rain*22);const expected=live?.forecast_tonnes??localExpected;const impact=expected-91500;const pct=live?.target_achievement_percent??(expected/100000*100);const risk=live?.risk_level??(pct>=97?'LOW':pct>=93?'MEDIUM':'HIGH');const chart=[{name:'Current',value:91500},{name:'Scenario',value:expected},{name:'Target',value:100000}];return <><PageHead kicker="DECISION SIMULATION" title="Production Scenario Simulator" sub="Test operational decisions before deploying them. Deterministic frontend model — not a trained ML system."/><div className="simulator-grid"><div className="panel controls"><div className="panel-head"><div><span className="kicker">SCENARIO INPUTS</span><h3>Operating conditions</h3></div><button onClick={()=>setV(defaults)}><RotateCcw/> RESET</button></div><Slider label="Rainfall Change" current="120 mm" value={v.rain} setValue={x=>setV({...v,rain:x})} min={0} max={50} unit="%"/><Slider label="Equipment Availability" current="82%" value={v.equip} setValue={x=>setV({...v,equip:x})} min={50} max={100} unit="%"/><Slider label="Blasting Delay" current="12 hrs" value={v.delay} setValue={x=>setV({...v,delay:x})} min={0} max={24} unit=" hrs"/><Slider label="Operating Hours" current="18 hrs/day" value={v.hours} setValue={x=>setV({...v,hours:x})} min={12} max={24} unit=" hrs"/></div><div className="panel result"><span className="kicker">AI SIMULATION RESULT</span><div className="scenario-compare"><div><span>CURRENT SCENARIO</span><b>91,500 <small>T</small></b></div><ArrowRight/><div><span>MODIFIED SCENARIO</span><b>{nfmt(expected)} <small>T</small></b><em>{impact>=0?'+':''}{(impact/91500*100).toFixed(1)}%</em></div></div><ResponsiveContainer width="100%" height={240}><BarChart data={chart}><CartesianGrid stroke="#263238" vertical={false}/><XAxis dataKey="name"/><YAxis domain={[80000,102000]} hide/><Tooltip/><Bar dataKey="value" radius={[2,2,0,0]}>{chart.map((_,i)=><Cell key={i} fill={i===1?'#ff9d2e':i===2?'#55727d':'#303e44'}/>)}</Bar></BarChart></ResponsiveContainer><div className="result-kpis"><div><span>Production impact</span><b className="green">+{nfmt(impact)} tonnes</b></div><div><span>Target achievement</span><b>{pct.toFixed(1)}%</b></div><div><span>Shortfall risk</span><b className={risk.toLowerCase()}>{risk}</b></div></div></div></div><div className="recommend-combo"><div className="combo-icon"><Zap/></div><div><span>RECOMMENDED COMBINATION</span><h3>Increase equipment availability <i>+</i> Reduce blasting delay</h3><p>Highest projected recovery without extending the operating envelope.</p></div><div><span>EXPECTED RECOVERY</span><b>+{nfmt(impact)} T</b></div><div><span>RISK REDUCTION</span><b className="green">HIGH → {risk}</b></div><Button kind="primary" onClick={()=>setToast(`Scenario applied locally. Expected production: ${nfmt(expected)} tonnes.`)}>Apply Scenario</Button></div>{toast&&<Toast text={toast} onDone={()=>setToast('')}/>}</>}

const options=[['Option A','Redeploy equipment','+4,500 T'],['Option B','Adjust blasting schedule','+2,800 T'],['Option C','Increase operating hours','+1,700 T']];
function Insights(){const [selected,setSelected]=useState(0);const [toast,setToast]=useState('');const nav=useNavigate();const [recs,setRecs]=useState<any>(options.map((o:any)=>({title:o[1],expected_recovery_tonnes:0})));useEffect(()=>{getRecommendations().then(setRecs).catch(console.error)},[]);return <><PageHead kicker="AI OPERATIONS ADVISOR" title="Operational decision support" sub="Structured, explainable recommendations with human approval before simulated action."/><div className="insights-grid"><div className="risk-hero"><Badge tone="red"><AlertTriangle/> PRODUCTION RISK</Badge><h2>Production is projected to fall <em>8.5% below target</em> this month.</h2><div><span>Primary contributor<b>Equipment downtime</b></span><span>AI confidence<b>82%</b></span></div><p>Forecast uses synthetic production history, equipment availability, weather and blast schedule indicators.</p></div><div className="action-hero"><Sparkles/><span>RECOMMENDED ACTION</span><h2>Redeploy Excavator E-14<br/>to Mine A.</h2><div><span>Expected recovery<b>+4,500 tonnes</b></span><span>Confidence<b>82%</b></span><span>Estimated impact<b>+4.8%</b></span></div><div className="action-buttons"><Button kind="primary" onClick={()=>nav('/simulator?recovery=E-14')}>Simulate <Play/></Button><Button onClick={()=>document.getElementById('alternatives')?.scrollIntoView()}>Compare Alternatives</Button><Button onClick={()=>setToast('Recommendation Applied. Scenario updated successfully. Expected recovery: +4,500 tonnes.')}>Apply Recommendation</Button></div></div></div><div className="panel alternatives" id="alternatives"><div className="panel-head"><div><span className="kicker">ALTERNATIVE ACTIONS</span><h3>Compare recovery strategies</h3></div><small>SELECT ONE FOR ANALYSIS</small></div><div className="option-grid">{recs.map((o:any,i:number)=><button className={selected===i?'active':''} onClick={()=>setSelected(i)} key={o.id??i}><span>OPTION {String.fromCharCode(65+i)}{selected===i&&<Check/>}</span><h3>{o.title}</h3><small>EXPECTED RECOVERY</small><b>+{o.expected_recovery_tonnes} T</b><i className="option-bar"><em style={{width:`${100-i*30}%`}}/></i></button>)}</div></div>{toast&&<Toast text={toast} onDone={()=>setToast('')}/>}</>}
function ReportPreview({type}:{type:string}){return <div className="report-preview"><div className="report-cover"><div className="brand"><Mountain/><b>ORESIGHT AI</b></div><Badge>SYNTHETIC DEMONSTRATION DATA</Badge><h2>{type==='risk'?'Shortfall Risk Analysis':type==='prospectivity'?'Prospectivity Assessment':type==='equipment'?'Equipment Performance':'Monthly Production Report'}</h2><p>MOIL Mining Operations · September 2026</p></div><div className="report-summary"><h3>Executive summary</h3><p>OreSight AI indicates an 8.5% potential production shortfall, primarily associated with equipment downtime. Recovery scenarios show that equipment redeployment and blast schedule improvement could restore up to 7,200 tonnes.</p><div><Metric label="AI FORECAST" value="91,500 T"/><Metric label="RISK" value="HIGH" tone="danger"/><Metric label="CONFIDENCE" value="82%" tone="cyan"/></div></div></div>}
function Reports(){const [report,setReport]=useState<string|null>(null);const [mine,setMine]=useState<any>(null);const reportImages:any={production:'/report-images/production.jpg',prospectivity:'/report-images/prospectivity.jpg',risk:'/report-images/risk.jpg',equipment:'/report-images/equipment.jpg'};return <><PageHead kicker="REPORTS & ANALYTICS" title="Decision records and mine comparison" sub="Visual previews generated from synthetic demonstration data."/><div className="report-grid">{reports.map(([title,sub,type])=><div className="report-card" key={title}><div className="report-photo"><img src={reportImages[type]} alt={`${title} visual`}/><span>{type.toUpperCase()}</span></div><h3>{title}</h3><p>{sub}</p><div><Button onClick={()=>setReport(type)}>View Report <ArrowRight/></Button></div></div>)}</div><div className="panel comparison" id="comparison"><div className="panel-head"><div><span className="kicker">PORTFOLIO BENCHMARK</span><h3>Mine Comparison</h3></div><small>SELECT A MINE FOR DETAIL</small></div><div className="compare-table"><div className="tr th"><span>Mine</span><span>Production</span><span>Target</span><span>Risk</span><span>Prospectivity</span><span/></div>{mines.map(m=><button className="tr" key={m.name} onClick={()=>setMine(m)}><b>{m.name}</b><span>{m.production}</span><span>{m.target}</span><span className={`risk-text ${m.risk.toLowerCase()}`}>{m.risk}</span><span>{m.prospectivity}</span><ChevronRight/></button>)}</div></div><div className="panel data-sources" id="sources"><div className="panel-head"><div><span className="kicker">MULTI-SOURCE INPUTS</span><h3>Data Sources</h3></div><Badge>DEMO CONNECTIVITY</Badge></div><div className="source-grid">{sources.map(([type,name,status])=><div key={type}><Database/><span>{type}</span><b>{name}</b><small className={status==='Synthetic Demo'?'synthetic':''}><i/>{status}</small></div>)}</div></div>{report&&<Modal title="Report preview" onClose={()=>setReport(null)} wide><ReportPreview type={report}/></Modal>}{mine&&<Modal title={`${mine.name} operational summary`} onClose={()=>setMine(null)}><div className="mine-detail"><Terrain compact/><div className="analysis-kpis"><Metric label="PRODUCTION" value={mine.production}/><Metric label="RISK" value={mine.risk} tone={mine.risk==='High'?'danger':''}/><Metric label="PROSPECTIVITY" value={mine.prospectivity}/></div><p>Synthetic performance summary for comparative demonstration. Select Prospectivity or Production for deeper analysis.</p></div></Modal>}</>}
function App(){return <BrowserRouter><Routes><Route path="/" element={<Landing/>}/><Route path="*" element={<Shell><Routes><Route path="/command-center" element={<Command/>}/><Route path="/prospectivity" element={<Prospectivity/>}/><Route path="/production" element={<Production/>}/><Route path="/simulator" element={<Simulator/>}/><Route path="/insights" element={<Insights/>}/><Route path="/reports" element={<Reports/>}/><Route path="*" element={<Command/>}/></Routes></Shell>}/></Routes></BrowserRouter>}
export default App;
