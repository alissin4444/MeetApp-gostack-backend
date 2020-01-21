import { Router } from "express";
import multer from "multer";
import multerConfig from "./config/multer";

import SessionController from "./app/controllers/SessionController";
import UserController from "./app/controllers/UserController";
import UploadController from "./app/controllers/UploadController";
import EncontroController from "./app/controllers/EncontroController";
import InscricaoController from "./app/controllers/InscricaoController";
import FiltroController from "./app/controllers/FiltroController";

import authMiddleware from "./app/middlewares/auth";

const routes = new Router();
const upload = multer(multerConfig);

routes.post("/sessions", SessionController.store);

routes.get("/users", UserController.index);
routes.post("/users", UserController.store);

routes.use(authMiddleware);

routes.post("/uploads", upload.single("file"), UploadController.store);

routes.put("/users", UserController.update);

routes.get("/encontros", EncontroController.index);
routes.post("/encontros", EncontroController.store);
routes.put("/encontros/:id", EncontroController.update);
routes.delete("/encontros/:id", EncontroController.destroy);

routes.get("/inscricaos", InscricaoController.index);
routes.post("/encontros/:id/inscricaos", InscricaoController.store);

routes.get("/filtros", FiltroController.index);

export default routes;
