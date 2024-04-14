const express = require('express')

const router = express.Router()

const {signupUser, loginUser, searchUser} = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth')

router.post('/login', loginUser)

router.post('/signup', signupUser)

router.use(requireAuth);

router.post('/search', searchUser)

module.exports = router