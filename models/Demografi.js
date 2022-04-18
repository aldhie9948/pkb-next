import mongoose from 'mongoose';
import validator from 'mongoose-unique-validator';

const demografiSchema = new mongoose.Schema({
  regions: {
    provincy: { required: true, type: Number },
    regency: { required: true, type: Number },
    district: { required: true, type: Number },
    village: { required: true, type: Number, unique: true },
  },
  category: {
    gender: {
      pria: Number,
      wanite: Number,
    },
    age: Object,
    education: {
      tbs: Number,
      btsd: Number,
      sd: Number,
      smp: Number,
      sma: Number,
      diploma: Number,
      d3: Number,
      s1: Number,
      s2: Number,
      s3: Number,
    },
    religions: {
      islam: Number,
      kristen: Number,
      khatolik: Number,
      hindu: Number,
      budha: Number,
      lainnya: Number,
    },
  },
  total: Number,
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
