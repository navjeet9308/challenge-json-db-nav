const studentHelper = require('./studentHelper');
module.exports = {
    updateStudentProperties: async (req, res, next) => {
        console.log('Load dash needed Properties' + req.loadDashProperties);
        await studentHelper.updateStudentProperties(req.loadDashProperties, req.body, req.params.studentId);
        res.json({success : true, message : "Student properties updated"});
    },
    getStudentProperties: async (req, res, next) => {
        res.json({message : 'get route'});
    },
    deleteStudentProperties: async (req, res, next) => {
        res.json({message : 'delete route'});
    }
}