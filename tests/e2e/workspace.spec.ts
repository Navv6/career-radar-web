import {test,expect} from '@playwright/test';
const base='https://api.github.com/repos/Navv6/career-radar';
const fixture={jobs:[{id:'a',company:'테스트 기업',title:'AI Engineer',location:'서울',availability:'모집중'},{id:'b',company:'전형 기업',title:'FDE',location:'인천',availability:'모집중'}],user:{jobs:{b:{status:'지원완료',notes:'보존할 메모'}},profile:{name:'테스트'},tasks:[],settings:{}},scans:[],exclusions:[],rankings:{}};
async function mock(page:any,conflict=false){
 let user=structuredClone(fixture.user);
 await page.route(base+'**',async(route:any)=>{
 const url=new URL(route.request().url());let data:any;
 if(url.pathname.endsWith('/career-radar'))data={private:true,full_name:'Navv6/career-radar'};
 else if(url.pathname.includes('/git/ref/'))data={object:{sha:'head'}};
 else if(route.request().method()==='PUT'){
   if(conflict)return route.fulfill({status:409,json:{}});
   user=JSON.parse(Buffer.from(route.request().postDataJSON().content,'base64').toString());data={content:{sha:'new-user'},commit:{sha:'new-head'}};
 }else{
 const content=url.pathname.endsWith('jobs.json')?fixture.jobs:url.pathname.endsWith('user.json')?user:url.pathname.endsWith('scans.json')?fixture.scans:url.pathname.endsWith('exclusions.json')?fixture.exclusions:fixture.rankings;
 data={content:Buffer.from(JSON.stringify(content)).toString('base64'),sha:'user-sha'};
 }
 await route.fulfill({json:data});
 });
}
async function login(page:any){await page.goto('/career-radar-web/');await page.getByLabel('GitHub 저장소 접근 토큰').fill('synthetic-test-token');await page.getByRole('button',{name:'연결하기',exact:true}).click();await expect(page.getByRole('heading',{name:'다음 기회를 준비하는 오늘'})).toBeVisible();}
test('anonymous shell contains no personal records or persistent credentials',async({page})=>{await page.goto('/career-radar-web/');await expect(page.getByRole('heading',{name:'워크스페이스 연결'})).toBeVisible();await expect(page.getByText('테스트 기업',{exact:true})).toHaveCount(0);expect(await page.evaluate(()=>Object.keys(localStorage))).toEqual([]);});
test('applications separated, memo survives stage save and reload',async({page})=>{await mock(page);await login(page);await page.getByRole('button',{name:'채용공고',exact:true}).click();await expect(page.getByText('테스트 기업',{exact:true})).toBeVisible();await expect(page.getByText('전형 기업',{exact:true})).toHaveCount(0);await page.getByRole('button',{name:'진행 중',exact:true}).click();await expect(page.getByText('전형 기업',{exact:true})).toBeVisible();await page.getByRole('button',{name:'수정',exact:true}).click();await page.getByLabel('전형 단계',{exact:true}).selectOption('1차 면접');await page.getByRole('button',{name:'변경 저장'}).click();await expect(page.getByRole('status')).toContainText('저장하고 재조회');await page.getByRole('button',{name:'새로고침',exact:true}).click();await expect(page.getByText('1차 면접',{exact:true})).toBeVisible();await page.getByRole('button',{name:'FDE',exact:true}).click();await expect(page.getByText('보존할 메모',{exact:true})).toBeVisible();expect(await page.evaluate(()=>JSON.stringify(localStorage))).not.toContain('synthetic-test-token');});
test('conflicting writes show an error and keep edit form',async({page})=>{await mock(page,true);await login(page);await page.getByRole('button',{name:'채용공고',exact:true}).click();await page.getByRole('button',{name:'수정',exact:true}).click();await page.getByLabel('개인 메모',{exact:true}).fill('새 메모');await page.getByRole('button',{name:'변경 저장'}).click();await expect(page.getByRole('alert').filter({hasText:'다른 기기'})).toContainText('다른 기기');await expect(page.getByRole('dialog',{name:'공고 수정'})).toBeVisible();});
test('mobile has no horizontal document overflow',async({page})=>{await mock(page);await login(page);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);});
