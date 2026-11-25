import type {Item, UserState, Workspace} from './model';
const REPO='Navv6/career-radar';
export class RepoClient {
 private token:string;
 userSha=''; head='';
 constructor(token:string){this.token=token;}
 destroy(){this.token='';this.userSha='';this.head='';}
 private async api(path:string,init:RequestInit={}){
   const r=await fetch(`https://api.github.com/repos/${REPO}${path}`,{...init,cache:'no-store',headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${this.token}`,'X-GitHub-Api-Version':'2022-11-28',...init.headers}});
   if(!r.ok) throw new Error(r.status===409||r.status===422?'다른 기기에서 데이터가 변경되었습니다. 새로고침 후 수정 내용을 다시 적용하세요.':r.status===401||r.status===403?'GitHub 인증·권한 또는 API 호출 제한을 확인하세요.':`GitHub 응답 오류 (${r.status})`);
   return r.json();
 }
 async verifyPrivate(){const r=await this.api('');if(r.private!==true||r.full_name.toLowerCase()!==REPO.toLowerCase())throw new Error('비공개 저장소 확인 실패. 개인 데이터 접근을 중단했습니다.');}
 async read<T>(path:string):Promise<{data:T;sha:string}>{
   const r=await this.api(`/contents/${path}?ref=${this.head}`);
   const bytes=Uint8Array.from(atob(r.content.replace(/\n/g,'')),c=>c.charCodeAt(0));
   return {data:JSON.parse(new TextDecoder().decode(bytes)) as T,sha:r.sha};
 }
 async load():Promise<Workspace>{
   await this.verifyPrivate(); const ref=await this.api('/git/ref/heads/main');this.head=ref.object.sha;
   const [jobs,user,scans,exclusions,rankings]=await Promise.all([
     this.read<Item[]>('data/catalog/jobs.json'),this.read<UserState>('data/private/user.json'),this.read<Item[]>('data/private/scans.json'),this.read<Item[]>('data/private/exclusions.json'),this.read<Record<string,Record<string,unknown>>>('data/private/rankings.json')]);
   this.userSha=user.sha;return {jobs:jobs.data,user:user.data,scans:scans.data,exclusions:exclusions.data,rankings:rankings.data};
 }
 async save(user:UserState){
   await this.verifyPrivate();const bytes=new TextEncoder().encode(JSON.stringify(user,null,2)+'\n');let binary='';for(const b of bytes)binary+=String.fromCharCode(b);
   const r=await this.api('/contents/data/private/user.json',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Update private workspace preferences',content:btoa(binary),sha:this.userSha,branch:'main'})});
   // Keep original SHA on failure; never retry conflict over another writer.
   this.userSha=r.content.sha;this.head=r.commit.sha;
   const check=await this.read<UserState>('data/private/user.json');
   if(JSON.stringify(check.data)!==JSON.stringify(user))throw new Error('저장 후 재조회가 일치하지 않습니다. 다시 연결하여 확인하세요.');
 }
}
