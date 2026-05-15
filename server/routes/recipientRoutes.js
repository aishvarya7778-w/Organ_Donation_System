const express = require('express');
const {
  registerRecipient,
  loginRecipient,
  getRecipientProfile,
  getRecipientStatus,
  updateRecipientStatus,
  getAllRecipients,
  getRecipientById
} = require('../controllers/recipientController');
const { protectAdmin, protectRecipient } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerRecipient);
router.post('/login', loginRecipient);
router.get('/me', protectRecipient, getRecipientProfile);
router.get('/profile', protectRecipient, getRecipientProfile);
router.get('/status', protectRecipient, getRecipientStatus);
router.patch('/status/:id', protectAdmin, updateRecipientStatus);
router.get('/all', getAllRecipients);
router.get('/:id', getRecipientById);

module.exports = router;
