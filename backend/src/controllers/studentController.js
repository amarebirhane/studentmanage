const Student = require('../models/Student');

// @desc    Get all students with search, filter, and pagination
// @route   GET /api/v1/students
// @access  Private/Teacher
const getStudents = async (req, res) => {
  try {
    const { search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { enrollmentNo: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const students = await Student.find(query)
      .populate('createdBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Student.countDocuments(query);

    res.json({
      students,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single student
// @route   GET /api/v1/students/:id
// @access  Private/Teacher
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('createdBy', 'name email');
    
    if (student) {
      res.json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new student
// @route   POST /api/v1/students
// @access  Private/Admin
const createStudent = async (req, res) => {
  try {
    const { name, email, phone, enrollmentNo, dateOfAdmission, photo } = req.body;

    const studentExists = await Student.findOne({ $or: [{ email }, { enrollmentNo }] });

    if (studentExists) {
      return res.status(400).json({ message: 'Student with this email or enrollment number already exists' });
    }

    const student = await Student.create({
      name,
      email,
      phone,
      enrollmentNo,
      dateOfAdmission: new Date(dateOfAdmission),
      photo: photo || null,
      createdBy: req.user._id,
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/v1/students/:id
// @access  Private/Admin
const updateStudent = async (req, res) => {
  try {
    const { name, email, phone, enrollmentNo, dateOfAdmission, photo } = req.body;

    const student = await Student.findById(req.params.id);

    if (student) {
      // Check if email or enrollmentNo is being changed and if it conflicts
      if (email && email !== student.email) {
        const emailExists = await Student.findOne({ email, _id: { $ne: req.params.id } });
        if (emailExists) {
          return res.status(400).json({ message: 'Email already exists' });
        }
      }

      if (enrollmentNo && enrollmentNo !== student.enrollmentNo) {
        const idExists = await Student.findOne({ enrollmentNo, _id: { $ne: req.params.id } });
        if (idExists) {
          return res.status(400).json({ message: 'Enrollment number already exists' });
        }
      }

      student.name = name || student.name;
      student.email = email || student.email;
      student.phone = phone || student.phone;
      student.enrollmentNo = enrollmentNo || student.enrollmentNo;
      if (dateOfAdmission) student.dateOfAdmission = new Date(dateOfAdmission);
      if (photo !== undefined) student.photo = photo;

      const updatedStudent = await student.save();
      res.json(updatedStudent);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/v1/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      await student.deleteOne();
      res.json({ message: 'Student removed' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/v1/students/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    
    const recentAdmissions = await Student.find()
      .sort({ dateOfAdmission: -1 })
      .limit(5)
      .select('name enrollmentNo dateOfAdmission');

    res.json({
      totalStudents,
      recentAdmissions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStats,
};

