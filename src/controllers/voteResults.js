import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

let db;

mongoClient.connect().then(() => {
  db = mongoClient.db("drivencracyBd");
});

export async function postVote(req, res) {
  const date = new Date();

  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();

  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;

  const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();

  const minute =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

  const second =
    date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();

  const id = req.params.id;

  const choice = await db
    .collection("choicesBd")
    .findOne({ _id: new ObjectId(id) });

  if (!choice) {
    return res.sendStatus(404);
  }

  const pool = await db.collection("poolBd").findOne({
    _id: new ObjectId(choice.poolId),
  });

  if (!pool) {
    return res.sendStatus(404);
  }

  const expirate = new Date(pool.expireAt);
  if (date.getTime > expirate) return res.sendStatus(403);

  const newDate = [
    ...choice.dateVote,
    {
      date: `${day}-${month}-${date.getFullYear()} ${hour}:${minute}:${second}`,
    },
  ];

  const newVote = choice.votes + 1;
  const newChoice = { ...choice, votes: newVote, dateVote: newDate };

  db.collection("choicesBd")
    .updateOne({ _id: choice._id }, { $set: newChoice })
    .then(() => res.sendStatus(200));
}

export async function getResults(req, res) {
  const pool = await db.collection("poolBd").findOne({
    _id: new ObjectId(req.params.id),
  });

  if (!pool) {
    return res.sendStatus(404);
  }

  let champion = 0;
  const id = req.params.id;
  db.collection("choicesBd")
    .find({
      poolId: id,
    })
    .toArray()
    .then((object) => {
      if (object.length === 0) return res.sendStatus(404);
      for (let i = 0; i < object.length; i++) {
        if (object[i].votes > champion) champion = object[i];
      }
      const response = {
        title: pool.title,
        expireAt: pool.expireAt,
        result: {
          title: champion.title,
          votes: champion.votes,
        },
      };

      res.send(response);
    });
}
