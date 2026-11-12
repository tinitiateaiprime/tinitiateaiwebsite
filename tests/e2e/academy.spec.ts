import {test,expect,type APIRequestContext} from '@playwright/test'
const password='Phase1-Local-Verification-Only!'
const print='foundational-python-print'
async function login(request:APIRequestContext,collection:string,email:string){const response=await request.post(`/api/${collection}/login`,{data:{email,password}});expect(response.status(),await response.text()).toBe(200);return (await response.json()).user}
async function dismiss(page:import('@playwright/test').Page){await page.getByRole('button',{name:'Close promotion'}).click({timeout:1500}).catch(()=>{})}
test('only explicitly approved demos are public; paid HTML, assets, videos and preview are denied',async({request,page})=>{
 test.setTimeout(180000)
 await page.goto('/academy/lessons/foundational-data-structures-demo');await dismiss(page);await expect(page.locator('iframe')).toBeVisible();expect(await page.locator('iframe').getAttribute('sandbox')).toBe('allow-scripts')
 expect((await request.get(`/api/academy/content/${print}/foundational/python/print.html`)).status()).toBe(403)
 expect((await request.get(`/api/academy/content/${print}/foundational/python/python-course.js`)).status()).toBe(403)
 expect((await request.get(`/api/academy/video/${print}`)).status()).toBe(403)
 expect((await request.get('/api/academy/recordings/1/preview')).status()).toBe(403)
 expect((await request.get('/Final-videos/foundational-python-print.mp4')).status()).toBe(404)
 await page.goto(`/academy/lessons/${print}`);await expect(page).toHaveURL(/login/)
})
test('administrator reviews and approves the six saved videos; registry has no duplicates',async({request})=>{
 await login(request,'users','phase1-admin@example.test')
 const rows=(await(await request.get('/api/lesson-recordings?limit=100')).json()).docs
 const current=(await(await request.get('/api/academy-lessons?limit=200&depth=0')).json()).docs;const six=rows.filter((row:{key:string;lesson:number|{id:number};fingerprint:string})=>row.key.startsWith('foundational-python-')&&current.some((lesson:{id:number;fingerprint:string})=>lesson.id===(typeof row.lesson==='object'?row.lesson.id:row.lesson)&&lesson.fingerprint===row.fingerprint));expect(six).toHaveLength(6)
 for(const recording of six){
  const preview=await request.get(`/api/academy/recordings/${recording.id}/preview`,{headers:{Range:'bytes=0-31'}});expect(preview.status()).toBe(206)
  const response=await request.post('/api/academy/approve',{data:{recording:recording.id}});expect(response.status(),await response.text()).toBe(200)
 }
})
test('licenses are independent of enrollment and cannot be self-granted',async({request,page})=>{
 const student=await login(request,'students','academy-unlicensed@example.test')
 const courses=(await(await request.get('/api/courses?limit=200')).json()).docs;const python=courses.find((row:{slug:string})=>['Python','python-language-course'].includes(row.slug));expect((await request.post('/api/enrollments',{data:{student:student.id,course:python.id,status:'active'}})).status()).toBe(201)
 expect((await request.post('/api/course-licenses',{data:{key:'unauthorized',student:student.id,courses:[courses[0].id],grantReason:'Self grant',status:'active'}})).status()).toBe(403)
 expect((await request.get(`/api/academy/video/${print}`)).status()).toBe(403)
 await page.request.post('/api/students/login',{data:{email:'academy-unlicensed@example.test',password}});await page.goto('/academy/lessons/foundational-python-variables');await expect(page.getByRole('heading',{name:'Continue Your Learning'})).toBeVisible()
})
test('all six approved MP4s support byte ranges and revocation is immediate',async({request,playwright})=>{
 await login(request,'students','phase1-student@example.test')
 for(const key of ['print','variables','datatypes','operators','strings','lists']){
  const response=await request.get(`/api/academy/video/foundational-python-${key}`,{headers:{Range:'bytes=0-63'}});expect(response.status(),await response.text().catch(()=>'' )).toBe(206);expect((await response.body()).length).toBe(64);expect(response.headers()['accept-ranges']).toBe('bytes')
  const suffix=await request.head(`/api/academy/video/foundational-python-${key}`,{headers:{Range:'bytes=-32'}});expect(suffix.status()).toBe(206);expect(suffix.headers()['content-range']).toMatch(/^bytes \d+-\d+\/\d+$/);if(suffix.headers()['content-length'])expect(suffix.headers()['content-length']).toBe('32');const tail=await request.get(`/api/academy/video/foundational-python-${key}`,{headers:{Range:'bytes=-32'}});expect((await tail.body()).length).toBe(32)
 }
 expect((await request.get(`/api/academy/video/${print}`,{headers:{Range:'bytes=999999999-'}})).status()).toBe(416)
 const unrelated=await request.get('/api/academy/video/snowflake-dataengineering-tables');expect(unrelated.status()).toBe(403)
 const admin=await playwright.request.newContext({baseURL:process.env.E2E_BASE_URL||'http://localhost:3100'});await login(admin,'users','phase1-admin@example.test')
 const license=(await(await admin.get('/api/course-licenses?limit=100')).json()).docs.find((row:{key:string})=>row.key==='fixture-python-license')
 try{await admin.patch(`/api/course-licenses/${license.id}`,{data:{status:'revoked'}});expect((await request.get(`/api/academy/video/${print}`)).status()).toBe(403);await admin.patch(`/api/course-licenses/${license.id}`,{data:{status:'active',expiresAt:'2020-01-01T00:00:00.000Z'}});expect((await request.get(`/api/academy/video/${print}`)).status()).toBe(403)}finally{await admin.patch(`/api/course-licenses/${license.id}`,{data:{status:'active',expiresAt:null}});await admin.dispose()}

})
test('Print remains plain HTML with its original Run, slides, video slot and persisted progress',async({page})=>{
 test.setTimeout(180000)
 await page.request.post('/api/students/login',{data:{email:'phase1-student@example.test',password}})
 await page.goto(`/academy/lessons/${print}`);await dismiss(page)
 const frame=page.frameLocator('iframe');await expect(frame.locator('#py-stage')).toBeVisible();await expect(frame.locator('#lesson-video video')).toHaveCount(1);await expect.poll(()=>frame.locator('#lesson-video video').evaluate(node=>(node as HTMLVideoElement).readyState),{timeout:20000}).toBeGreaterThan(0)
 await frame.locator('#lesson-video video').evaluate(async node=>{const video=node as HTMLVideoElement;video.muted=true;await video.play()});await expect.poll(()=>frame.locator('#lesson-video video').evaluate(node=>(node as HTMLVideoElement).currentTime)).toBeGreaterThan(0.1);await frame.locator('#lesson-video video').evaluate(node=>(node as HTMLVideoElement).pause())
 await expect(frame.locator('header.master-top-nav,footer.site-footer,[data-dashboard-tutor]')).toHaveCount(0)
 const isolated=await page.locator('iframe').elementHandle();const context=await isolated!.contentFrame();expect(await context!.evaluate(()=>{try{return typeof document.cookie!=='string'}catch{return true}})).toBe(true)
 await frame.locator('#py-continue').click();await frame.locator('#py-first').click();await frame.locator('#py-run').click();await expect(frame.locator('#py-term')).toContainText('Hello, World!',{timeout:45000})
 await frame.locator('#py-next').click();await expect.poll(async()=>{const data=await(await page.request.get(`/api/academy/progress?lesson=${print}`)).json();return data.state?.print?.length||0}).toBeGreaterThan(1)
 await page.reload();await dismiss(page);await expect(frame.locator('#py-stat-progress')).not.toHaveText('0%')
 const uri=await page.locator('iframe').getAttribute('src');const response=await page.request.get(uri!);expect(response.headers()['content-security-policy']).toContain('sandbox allow-scripts');expect(response.headers()['cache-control']).toContain('no-store')
 const stolen=new URL(uri!,'http://localhost:3100').searchParams.get('t');expect((await page.request.get(`/api/academy/content/foundational-python-variables/foundational/python/python-course.js?t=${stolen}`)).status()).toBe(403)
 await page.setViewportSize({width:390,height:844});await expect.poll(()=>frame.locator('html').evaluate(node=>node.scrollWidth<=window.innerWidth)).toBe(true);await page.screenshot({path:'test-results/academy-print-mobile.png',fullPage:true})
})
test('students cannot edit other progress, use trainer tools, or alter CMS role assignments',async({request,page})=>{
 const student=await login(request,'students','phase1-student@example.test')
 expect((await request.post('/api/academy/jobs',{data:{lesson:print,mode:'silent-preview'}})).status()).toBe(403)
 expect((await request.post('/api/academy/approve',{data:{recording:1}})).status()).toBe(403)
 expect((await request.post('/api/lesson-progress',{data:{key:'other',student:9999,lesson:1,state:{print:[0]}}})).status()).toBe(403)
 const own=(await(await request.get('/api/lesson-progress')).json()).docs
 expect(own.every((row:{student:number|{id:number}})=>typeof row.student==='object'?row.student.id===student.id:row.student===student.id)).toBe(true)
 await page.request.post('/api/students/login',{data:{email:'phase1-student@example.test',password}});await page.goto('/trainer');await expect(page).toHaveURL(/dashboard/)
})
test('assigned trainers reuse recordings and unassigned trainers cannot record or enter CMS',async({request,page})=>{
 const trainer=await login(request,'users','academy-trainer@example.test')
 const reused=await request.post('/api/academy/jobs',{data:{lesson:print,mode:'silent-preview'}});expect(reused.status()).toBe(200);expect((await reused.json()).reused).toBe(true)
 expect((await request.patch(`/api/users/${trainer.id}`,{data:{role:'admin'}})).status()).toBe(200)
 const me=(await(await request.get('/api/users/me')).json()).user;expect(me.role).toBe('trainer')
 expect((await request.post('/api/users',{data:{email:'escalate@example.test',password,name:'Not allowed',role:'admin'}})).status()).toBe(403)
 expect((await request.patch('/api/courses/1',{data:{title:'Unauthorized'}})).status()).toBe(403)
 await login(request,'users','academy-unassigned@example.test');expect((await request.post('/api/academy/jobs',{data:{lesson:print,mode:'silent-preview'}})).status()).toBe(403)
 await page.request.post('/api/users/login',{data:{email:'academy-trainer@example.test',password}});await page.goto('/trainer');await dismiss(page);await expect(page.getByRole('heading',{name:'Trainer studio'})).toBeVisible();await expect(page.getByRole('button',{name:'Record or reuse'}).first()).toBeVisible()
})
