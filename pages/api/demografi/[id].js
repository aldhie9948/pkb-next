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

handler.put(async (req, res) => {
  await dbConnect();
  const {
    query: { id },
  } = req;

  try {
    const body = req.body;
    const oldDemografi = await Demografi.find({ idVillage: id });
    if (!oldDemografi) throw new Error('404');
    const updatedDemografi = await Demografi.findByIdAndUpdate(
      oldDemografi[0]._id,
      body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedDemografi);
  } catch (error) {
    console.log(error);
    if (error.message === '404')
      res.status(404).json({ error: 'Kelurahan tidak ditemukan.' });
    res.status(400).json({ error: error.message });
  }
});

handler.get(async (req, res) => {
  await dbConnect();
  const {
    query: { id },
  } = req;
  try {
    const response = await Demografi.find({ idProvincy: Number(id) });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

export default handler;
