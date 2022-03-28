import Indonesia from '../../../models/Indonesia';
import dbConnect from '../../../lib/dbConnect';

export default async function handler(req, res) {
  const {
    query: { id },
  } = req;
  await dbConnect();
  const results = await Indonesia.getRegency(id);
  res.status(200).json(results);
}
