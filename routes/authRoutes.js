const router = require('express').Router();

const authController = require('../controllers/authControler')


router.get('/signup', authController.signup_get)

router.post('/signup', authController.signup_post)

router.get('/login', authController.login_get)

router.post('/login', authController.login_post)

module.exports = router;