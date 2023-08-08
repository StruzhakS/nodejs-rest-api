import jwt from 'jsonwebtoken';
import dotenv from 'dotenv/config';
import User from '../models/User.js';
import HttpError from '../helpers/HttpError.js';

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    HttpError(401);
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || !user.token) {
      HttpError(401);
    }
    req.user = user;
    next();
  } catch (error) {
    console.log('catch');
    next(HttpError(401));
  }
};

export default authenticate;
