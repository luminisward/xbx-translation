import { Pool } from 'pg'

const pool = new Pool()

const schemaMap = {
  jp: ['jp102', 'jp101', 'jp100'],
  yx: ['youxia'],
}

export const queryTable = async (language: string, bdat: string, table: string) => {
  const schemas = schemaMap[language] || schemaMap.jp

  await pool.query(`SET search_path TO ${schemas.join(',')};`)
  const result = await pool.query(`select * from "${bdat}.${table}"`)
  return result
}

export const showTables = async () => {
  const { rows } = await pool.query(`SELECT	tablename FROM pg_catalog.pg_tables WHERE schemaname = 'jp100'`)
  return rows.map(({ tablename }) => tablename)
}

export default pool
