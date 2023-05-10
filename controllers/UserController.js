const database = require("../models");

class UserController {

  static async hello(req, res){
    res.send("HELLO")
  }
  static async register(req, res) {
    const { email, password, name, rua, numero, bairro, cidade, estado, cep } =
      req.body;

    // verify if email exists

    const userExists = await database.User.findOne({
      where: { email: email },
    });

    if (userExists) {
      res.send({ message: "User already exists" });
      // return;
    } else {
      const user = await database.User.create({
        name,
        email,
        password,
        type: "user",
      });

      // setUser Address
      const userAddress = await database.Address.create({
        userId:user.id, rua, numero, bairro, cidade, estado, cep
      });

      if (!user) {
        res.send({ message: "Não foi possivel cadastrar  usuário" });
      } else if(!userAddress){
        user.destroy()
        res.send({ message: "Não foi possivel cadastrar endereço do usuário" });
      } else {
        res.send({
          message: "Created successfully",
          user: user.id,
        });
      }
    }
  }

  static async getOne(req, res) {
    const id = req.params.id;

    const user = await database.User.findOne({
      where: { id: id },
      include: [
        {
          model: database.Address,
          attributes: ['rua', 'numero', 'bairro', 'cidade', 'estado', 'cep'],
          as: 'address'
        },
        {
          model: database.Schedule,
          attributes: ['userId', 'descriptionService', 'price', 'status', 'paymentStatus'],
          as: 'schedules'
        }
      ]
    });

    if (!user) {
      return res.status(400).json({
        statusCode: 400,
        message: "Não foi possivel encontrar usuário",
      });
    }

    return res.json({
      statusCode: 200,
      user,
    });
  }

  static async getAll(req, res) {
    const users = await database.User.findAll({
      include: {
        model: database.Address,
        attributes: ['rua', 'numero', 'bairro', 'cidade', 'estado', 'cep'],
        as: 'address'
      }
    });

    if (!users) {
      return res.status(400).json({
        statusCode: 400,
        message: "Não foi possivel encontrar usuário",
      });
    }

    return res.json({
      statusCode: 200,
      users,
    });
  }

  static async update(req, res) {
    const { id } = req.params;
    const { name, email, type } = req.body;

    const user = await database.User.findOne({
      where: { id: id },
    });

    if (!user) {
      res.send({ message: "User not founded", statusCode: 400 });
      return;
    }

    await database.User.update(
      { name, email, type },
      {
        where: {
          id: id,
        },
      }
    );

    res.send({ message: "Updated successfully", statusCode: 200 });
  }

  static async delete() {
    const { id } = req.params;

    const user = await database.User.findOne({
      where: { id: id },
    });

    if (!user) {
      res.send({ message: "User not founded", statusCode: 400 });
      return;
    }

    await database.User.destroy({
      where: {
        id: id,
      },
    });

    res.send({ message: "Deleted successfully", statusCode: 200 });
  }
  static async getUserAdress(req, res){
      const id = req.params.id;

      const user = await database.User.findOne({
        where: { id: id },
      });


    if (!user) {
      return res.status(400).json({
        statusCode: 400,
        message: "Não foi possivel encontrar usuário",
      });
    }


    const address = await database.Address.findOne({
      where: { userId: id },
    });


    if (!address) {
      return res.status(400).json({
        statusCode: 400,
        message: "Não foi possivel encontrar endereço",
      });
    }

    return res.json({
      statusCode: 200,
      user,
      address
    });

  }
  static async updateUserAddress(req, res){
      const userId = req.params.userId;
      const {rua, numero, bairro, cidade, estado, cep} = req.body

      const user = await database.User.findOne({
        where: { id: userId },
      });


    if (!user) {
      return res.status(400).json({
        statusCode: 400,
        message: "Não foi possivel encontrar usuário",
      });
    }


    const address = await database.Address.findOne({
      where: { userId: userId },
    });


    if (!address) {
      return res.status(400).json({
        statusCode: 400,
        message: "Não foi contém endereço",
      });
    }

    await database.Address.update(
      {rua, numero, bairro, cidade, estado, cep },
      {
        where: {
          userId: userId,
        },
      }
    );

    res.send({ message: "Updated successfully", statusCode: 200 });
  }
}

module.exports = UserController;
