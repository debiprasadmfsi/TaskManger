const catchAsync = require('./../utils/catchAsync');
const { getDoc, doc ,getDocs} = require('firebase/firestore');
const { getCollections } = require('./../models/dbConfig');

const getUserList = catchAsync(async (req, res, next) => {
  const User = getCollections('User');
  const docSnap = await getDocs(User);
  const userList=[];
  docSnap.forEach((doc) => {
    userList.push({
      uid:doc.id,
      ...doc.data()
    })
  })

  res.status(200).send({ status: 'success', data: userList });
});

const getUser = catchAsync(async (req, res, next) => {
  const User = getCollections('User');
  const docRef = doc(User, req.params.id);
  const docSnap = await getDoc(docRef);
  let userDetails;
  if (docSnap.exists()) {
    userDetails = docSnap.data();
  }

  res.status(200).send({ status: 'success', data: userDetails });
});

module.exports = {
  getUserList,
  getUser,
};
