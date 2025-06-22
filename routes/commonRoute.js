const router = require('express').Router();
const commonController = require('../controllers/commonController')

router.get('/truncateTable', commonController.truncateTable)

module.exports = router
