import express from 'express';
import Joi from 'joi';
import Contact from '../../models/Contact.js';
import authenticate from '../../middlewares/authenticate.js';
import upload from '../../middlewares/upload.js';
import fs from 'fs/promises';
import path from 'path';

const contactsRouter = express.Router();

const avatarPath = path.resolve('public', 'avatars');

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
  // avatarURL: Joi.string(),
});

const contactUpdateSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

contactsRouter.use(authenticate);

contactsRouter.get('/', async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page, limit } = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find({ owner }, '-createdAt -updatedAt', { skip, limit }).populate(
      'owner',
      'email'
    );
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

contactsRouter.post('/', upload.single('avatarURL'), async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const { _id: owner } = req.user;
    const { path: oldPath, filename } = req.file;

    const newPath = path.join(avatarPath, filename);
    await fs.rename(oldPath, newPath);
    const avatarURL = path.join('public', 'avatars', filename);
    const result = await Contact.create({ ...req.body, avatarURL, owner });
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
