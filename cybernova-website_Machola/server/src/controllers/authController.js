import jwt from 'jsonwebtoken';
import { AdminModel } from '../models/adminModel.js';

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

export const adminLogin = async (req, res) => {
  if (!JWT_SECRET) {
    return res.status(500).json({ message: 'JWT_SECRET is not configured on backend.' });
  }

  try {
    const { username, email, password } = req.body;
    const loginName = username || email;

    if (!loginName || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const admin = await AdminModel.authenticateAdmin(loginName, password);

    if (!admin) {
      return res.status(401).json({ message: 'Invalid admin credentials.' });
    }

    const token = jwt.sign(
      {
        sub: String(admin.id),
        username: admin.username,
        email: admin.email,
        role: admin.role || 'admin',
      },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN },
    );

    return res.status(200).json({
      access_token: token,
      token_type: 'Bearer',
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: admin.role || 'admin',
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
