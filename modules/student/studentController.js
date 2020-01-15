const studentHelper = require('./studentHelper')
module.exports = {
  updateStudentProperties: async (req, res, next) => {
    console.log('Load dash needed Properties' + req.loadDashProperties)
    await studentHelper.updateStudentProperties(req.loadDashProperties, req.body, req.params.studentId)
    res.json({ success: true, message: 'Student properties updated' })
  },
  getStudentProperties: async (req, res, next) => {
    const studentProperties = await studentHelper.getStudentProperties(req.loadDashProperties, req.params.studentId)
    if (!studentProperties) return next()
    res.json(studentProperties)
  },
  deleteStudentProperties: async (req, res, next) => {
    const isDeleted = await studentHelper.deleteStudentProperties(req.loadDashProperties, req.params.studentId)
    if (!isDeleted) return next()
    res.json({ success: true, message: 'Student properties deleted.' })
  }
}
