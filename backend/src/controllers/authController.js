const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');
const { generateToken, setTokenCookie } = require('../utils/generateToken');

const normalizeEmail = (email) => email?.toLowerCase().trim();

// @desc    Register a new user (admin only)
// @route   POST /api/v1/auth/register
// @access  Private/Admin
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role = 'TEACHER', phone } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const formattedRole = role.toUpperCase();
    if (!['ADMIN', 'TEACHER'].includes(formattedRole)) {
      return res.status(400).json({ message: 'Role must be ADMIN or TEACHER' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: normalizeEmail(email) } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: normalizeEmail(email),
        password: hashedPassword,
        role: formattedRole,
        phone,
      },
    });

    const token = generateToken(user.id);
    setTokenCookie(res, token);

    res.status(201).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: normalizeEmail(email) },
      include: {
        studentProfile: true,
        teacherProfile: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.id);
    setTokenCookie(res, token);

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      studentProfile: user.studentProfile,
      teacherProfile: user.teacherProfile,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Failed to login' });
  }
};

// @desc    Logout user
const logoutUser = async (_req, res) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to logout' });
  }
};

// @desc    Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        phone: true,
        studentProfile: {
          include: {
            class: true,
            section: true,
            documents: true,
          },
        },
        teacherProfile: true,
        parentProfiles: {
          include: {
            student: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
};
