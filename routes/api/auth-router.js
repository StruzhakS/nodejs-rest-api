import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import authenticate from '../../middlewares/authenticate.js';
import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import { userSigninSchema, userSignupSchema } from '../../schemas/users-schmas.js';
import HttpError from '../../helpers/HttpError.js';

const authRouter = express.Router();
dotenv.config();

const { JWT_SECRET } = process.env;
authRouter.post('/signup', async (req, res, next) => {
  try {
    const { error } = userSignupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      res.status(409).json({ message: `Email in use` });
    }
    const hashPasswword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPasswword });
    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/signin', async (req, res, next) => {
  try {
    const { error } = userSigninSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: `Email or password invalid` });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      res.status(401).json({ message: `Email or password invalid` });
    }
    const payload = {
      id: user.id,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });

    await User.findByIdAndUpdate(user._id, { token });

    res.json({ token });
  } catch (error) {
    next(error);
  }
});

authRouter.get('/current', authenticate, async (req, res) => {
  const { name, email } = req.user;
  res.json({ email });
});

authRouter.post('/signout', authenticate, async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: '' });
  res.json({ message: 'Signout success' });
});

export default authRouter;
