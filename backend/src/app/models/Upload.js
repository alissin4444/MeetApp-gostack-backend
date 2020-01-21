import Sequelize, { Model } from "sequelize";

class Upload extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        path: Sequelize.TEXT,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/uploads/${this.path}`;
          }
        }
      },
      {
        sequelize
      }
    );
  }
}

export default Upload;
