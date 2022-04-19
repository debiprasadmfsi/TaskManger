const express = require('express');
const router = express.Router();
const {protect}=require('./../controllers/auth')
const {
  getLists,
  listAdd,
  listUpdate,
  listDelete,
  getList,
  listValidators
} = require('./../controllers/list');


router.route('').get(protect,getLists).post(protect,listValidators,listAdd);
router.route('/:id').get(protect,getList).patch(protect,listUpdate).delete(protect,listDelete);

module.exports = router;