export const PIPELINE=['New Lead','Contacted','Estimate Scheduled','Estimate Sent','Won','Lost'];
export const JOB_STATUSES=['Scheduled','In Progress','Completed'];
export const ESTIMATE_STATUSES=['Draft','Sent','Approved','Declined'];
export const SERVICES=['Full-Service Junk Removal','Furniture & Appliances','Garage / Basement Cleanout','Estate Cleanout','Construction Debris','Commercial Cleanout','Light Demolition','Yard Waste','Other'];
export const currency=(n=0)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Number(n)||0);
export const shortDate=(s)=>s?new Date(s+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'}):'Not set';
export const longDate=(s)=>s?new Date(s+'T12:00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'}):'Not scheduled';
export const isoDay=(offset=0)=>{const d=new Date();d.setDate(d.getDate()+offset);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
export const nextId=()=>globalThis.crypto?.randomUUID?.()||String(Date.now())+String(Math.random()).slice(2);
export const SAMPLE={
 demo:true,
 leads:[
  {id:'l1',name:'Jordan Parker',company:'Residential',phone:'(616) 555-0101',email:'jordan@example.com',service:'Full-Service Junk Removal',location:'Grand Rapids, MI',value:325,stage:'New Lead',owner:'Owner',source:'Website',notes:'Sample: 1/2 truck of household items.',created:isoDay(-1),followUp:isoDay(0)},
  {id:'l2',name:'Taylor Mitchell',company:'Residential',phone:'(616) 555-0102',email:'taylor@example.com',service:'Garage / Basement Cleanout',location:'Wyoming, MI',value:650,stage:'Contacted',owner:'Sales Rep',source:'Google',notes:'Sample: Garage cleanout, photos requested.',created:isoDay(-3),followUp:isoDay(1)},
  {id:'l3',name:'Morgan Carter',company:'Sample Property Group',phone:'(616) 555-0103',email:'morgan@example.com',service:'Commercial Cleanout',location:'Kentwood, MI',value:1800,stage:'Estimate Scheduled',owner:'Owner',source:'Referral',notes:'Sample: Apartment move-out cleanout.',created:isoDay(-5),followUp:isoDay(2)},
  {id:'l4',name:'Jamie Rivera',company:'Residential',phone:'(616) 555-0104',email:'jamie@example.com',service:'Furniture & Appliances',location:'Walker, MI',value:275,stage:'Estimate Sent',owner:'Sales Rep',source:'Thumbtack',notes:'Sample: Sofa and old appliance.',created:isoDay(-4),followUp:isoDay(0)},
  {id:'l5',name:'Alex Brooks',company:'Residential',phone:'(616) 555-0105',email:'alex@example.com',service:'Estate Cleanout',location:'Grandville, MI',value:1450,stage:'Won',owner:'Owner',source:'Phone',notes:'Sample: Whole-home cleanout booked.',created:isoDay(-9),followUp:''}
 ],
 estimates:[
  {id:'e1',leadId:'l4',client:'Jamie Rivera',service:'Furniture & Appliances',amount:275,status:'Sent',date:isoDay(-1),validUntil:isoDay(6),notes:'Sample quote for sofa and appliance hauling'},
  {id:'e2',leadId:'l3',client:'Morgan Carter',service:'Commercial Cleanout',amount:1800,status:'Draft',date:isoDay(),validUntil:isoDay(10),notes:'Sample quote pending site photos'},
  {id:'e3',leadId:'l5',client:'Alex Brooks',service:'Estate Cleanout',amount:1450,status:'Approved',date:isoDay(-7),validUntil:isoDay(5),notes:'Sample booked estate cleanout'}
 ],
 jobs:[
  {id:'j1',leadId:'l5',client:'Alex Brooks',service:'Estate Cleanout',location:'Grandville, MI',startDate:isoDay(1),startTime:'09:30',endDate:isoDay(1),amount:1450,paid:400,status:'Scheduled',notes:'Sample: Crew of two, full trailer'},
  {id:'j2',leadId:'',client:'Casey Lee',service:'Construction Debris',location:'Grand Rapids, MI',startDate:isoDay(3),startTime:'13:00',endDate:isoDay(3),amount:590,paid:0,status:'Scheduled',notes:'Sample: Contractor debris pickup'},
  {id:'j3',leadId:'',client:'Sam Hill',service:'Full-Service Junk Removal',location:'Kentwood, MI',startDate:isoDay(-2),startTime:'10:00',endDate:isoDay(-2),amount:325,paid:325,status:'Completed',notes:'Sample completed job'}
 ],
 tasks:[
  {id:'t1',title:'Follow up on furniture quote',detail:'Jamie Rivera',due:isoDay(),owner:'Sales Rep',done:false,leadId:'l4'},
  {id:'t2',title:'Confirm estate cleanout arrival',detail:'Alex Brooks',due:isoDay(),owner:'Owner',done:false,leadId:'l5'},
  {id:'t3',title:'Check photos for commercial cleanout',detail:'Morgan Carter',due:isoDay(2),owner:'Owner',done:false,leadId:'l3'}
 ]
};
export const EMPTY={demo:false,leads:[],estimates:[],jobs:[],tasks:[]};
export function loadWorkspace(){try{const raw=localStorage.getItem('mxd-workspace-v1'); if(raw){const v=JSON.parse(raw); if(v&&Array.isArray(v.leads)&&Array.isArray(v.jobs)&&Array.isArray(v.estimates)&&Array.isArray(v.tasks))return v;}}catch{}return SAMPLE;}
export const displayTime=(time)=>{if(!time)return '';const [h,m]=time.split(':').map(Number);if(!Number.isFinite(h)||!Number.isFinite(m))return time;return new Date(2000,0,1,h,m).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});}
