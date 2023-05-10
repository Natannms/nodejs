const database = require("../models");

class ScheduleController {
  static async getAll(req,res) {
    const schedule = await database.Schedule.findAll({
      include: [
        {
          model: database.User,
          attributes: ['id', 'name'],
          as: 'user'
        }
      ]
    });

    if (!schedule) {
      return res.status(400).json({
        statusCode: 400,
        message: "Não foi possivel encontrar",
      });
    }

    return res.json({
      statusCode: 200,
      schedule,
    });
  }

  static async getOne(req, res) {
    const { id } = req.params;

    const schedule = await database.Schedule.findOne({
      where: { id: id },
      include: [
        {
          model: database.User,
          attributes: ['id', 'name'],
          as: 'user'
        }
      ]
    });

    if (!schedule) {
      return res.status(400).json({
        statusCode: 400,
        message: "Não foi possivel encontrar",
      });
    }

    return res.json({
      statusCode: 200,
      schedule,
    });
  }

  static async update(req, res) {
    const { id } = req.params;
    const { descriptionService, price, status, paymentStatus } = req.body;

    const schedule = await database.Schedule.findOne({
      where: { id: id },
    });

    if (!schedule) {
      res.send({ message: "Not founded", statusCode: 400 });
      return;
    }

    await database.Schedule.update(
      { descriptionService, price, status, paymentStatus },
      {
        where: {
          id: id,
        },
      }
    );

    res.send({ message: "Updated successfully", statusCode: 200 });
  }

  static async delete(req, res){
    const { id } = req.params

    const schedule = await database.Schedule.findOne({
        where: { id: id },
    });

    if (!schedule) {
        res.send({ message: "Not founded", statusCode:400 });
        return
    }

    await database.Schedule.destroy({
        where: {
            id: id
        }
    });

    res.send({ message: "Deleted successfully", statusCode:200 });
  }
}

module.exports = ScheduleController;
