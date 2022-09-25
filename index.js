import express from "express";
import cors from "cors";
import poolRoutes from "./src/routtes/poolRoutes.js";
import choicesRoutes from "./src/routtes/choicesRoutes.js";
const app = start();

app.use(choicesRoutes);
app.use(poolRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});

function start() {
  const app = express();
  app.use(express.json());
  app.use(cors());
  return app;
}
