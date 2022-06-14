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
const ApiFeaturs = require("./../utils/apiFeaturs");
const { getCollections } = require('./../models/dbConfig');
const AppError = require('./../utils/appError');

const getGroups = catchAsync(async (req, res, next) => {
    //     console.log(req.uid)
    //   const Group = getCollections('Group');
    //   const q = query(Group, where('uid', '==', req.uid));
    //   const querySnapshot = await getDocs(q);
    //   let groupData = [];
    //   querySnapshot.forEach((doc) => {
    //     groupData.push({ _id: doc.id, ...doc.data() });
    //   });
    //   res.status(200).send({ status: 'success', groupData });
    const Group = getCollections("Group");
    const queryFilters = { sort: req.query.sort || "date", ...req.query };
    if (!queryFilters.limit) queryFilters["limit"] = 10;
    const apiFeatur = new ApiFeaturs(queryFilters, Group);
    await apiFeatur.builtFbQuery();
    const q = query(Group, ...apiFeatur.transformedQuery);
    const querySnapshot = await getDocs(q);
    let groupData = [];
    querySnapshot.forEach((doc) => {
        groupData.push({ _id: doc.id, ...doc.data() });
    });
    res
        .status(200)
        .send({ status: "success", taskCount: groupData.length, groupData });
});
const getGroup = catchAsync(async (req, res, next) => {
    const Group = getCollections('Group');
    const docRef = doc(Group, req.params.id);
    const docSnap = await getDoc(docRef);
    let groupDatetails;
    if (docSnap.exists()) {
        groupDatetails = docSnap.data();
    }

    res.status(200).send({ status: 'success', data: groupDatetails });
});

const groupAdd = catchAsync(async (req, res, next) => {
    const Group = getCollections('Group');
    await addDoc(Group, {
        name: req.body.name,
        type: req.body.type,
        uid: req.uid,
        date: Date.now(),
        members: req.body.members || []
    });
    res.status(201).send({ status: 'success', msg: 'Group created successfully' });
});

const groupUpdate = catchAsync(async (req, res, next) => {
    const Group = getCollections('Group');
    console.log(req.body);
    const docRef = doc(Group, req.params.id);
    await updateDoc(docRef, { ...req.body });
    res.status(204).send({ status: 'success', data: 'Group updated successfully' });
});

const groupDelete = catchAsync(async (req, res, next) => {
    const Group = getCollections('Group');
    const docRef = doc(Group, req.params.id);
    await deleteDoc(docRef);

    res.status(202).send({ status: 'success', data: null });
});

const groupValidators = catchAsync(async (req, res, next) => {
    if (!req.body.name) {
        throw new AppError('Group Name required', 401);
    } else if (!req.uid) {
        throw new AppError('uuid required', 401);
    } else if (['board', 'mindmap', 'contacts'].indexOf(req.body.type) === -1) {
        throw new AppError(
            'Invalid Group type, Group type should be between 0-4',
            401
        );
    } else {
        next();
    }
});

module.exports = {
    getGroups,
    groupAdd,
    groupUpdate,
    groupDelete,
    getGroup,
    groupValidators,
};
