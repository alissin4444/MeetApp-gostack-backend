import Sequelize from "sequelize";

import User from "../app/models/User";
import Upload from "../app/models/Upload";
import Encontro from "../app/models/Encontro";
import Inscricao from "../app/models/Inscricao";

import databaseConfig from "../config/database";

const models = [User, Upload, Encontro, Inscricao];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
