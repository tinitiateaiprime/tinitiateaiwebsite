// Offline schema diff. Explicitly disable database connection before loading any adapter.
import {getPayload} from 'payload'
import {mkdir,writeFile} from 'node:fs/promises'
process.env.DB_PROVIDER='postgres';process.env.DATABASE_URL='';process.env.DATABASE_URL_UNPOOLED='';process.env.PAYLOAD_SCHEMA_PUSH='false'
const config=(await import('../../src/payload.config.ts')).default
const payload=await getPayload({config,disableDBConnect:true,disableOnInit:true})
try{
 const {generateDrizzleJson,generateMigration}=payload.db.requireDrizzleKit()
 const after=await generateDrizzleJson(payload.db.schema)
 const before=structuredClone(after)
 const additions=['academy_lessons','course_licenses','trainer_assignments','lesson_progress','lesson_recordings','recording_jobs']
 const isNew=name=>additions.some(prefix=>name===prefix||name.startsWith(prefix+'_'))
 const removedTables=Object.entries(before.tables).filter(([,t])=>isNew(t.name)).map(([name])=>name)
 for(const name of removedTables)delete before.tables[name]
 for(const table of Object.values(before.tables)){
  for(const [columnName]of Object.entries(table.columns))if(isNew(columnName.replace(/_id$/,''))||columnName==='reset_password_requested_at')delete table.columns[columnName]
  for(const [name,index]of Object.entries(table.indexes||{}))if(index.columns.some(column=>!table.columns[column.expression]))delete table.indexes[name]
  for(const [name,fk]of Object.entries(table.foreignKeys||{}))if(isNew(fk.tableTo)||fk.columnsFrom.some(column=>!table.columns[column]))delete table.foreignKeys[name]
 }
 for(const [name,enumeration]of Object.entries(before.enums)){
  if(additions.some(prefix=>enumeration.name.startsWith('enum_'+prefix+'_')))delete before.enums[name]
  else if(enumeration.name==='enum_users_role')enumeration.values=enumeration.values.filter(value=>value!=='trainer')
 }
 const up=await generateMigration(before,after)
 const down=await generateMigration(after,before)
 // Remove referencing constraints before DROP TABLE ... CASCADE can remove them.
 // Use one explicit enum rollback rather than duplicating Drizzle's enum rebuild.
 const rollback=down.filter(statement=>!(/enum_users_role/.test(statement)||/ALTER TABLE "users" ALTER COLUMN "role"/.test(statement)))
 const dropConstraints=rollback.filter(statement=>/DROP CONSTRAINT/.test(statement))
 const rollbackOrdered=[...dropConstraints,...rollback.filter(statement=>!/DROP CONSTRAINT/.test(statement))]
 if(up.some(statement=>/DROP TABLE|TRUNCATE|DELETE FROM/i.test(statement)))throw Error('Unexpected destructive UP migration')
 await mkdir('src/migrations/postgres',{recursive:true})
 await writeFile('src/migrations/postgres/phase2.up.sql','BEGIN;\n'+up.join('\n\n')+'\nCOMMIT;\n')
 await writeFile('src/migrations/postgres/phase2.down.sql',`-- Explicit reviewed rollback only. Back up Academy data and reassign trainer users first.
BEGIN;
DO $$ BEGIN IF current_setting('tinitiate.allow_phase2_rollback',true) IS DISTINCT FROM 'on' THEN RAISE EXCEPTION 'Reviewed rollback requires SET tinitiate.allow_phase2_rollback = on'; END IF; IF EXISTS (SELECT 1 FROM users WHERE role::text = 'trainer') THEN RAISE EXCEPTION 'Reassign trainer users before rollback'; END IF; END $$;
`+rollbackOrdered.join('\n\n')+`
ALTER TABLE users ALTER COLUMN role DROP DEFAULT;
ALTER TYPE enum_users_role RENAME TO enum_users_role_phase2_old;
CREATE TYPE enum_users_role AS ENUM ('admin','editor');
ALTER TABLE users ALTER COLUMN role TYPE enum_users_role USING role::text::enum_users_role;
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'editor'::enum_users_role;
DROP TYPE enum_users_role_phase2_old;
COMMIT;
`)
 await writeFile('src/migrations/postgres/phase2.snapshot.json',JSON.stringify(after,null,2))
 await writeFile('src/migrations/postgres/README.md','# Phase 2 PostgreSQL migration\n\nGenerated offline with Payload 3.93 and database connections disabled. Never applied in this session. The baseline is the checked-in Phase 1 application schema, reconstructed by removing the six Academy collections, trainer role, and new auth reset timestamp from the current schema. Compare it with a staging copy before applying; actual Neon schema drift was not assumed safe. UP contains additive Academy tables/relations/indexes, trainer role and auth reset timestamps. DOWN removes the new structures and their data; export and back them up first, and reassign all trainer users before dropping that enum value. Run through a reviewed database change procedure, not automatic development schema push. Local SQLite development uses only the isolated Phase 2 copy.\n')
 console.log(JSON.stringify({offline:true,connectionDisabled:true,upStatements:up.length,downStatements:down.length,productionWrites:0}))
}finally{await payload.destroy()}
