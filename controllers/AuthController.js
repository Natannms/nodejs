const jwt = require("jsonwebtoken");
const database = require("../models");
const secretKey = "secretKey";

class AuthController {
  //create functions for login, register, logout, with JWT authentication

  // middleware to verify JWT token
  authenticate(req, res, next) {
    // get the token from the request header
    const token = req.headers["x-access-token"];

    // verify the token
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }
      req.decoded = decoded;
      next();
    });
  }

  generateToken() {
    const token = jwt.sign({ username: "admin" }, secretKey, {
      expiresIn: "1h",
    });
    return token;
  }

  static async login(req, res, next) {
    const { email, password } = req.body;

    const user = await database.User.findOne({
      where: { email: email, password: password },
    });

    if (!user) {
      return res.status(400).json({ error: "User not found", statusCode:400});
    }

    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" });
    res.json({
      user: {
        id: user.id,
        name: user.name,
        token,
      },
      statusCode:200
    });
  }

  static async logout(req, res, next) {
    //get token in header
    const token = req.headers["x-access-token"];

    //verify if token existis in BlackListTokens
    const tokenExists = await database.BlackListToken.findOne({
      where: { token: token },
    });

    if (tokenExists) {
       //delete token
      await database.BlackListToken.destroy({
        where: { token: token },
      });

      return res.status(200).json({ message: "Logout successfully" });
    }else{
      return res.status(400).json({ error: "Token not found" });
    }
  }


  static async updatePassword(req, res) {
    const { id } = req.params;
    const {password } = req.body;

    const user = await database.User.findOne({
      where: { id: id },
    });

    if (!user) {
      res.send({ message: "User not founded", statusCode: 400 });
      return;
    }

    await database.User.update(
      { password },
      {
        where: {
          id: id,
        },
      }
    );

    res.send({ message: "Updated successfully", statusCode: 200 });
  }
}

module.exports = AuthController;
