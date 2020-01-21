import Upload from "../models/Upload";

class UploadController {
  async store(req, res) {
    const { originalname: nome, filename: path } = req.file;
    const file = await Upload.create({
      nome,
      path
    });

    return res.json(file);
  }
}

export default new UploadController();
