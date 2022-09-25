import express from "express";
import { postPool, getPool } from "../controllers/poolController.js";
import { validaPool } from "../midweres/validations.js";

const router = express.Router();

router.post("/pool", validaPool, postPool);
router.get("/pool", getPool);

export default router;
