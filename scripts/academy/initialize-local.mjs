import {getPayload} from 'payload'
import config from '../../src/payload.config.ts'
// Node 24 provides the native SQLite backup/DDL API; the project still uses Node 20 type declarations.
import { DatabaseSync } from 'node:sqlite'
import { writeFile } from 'node:fs/promises'
if(process.env.INTEGRATION_TARGET!=='local'||process.env.DB_PROVIDER!=='sqlite'||!process.env.DATABASE_URI?.replaceAll('\\','/').endsWith('/.phase2-local/site.db'))throw Error('Phase 2 initialization requires the isolated Phase 2 database')
// Drizzle's SQLite FK-table rebuild can select newly added columns before they
// exist. Pre-add these nullable columns in this guarded local copy so its copy
// operation preserves every existing row. Foreign keys/indexes follow in push.
const localDB=new DatabaseSync(process.env.DATABASE_URI.slice(5))
try {
 for(const [table, additions] of Object.entries({courses:{preview_lesson_id:'integer',preview_fingerprint:'text',approve_preview_version:'integer DEFAULT 0'},payload_locked_documents_rels:{course_subscription_requests_id:'integer',course_request_notifications_id:'integer'}})){
  const exists=localDB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(table)
  if(!exists)continue
  const columns=new Set((localDB.prepare(`PRAGMA table_info("${table}")`).all()).map(row=>row.name))
  for(const [column,type] of Object.entries(additions))if(!columns.has(column))localDB.exec(`ALTER TABLE "${table}" ADD COLUMN "${column}" ${type}`)
 }
 const scratch='__new_payload_locked_documents_rels'
 if(localDB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(scratch)){
  if((localDB.prepare(`SELECT count(*) n FROM "${scratch}"`).get()).n!==0)throw Error('Unexpected nonempty migration scratch table; review before retrying')
  localDB.exec(`DROP TABLE "${scratch}"`)
 }
}finally{localDB.close()}
const resolved=await config
const nativeInit=resolved.db.init
resolved.db.init=options=>{const adapter=nativeInit(options);adapter.push=false;return adapter}
const payload=await getPayload({config:resolved})
try {
 const {pushSchema}=payload.db.requireDrizzleKit()
 const plan=await pushSchema(payload.db.schema,payload.db.drizzle)
 if(plan.hasDataLoss||plan.warnings.length)throw Error('Schema plan needs review: '+plan.warnings.join('; '))
 const statements=plan.statementsToExecute.map(statement=>statement.replace(/^CREATE (UNIQUE )?INDEX /i,(_all,unique)=>`CREATE ${unique||''}INDEX IF NOT EXISTS `))
 await writeFile('.phase2-local/last-schema-plan.sql',statements.join('\n\n'))
 const database=new DatabaseSync(process.env.DATABASE_URI.slice(5))
 try {
  const before=JSON.stringify(database.prepare('SELECT id,slug,category_id,trainer_id FROM courses ORDER BY id').all())
  database.exec('PRAGMA foreign_keys=OFF; BEGIN IMMEDIATE;')
  try {
   for(const statement of statements)database.exec(statement)
   if(before!==JSON.stringify(database.prepare('SELECT id,slug,category_id,trainer_id FROM courses ORDER BY id').all()))throw Error('Course identity or relationship changed during initialization')
   database.exec('COMMIT;')
  }catch(error){database.exec('ROLLBACK;');throw error}
  finally{database.exec('PRAGMA foreign_keys=ON;')}
 }finally{database.close()}
 console.log(JSON.stringify({initialized:true,localOnly:true,statements:statements.length,courseIDsAndRelationshipsPreserved:true,productionWrites:0}))
}finally{await payload.destroy()}
