import "dotenv/config";
import { MongoClient, ServerApiVersion } from "mongodb";

const client = new MongoClient(process.env.COMMUNITY_URI, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
});

let _db, user_coll, todo_coll;

const mongoConnect = async () => {
	new Promise(async (resolve, reject) => {
		await client.connect()
			.then(async client => {
				_db = await client.db()
				user_coll = await _db.collection("users")
				todo_coll = await _db.collection("todos")
				resolve()
			})
			.catch(err => {
				reject(err)
			})
	})
		.then(async () => {
			console.log("Databse plugged in and healthy to serve.!")
		})
		.catch(err => {
			console.log("Error connecting to database")
			console.log(err)
		})
};

const usercoll = async () => {
	if (user_coll) return user_coll
	throw "Users collection not found"
}

const todocoll = async () => {
	if (todo_coll) return todo_coll
	throw "Todos collection not found"
}

export { mongoConnect, todocoll, usercoll };

