const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../users/users-model');
const {
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree
} = require('./auth-middleware');

router.post('/register', 
checkPasswordLength,
checkUsernameFree, (req, res, next)=> {
  const {username, password} = req.body
  const hash = bcrypt.hashSync(password, 8)
  Users.add({username, password: hash})
    .then(newUser => {
      res.status(200).json(newUser)
    })
    .catch(next)
})
router.post('/login', 
checkUsernameExists, (req, res, next)=> {
  const {username, password} = req.body
  if(bcrypt.compareSync(password, req.user.password)) {
    req.session.user = req.user
    res.status(200).json({
        message: `Welcome ${username}!`
      })
  } else{
    res.status(401).json({
      message: "Invalid credentials"
    })
    next()
  }
})
router.get('/logout', (req, res, next)=> {
  if(req.session.user){
    req.session.destroy(err => {
      if(err){
        next(err)
      }else{
        res.status(200).json({
          message: "logged out"
        })
      }
    })
  }else{
    res.status(200).json({
      message: "no session"
    })
  }
})

router.use('*', (req, res)=> {
  res.json({api: 'reached'})
})
router.use((err, req, res, next)=> {
  res.status(500).json({
      message: err.message
  })
})

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */


/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
*/


module.exports = router;