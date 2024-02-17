import League from '@/controllers/leagues/league'

export default async function handler(req, res) {
  try {
    if  (req.method !== 'GET') {
      return res.status(405).send({ error: 'method not allowed' })
    }

    const { slug, ...rest } = req.query


    const result = new League(slug)

    const data = await result.dataRest(rest)

    res.status(200).send({ data })

  //   const result = await someAsyncOperation()
  //   res.status(200).send({ result })
  } catch (err) {
    console.log('error', err)
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
