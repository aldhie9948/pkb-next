import mongoose from 'mongoose';
import validator from 'mongoose-unique-validator';
validator.defaults.message = 'Error, {PATH} tidak boleh sama.';

const anggotaSchema = new mongoose.Schema({
  nama: String,
  nik: { type: String, unique: true },
  kta: { type: String, unique: true },
  noHP: String,
  gender: String,
  tanggalLahir: String,
  alamat: {
    jalan: String,
    provinsi: Object,
    kabupaten: Object,
    kecamatan: Object,
    kelurahan: Object,
  },
  pekerjaan: String,
  statusAnggota: String,
  tanggalDaftar: String,
  foto: String,
  created_at: Number,
  updated_at: Number,
});

anggotaSchema.plugin(validator);

anggotaSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports =
  mongoose.models.Anggota || mongoose.model('Anggota', anggotaSchema);
