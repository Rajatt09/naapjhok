const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.route('/profiles')
    .post(userController.addProfile)
    .get(userController.getProfiles);

router.route('/profiles/:id')
    .put(userController.updateProfile)
    .delete(userController.deleteProfile);

module.exports = router;
