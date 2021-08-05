import { NextApiRequest, NextApiResponse } from 'next'
import { queryTable, showTables } from '../../../db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  switch (method) {
    case 'GET': {
      const name = req.query.name as string[]
      const language: string = req.query.language ? String(req.query.language) : 'jp'
      const [bdat, table] = ((name: string[]) => {
        if (name.length === 2) {
          return name
        } else if (name.length === 1) {
          return name[0].split('.')
        }
      })(name)

      const { rows } = await queryTable(language, bdat, table)
      res.status(200).json(rows)
      break
    }

    default: {
      res.status(404).send('Not Found')
      break
    }
  }

  return
}
