const bodyParser = require('body-parser');
const cors = require('cors');
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');
const ScheduleController = require('../controllers/ScheduleController');
module.exports = app =>{
    app.use(bodyParser.json());
    app.use(cors());

    // User Routes
    app.get("/ola", UserController.hello);
    app.post("/login", AuthController.login);
    app.get("/users", UserController.getAll)
    app.get("/users/:id", UserController.getOne)
    app.put("/users/:id", UserController.update)
    app.put("/address/:userId", UserController.updateUserAddress)

    // Schedule Routes
    app.get("/schedules", ScheduleController.getAll)
    app.get("/schedules/:id", ScheduleController.getOne)
    app.put("/schedules/:id", ScheduleController.update)
}
