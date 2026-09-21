// Synthetic demonstration data only. Not actual MOIL operational data.
export const blocks=[
 {id:'B12',score:94,confidence:89,grade:36.2,depth:'38–61 m',x:18,y:30,color:'#e34b36'},
 {id:'B17',score:76,confidence:78,grade:29.4,depth:'55–78 m',x:42,y:18,color:'#f3a12b'},
 {id:'B18',score:88,confidence:83,grade:32.1,depth:'44–70 m',x:64,y:35,color:'#e76f2e'},
 {id:'B21',score:81,confidence:80,grade:30.7,depth:'48–73 m',x:34,y:66,color:'#ef9b27'},
 {id:'B27',score:92,confidence:86,grade:34.8,depth:'42–68 m',x:72,y:69,color:'#e95835'},
];
export const indicators=[['Geological Compatibility',91],['Remote Sensing Anomaly',84],['Terrain Suitability',72],['Historical Exploration',89],['Borehole Correlation',86]] as [string,number][];
export const equipment=[
 {id:'E-14',type:'Excavator',status:'Maintenance',util:61}, {id:'H-07',type:'Haul Truck',status:'Active',util:88},
 {id:'H-12',type:'Haul Truck',status:'Active',util:92},{id:'D-03',type:'Drill',status:'Delayed',util:72},{id:'B-02',type:'Bulldozer',status:'Active',util:84},
];
export const risks=[{name:'Equipment downtime',value:42,color:'#ed5b3f'},{name:'Blasting delays',value:27,color:'#f2a52e'},{name:'Weather',value:18,color:'#d4be49'},{name:'Other',value:13,color:'#547680'}];
export const production=Array.from({length:90},(_,i)=>{const planned=3500+Math.sin(i/4)*110;const actual=planned-90-Math.sin(i/2.7)*130-(i>72?(i-72)*9:0);return{day:`${i+1}`,planned:Math.round(planned),actual:Math.round(actual),forecast:Math.round(i<60?actual:planned-190+Math.sin(i/3)*70)}});
export const monthly=['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map((month,i)=>({month,planned:82000+i*2250,actual:80400+i*1700+(i%2?1200:-700),forecast:81500+i*1800}));
export const mines=[{name:'Mine A',production:'94.2%',target:'100%',risk:'Medium',prospectivity:'87%'},{name:'Mine B',production:'102.1%',target:'100%',risk:'Low',prospectivity:'54%'},{name:'Mine C',production:'81.3%',target:'100%',risk:'High',prospectivity:'76%'},{name:'Mine D',production:'97.8%',target:'100%',risk:'Medium',prospectivity:'69%'}];
export const layers=['Mine Boundary','Mineral Prospectivity','Geological Layers','Borehole Locations','NDVI','Rainfall','Soil Moisture','Land Surface Temperature','Elevation'];
export const reports=[['Monthly Production Report','September 2026','production'],['Prospectivity Assessment','Mine A','prospectivity'],['Shortfall Risk Analysis','September 2026','risk'],['Equipment Performance','September 2026','equipment']];
export const sources=[['SATELLITE','Sentinel-2','Connected'],['GEOLOGY','Geological Survey','Connected'],['BOREHOLES','Historical Exploration','Connected'],['WEATHER','Rainfall / Soil Moisture','Connected'],['OPERATIONS','Production / Equipment','Synthetic Demo']];
