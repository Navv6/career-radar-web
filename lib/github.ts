import type {Item, UserState, Workspace} from './model';
const REPO='Navv6/career-radar';
export class RepoClient {
 private token:string;
 userSha=''; head='';
 constructor(token:string){this.token=token;}
 destroy(){this.token='';this.userSha='';this.head='';}
 private async api(path:string,init:RequestInit={}){
   const r=await fetch(`https://api.github.com/repos/${REPO}${path}`,{...init,cache:'no-store',headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${this.token}`,'X-GitHub-Api-Version':'2022-11-28',...init.headers}});
   if(!r.ok){
     // Explain the failing stage without exposing credentials or response bodies.
     const stage=path===''?'저장소 접근':path.startsWith('/git/ref/')?'데이터 버전 조회':init.method==='PUT'?'사용자 변경 저장':'데이터 파일 조회';
     if(r.status===404){
       const reason=path===''?'토큰이 비공개 저장소에 접근할 수 없거나 저장소를 찾을 수 없습니다.':path.startsWith('/git/ref/')?'main 버전을 읽을 수 없습니다. Contents 권한 또는 브랜치를 확인하세요.':'파일을 읽거나 저장할 수 없습니다. Contents 권한 또는 데이터 파일 경로를 확인하세요.';
       throw new Error(`${stage} 실패 (404). ${reason} 토큰 설정에서 Resource owner: Navv6 → Only select repositories: career-radar → Contents: Read and write를 확인하세요. career-radar-web만 선택하면 개인 데이터를 읽을 수 없습니다.`);
     }
     if(r.status===409||r.status===422)throw new Error('다른 기기에서 데이터가 변경되었습니다. 새로고침 후 수정 내용을 다시 적용하세요.');
     if(r.status===401)throw new Error(`${stage} 실패 (401). 토큰이 유효하지 않습니다. 만료·폐기 여부와 복사한 값을 확인하세요.`);
     if(r.status===403||r.status===429)throw new Error(`${stage} 실패 (${r.status}). GitHub 토큰의 저장소·Contents 권한 또는 API 호출 제한을 확인하세요.`);
     throw new Error(`${stage} 실패 (${r.status}). 잠시 후 다시 시도하세요.`);
   }
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
