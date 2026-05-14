import initSqlJs from 'sql.js'
import type { Database } from 'sql.js'

let db: Database | null = null
let sqlJs: Awaited<ReturnType<typeof initSqlJs>> | null = null

const INIT_SQL = `
  CREATE TABLE IF NOT EXISTS history (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT,
    diagram_type TEXT NOT NULL DEFAULT 'unknown',
    code         TEXT NOT NULL,
    created_at   INTEGER NOT NULL
  );
`

export async function getDb(): Promise<Database> {
  if (db) return db

  sqlJs = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' })
  db = new sqlJs.Database()
  db.run(INIT_SQL)
  return db
}

export function closeDb() {
  db?.close()
  db = null
}

export function exportDb(): Uint8Array | null {
  if (!db) return null
  return db.export()
}

export function importDb(data: Uint8Array) {
  if (!sqlJs) return
  db?.close()
  db = new sqlJs.Database(data)
  db.run(INIT_SQL)
}
