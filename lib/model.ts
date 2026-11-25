export type Item = {id:string; [key:string]:unknown};
export type UserState = {jobs:Record<string,Record<string,unknown>>;profile:Record<string,unknown>;tasks:Item[];settings:Record<string,unknown>};
export type Workspace = {jobs:Item[];user:UserState;scans:Item[];exclusions:Item[];rankings:Record<string,Record<string,unknown>>};
export const stages=['서류 제출','서류 검토','과제','1차 면접','2차 면접','최종 면접','처우 협의','합격','불합격','지원 철회'];
export const closedStages=['합격','불합격','지원 철회'];
export const text=(v:unknown)=>v===null||v===undefined||v===''?'미확인':String(v);
export function stage(j:Item){return String(j.applicationStage || (j.status==='지원완료'?'서류 제출':''));}
export function applied(j:Item){return j.status==='지원완료'||!!stage(j);}
export function closed(j:Item){return closedStages.includes(stage(j));}
export function merged(w:Workspace):Item[]{return w.jobs.map(j=>({...j,status:'관심',...w.user.jobs[j.id]}));}
export function editJob(user:UserState,j:Item,patch:Record<string,unknown>):UserState {
 patch=Object.fromEntries(Object.entries(patch).filter(([k,v])=>String(v??'')!==String(j[k]??'')));
 const next=structuredClone(user);const previous=next.jobs[j.id]||{};
 const fields=Object.keys(patch).filter(k=>patch[k]!==j[k]).filter(k=>!['status','notes','rating','evaluation','applicationStage','applicationNotes','applyDate','nextAction','nextActionDate'].includes(k));
 const overlay:Record<string,unknown>={...previous,...patch,manualFields:Array.from(new Set([...(previous.manualFields as string[]||[]),...fields]))};
 if(patch.applicationStage && patch.applicationStage!==stage(j)){
   overlay.status='지원완료';overlay.applicationHistory=[...(previous.applicationHistory as unknown[]||[]),{from:stage(j)||'미지원',stage:patch.applicationStage,at:new Date().toISOString()}];
 }
 if(patch.status==='지원완료'&&!stage(j)) overlay.applicationStage='서류 제출';
 next.jobs[j.id]=overlay;return next;
}
export function safeUrl(v:unknown):string|undefined {
 try{const u=new URL(String(v));return u.protocol==='https:'?u.href:undefined;}catch{return undefined;}
}
