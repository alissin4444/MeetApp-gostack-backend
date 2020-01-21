import Sequelize, { Model } from "sequelize";

class Inscricao extends Model {
  static init(sequelize) {
    super.init(
      {
        user_id: Sequelize.NUMBER,
        encontro_id: Sequelize.NUMBER
      },
      {
        sequelize
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    this.belongsTo(models.Encontro, {
      foreignKey: "encontro_id",
      as: "encontro"
    });
  }
}

export default Inscricao;
