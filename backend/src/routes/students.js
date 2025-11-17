const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStats,
} = require('../controllers/studentController');
const { protect, admin, teacher } = require('../middleware/auth');
const { validate } = require('../utils/validation');
const { studentSchema, updateStudentSchema } = require('../utils/validation');

router.get('/stats', protect, admin, getStats);
router.route('/')
  .get(protect, teacher, getStudents)
  .post(protect, admin, validate(studentSchema), createStudent);

router.route('/:id')
  .get(protect, teacher, getStudentById)
  .put(protect, admin, validate(updateStudentSchema), updateStudent)
  .delete(protect, admin, deleteStudent);

module.exports = router;

