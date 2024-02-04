import createTables from '../../lib/db/createTables'

export default async function handler(req, res) {
  try {
    if  (req.method !== 'GET') {
      return res.status(405).send({ error: 'method not allowed' })
    }

    createTables()

    res.status(200).send({ name: 'John Doe' })

  //   const result = await someAsyncOperation()
  //   res.status(200).send({ result })
  } catch (err) {
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
