import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../configs/Auth';

export default async (req, res, next) => {
  const bearerToken = req.headers.authorization;

  if (!bearerToken)
    return res.status(401).json({ error: 'Token not provided' });

  const [, token] = bearerToken.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secretKey);

    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' });
  }
};
