import { Op } from "sequelize";
import Encontro from "../models/Encontro";

import { startOfDay, endOfDay, parseISO } from "date-fns";

class FiltroController {
  async index(req, res) {
    switch (req.query.query) {
      case "encontros":
        const encontros = await Encontro.findAll({
          where: {
            data: {
              [Op.between]: [
                startOfDay(parseISO(req.query.date)),
                endOfDay(parseISO(req.query.date))
              ]
            }
          },
          limit: 10,
          offset: (req.query.page - 1) * 10
        });
        return res.json(encontros);
        break;
      default:
        return res.json();
    }
  }
}

export default new FiltroController();
