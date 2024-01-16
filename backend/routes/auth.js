const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const JWT_SECRET = "Rohitisagood$boy"
const fetchuser = require('../middleware/fetchuser')

// Route 1: create a user using: post:"/api/auth/createuser". No login required
router.post('/createuser', [
  body('email', 'Enter a valid email').isEmail(),
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('password', 'Enter a valid password').isLength({ min: 6 })
], async (req, res) => {
  // if thier are errors then returns bad request and errors
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // chech whether the user with this email exists already 
  try {
    let success = false;
    let user = await User.findOne({ email: req.body.email })
    //   console.log(user);
    if (user) {
      return res.status(400).json({ success,error: 'Email already exist' });
    }
    // doing hashing with the help of bcryptjs for the password protection
    const salt = await bcrypt.genSalt(10);
    secpass = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secpass
    })
    // sending authentication token to the user with the use of jsonwebtoken(JWT)
    const data = {
      user: {
        id: user.id,
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    //   console.log(jwtData);
    //   res.json({"message":"Thank you for registration"}); 
    success = true;
    res.json({success, authToken })
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Internal server error")
  }

  //   .then(user => res.json(user))
  //   .catch((err)=>{console.log(err)
  // res.json({error: 'Email already registered'})})
})

//Route 2: Authentication a user using post "/api/auth/login" . No login required
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Enter a valid password').isLength({ min: 6 })
], async (req, res) => {
  // if thier are errors then returns bad request and errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body
  try {
    let user = await User.findOne({ email })
    let success = true;
    if (!user) {
      success = false;
      return res.status(400).json({ success,error: "Please enter valid login credential" });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false;
      return res.status(400).json({success, error: "Incorrect password, please try again" });
    }
    const data = {
      user: {
        id: user.id,
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);
    res.json({ success, authToken })
  } catch (error) {
    console.log(error.message)
    res.status(500).json.send("Internal server error")
  }
})

//Route 3: Get loggedin user details using post "/api/auth/getuser" . login required
router.post('/getuser', fetchuser, [
], async (req, res) => {
  // if thier are errors then returns bad request and errors
  try {
    userId = req.user.id;
    let user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Internal server error")
  }

})


module.exports = router