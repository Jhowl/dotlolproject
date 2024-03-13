import Hero from '@/controllers/heroes/hero'
export default async function handler(req, res) {
  try {
    if  (req.method !== 'GET') {
      return res.status(405).send({ error: 'method not allowed' })
    }

    const { id, ...rest } = req.query


    const result = new Hero({id})

    const data = await result.dataRest(rest)

    res.status(200).send({ data })

  //   const result = await someAsyncOperation()
  //   res.status(200).send({ result })
  } catch (err) {
    console.log('error', err)
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
