import express from 'express';
// import contactServices from '../../models/contacts.js';
import Joi from 'joi';
import Contact from '../../models/Contact.js';
const contactsRouter = express.Router();

const contactAddSchema = Joi.object({
  name: Joi.string().min(3).max(11).required().messages({
    'string.empty': `"name" cannot be an empty field`,
    'string.min': `"name" should have a minimum length of 3`,
    'any.required': `"name" is a required field`,
  }),
  email: Joi.string().min(3).required().email(),
  phone: Joi.string()
    .regex(/^[0-9]{10}$/)
    .messages({
      'string.pattern.base': `Phone number must have 10 digits.(For example: 0501234567)`,
    })
    .required(),
  favorite: Joi.boolean(),
});

const contactUpdateSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

contactsRouter.get('/', async (req, res, next) => {
  try {
    const result = await Contact.find();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

contactsRouter.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findOne({ _id: contactId });
    if (!result) {
      return res.status(404).json({ message: `Movie with id=${contactId} not found` });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

contactsRouter.post('/', async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const { name, phone, email } = req.body;
    const result = await Contact.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

contactsRouter.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const result = await Contact.findByIdAndRemove({ _id: contactId });
    if (!result) {
      return res.status(404).json({ message: `Movie with id=${contactId} not found` });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

contactsRouter.put('/:id', async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const { name, phone, email, favorite } = req.body;
    const { id } = req.params;

    const result = await Contact.findByIdAndUpdate(
      { _id: id },
      { name, phone, email, favorite },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: `Movies with id=${id} not found` });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

contactsRouter.patch('/:id/favorite', async (req, res, next) => {
  try {
    if (req.body.error) {
      return res.status(400).json({ message: error.message });
    }
    const { id } = req.params;

    const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
    if (!result) {
      return res.status(404).json({ message: `Movies with id=${id} not found` });
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default contactsRouter;
