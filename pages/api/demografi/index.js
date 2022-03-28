import dbConnect from '../../../lib/dbConnect';
import nc from 'next-connect';
import Demografi from '../../../models/Demografi';

const handler = nc({
  onNoMatch: (req, res) => {
    return res
      .status(400)
      .json({ error: `Method ${req.method} is not allowed.` });
  },
});

handler.post(async (req, res) => {
  await dbConnect();

  try {
    const body = req.body;
    const demografi = new Demografi(body);
    const savedDemografi = await demografi.save();
    res.status(201).json(savedDemografi);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

handler.get(async (req, res) => {
  await dbConnect();
  try {
    const response = await Demografi.find({});
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

export default handler;
