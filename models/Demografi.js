import mongoose from 'mongoose';
import validator from 'mongoose-unique-validator';

const demografiSchema = new mongoose.Schema({
  idProvincy: {
    required: true,
    type: Number,
  },
  idRegency: {
    required: true,
    type: Number,
  },
  idDistrict: {
    required: true,
    type: Number,
  },
  idVillage: {
    required: true,
    type: Number,
    unique: true,
  },
  gender: {
    pria: Number,
    wanita: Number,
  },
  total: {
    required: true,
    type: Number,
  },
});

demografiSchema.plugin(validator);

demografiSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports =
  mongoose.models.Demografi || mongoose.model('Demografi', demografiSchema);
