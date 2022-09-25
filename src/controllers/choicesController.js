import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

let db;

mongoClient.connect().then(() => {
  db = mongoClient.db("drivencracyUol");
});

export async function postChoices(req, res) {
  const aux = ObjectId(req.body.poolId);
  console.log(aux);
  db.collection("poolBd")
    .findOne({
      _id: aux,
    })
    .then((object) => {
      if (object === null) return res.send(object);
      db.collection("choicesBd")
        .findOne({
          title: req.body.title,
        })
        .then((value) => {
          if (value !== null) return res.sendStatus(409);
          db.collection("choicesBd")
            .insertOne({
              ...req.body,
              votes: 0,
            })
            .then(() => res.send(req.body));
        });
    });
}

export async function getChoices(req, res) {
  const id = req.params.id;
  db.collection("choicesBd")
    .find({
      poolId: id,
    })
    .toArray()
    .then((object) => {
      if (object.length === 0) return res.sendStatus(404);
      res.send(object);
    });
}