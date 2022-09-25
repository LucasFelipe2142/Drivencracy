import express from "express";
import { postVote, getResults } from "../controllers/voteResults.js";

const routes = express.Router();

routes.post("/choice/:id/vote", postVote);
routes.get("/poll/:id/result", getResults);

export default routes;
