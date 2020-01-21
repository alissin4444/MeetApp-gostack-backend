import * as Yup from "yup";
import { startOfHour, parseISO, isBefore, addHours, isAfter } from "date-fns";

import Encontro from "../models/Encontro";
import Upload from "../models/Upload";

class EncontroController {
  async index(req, res) {
    const encontros = await Encontro.findAll({
      where: {
        organizador_id: req.userId
      },
      include: {
        model: Upload,
        as: "banner",
        attributes: ["nome", "path", "url"]
      },
      attributes: ["id", "titulo", "descricao", "localizacao", "data"]
    });
    return res.json(encontros);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      titulo: Yup.string().required(),
      descricao: Yup.string().required(),
      localizacao: Yup.string().required(),
      data: Yup.date().required(),
      banner_id: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Dados incorretos" });
    }

    const { titulo, descricao, localizacao, data, banner_id } = req.body;

    const dataFormatada = startOfHour(parseISO(data));

    if (isBefore(dataFormatada, startOfHour(addHours(new Date(), 2)))) {
      return res
        .status(400)
        .json({ error: "Datas passadas não são permitidas" });
    }

    const encontro = await Encontro.create({
      titulo,
      descricao,
      localizacao,
      data: dataFormatada,
      banner_id,
      organizador_id: req.userId
    });

    return res.json(encontro);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      titulo: Yup.string(),
      descricao: Yup.string(),
      localizacao: Yup.string(),
      data: Yup.date(),
      banner_id: Yup.number()
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: "Dados incorretos" });
    }

    const encontro = await Encontro.findByPk(req.params.id);

    if (!encontro) {
      return res.status(404).json({ error: "Encontro não encontrado" });
    }

    if (encontro.organizador_id !== req.userId) {
      return res
        .status(401)
        .json({ error: "Apenas o organizador pode alterar seu encontro" });
    }

    if (isAfter(startOfHour(new Date()), encontro.data)) {
      return res.status(401).json({
        error: "O encontro não pode ser editado após seu início"
      });
    }

    if (req.body.data) {
      const dataFormatada = startOfHour(parseISO(req.body.data));

      if (isBefore(dataFormatada, startOfHour(addHours(new Date(), 1)))) {
        return res
          .status(400)
          .json({ error: "Datas passadas não são permitidas" });
      }
    }

    encontro.update(req.body);
    await encontro.save();

    return res.json(encontro);
  }

  async destroy(req, res) {
    const encontro = await Encontro.findByPk(req.params.id);

    if (!encontro) {
      return res.status(404).json({ error: "Encontro não encontrado" });
    }
    if (encontro.organizador_id !== req.userId) {
      return res.status(401).json({ error: "Não autorizado" });
    }

    if (isBefore(encontro.data, startOfHour(addHours(new Date(), 2)))) {
      return res.status(401).json({
        error: "Não autorizado apagar faltando duas horas para o encontro"
      });
    }

    await Encontro.destroy({
      where: {
        id: req.params.id
      }
    });

    return res.json();
  }
}

export default new EncontroController();
