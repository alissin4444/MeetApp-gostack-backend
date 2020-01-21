import { Op } from "sequelize";
import { startOfHour, isAfter } from "date-fns";
import Inscricao from "../models/Inscricao";
import Encontro from "../models/Encontro";

import Mail from "../../lib/Mail";

class InscricaoController {
  async index(req, res) {
    const encontros = await Encontro.findAll({
      attributes: ["id", "titulo", "descricao", "localizacao", "data"],
      where: {
        data: {
          [Op.gte]: new Date()
        }
      },
      include: {
        model: Inscricao,
        as: "inscricoes",
        attributes: ["user_id"],
        where: {
          user_id: req.userId
        }
      },
      order: ["data"]
    });

    return res.json(encontros);
  }

  async store(req, res) {
    const encontro = await Encontro.findByPk(req.params.id, {
      include: {
        model: User,
        as: "organizador",
        attributes: ["name", "email"]
      }
    });

    if (!encontro) {
      return res.status(404).json({ message: "Encontro não encontrado" });
    }

    if (req.userId === encontro.organizador_id) {
      return res.status(400).json({
        message:
          "Apenas são permitidas inscrições em encontros não organizados por este user"
      });
    }

    if (isAfter(startOfHour(new Date()), encontro.data)) {
      return res.status(401).json({
        error: "A inscrição não pode acontecer após o início do encontro"
      });
    }

    const dataNaoPermitida = await Inscricao.findOne({
      where: {
        user_id: req.userId,
        data: encontro.data
      }
    });

    if (dataNaoPermitida) {
      return res.status(401).json({
        message:
          "O usuário não pode se inscrever em dois encontros com o mesmo horário e dia"
      });
    }

    const usuarioJaInscrito = await Inscricao.findOne({
      where: {
        user_id: req.userId,
        encontro_id: encontro.id
      }
    });

    if (usuarioJaInscrito) {
      return res
        .status(401)
        .json({ message: "Este usuário já está inscrito nesse encontro" });
    }

    const inscricao = await Inscricao.create({
      user_id: req.userId,
      encontro_id: encontro.id
    });

    await Mail.sendMail({
      to: `${encontro.organizador.name} <${encontro.organizador.email}>`,
      subject: "Nova inscrição",
      text: "Um novo usuário se inscreveu em seu evento"
    });

    return res.json(inscricao);
  }
}

export default new InscricaoController();
