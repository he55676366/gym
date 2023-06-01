var { Error } = require('../response')
var login_render = function (req, res, next) {
    if(req.session.user) {
        next();
    } else {
        res.redirect('/')
    }
}
var login_api = function (req, res, next) {
    if(req.session.user) {
        next();
    } else {
        res.end(
            JSON.stringify(new Error('permission deined'))
        )
    }
}

var login_api_admin = function (req, res, next) {
    if(req.session.admin) {
        next();
    } else {
        res.redirect('/admin')        
    }
}


module.exports = {
    login_render,
    login_api,
    login_api_admin
}