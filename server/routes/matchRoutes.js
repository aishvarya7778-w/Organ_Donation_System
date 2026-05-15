const express = require('express');
const { checkCompatibility, runMatching } = require('../controllers/matchController');
const { protectAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/check/:donorId/:recipientId', checkCompatibility);
router.post('/run', protectAdmin, runMatching);

module.exports = router;
