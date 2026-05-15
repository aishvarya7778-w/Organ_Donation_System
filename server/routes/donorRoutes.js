const express = require('express');
const {
  registerDonor,
  loginDonor,
  getDonorProfile,
  getDonorStatus,
  updateDonorStatus,
  getAllDonors,
  getDonorById
} = require('../controllers/donorController');
const upload = require('../middleware/uploadMiddleware');
const { protectAdmin, protectDonor } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', upload.single('reportFile'), registerDonor);
router.post('/login', loginDonor);
router.get('/me', protectDonor, getDonorProfile);
router.get('/profile', protectDonor, getDonorProfile);
router.get('/status', protectDonor, getDonorStatus);
router.patch('/status/:id', protectAdmin, updateDonorStatus);
router.get('/all', getAllDonors);
router.get('/:id', getDonorById);

module.exports = router;
