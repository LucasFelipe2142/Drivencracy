import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

let db;

mongoClient.connect().then(() => {
  db = mongoClient.db("drivencracyBd");
});

export async function postChoices(req, res) {
  const now = Date.now();
  const aux = ObjectId(req.body.poolId);
  console.log(aux);
  db.collection("poolBd")
    .findOne({
      _id: aux,
    })
    .then((object) => {
      if (object === null) return res.sendStatus(404);
      const expirate = new Date(object.expireAt);
      if (now > expirate) return res.sendStatus(403);
      db.collection("choicesBd")
        .findOne({
          title: req.body.title,
          poolId: req.body.poolId,
        })
        .then((value) => {
          if (value !== null) return res.sendStatus(409);
          db.collection("choicesBd")
            .insertOne({
              ...req.body,
              votes: 0,
              dateVote: [],
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
      for (let i = 0; i < object.length; i++) {
        delete object[i].votes;
        delete object[i].dateVote;
      }
      res.send(object);
    });
}
