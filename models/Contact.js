import { Schema, model } from 'mongoose';
import handleSaveError from './Hooks/handleSaveError.js';

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = model('contact', contactSchema);

contactSchema.post('save', handleSaveError);

export default Contact;
