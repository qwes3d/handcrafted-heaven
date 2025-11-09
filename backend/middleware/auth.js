/// src/middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../models/user';


async function auth(req, res, next) {
const header = req.headers.authorization;
if (!header) return res.status(401).json({ error: 'No token' });
const token = header.split(' ')[1];
try {
const payload = jwt.verify(token, process.env.JWT_SECRET);
req.user = await User.findById(payload.id).select('-password');
next();
} catch (err) {
res.status(401).json({ error: 'Invalid token' });
}
}


function requireRole(role) {
return (req, res, next) => {
if (!req.user) return res.status(401).json({ error: 'No user' });
if (req.user.role !== role) return res.status(403).json({ error: 'Forbidden' });
next();
};
}


module.exports = { auth, requireRole };