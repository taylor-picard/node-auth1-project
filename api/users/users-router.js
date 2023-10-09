const router = require('express').Router();
const {restricted} =require('../auth/auth-middleware');
const Users = require('./users-model');

router.get('/', restricted, async (req, res, next)=> {
  try{
    const users = await Users.find()
      res.status(200).json(users)
  }catch(err) {
      res.status(401).json({
        message: "You shall not pass!"
      })
      next(err);
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
  [GET] /api/users

  This endpoint is RESTRICTED: only authenticated clients
  should have access.

  response:
  status 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response on non-authenticated:
  status 401
  {
    "message": "You shall not pass!"
  }
 */


module.exports = router;