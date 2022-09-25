import express from "express";
import { validaChoices } from "../midweres/validations.js";
import { postChoices, getChoices } from "../controllers/choicesController.js";

const routes = express.Router();

routes.post("/choices", validaChoices, postChoices);
routes.get("/poll/:id/choice", getChoices);

export default routes;
