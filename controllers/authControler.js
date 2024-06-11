const User = require('../models/User');
const {registerValidation, loginValidation} = require('../validation')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.signup_get = (req, res) => {
    res.render('signup')
}

module.exports.signup_post = async (req, res) => {
    //Validating the data
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the user already exists
    let nameExists;
    try {
        nameExists = await User.findOne({name: req.body.name})
    } catch{
        return res.status(500).send('Internal server error');
    } 
    if (nameExists) return res.status(400).send('Name already exists')

    //Checking if the user already exists
    let emailExists;
    try {
        emailExists = await User.findOne({email: req.body.email})
    } catch{
        return res.status(500).send('Internal server error');
    } 
    if (emailExists) return res.status(400).send('Email already exists') //When we send a res the the code stops there
    
    //Hashing the password
    const  salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //Creating a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        verified: "n",
        likedposts: [],
        followers: [],
        follows: [],
        img: " "
    });
    try{
        const savedUser = await user.save();
        //Creating and assigning a token so that the backend knows the user is logged in
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
        res.cookie('jwt', token, {maxAge: 604800000, httpOnly: true})
        res.cookie('username', user.name, {maxAge: 604800000})
        res.cookie('verified', user.verified, {maxAge: 604800000})
        res.status(200).send(savedUser);
    }catch(err){
        res.status(400).send(err);
    }
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.login_post = async (req, res) => {
    //Validating the data
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Checking if the user already exists
    let user;
    try {
        user = await User.findOne({email: req.body.email})
    } catch{
        return res.status(500).send('Internal server error');
    } 
    if (!user) return res.status(400).send('Email is incorrect')
    //Checking if the password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password')

    //Creating and assigning a token so that the backend knows the user is logged in, then setting the cookie for the token as well as the manager id
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.cookie('jwt', token, {maxAge: 604800000, httpOnly: true})
    res.cookie('username', user.name, {maxAge: 604800000})
    res.cookie('verified', user.verified, {maxAge: 604800000})
    res.status(200).send('Token')
}