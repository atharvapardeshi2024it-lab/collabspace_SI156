const express    = require('express');
const { body }   = require('express-validator');
const router     = express.Router();
const auth       = require('../middleware/auth');
const { validate } = require('../middleware/errorHandler');
const ctrl       = require('../controllers/authController');

const registerRules = [
  body('first_name').trim().notEmpty().withMessage('First name is required'),
  body('last_name').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('department').notEmpty().withMessage('Department is required'),
  body('year').notEmpty().withMessage('Year is required'),
];

const loginRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
];

router.post('/register',        registerRules, validate, ctrl.register);
router.post('/login',           loginRules,    validate, ctrl.login);
router.get( '/me',              auth,                    ctrl.getMe);
router.put( '/profile',         auth,                    ctrl.updateProfile);
router.put( '/change-password', auth,                    ctrl.changePassword);

module.exports = router;
