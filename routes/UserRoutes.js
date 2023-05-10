const {Router} = require('express');
const UserController = require('../controllers/UserController');
// const AuthController = require('../controllers/AuthController');


const router = Router();

router.post("/hello", (req, res)=>{
        res.send("ola mindo")
});
// router.post("/login", AuthController.login);
// router.get("/users", UserController.getAll)
// router.get("/users/:id", UserController.getOne)
// router.put("/users/:id", UserController.update)
// router.put("/address/:userId", UserController.updateUserAddress)
module.exports = router;
