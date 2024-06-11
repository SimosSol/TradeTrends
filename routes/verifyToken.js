//This middleware can be added to any route that we want to be protected 
//accessed only by logged in users

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    const token = req.cookies.jwt
    if(!token) return res.redirect('/login')

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)  //Returns the user id as it can be found in the database
        next();
    } catch (err) {
        res.redirect('/login')
    }
}