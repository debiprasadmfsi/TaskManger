const express = require('express');
const router = express.Router();
const { protect } = require('./../controllers/auth');
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  validateTask
} = require('./../controllers/task');

router.route('').get(protect,getTasks).post(protect,validateTask,createTask);
router.route('/:id').get(protect,getTask).patch(protect,updateTask).delete(protect,deleteTask);

module.exports = router;