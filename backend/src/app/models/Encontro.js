import Sequelize, { Model } from "sequelize";

class Encontro extends Model {
  static init(sequelize) {
    super.init(
      {
        titulo: Sequelize.STRING,
        descricao: Sequelize.TEXT,
        localizacao: Sequelize.STRING,
        data: Sequelize.DATE
      },
      {
        sequelize
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Upload, { foreignKey: "banner_id", as: "banner" });
    this.belongsTo(models.User, {
      foreignKey: "organizador_id",
      as: "organizador"
    });
    this.hasMany(models.Inscricao, {
      foreignKey: "encontro_id",
      as: "inscricoes"
    });
  }
}

export default Encontro;
