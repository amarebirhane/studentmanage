const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getClasses,
  getSections,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.route('/users')
  .get(protect, admin, getUsers);

router.route('/users/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

router.route('/classes')
  .get(protect, getClasses);

router.route('/sections')
  .get(protect, getSections);

module.exports = router;

