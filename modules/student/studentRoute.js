const express = require('express');
const studentController = require('./studentController');
const studentMiddlewares = require('./studentMiddleware');

const router = express.Router();

router.put('/:studentId/*', [studentMiddlewares.convertPropertiesForLoadDash], studentController.updateStudentProperties);
router.get('/:studentId/*', [studentMiddlewares.convertPropertiesForLoadDash], studentController.getStudentProperties); 
router.delete('/:studentId/*', [studentMiddlewares.convertPropertiesForLoadDash], studentController.deleteStudentProperties);

module.exports = router;