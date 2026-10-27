import React, {useState,useEffect,useMemo,useLayoutEffect} from 'react';
import {brandImage} from './logo.js';
import {
 LayoutDashboard, UsersRound, FileText, HardHat, CalendarDays, ListTodo,
 Menu, X, Plus, Search, Bell, ChevronDown, ChevronRight, ArrowUpRight,
 ArrowRight, Phone, Mail, MapPin, Clock3, DollarSign, CircleCheck, CalendarClock,
 MoreHorizontal, Check, TrendingUp, BriefcaseBusiness, ShieldCheck, Building2,
 SlidersHorizontal, Download, Trash2, Pencil, MoveRight, ChevronLeft, AlertCircle,
 ExternalLink, Layers3, GripVertical, CheckCheck, Sparkles, Wallet, CircleDollarSign
} from 'lucide-react';
import {PIPELINE,JOB_STATUSES,ESTIMATE_STATUSES,SERVICES,currency,shortDate,longDate,isoDay,nextId,loadWorkspace,EMPTY,displayTime} from './data';

const NAV=[
 {id:'overview',name:'Overview',icon:LayoutDashboard},
 {id:'leads',name:'Leads & Pipeline',icon:UsersRound},
 {id:'estimates',name:'Estimates',icon:FileText},
 {id:'jobs',name:'Jobs & Projects',icon:HardHat},
 {id:'schedule',name:'Schedule',icon:CalendarDays},
 {id:'tasks',name:'Follow-ups',icon:ListTodo}
];
const STAGE_STYLES={'New Lead':'blue','Contacted':'purple','Estimate Scheduled':'amber','Estimate Sent':'orange','Won':'green','Lost':'gray',
 'Draft':'gray','Sent':'orange','Approved':'green','Declined':'red','Scheduled':'blue','In Progress':'purple','Completed':'green'};
const typeMap={lead:'leads',estimate:'estimates',job:'jobs',task:'tasks'};
function classNames(...xs){return xs.filter(Boolean).join(' ')}
function initials(name=''){return name.split(' ').filter(Boolean).slice(0,2).map(v=>v[0]).join('').toUpperCase()||'CC'}
function Badge({value}){return <span className={'badge badge-'+(STAGE_STYLES[value]||'gray')}><span className="badge-dot"/>{value}</span>}
function EmptyPanel({icon:Icon=Layers3,title='Nothing here yet',detail='Create your first record to get started.',action,onAction}){return <div className="empty-panel"><span className="empty-icon"><Icon size={23}/></span><h3>{title}</h3><p>{detail}</p>{action&&<button className="btn btn-primary" onClick={onAction}><Plus size={15}/>{action}</button>}</div>}
function SmallHeading({title,action,onAction,subtitle}){return <div className="panel-heading"><div><h3>{title}</h3>{subtitle&&<p>{subtitle}</p>}</div>{action&&<button className="text-action" onClick={onAction}>{action}<ArrowUpRight size={15}/></button>}</div>}
function Person({name,sub}){return <div className="person"><div className="avatar">{initials(name)}</div><div className="person-copy"><strong>{name}</strong>{sub&&<span>{sub}</span>}</div></div>}
function DateLabel({date}){return <span className="date-label"><CalendarDays size={14}/>{shortDate(date)}</span>}
function Field({label,children,full=false}){return <label className={full?'field field-full':'field'}><span>{label}</span>{children}</label>}
function SummaryCard({icon:Icon,label,value,foot,accent=false,onClick}){return <button className={'summary-card '+(accent?'summary-accent':'')} onClick={onClick}><span className="metric-icon"><Icon size={19}/></span><span className="summary-label">{label}</span><span className="summary-value">{value}</span><span className="summary-foot">{foot}<ArrowUpRight size={14}/></span></button>}
function Editor({type,item,db,onClose,onSave,onDelete}){
 const isNew=!item?.id;
 const defaults=type==='lead'?{name:'',company:'',phone:'',email:'',service:'Full-Service Junk Removal',location:'',value:'',stage:'New Lead',owner:'Sales Rep',source:'Website',followUp:'',notes:''}:
 type==='estimate'?{leadId:'',client:'',service:'Full-Service Junk Removal',amount:'',status:'Draft',date:isoDay(),validUntil:'',notes:''}:
 type==='job'?{leadId:'',client:'',service:'Full-Service Junk Removal',location:'',amount:'',paid:0,status:'Scheduled',startDate:'',startTime:'',endDate:'',notes:''}:
 {title:'',detail:'',due:isoDay(),owner:'Sales Rep',done:false};
 const [form,setForm]=useState({...defaults,...item});
 const update=(key,val)=>setForm(p=>({...p,[key]:val}));
 const title=type==='lead'?'lead':type==='estimate'?'estimate':type==='job'?'job':'follow-up';
 const field=(key,label,kind='text',full=false,required=false)=><Field label={label} full={full}><input type={kind} value={form[key]??''} required={required} onChange={e=>update(key,e.target.value)} placeholder={label}/></Field>;
 const select=(key,label,values)=><Field label={label}><select value={form[key]??''} onChange={e=>update(key,e.target.value)}>{values.map(v=><option key={v} value={v}>{v||'Select'}</option>)}</select></Field>;
 const submit=e=>{e.preventDefault();onSave(type,{...form,amount:Number(form.amount)||0,paid:Number(form.paid)||0,value:Number(form.value)||0});};
 return <div className="modal-backdrop" onClick={onClose}><div className="editor" role="dialog" aria-modal="true" aria-label={(isNew?'New ':'Edit ')+title} onClick={e=>e.stopPropagation()}>
 <div className="editor-top"><div><span className="eyebrow">MXD JUNK REMOVAL</span><h2>{isNew?'Add ':'Edit '}{title}</h2></div><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20}/></button></div>
 <form onSubmit={submit}><div className="editor-scroll"><div className="form-grid">
 {type==='lead'&&<>{field('name','Customer name','text',false,true)}{field('company','Company / property')}
 {field('phone','Phone','tel')}{field('email','Email','email')}{select('service','Removal service',SERVICES)}
 {field('location','Project location')}{field('value','Potential project value ($)','number')}
 {select('stage','Pipeline stage',PIPELINE)}{select('owner','Assigned to',['Owner','Sales Rep','Crew Lead'])}
 {select('source','Lead source',['Website','Google','Referral','Instagram','Facebook','Thumbtack','Phone','Yelp','Other'])}
 {field('followUp','Next follow-up','date')}</>}
 {type==='estimate'&&<><Field label="Linked lead"><select value={form.leadId||''} onChange={e=>{const lead=db.leads.find(x=>x.id===e.target.value);setForm(p=>({...p,leadId:e.target.value,...(lead?{client:lead.name,service:lead.service,amount:lead.value}:{})}))}}><option value="">No linked lead</option>{db.leads.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}</select></Field>
 {field('client','Customer name','text',false,true)}{select('service','Removal service',SERVICES)}{field('amount','Estimate amount ($)','number',false,true)}
 {select('status','Estimate status',ESTIMATE_STATUSES)}{field('date','Date prepared','date')}
 {field('validUntil','Valid until','date')}</>}
 {type==='job'&&<>{field('client','Customer name','text',false,true)}{select('service','Removal service',SERVICES)}
 {field('location','Project address')}{field('amount','Project total ($)','number')}
 {field('paid','Payments collected ($)','number')}{select('status','Job status',JOB_STATUSES)}
 {field('startDate','Pickup date','date')}{field('startTime','Arrival time','time')}{field('endDate','Completion date','date')}</>}
 {type==='task'&&<>{field('title','What needs to happen?','text',true,true)}{field('detail','Customer / details','text',true)}
 {field('due','Due date','date')}{select('owner','Assigned to',['Owner','Sales Rep','Crew Lead'])}</>}
 {type!=='task'&&<Field label="Internal notes" full><textarea rows="4" value={form.notes||''} onChange={e=>update('notes',e.target.value)} placeholder="Add load size, access instructions, disposal notes, crew details, or next steps..."/></Field>}
 </div></div><div className="editor-actions">{!isNew&&<button type="button" className="btn btn-danger-ghost" onClick={()=>onDelete(type,item.id)}><Trash2 size={16}/>Delete</button>}<div className="editor-action-right"><button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button><button type="submit" className="btn btn-primary"><Check size={17}/>{isNew?'Create record':'Save changes'}</button></div></div></form>
 </div></div>
}
const MXD_LOGO=brandImage;
function BrandLogo(){return <span className="brand-logo-image-wrap"><img className="brand-logo-image" src={MXD_LOGO} alt="MXD Junk Removal logo" loading="eager" decoding="async"/></span>}
function Logo(){return <div className="brand"><BrandLogo/><div className="brand-copy"><strong>MXD</strong><span>JUNK REMOVAL</span></div></div>}
function SectionHero({eyebrow,title,description,action,onAction,icon:Icon=Plus}){return <div className="section-intro"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action&&<button className="btn btn-primary new-action" onClick={onAction}><Icon size={17}/>{action}</button>}</div>}
function App(){
 const [db,setDb]=useState(loadWorkspace);
 const [view,setView]=useState('overview');
 const [drawer,setDrawer]=useState(null);
 const [search,setSearch]=useState('');
 const [stageFilter,setStageFilter]=useState('All');
 const [monthOffset,setMonthOffset]=useState(0);
 const [mobileMenu,setMobileMenu]=useState(false);
 const [notice,setNotice]=useState('');
 useEffect(()=>{try{localStorage.setItem('mxd-workspace-v1',JSON.stringify(db));}catch{}},[db]);
 useEffect(()=>{if(notice){const t=setTimeout(()=>setNotice(''),3200);return ()=>clearTimeout(t)}},[notice]);
 const show=(message)=>setNotice(message);
 const open=(type,item=null)=>setDrawer({type,item});
 // Reset immediately and after React changes pages. Smooth scrolling used to
 // keep the previous page's scroll offset during mobile tab transitions.
 const resetPageScroll=()=>{
   window.scrollTo(0,0);
   document.documentElement.scrollTop=0;
   document.body.scrollTop=0;
   const content=document.querySelector('.page-content');
   if(content)content.scrollTop=0;
   const main=document.querySelector('.main-area');
   if(main)main.scrollTop=0;
 };
 useLayoutEffect(()=>{resetPageScroll();},[view]);
 const navigate=(v)=>{
   setSearch('');
   setMobileMenu(false);
   resetPageScroll();
   setView(v);
 };
 const metrics=useMemo(()=>{
 const liveLeads=db.leads.filter(l=>!['Won','Lost'].includes(l.stage));
 const pending=db.estimates.filter(e=>['Draft','Sent'].includes(e.status));
 const openJobs=db.jobs.filter(j=>j.status!=='Completed');
 return {liveLeads:liveLeads.length,pending:pending.length,openJobs:openJobs.length,paid:db.jobs.reduce((sum,j)=>sum+(Number(j.paid)||0),0),
 bookValue:db.jobs.reduce((sum,j)=>sum+(Number(j.amount)||0),0),
 estimateValue:pending.reduce((sum,e)=>sum+(Number(e.amount)||0),0),
 pipelineValue:liveLeads.reduce((sum,l)=>sum+(Number(l.value)||0),0),
 dueTasks:db.tasks.filter(t=>!t.done&&t.due<=isoDay()).length};
 },[db]);
 const filter=(arr,fn)=>arr.filter(x=>JSON.stringify(x).toLowerCase().includes(search.toLowerCase())&&(fn?fn(x):true));
 const upsert=(type,payload)=>{
 const key=typeMap[type];let record={...payload,id:payload.id||nextId()};
 if(type==='lead'&&!record.created)record.created=isoDay();
 setDb(prev=>({...prev,[key]:prev[key].some(x=>x.id===record.id)?prev[key].map(x=>x.id===record.id?record:x):[record,...prev[key]]}));
 setDrawer(null);show((payload.id?'Updated ':'Created ')+type+' successfully');
 };
 const remove=(type,id)=>{if(!window.confirm('Delete this '+type+'? This cannot be undone.'))return;setDb(p=>({...p,[typeMap[type]]:p[typeMap[type]].filter(r=>r.id!==id)}));setDrawer(null);show('Record deleted');};
 const moveLead=(id,stage)=>setDb(prev=>({...prev,leads:prev.leads.map(l=>l.id===id?{...l,stage}:l)}));
 const estimateStatus=(id,status)=>setDb(p=>({...p,estimates:p.estimates.map(e=>e.id===id?{...e,status}:e),leads:status==='Approved'?p.leads.map(l=>p.estimates.some(e=>e.id===id&&e.leadId===l.id)?{...l,stage:'Won'}:l):p.leads}));
 const jobStatus=(id,status)=>setDb(p=>({...p,jobs:p.jobs.map(j=>j.id===id?{...j,status}:j)}));
 const toggleTask=(id)=>setDb(p=>({...p,tasks:p.tasks.map(t=>t.id===id?{...t,done:!t.done}:t)}));
 const convert=(estimate)=>{
 if(db.jobs.some(j=>j.estimateId===estimate.id)){show('A job already exists for this estimate');return;}
 const lead=db.leads.find(l=>l.id===estimate.leadId);
 const job={id:nextId(),estimateId:estimate.id,leadId:estimate.leadId,client:estimate.client,service:estimate.service,location:lead?.location||'',amount:estimate.amount,paid:0,status:'Scheduled',startDate:'',startTime:'',endDate:'',notes:estimate.notes||''};
 setDb(p=>({...p,jobs:[job,...p.jobs],estimates:p.estimates.map(e=>e.id===estimate.id?{...e,status:'Approved'}:e),leads:p.leads.map(l=>l.id===estimate.leadId?{...l,stage:'Won'}:l)}));
 navigate('jobs');open('job',job);show('Job created from approved estimate');
 };
 const resetDemo=()=>{if(window.confirm('Remove all sample records and start with an empty workspace?')){setDb({...EMPTY});show('Sample records cleared');}};
 const exportData=()=>{const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='mxd-workspace-'+isoDay()+'.json';a.click();URL.revokeObjectURL(url);show('Workspace exported');};
 const upcomingJobs=[...db.jobs].filter(j=>j.startDate&&j.status!=='Completed'&&j.startDate>=isoDay()).sort((a,b)=>a.startDate.localeCompare(b.startDate));
 const dueTasks=db.tasks.filter(t=>!t.done).sort((a,b)=>(a.due||'9999').localeCompare(b.due||'9999'));
 const tasksPreview=dueTasks.slice(0,4);
 const estimatePreview=db.estimates.filter(x=>x.status==='Sent'||x.status==='Draft').slice(0,4);
 const leadPreview=[...db.leads].filter(l=>!['Won','Lost'].includes(l.stage)).slice(0,5);
 const renderOverview=()=> <div className="view-fade">
 <div className="welcome-banner"><div className="welcome-content"><span className="welcome-pill"><span/>OPERATIONS SNAPSHOT</span><h2>One clear view of<br/>your entire business.</h2><p>Keep your leads moving, your crews booked, and every dollar accounted for.</p><button onClick={()=>navigate('leads')} className="welcome-link">View your pipeline <ArrowRight size={17}/></button></div><div className="welcome-decoration"><span className="deco-ring ring-1"/><span className="deco-ring ring-2"/><span className="deco-ring ring-3"/><div className="deco-square"><Layers3 size={39}/></div></div></div>
 <div className="section-label-row"><h2>Business at a glance</h2><span>Live workspace metrics</span></div>
 <div className="metric-grid">
 <SummaryCard icon={UsersRound} label="Active leads" value={metrics.liveLeads} foot="In your pipeline" onClick={()=>navigate('leads')}/>
 <SummaryCard icon={FileText} label="Open estimates" value={metrics.pending} foot={currency(metrics.estimateValue)+' outstanding'} onClick={()=>navigate('estimates')}/>
 <SummaryCard icon={HardHat} label="Active jobs" value={metrics.openJobs} foot="Scheduled or in progress" onClick={()=>navigate('jobs')}/>
 <SummaryCard icon={Wallet} label="Payments collected" value={currency(metrics.paid)} foot="Recorded across all jobs" accent onClick={()=>navigate('jobs')}/>
 </div>
 <div className="insight-strip"><div><span className="insight-icon"><TrendingUp size={20}/></span><div><small>Open lead pipeline</small><strong>{currency(metrics.pipelineValue)}</strong></div></div><span className="insight-divider"/><div><span className="insight-icon"><BriefcaseBusiness size={20}/></span><div><small>Total booked job value</small><strong>{currency(metrics.bookValue)}</strong></div></div><span className="insight-divider"/><div><span className="insight-icon"><CalendarClock size={20}/></span><div><small>Follow-ups due</small><strong>{metrics.dueTasks}</strong></div></div></div>
 <div className="dashboard-grid">
 <section className="panel main-panel"><SmallHeading title="Leads that need attention" subtitle="Keep every potential project moving" action="All leads" onAction={()=>navigate('leads')}/>
 {leadPreview.length?<div className="overview-table"><div className="table-headers"><span>CONTACT</span><span>STAGE</span><span>VALUE</span><span/></div>{leadPreview.map(l=><button className="overview-row" key={l.id} onClick={()=>open('lead',l)}><Person name={l.name} sub={l.service}/><div><Badge value={l.stage}/></div><strong>{currency(l.value)}</strong><ChevronRight size={16}/></button>)}</div>:<EmptyPanel icon={UsersRound} title="No active leads" action="Add a lead" onAction={()=>open('lead')}/>}
 </section>
 <section className="panel side-panel"><SmallHeading title="Coming up next" subtitle="Your upcoming pickups" action="Schedule" onAction={()=>navigate('schedule')}/>
 {upcomingJobs.length?<div className="upcoming-list">{upcomingJobs.slice(0,4).map(j=><button className="upcoming-item" key={j.id} onClick={()=>open('job',j)}><span className="date-tile"><strong>{new Date(j.startDate+'T12:00:00').toLocaleDateString('en-US',{day:'2-digit'})}</strong><small>{new Date(j.startDate+'T12:00:00').toLocaleDateString('en-US',{month:'short'}).toUpperCase()}</small></span><span className="upcoming-copy"><strong>{j.client}</strong><span>{j.service}{j.startTime?' · '+displayTime(j.startTime):''}</span><small><MapPin size={12}/>{j.location||'Location not set'}</small></span><ChevronRight size={16}/></button>)}</div>:<EmptyPanel icon={CalendarDays} title="No upcoming jobs" detail="Scheduled projects will appear here."/>}
 </section>
 <section className="panel main-panel"><SmallHeading title="Estimates in progress" subtitle="Quotes waiting on a decision" action="All estimates" onAction={()=>navigate('estimates')}/>
 {estimatePreview.length?<div className="estimate-preview">{estimatePreview.map(e=><button className="estimate-line" key={e.id} onClick={()=>open('estimate',e)}><span className="estimate-doc"><FileText size={19}/></span><span className="line-copy"><strong>{e.client}</strong><small>{e.service} · {shortDate(e.date)}</small></span><Badge value={e.status}/><strong className="line-amount">{currency(e.amount)}</strong><ChevronRight size={16}/></button>)}</div>:<EmptyPanel icon={FileText} title="No pending estimates" action="New estimate" onAction={()=>open('estimate')}/>}
 </section>
 <section className="panel side-panel"><SmallHeading title="Today's priorities" subtitle="The next actions that matter" action="All follow-ups" onAction={()=>navigate('tasks')}/>
 {tasksPreview.length?<div className="compact-task-list">{tasksPreview.map(t=><div className="compact-task" key={t.id}><button className="check-btn" onClick={()=>toggleTask(t.id)} aria-label="Complete task"><Check size={15}/></button><button className="task-copy" onClick={()=>open('task',t)}><strong>{t.title}</strong><span>{t.detail}</span></button><small className={t.due<=isoDay()?'due-urgent':'due-soon'}>{t.due===isoDay()?'Today':shortDate(t.due)}</small></div>)}</div>:<EmptyPanel icon={CheckCheck} title="All caught up" detail="Nothing outstanding right now."/>}
 </section>
 </div></div>;
 const renderLeads=()=>{
 const leads=filter(db.leads,stageFilter==='All'?null:l=>l.stage===stageFilter);
 return <div className="view-fade"><SectionHero eyebrow="SALES WORKSPACE" title="Leads & pipeline" description="Move prospects from the first call to a closed project. Drag cards on desktop or use the stage menu on mobile." action="Add lead" onAction={()=>open('lead')}/>
 <div className="toolbar"><div className="input-search"><Search size={17}/><input aria-label="Search leads" placeholder="Search customers, services, locations..." value={search} onChange={e=>setSearch(e.target.value)}/></div><div className="toolbar-right"><span className="result-count">{leads.length} leads</span><select aria-label="Filter lead stage" className="filter-select" value={stageFilter} onChange={e=>setStageFilter(e.target.value)}>{['All',...PIPELINE].map(s=><option value={s} key={s}>{s==='All'?'All stages':s}</option>)}</select></div></div>
 <div className="pipeline-board">{PIPELINE.filter(s=>stageFilter==='All'||s===stageFilter).map(stage=><div className="pipeline-column" key={stage} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const id=e.dataTransfer.getData('text/lead');if(id){moveLead(id,stage);show('Lead moved to '+stage)}}}>
 <div className="column-heading"><div><span className={'column-dot col-'+(STAGE_STYLES[stage]||'gray')}/><strong>{stage}</strong><span className="column-count">{leads.filter(l=>l.stage===stage).length}</span></div><span>{currency(leads.filter(l=>l.stage===stage).reduce((a,l)=>a+(Number(l.value)||0),0))}</span></div>
 <div className="column-content">{leads.filter(l=>l.stage===stage).map(l=><article className="lead-card" draggable onDragStart={e=>e.dataTransfer.setData('text/lead',l.id)} key={l.id}><div className="lead-card-top"><span className="service-label">{l.service}</span><button className="card-edit" onClick={()=>open('lead',l)} aria-label={'Edit '+l.name}><MoreHorizontal size={20}/></button></div><button className="lead-main" onClick={()=>open('lead',l)}><strong>{l.name}</strong><span>{l.company&&l.company!=='Residential'?l.company+' · ':''}{l.location||'Location not set'}</span></button><strong className="lead-value">{currency(l.value)}</strong><div className="lead-card-bottom"><span className="lead-owner"><span className="owner-dot">{initials(l.owner)}</span>{l.owner}</span><span className="follow-date"><Clock3 size={13}/>{l.followUp?shortDate(l.followUp):'No follow-up'}</span></div><div className="lead-quick-actions">{l.phone&&<a href={'tel:'+l.phone.replace(/[^+\d]/g,'')} onClick={e=>e.stopPropagation()}><Phone size={14}/>Call</a>}{l.phone&&<a href={'sms:'+l.phone.replace(/[^+\d]/g,'')} onClick={e=>e.stopPropagation()}><Mail size={14}/>Text</a>}{l.location&&<a href={'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(l.location)} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()}><MapPin size={14}/>Map</a>}</div><select className="card-stage-select" aria-label={'Change stage for '+l.name} value={l.stage} onChange={e=>moveLead(l.id,e.target.value)}>{PIPELINE.map(s=><option key={s} value={s}>{s}</option>)}</select></article>)}
 {!leads.filter(l=>l.stage===stage).length&&<div className="column-empty">Drop a lead here</div>}</div></div>)}</div>
 </div>
 };
 const renderEstimates=()=>{
 const estimates=filter(db.estimates);
 return <div className="view-fade"><SectionHero eyebrow="QUOTES & OPPORTUNITIES" title="Estimates" description="See what you've quoted, what's still outstanding, and what's ready to become a job." action="New estimate" onAction={()=>open('estimate')}/>
 <div className="mini-stats"><div><span>Open estimate value</span><strong>{currency(metrics.estimateValue)}</strong></div><div><span>Waiting on a decision</span><strong>{db.estimates.filter(e=>e.status==='Sent').length}</strong></div><div><span>Approved estimates</span><strong>{db.estimates.filter(e=>e.status==='Approved').length}</strong></div></div>
 <div className="toolbar"><div className="input-search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search estimates..." aria-label="Search estimates"/></div><span className="result-count">{estimates.length} estimates</span></div>
 <div className="record-stack">{estimates.length?estimates.map(e=><article className="record-card" key={e.id}><div className="record-main"><div className="record-icon estimate"><FileText size={22}/></div><div className="record-copy"><div className="record-title"><h3>{e.client}</h3><Badge value={e.status}/></div><p>{e.service}</p><div className="record-meta"><span><CalendarDays size={14}/>Prepared {shortDate(e.date)}</span>{e.validUntil&&<span><Clock3 size={14}/>Valid until {shortDate(e.validUntil)}</span>}</div></div></div><div className="record-tail"><strong className="record-amount">{currency(e.amount)}</strong><div className="record-actions">{e.status!=='Approved'&&e.status!=='Declined'&&<select aria-label={'Status for '+e.client} value={e.status} onChange={v=>estimateStatus(e.id,v.target.value)}><option value="Draft">Draft</option><option value="Sent">Sent</option><option value="Approved">Approved</option><option value="Declined">Declined</option></select>}{e.status==='Approved'&&!db.jobs.some(j=>j.estimateId===e.id)&&<button className="btn btn-small btn-primary" onClick={()=>convert(e)}>Create job<ArrowRight size={14}/></button>}<button className="btn btn-small btn-secondary" onClick={()=>open('estimate',e)}><Pencil size={14}/>Edit</button></div></div></article>):<EmptyPanel icon={FileText} title="No estimates yet" detail="Build your first estimate to track its value and status." action="New estimate" onAction={()=>open('estimate')}/>}</div></div>;
 };
 const renderJobs=()=>{
 const jobs=filter(db.jobs);
 return <div className="view-fade"><SectionHero eyebrow="PROJECT OPERATIONS" title="Jobs & projects" description="Track what's booked, what's underway, and how much you've actually collected." action="New job" onAction={()=>open('job')}/>
 <div className="mini-stats"><div><span>Booked job value</span><strong>{currency(metrics.bookValue)}</strong></div><div><span>Payments collected</span><strong>{currency(metrics.paid)}</strong></div><div><span>Balance remaining</span><strong>{currency(Math.max(0,metrics.bookValue-metrics.paid))}</strong></div></div>
 <div className="toolbar"><div className="input-search"><Search size={17}/><input aria-label="Search jobs" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search projects or customers..."/></div><span className="result-count">{jobs.length} jobs</span></div>
 <div className="record-stack">{jobs.length?jobs.map(j=><article className="record-card job-record" key={j.id}><div className="record-main"><div className="record-icon job"><HardHat size={22}/></div><div className="record-copy"><div className="record-title"><h3>{j.client}</h3><Badge value={j.status}/></div><p>{j.service}{j.location?' · '+j.location:''}</p><div className="record-meta"><span><CalendarDays size={14}/>{j.startDate?'Pickup '+shortDate(j.startDate)+(j.startTime?' · '+displayTime(j.startTime):''):'Date not set'}</span><span><Wallet size={14}/>{currency(j.paid)} collected</span></div></div></div><div className="record-tail"><strong className="record-amount">{currency(j.amount)}</strong><div className="progress-track" title={Math.round(Math.min(100,(j.paid/Math.max(1,j.amount))*100))+'% paid'}><div style={{width:Math.min(100,(j.paid/Math.max(1,j.amount))*100)+'%'}}/></div><div className="record-actions"><select aria-label={'Status for '+j.client} value={j.status} onChange={e=>jobStatus(j.id,e.target.value)}>{JOB_STATUSES.map(s=><option key={s}>{s}</option>)}</select><button className="btn btn-small btn-secondary" onClick={()=>open('job',j)}><Pencil size={14}/>Manage</button></div></div></article>):<EmptyPanel icon={HardHat} title="No jobs yet" detail="Approved estimates can be turned into jobs, or add one manually." action="Add job" onAction={()=>open('job')}/>}</div></div>;
 };
 const renderTasks=()=>{
 const tasks=filter(db.tasks).sort((a,b)=>(a.done===b.done?0:a.done?1:-1)||(a.due||'').localeCompare(b.due||''));
 return <div className="view-fade"><SectionHero eyebrow="STAY TOP OF MIND" title="Follow-ups & tasks" description="Every call, reminder, and next step in one place. Assign tasks to the owner or salesperson." action="Add follow-up" onAction={()=>open('task')}/>
 <div className="mini-stats"><div><span>Open follow-ups</span><strong>{db.tasks.filter(t=>!t.done).length}</strong></div><div><span>Due today or overdue</span><strong>{metrics.dueTasks}</strong></div><div><span>Completed</span><strong>{db.tasks.filter(t=>t.done).length}</strong></div></div>
 <div className="toolbar"><div className="input-search"><Search size={17}/><input aria-label="Search follow-ups" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks or customers..."/></div></div>
 <div className="panel task-panel">{tasks.length?tasks.map(t=><div className={'full-task '+(t.done?'is-done':'')} key={t.id}><button className="big-check" aria-label={t.done?'Mark as incomplete':'Mark complete'} onClick={()=>toggleTask(t.id)}>{t.done&&<Check size={16}/>}</button><button className="full-task-copy" onClick={()=>open('task',t)}><strong>{t.title}</strong><span>{t.detail||'No additional details'}</span></button><span className={'task-due '+(!t.done&&t.due<=isoDay()?'overdue':'')}><CalendarDays size={14}/>{shortDate(t.due)}</span><span className="task-owner">{t.owner}</span><button className="icon-btn task-edit" onClick={()=>open('task',t)} aria-label="Edit task"><Pencil size={16}/></button></div>):<EmptyPanel icon={ListTodo} title="No tasks yet" detail="Add a call, follow-up, or reminder for your team." action="Add follow-up" onAction={()=>open('task')}/>}</div></div>
 };
 const renderSchedule=()=>{
 const month=new Date();month.setDate(1);month.setMonth(month.getMonth()+monthOffset);
 const year=month.getFullYear(),m=month.getMonth();
 const days=new Date(year,m+1,0).getDate(),start=new Date(year,m,1).getDay();
 const items=[...db.jobs.filter(j=>j.startDate).map(j=>({date:j.startDate,title:j.client,type:'job',subtitle:j.service+(j.startTime?' · '+displayTime(j.startTime):''),id:j.id})),
 ...db.tasks.filter(t=>t.due&&!t.done).map(t=>({date:t.due,title:t.title,type:'task',subtitle:t.detail,id:t.id}))];
 const inMonth=items.filter(e=>{const d=new Date(e.date+'T12:00:00');return d.getFullYear()===year&&d.getMonth()===m;}).sort((a,b)=>a.date.localeCompare(b.date));
 return <div className="view-fade"><SectionHero eyebrow="JOBS & CREW CALENDAR" title="Schedule" description="See pickups and follow-ups together, so nothing slips through the cracks." action="Add job" onAction={()=>open('job')}/>
 <div className="panel calendar-panel"><div className="calendar-toolbar"><h2>{month.toLocaleDateString('en-US',{month:'long',year:'numeric'})}</h2><div><button className="btn btn-secondary btn-small" onClick={()=>setMonthOffset(0)}>Today</button><button className="icon-btn bordered" aria-label="Previous month" onClick={()=>setMonthOffset(n=>n-1)}><ChevronLeft size={18}/></button><button className="icon-btn bordered" aria-label="Next month" onClick={()=>setMonthOffset(n=>n+1)}><ChevronRight size={18}/></button></div></div>
 <div className="calendar-grid">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(x=><div className="weekday" key={x}>{x}</div>)}{Array.from({length:start},(_,i)=><div className="calendar-cell muted" key={'blank'+i}/>)}
 {Array.from({length:days},(_,i)=>{const d=i+1,date=[year,String(m+1).padStart(2,'0'),String(d).padStart(2,'0')].join('-'),events=inMonth.filter(e=>e.date===date);return <div key={d} className={'calendar-cell '+(date===isoDay()?'is-today':'')}><span className="calendar-day">{d}</span><div className="calendar-events">{events.slice(0,2).map(e=><button key={e.type+e.id} className={'calendar-event '+e.type} title={e.title} onClick={()=>open(e.type,db[typeMap[e.type]].find(x=>x.id===e.id))}>{e.title}</button>)}{events.length>2&&<span className="calendar-more">+{events.length-2} more</span>}</div></div>})}</div></div>
 <section className="panel agenda-panel"><SmallHeading title="This month's agenda" subtitle="Jobs and next actions this month"/>{inMonth.length?<div className="agenda-list">{inMonth.map(e=><button className="agenda-row" key={e.type+e.id} onClick={()=>open(e.type,db[typeMap[e.type]].find(x=>x.id===e.id))}><span className="agenda-date">{shortDate(e.date)}</span><span className={'agenda-type '+e.type}>{e.type==='job'?<HardHat size={17}/>:<ListTodo size={17}/>}</span><span className="agenda-copy"><strong>{e.title}</strong><small>{e.subtitle}</small></span><ChevronRight size={17}/></button>)}</div>:<EmptyPanel icon={CalendarDays} title="Nothing on the calendar" detail="Add jobs or follow-ups to see them here."/>}</section>
 </div>;
 };
 const renderView=()=>view==='leads'?renderLeads():view==='estimates'?renderEstimates():view==='jobs'?renderJobs():view==='tasks'?renderTasks():view==='schedule'?renderSchedule():renderOverview();
 const titleMap={overview:'Overview',leads:'Leads & Pipeline',estimates:'Estimates',jobs:'Jobs & Projects',tasks:'Follow-ups',schedule:'Schedule'};
 return <div className="app-shell">
 <aside className="sidebar"><Logo/><div className="workspace-label">WORKSPACE</div><nav aria-label="Primary navigation">{NAV.map(n=>{const Icon=n.icon;return <button key={n.id} className={'nav-item '+(view===n.id?'selected':'')} onClick={()=>navigate(n.id)}><Icon size={19}/><span>{n.name}</span>{n.id==='tasks'&&metrics.dueTasks>0&&<em>{metrics.dueTasks}</em>}</button>})}</nav><div className="sidebar-bottom"><div className="help-card"><span className="help-icon"><ShieldCheck size={21}/></span><strong>Built for the field.</strong><p>Simple operations. Clear numbers. A better customer experience.</p></div><div className="sidebar-footer"><span className="footer-logo">MXD</span><div><strong>MXD Junk Removal</strong><small>Command Center</small></div><span className="online-dot"/></div></div></aside>
 <div className="main-area"><header className="topbar"><div className="mobile-brand"><BrandLogo/><strong>MXD JUNK REMOVAL</strong></div><div className="breadcrumb"><span>Workspace</span><ChevronRight size={14}/><strong>{titleMap[view]}</strong></div><div className="topbar-right"><span className="today-pill"><CalendarDays size={15}/>{new Date().toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</span><button className="topbar-icon" title="Follow-ups" onClick={()=>navigate('tasks')}><Bell size={19}/>{metrics.dueTasks>0&&<span/>}</button><div className="topbar-avatar" title="Team workspace">MXD</div></div></header>
 <main className="page-content">{db.demo&&<div className="demo-alert"><div><AlertCircle size={18}/><span><strong>Sample workspace</strong> These are fictional example records to preview the CRM. Data is stored only in this browser.</span></div><button onClick={resetDemo}>Clear sample data <ArrowRight size={14}/></button></div>}
 {!db.demo&&<div className="preview-alert"><ShieldCheck size={16}/><span>Preview mode: data stays on this device until secure team sync is connected.</span><button onClick={exportData}><Download size={14}/>Back up</button></div>}
 {view==='overview'&&<div className="greeting"><div><span className="eyebrow">YOUR COMMAND CENTER</span><h1>Good {new Date().getHours()<12?'morning':new Date().getHours()<17?'afternoon':'evening'}, team <span className="wave">✳</span></h1><p>Here's what's happening at MXD Junk Removal.</p></div><button className="btn btn-primary greeting-add" onClick={()=>open('lead')}><Plus size={18}/>Add a lead</button></div>}
 {renderView()}
 <footer className="main-footer">MXD Junk Removal <span>·</span> Made for a smoother day in the field.</footer>
 </main></div>
 <nav className="mobile-bottom-nav" aria-label="Mobile navigation">{[{id:'overview',name:'Home',icon:LayoutDashboard},{id:'leads',name:'Leads',icon:UsersRound},{id:'estimates',name:'Estimates',icon:FileText},{id:'jobs',name:'Jobs',icon:HardHat},{id:'more',name:'More',icon:Menu}].map(n=>{const Icon=n.icon;return <button key={n.id} className={(view===n.id||n.id==='more'&&['tasks','schedule'].includes(view))?'active':''} onClick={()=>n.id==='more'?setMobileMenu(!mobileMenu):navigate(n.id)}><Icon size={21}/><span>{n.name}</span></button>})}</nav>
 {mobileMenu&&<div className="mobile-menu" role="menu"><button onClick={()=>navigate('schedule')}><CalendarDays size={19}/>Schedule<ChevronRight size={17}/></button><button onClick={()=>navigate('tasks')}><ListTodo size={19}/>Follow-ups<ChevronRight size={17}/></button><button onClick={exportData}><Download size={19}/>Export workspace<ChevronRight size={17}/></button><button onClick={()=>setMobileMenu(false)}><X size={19}/>Close menu</button></div>}
 {drawer&&<Editor key={(drawer.item?.id||'new')+drawer.type} type={drawer.type} item={drawer.item} db={db} onClose={()=>setDrawer(null)} onSave={upsert} onDelete={remove}/>}
 {notice&&<div className="toast"><CircleCheck size={18}/>{notice}</div>}
 </div>;
}
export default App;
