import { NextApiRequest, NextApiResponse } from 'next'
import { showTables } from '../../db'

const languageList = [
  { id: 'jp', label: '日版' },
  { id: 'yx', label: '游侠版' },
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(languageList)
}
