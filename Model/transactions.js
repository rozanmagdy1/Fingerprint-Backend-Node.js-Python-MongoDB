const {insertOne, find, findOne, deleteOne} = require("../DB/Db");
const fs = require("fs");
let dataBaseName = "systemDB";
let collectionName = "transactions";
let tempCollection = "TempTransactions"

class TransactionsModel {

    saveFile(file, path, transaction_no) {
        fs.rename(file, `./DataBasesImages/TransactionType${transaction_no}/${path}.jpg`,
            (err) => {
                if (err) throw err
            })
    }

    saveTransaction(data) {insertOne(dataBaseName, collectionName, data);}
    saveTempTransaction(data) {insertOne(dataBaseName, tempCollection, data);}
    async getAllTransactions() {return await find(dataBaseName, collectionName);}
    async getTransactionByID(filter) {return await findOne(dataBaseName, collectionName, filter);}
    async getTransactionsByUserID(filter) {return await find(dataBaseName, collectionName, filter);}
    async getTransactionsNeedToConfirm() {return await find(dataBaseName, tempCollection);}
    async getTransactionNeedToConfirmById(filter) {return await findOne(dataBaseName, tempCollection, filter);}
    async deleteTempTransaction(filter) {return await deleteOne(dataBaseName, tempCollection, filter);}
    async getDeclinedTransactions(filter) {return await find(dataBaseName, collectionName,filter);}

    async renameImageOfDeclinedTransaction(old_name, new_name) {
        fs.rename(old_name, new_name, (err) => {
            if (err) throw err
        });
    }

}
module.exports = {
    TransactionsModel
}