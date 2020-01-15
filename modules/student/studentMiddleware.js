module.exports = {
    convertPropertiesForLoadDash : async (req, res, next) => {
        req.loadDashProperties = req.params[0].replace(/\/$/, "").replace(/\//g, '.');
        next();
    }
}