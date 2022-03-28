import Indonesia from '../../../models/Indonesia';
import dbConnect from '../../../lib/dbConnect';
import nc from 'next-connect';
const handler = nc({
  onNoMatch: (req, res) => {
    return res
      .status(400)
      .json({ error: `Method ${req.method} is not allowed.` });
  },
});
handler.get(async (req, res) => {
  await dbConnect();
  const results = await Indonesia.getAllProvince();
  res.status(200).json(results);
});

export default handler;
