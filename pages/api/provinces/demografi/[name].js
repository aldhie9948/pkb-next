import Indonesia from '../../../../models/Indonesia';
import dbConnect from '../../../../lib/dbConnect';
import nc from 'next-connect';
const handler = nc({
  onNoMatch: (req, res) => {
    return res
      .status(400)
      .json({ error: `Method ${req.method} is not allowed.` });
  },
});
handler.get(async (req, res) => {
  const {
    query: { name },
  } = req;
  await dbConnect();
  const results = await Indonesia.find({ name });
  res.status(200).json(results[0]);
});

export default handler;
