const catchAsync = require('./../utils/catchAsync');
const {
  addDoc,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  deleteDoc,
  updateDoc
} = require('firebase/firestore');
const { getCollections } = require('./../models/dbConfig');
const AppError = require('./../utils/appError');

const getLists = catchAsync(async (req, res, next) => {
  const List = getCollections('List');
  const q = query(List, where('uid', '==', req.uid));
  const querySnapshot = await getDocs(q);
  let listData = [];
  querySnapshot.forEach((doc) => {
    listData.push({ _id: doc.id, ...doc.data() });
  });
  res.status(200).send({ status: 'success', listData });
});
const getList = catchAsync(async (req, res, next) => {
  const List = getCollections('List');
  const docRef = doc(List, req.params.id);
  const docSnap = await getDoc(docRef);
  let listDatetails;
  if (docSnap.exists()) {
    listDatetails = docSnap.data();
  }

  res.status(200).send({ status: 'success', data: listDatetails });
});

const listAdd = catchAsync(async (req, res, next) => {
  const List = getCollections('List');
  await addDoc(List, {
    name: req.body.name,
    type: req.body.type,
    uid: req.uid,
  });
  res.status(201).send({ status: 'success', msg: 'List created successfully' });
});

const listUpdate = catchAsync(async (req, res, next) => {
  const List = getCollections('List');
  console.log(req.body);
  const docRef = doc(List, req.params.id);
  await updateDoc(docRef, {...req.body});
  res.status(204).send({ status: 'success', data: 'List updated successfully' });
});

const listDelete = catchAsync(async (req, res, next) => {
  const List = getCollections('List');
  const docRef = doc(List, req.params.id);
  await deleteDoc(docRef);

  res.status(202).send({ status: 'success', data: null });
});

const listValidators = catchAsync(async (req, res, next) => {
  if (!req.body.name) {
    throw new AppError('List Name required', 401);
  } else if (!req.uid) {
    throw new AppError('uuid required', 401);
  } else if ([0, 1, 2, 3, 4].indexOf(req.body.type) === -1) {
    throw new AppError(
      'Invalid List type, List type should be between 0-4',
      401
    );
  } else {
    next();
  }
});

module.exports = {
  getLists,
  listAdd,
  listUpdate,
  listDelete,
  getList,
  listValidators,
};
