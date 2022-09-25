import express from "express";
import { postVote } from "../controllers/voteResults.js";

const routes = express.Router();

routes.post("/choice/:id/vote", postVote);

export default routes;
