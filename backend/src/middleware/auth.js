const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const getTokenFromRequest = (req) => {
  if (req.cookies?.token) {
    return req.cookies.token;
  }
  if (req.headers.authorization?.startsWith('Bearer')) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

const protect = async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        studentProfile: true,
        teacherProfile: true,
        parentProfiles: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

const requireRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Not authorized for this action' });
  }

  next();
};

const admin = requireRoles('ADMIN');
const teacher = requireRoles('ADMIN', 'TEACHER');
const parent = requireRoles('ADMIN', 'PARENT');
const student = requireRoles('ADMIN', 'STUDENT');

module.exports = { protect, admin, teacher, parent, student, requireRoles };
