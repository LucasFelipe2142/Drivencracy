import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

let db;

mongoClient.connect().then(() => {
  db = mongoClient.db("drivencracyUol");
});

export async function postPool(req, res) {
  let expirate = req.body.expireAt;
  console.log(req.body.expireAt);
  if (req.body.expireAt === "") {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    const day = date.getDay() < 10 ? `0${date.getDay()}` : date.getDay();
    const month =
      date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth();
    const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minute =
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    const second =
      date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    expirate = `${day}-${month}-${date.getFullYear()} ${hour}:${minute}:${second}`;
  }
  db.collection("poolBd")
    .insertOne({
      title: req.body.title,
      expireAt: expirate,
    })
    .then(() => res.sendStatus(201))
    .catch(() => res.sendStatus(404));
}

export async function getPool(req, res) {
  db.collection("poolBd")
    .find()
    .toArray()
    .then((object) => {
      res.send(object);
    });
}
