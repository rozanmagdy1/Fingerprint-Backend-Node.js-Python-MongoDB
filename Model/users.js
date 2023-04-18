let dataBaseName = "systemDB";
let collection1Name = "users";
let collection2Name = "logs";
const {find, insertOne, findOne, deleteOne, updateOneByQuery} = require("../DB/Db");
const {ObjectId} = require("mongodb");

class UsersModel {
    async getAllUsers() {
        return await find(dataBaseName, collection1Name);
    }

    getUser(filter) {
        return findOne(dataBaseName, collection1Name, filter);
    }

    async addUser(data) {
        return await insertOne(dataBaseName, collection1Name, data);

    }

    async updateUser(filter, data) {
        return await updateOneByQuery(dataBaseName, collection1Name, filter, data);
    }

    async deleteUser(id) {
        return await deleteOne(dataBaseName, collection1Name, {_id: ObjectId(id)});
    }

    async saveLoginLogs(data) {
        return await insertOne(dataBaseName, collection2Name, data);
    }

    async getAllLogs() {
        return await find(dataBaseName, collection2Name);
    }
}

module.exports = {
    UsersModel
}