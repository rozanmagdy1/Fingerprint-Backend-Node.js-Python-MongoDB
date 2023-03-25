const spawn = require("child_process").spawn ;
const path = require('path');
const {extractUserNameFromToken,extractUserIdFromToken} = require("../Services/extractInfoFromToken");
const {TransactionsModel} = require('../Model/transactions');
const transaction = new TransactionsModel();
const {CitizensModel} = require('../Model/citizens');
const citizen = new CitizensModel();
const {Pipeline1} = require('../Pipelines/pipeline1')
const pipeline1 = new Pipeline1();
const {Pipeline2} = require('../Pipelines/pipeline2')
const pipeline2 = new Pipeline2();
const {Pipeline3} = require('../Pipelines/pipeline3')
const {ObjectId} = require("mongodb");
const pipeline3 = new Pipeline3();

class TransactionService {
    
    static getUserMakeTransactionInfo(token){
        let username = extractUserNameFromToken(token);
        let id = extractUserIdFromToken(token)
        return [username,id]
    }

    static renameFile(token){
        //get data need for save image in server
        let [username ,] = TransactionService.getUserMakeTransactionInfo(token);
        let time = new Date().toLocaleString().replaceAll('/','-').replaceAll(':','.');
        return username +"&&"+ time;
    }

    static saveInDB(user,result){
        if (user.isAdmin === true){
            transaction.saveTransaction(result);
        }else{
            transaction.saveTempTransaction(result);
        }
    }


    transactionOneAndThree(user,file,token, folderName, transaction_no) {
        try {
            //rename image
            let path_name = TransactionService.renameFile(token);

            //save image in server
            transaction.saveFile(file,path_name,transaction_no);

            let [username ,id] = TransactionService.getUserMakeTransactionInfo(token);

            //Enter the image into pipeline one
            return new Promise(function(resolve) {

                pipeline1.pipeLineOne(path_name,folderName,spawn,transaction_no).then((data)=>{
                    let result = {};
                    let image_full_path = path.resolve(`${path_name}.jpg`);
                    image_full_path = image_full_path.replace(/\\[\, \w\.&-]+$/, "");
                    result.user = username;
                    result.userId = id;
                    if (transaction_no === 1){
                        result.transactionType = "one{Compare with people have previous crimes}";
                        result.transactionImagePath = `${image_full_path}\\DataBasesImages\\TransactionType1\\${path_name}.jpg`;
                    }else if (transaction_no === 3){
                        result.transactionType = "Three{Compare with global DB}";
                        result.transactionImagePath = `${image_full_path}\\DataBasesImages\\TransactionType3\\${path_name}.jpg`;
                    }

                    if (data["fileMatched"] === undefined){
                        result.result = "not matched";
                        result.informationEstimated = data;
                        //return data of transaction to controller
                        resolve(result)
                        //save the report of transaction in database
                        TransactionService.saveInDB(user,result);
                    }else{
                        result.result = "matched";
                        citizen.findPerson({fingers : data["fileMatched"]}).then((person)=>{
                            result.PersonMatched= person;
                            //return data of transaction to controller
                            resolve(result)
                            //save the report of transaction in database
                            TransactionService.saveInDB(user,result);
                        })
                    }
                })
            })
        }catch (e) {
            return null
        }
    }

    transactionTwo(user, path1, path2, token, transaction_no) {
        let result = {}
        let [username , id] = TransactionService.getUserMakeTransactionInfo(token);

        //rename images
        let path1_name =TransactionService.renameFile(token) + "&&" + "image1";
        let path2_name =TransactionService.renameFile(token) + "&&" + "image2";

        try {
            //save images in server
            transaction.saveFile(path1,path1_name,transaction_no);
            transaction.saveFile(path2,path2_name,transaction_no);

            return new Promise((resolve)=>{
                pipeline2.pipeLineTwo(path1_name, path2_name, spawn).then((data)=>{
                    let image1_full_path = path.resolve(`${path1_name}.jpg`);
                    image1_full_path = image1_full_path.replace(/\\[\, \w\.&-]+$/, "");
                    let image2_full_path = path.resolve(`${path2_name}.jpg`);
                    image2_full_path = image2_full_path.replace(/\\[\, \w\.&-]+$/, "");

                    result.transactionImage1Path = `${image1_full_path}\\DataBasesImages\\TransactionType2\\${path1_name}.jpg`;
                    result.transactionImage2Path = `${image2_full_path}\\DataBasesImages\\TransactionType2\\${path2_name}.jpg`;
                    result.user = username;
                    result.userId = id;
                    result.transactionType = "Two{compare image from crime scene with image of suspect person}";
                    result.isMatched = data;
                    //return data of transaction to controller
                    resolve(result)
                    //save the report of transaction in database
                    TransactionService.saveInDB(user,result);
                })
            })
        }catch (e) {
            return null
        }
    }

    transactionFour(user, file, token, transaction_no) {
        let result = {}
        let [username , id] = TransactionService.getUserMakeTransactionInfo(token);
        //rename image
        let path_name = TransactionService.renameFile(token);

        try {
            //save image in server
            transaction.saveFile(file,path_name,transaction_no);

            return new Promise(function(resolve) {
                pipeline3.pipeLineThree(path_name,spawn).then((data)=>{
                    let image_full_path = path.resolve(`${path_name}.jpg`);
                    image_full_path = image_full_path.replace(/\\[\, \w\.&-]+$/, "");
                    result.transactionImagePath = `${image_full_path}\\DataBasesImages\\TransactionType4\\${path_name}.jpg`;
                    result.user = username;
                    result.userId = id;
                    result.transactionType = "Four{Get Estimated Information's From FingerPrint Like (GENDER , HAND, FINGER)}";
                    result.informationEstimated = data;
                    //return data of transaction to controller
                    resolve(result)
                    //save the report of transaction in database
                    TransactionService.saveInDB(user,result);
                })
            })
        }catch (e) {
            return null
        }
    }

    async listAllTransactions() {
        try {
            return await transaction.getAllTransactions();
        }catch (e) {
            return null;
        }
    }

    async getTransactionById(id,user) {
        try {
            if(user.isAdmin === true){
                let Transaction = await transaction.getTransactionByID({_id: ObjectId(id)});
                if(!Transaction){
                    return null;
                }else{
                    return Transaction;
                }
            }else{
                let Transaction = await transaction.getTransactionByID({_id: ObjectId(id),
                    confirmationResult:true});
                if(!Transaction){
                    return "unauthorized";
                }else{
                    return Transaction;
                }
            }
        }catch (e) {
            return null;
        }
    }

    async getTransactionByUserId(id) {
        try {
            let Transaction = await transaction.getTransactionsByUserID({userId: id});
            if(!Transaction){
                return null;
            }else{
                return Transaction;
            }
        }catch (e) {
            return null;
        }
    }

    async getTransactionsNeedToConfirm() {
        try {
            return await transaction.getTransactionsNeedToConfirm();
        }catch (e) {
            return null;
        }
    }

    async getTransactionNeedToConfirmById(id) {
        try {
            let Transaction = await transaction.getTransactionNeedToConfirmById({_id: ObjectId(id)});
            if(!Transaction){
                return null;
            }else{
                return Transaction;
            }
        }catch (e) {
            return null;
        }
    }

    async ConfirmTransaction(token,id,confirm) {
        let [username , user_id] = TransactionService.getUserMakeTransactionInfo(token);
        try {
            let Transaction = await transaction.getTransactionNeedToConfirmById({_id: ObjectId(id)});
            if(!Transaction){
                return null;
            }else{
                let time = new Date().toLocaleString().replaceAll('/','-').replaceAll(':','.');
                if(confirm === true){
                    transaction.saveTransaction(Transaction);
                    Transaction.confirmedByAdmin = true;
                    Transaction.confirmationResult = true;
                    Transaction.confirmationTime = time;
                    return await transaction.deleteTempTransaction({_id: ObjectId(Transaction._id)});
                }else{
                    Transaction.userRefused = Transaction.user;
                    Transaction.user = username;
                    Transaction.userId = user_id;
                    Transaction.confirmedByAdmin = true;
                    Transaction.confirmationResult = false;
                    Transaction.confirmationTime = time;
                    if (Transaction.transactionImage1Path === undefined){
                        let old_path = Transaction.transactionImagePath;
                        let old_path_dir = path.dirname(old_path);
                        let new_path = `${old_path_dir}\\${username}&&${time}.jpg`;
                        await transaction.renameImageOfDeclinedTransaction(old_path , new_path);
                        Transaction.transactionImagePath = new_path;
                    }else{
                        let image1_old_path = Transaction.transactionImage1Path;
                        let image2_old_path = Transaction.transactionImage2Path;
                        let image1_old_path_dir = path.dirname(image1_old_path);
                        let image2_old_path_dir = path.dirname(image2_old_path);
                        let image1_new_path = `${image1_old_path_dir}\\${username}&&${time}&&image1.jpg`;
                        let image2_new_path = `${image2_old_path_dir}\\${username}&&${time}&&image2.jpg`;
                        await transaction.renameImageOfDeclinedTransaction(image1_old_path , image1_new_path);
                        await transaction.renameImageOfDeclinedTransaction(image2_old_path , image2_new_path);
                        Transaction.transactionImage1Path = image1_new_path;
                        Transaction.transactionImage2Path = image2_new_path;
                    }
                    transaction.saveTransaction(Transaction);
                    return await transaction.deleteTempTransaction({_id: ObjectId(Transaction._id)});
                }
            }
        }catch (e) {
            return null;
        }
    }

    async getLogsOfDeclinedTransactions(token) {
        let [username , ] = TransactionService.getUserMakeTransactionInfo(token);
        try {
             let the_log = []
             let result = await transaction.getDeclinedTransactions({confirmationResult :false,
                userRefused : username});
             for (let i =0; i < result.length; i++){
                 the_log.push({
                     transactionID : result[i]._id,
                     declineTime : result[i].confirmationTime,
                     confirmation  : "refused",
                 })
             }
             return the_log
        }catch (e) {
            return null;
        }
    }
}
module.exports = {
    TransactionService
}
