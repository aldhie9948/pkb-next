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

handler.put(async (req, res, next) => {
  const {
    query: { id },
  } = req;
  await dbConnect();
  const form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields, files) {
    try {
      const editedAnggota = await Anggota.findById(id);
      if (!editedAnggota) throw new Error('Anggota tidak ditemukan.');
      if (files.foto.size > 0) {
        if (!files.foto.mimetype.includes('image'))
          throw new Error('File yang diupload bukan gambar');
      }

      const filename =
        files.foto.size > 0 ? await saveFile(files.foto) : editedAnggota.foto;

      if (files.foto.size > 0)
        fs.unlinkSync(
          `${process.cwd()}/public/img/anggota/${editedAnggota.foto}`
        );

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
        updated_at: Math.floor(Date.now() / 1000),
      };
      const updatedAnggota = await Anggota.findByIdAndUpdate(id, dataForm, {
        new: true,
      });
      res.status(201).json(updatedAnggota);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  });
});

handler.delete(async (req, res) => {
  const {
    query: { id },
  } = req;
  await dbConnect();
  try {
    const response = await Anggota.findByIdAndRemove(id);
    fs.unlinkSync(`${process.cwd()}/public/img/anggota/${response.foto}`);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
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
