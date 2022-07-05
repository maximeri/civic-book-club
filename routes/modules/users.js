const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')
const userController = require('../../../controllers/user-controller')
router.put('/:id', upload.single('avatar'), userController.putUser) // edit user info
router.get('/:id', userController.getUser) // view user info

module.exports = router
