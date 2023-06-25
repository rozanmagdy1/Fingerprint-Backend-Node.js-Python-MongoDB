const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017';
// let url = process.env.MONGO_URI
function mongoConnect(url) {
    return new Promise((resolve, reject)=>{
        MongoClient.connect(url, function (error, result) {
            if(error){reject(error)}
            resolve(result);
        })
    })
}
function find(dataBaseName, collectionName, filter ={}) {
    return new Promise((resolve, reject) => {
        mongoConnect(url).then((db)=>{
            let dbo = db.db(dataBaseName);
            dbo.collection(collectionName).find(filter).toArray(function (error, result) {
                if (error) {reject(error)}
                resolve(result);
                db.close();
            })
        })
    })
}
function findOne(dataBaseName, collectionName, filter ={}) {
    return new Promise((resolve, reject) => {
        mongoConnect(url).then((db)=>{
            let dbo = db.db(dataBaseName);
            dbo.collection(collectionName).findOne(filter, function (error, result) {
                if (error) {reject(error)}
                resolve(result);
                db.close();
            })
        })
    })
}
function insertOne(dataBaseName, collectionName, data) {
    return new Promise((resolve, reject) => {
        mongoConnect(url).then((db) => {
            let dbo = db.db(dataBaseName);
            dbo.collection(collectionName).insertOne(data, function (error, result) {
                if(error) {reject(error)}
                resolve(result);
                console.log("one document inserted successfully");
                db.close();
            })
        })
    })
}
function deleteOne(dataBaseName, collectionName, filter = {}) {
    return new Promise((resolve, reject)=>{
        mongoConnect(url).then((db)=>{
            let dbo = db.db(dataBaseName);
            dbo.collection(collectionName).deleteOne(filter, function (error, result) {
                if(error){reject(error)}
                resolve(result);
                console.log("One document deleted successfully");
                db.close();
            })
        })

    })
}
function updateOneByQuery(databaseName,collectionName,filter = {}, newData) {
    return new Promise((resolve, reject)=>{
        mongoConnect(url).then((db)=>{
            const dbo = db.db(databaseName);
            dbo.collection(collectionName).updateOne(filter,{$set : newData},function (error,result) {
                if(error){reject(error)}
                resolve(result);
                db.close();
            })
        })
    })
}

module.exports = {
    find,
    findOne,
    insertOne,
    deleteOne,
    updateOneByQuery,
}