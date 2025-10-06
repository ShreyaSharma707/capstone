import User from '../models/User.js';

export async function listUsers(req, res) {
  const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
  return res.json(users);
}


