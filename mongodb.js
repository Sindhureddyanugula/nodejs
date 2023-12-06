const uri = "mongodb+srv://sindhu:MhNKu2GTVRPBQTU9@cluster0.zzj7gdh.mongodb.net/?retryWrites=true&w=majority";
const fs = require('fs');

const {MongoClient} = require('mongodb');

const dbName = "cities";
const collectionName = "citiesandpopulation";
const client = new MongoClient(uri);

async function connect(){
    try {
        await client.connect();
        console.log("MongoDB connected");
    } catch (e) {
        console.error(e);
    }
}

async function upload(){
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const path = require('path');
    const dataPath = path.join(__dirname, 'db.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));


    try {
        const insertManyResult = await collection.insertMany(data);
        console.log(`${insertManyResult.insertedCount} documents successfully inserted.\n`);
      } catch (err) {
        console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
      }
    console.log('Data uploaded successfully')
}

async function retrieve(){
    const cursor = client.db("cities").collection("citiesandpopulation").find({});
    const results = await cursor.toArray();
    console.log(results);
    return results;
}

async function deleteData(){
    await client.db('cities').collection('citiesandpopulation').deleteMany({});

    console.log("data removed");
}
module.exports = {connect,upload,retrieve,deleteData};