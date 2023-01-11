const express = require('express');
const { protect } = require('../middleware/authMiddleware.js');
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
} = require('../controllers/chatController.js');
const router = express.Router();

router.route('/').post(protect, accessChat);

router.route('/').get(protect, fetchChats);
router.route('/group').post(protect, createGroupChat);
router.route('/rename').put(protect, renameGroupChat);
router.route('/add').put(protect, addToGroup);
router.route('/remove').put(protect, removeFromGroup);

module.exports = router;
