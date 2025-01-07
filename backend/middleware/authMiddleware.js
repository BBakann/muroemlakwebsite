const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Yetkisiz erişim' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    // Admin kontrolü
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: 'Yetkisiz erişim' });
  }
}; 