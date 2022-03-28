import dbConnect from '../../../lib/dbConnect';
import nc from 'next-connect';
import Anggota from '../../../models/Anggota';
import formidable from 'formidable';
import fs from 'fs';
import { format } from 'date-fns';

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nc({
  onNoMatch: (req, res) => {
    return res
      .status(400)
      .json({ error: `Method ${req.method} is not allowed.` });
  },
});

handler.post(async (req, res, next) => {
  await dbConnect();
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    try {
      if (files.foto.size === 0)
        throw new Error('Mohon lampirkan foto anggota');
      if (!files.foto.mimetype.includes('image'))
        throw new Error('File yang diupload bukan gambar');

      const filename = await saveFile(files.foto);
      const dataForm = {
        ...fields,
        alamat: {
          jalan: fields.alamat,
          provinsi: JSON.parse(fields.provinsi),
          kabupaten: JSON.parse(fields.kabupaten),
          kecamatan: JSON.parse(fields.kecamatan),
          kelurahan: JSON.parse(fields.kelurahan),
        },
        foto: filename,
        created_at: Math.floor(Date.now() / 1000),
        updated_at: Math.floor(Date.now() / 1000),
      };
      const anggota = new Anggota(dataForm);
      const savedAnggota = await anggota.save();
      res.status(201).json(savedAnggota);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  });
});

const saveFile = async (file) => {
  const mime = file.mimetype === 'image/png' ? '.png' : '.jpg';
  const data = fs.readFileSync(file.filepath);
  const filename = `${file.newFilename}-${new Date().getTime()}${mime}`;
  fs.writeFileSync(`./public/img/anggota/${filename}`, data);
  await fs.unlinkSync(file.filepath);
  return filename;
};

handler.get(async (req, res) => {
  await dbConnect();
  const response = await Anggota.find({});
  res.status(200).json(response);
});

export default handler;
