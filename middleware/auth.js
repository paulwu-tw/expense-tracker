const authenticate = {
    authenticator: (req, res, next)=> {
        if(req.isAuthenticated()) return next()

        req.flash('warningMsg', 'Please login first.')
        res.redirect('/users/login')
    }
}

module.exports = authenticate