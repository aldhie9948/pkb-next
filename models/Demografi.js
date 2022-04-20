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
      type: [{ text: String, name: String, total: Number }],
      default: undefined,
    },
    age: {
      type: [{ text: String, name: String, total: Number }],
      default: undefined,
    },
    religions: {
      type: [{ text: String, name: String, total: Number }],
      default: undefined,
    },
    educations: {
      type: [{ text: String, name: String, total: Number }],
      default: undefined,
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
