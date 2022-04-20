const catchAsync = require("./../utils/catchAsync");
const {
  addDoc,
  getDocs,
  query,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} = require("firebase/firestore");
const ApiFeaturs = require("./../utils/apiFeaturs");
const { getCollections } = require("./../models/dbConfig");
const AppError = require("./../utils/appError");

const createTask = catchAsync(async (req, res, next) => {
  const Task = getCollections("Task");
  const newTask = req.body;
  newTask["date"] = new Date();
  await addDoc(Task, newTask);
  res.status(201).send({ status: "success", msg: "Task created successfully" });
});

const getTasks = catchAsync(async (req, res, next) => {
  const Task = getCollections("Task");
  const queryFilters = { sort:req.query.sort||"date", ...req.query };
  if (!queryFilters.limit) queryFilters["limit"] = 10;
  const apiFeatur = new ApiFeaturs(queryFilters, Task);
  await apiFeatur.builtFbQuery();
  const q = query(Task, ...apiFeatur.transformedQuery);
  const querySnapshot = await getDocs(q);
  let taskData = [];
  querySnapshot.forEach((doc) => {
    taskData.push({ _id: doc.id, ...doc.data() });
  });
  res
    .status(200)
    .send({ status: "success", taskCount: taskData.length, taskData });
});

const getTask = catchAsync(async (req, res, next) => {
  const Task = getCollections("Task");
  const docRef = doc(Task, req.params.id);
  const docSnap = await getDoc(docRef);
  let taskDetails;
  if (docSnap.exists()) {
    taskDetails = docSnap.data();
  }

  res.status(200).send({ status: "success", data: taskDetails });
});

const updateTask = catchAsync(async (req, res, next) => {
  const Task = getCollections("Task");
  const docRef = doc(Task, req.params.id);
  await updateDoc(docRef, { ...req.body });
  res
    .status(204)
    .send({ status: "success", data: "Task updated successfully" });
});

const deleteTask = catchAsync(async (req, res, next) => {
  const Task = getCollections("Task");
  const docRef = doc(Task, req.params.id);
  await deleteDoc(docRef);

  res.status(202).send({ status: "success", data: null });
});
const validateTask = catchAsync(async (req, res, next) => {
  if (!req.body.name) {
    throw new AppError("Task Name required", 401);
  } else if (!req.body.lid) {
    throw new AppError("List id required for task", 401);
  } else if (!req.uid) {
    throw new AppError("uid require for task", 401);
  } else {
    next();
  }
});

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  validateTask,
};
