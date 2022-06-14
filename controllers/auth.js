const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} = require('firebase/auth');
const AppError = require('./../utils/appError');
const { getCollections } = require('./../models/dbConfig');
const { getFbAuth, getFbAdminAuth } = require('../models/dbConfig');
const catchAsync = require('./../utils/catchAsync');
const { setDoc, doc } = require('firebase/firestore');

const signup = catchAsync(async (req, res, next) => {
  const auth = getFbAuth();
  const User = getCollections('User');
  let userData = await createUserWithEmailAndPassword(
    auth,
    req.body.email,
    req.body.password
  );

  userDetails = {
    uid:userData.user.uid,
    name: req.body.name,
    email: req.body.email,
  };
  if (req.body.profile) userData['profile_url'] = req.body.profile;
  await setDoc(doc(User, userDetails.uid), userDetails);
  res.status(200).send({
    status: 'success',
    body:{uid:userDetails.uid,...userData.user.stsTokenManager},
    message: 'Signup success',
  });
});

const login = catchAsync(async (req, res, next) => {
  const auth = getFbAuth();
  const user = await signInWithEmailAndPassword(
    auth,
    req.body.email,
    req.body.password
  );

  const userData = {
    uid: user.user.uid,
    access_token: user.user.stsTokenManager.accessToken,
    refresh_token: user.user.stsTokenManager.refreshToken,
    expiration_time: user.user.stsTokenManager.expirationTime,
  };
  res.status(200).send({
    status: 'success',
    user: userData,
  });
});

const logout = catchAsync(async (req, res, next) => {
  const auth = getFbAuth();
  await signOut(auth);

  res.status(200).send({
    status: 'success',
    msg: 'Logout successful',
  });
});

const protect = catchAsync(async (req, res, next) => {
  const headerToken = req.headers.authorization;
  if (!headerToken) {
    res.status(401).send({ message: 'No token provided' });
  } else if (headerToken && headerToken.split(' ')[0] !== 'Bearer') {
    res.status(401).send({ message: 'Invalid token' });
  } else {
    const token = headerToken.split(' ')[1];
    const auth = getFbAdminAuth();
    let data = await auth.verifyIdToken(token);
    req['uid'] = data.uid;
    next();
  }
});

const validateUser = catchAsync(async (req, res, next) => {
  if (!req.body.name) {
    throw new AppError('User Name required', 401);
  } else if (!req.body.email) {
    throw new AppError('User Email required', 401);
  } else if (!req.body.password) {
    throw new AppError('Password required', 401);
  } else {
    next();
  }
});

module.exports = {
  signup,
  login,
  logout,
  protect,
  validateUser,
};
