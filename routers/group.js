const express = require('express');
const router = express.Router();
const {protect}=require('./../controllers/auth')
const {
  getGroups,
  groupAdd,
  groupUpdate,
  groupDelete,
  getGroup,
  groupValidators
} = require('./../controllers/group');


router.route('').get(protect,getGroups).post(protect,groupValidators,groupAdd);
router.route('/:id').get(protect,getGroup).patch(protect,groupUpdate).delete(protect,groupDelete);

module.exports = router;