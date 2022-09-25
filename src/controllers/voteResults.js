import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

let db;

mongoClient.connect().then(() => {
  db = mongoClient.db("drivencracyUol");
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
