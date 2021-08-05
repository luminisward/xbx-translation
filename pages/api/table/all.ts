import { NextApiRequest, NextApiResponse } from 'next'
import { showTables } from '../../../db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const result = await showTables()
  res.status(200).json(result.filter((name) => name.includes('_ms')))
}
