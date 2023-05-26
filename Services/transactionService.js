const spawn = require("child_process").spawn;
const path = require('path');
const parallel = require('run-parallel')
const { extractUserNameFromToken, extractUserIdFromToken } = require("../Services/extractInfoFromToken");
const { TransactionsModel } = require('../Model/transactions');
const transaction = new TransactionsModel();
const { CitizensModel } = require('../Model/citizens');
const citizen = new CitizensModel();
const { UsersModel } = require('../Model/users');
const users = new UsersModel();
const { Pipeline1 } = require('../Pipelines/pipeline1')
const pipeline1 = new Pipeline1();
const { Pipeline2 } = require('../Pipelines/pipeline2')
const pipeline2 = new Pipeline2();
const { Pipeline3 } = require('../Pipelines/pipeline3')
const { ObjectId } = require("mongodb");
const pipeline3 = new Pipeline3();

class TransactionService {

    static getUserMakeTransactionInfo(token) {
        let username = extractUserNameFromToken(token);
        let id = extractUserIdFromToken(token)
        return [username, id]
    }

    static renameFile(token) {
        let [username,] = TransactionService.getUserMakeTransactionInfo(token);
        let time = new Date().toLocaleString().replaceAll('/', '-').replaceAll(':', '.');
        return username + "&&" + time;
    }

    static saveInDB(user, result) {
        if (user.isAdmin === true) {
            transaction.saveTransaction(result);
        } else {
            transaction.saveTempTransaction(result);
        }
    }

    transactionOneAndThree(user, file, token, folderName, transaction_no) {
        try {
            let path_name = TransactionService.renameFile(token);     //rename image
            transaction.saveFile(file, path_name, transaction_no);   //save image in server
            let [username, id] = TransactionService.getUserMakeTransactionInfo(token);

            //Enter the image into pipeline one
            return new Promise(function (resolve) {
                pipeline1.pipeLineOne(path_name, folderName, spawn, transaction_no).then((data) => {
                    let result = {};
                    result.user = username;
                    result.userId = id;

                    let image_full_path = path.resolve(`${path_name}.jpg`);
                    image_full_path = image_full_path.replace(/\\[\, \w\.&-]+$/, "");
                    let part_extracted = path.dirname(image_full_path);

                    if (transaction_no === 1) {
                        result.transactionType = "one{Compare with people have previous crimes}";
                        result.transactionImagePath = `${part_extracted}\\DataBasesImages\\TransactionType1\\${path_name}.jpg`;
                    } else if (transaction_no === 3) {
                        result.transactionType = "Three{Compare with global DB}";
                        result.transactionImagePath = `${part_extracted}\\DataBasesImages\\TransactionType3\\${path_name}.jpg`;
                    }

                    if (data["fileMatched"] === undefined) {
                        result.result = "not matched";
                        result.informationEstimated = data;
                        parallel([
                            () => { resolve(result) },
                            () => { TransactionService.saveInDB(user, result) }
                        ], function () {
                            console.log("complete successfully")
                        });
                    } else {
                        result.result = "matched";
                        citizen.findPerson({ fingers: data["fileMatched"] }).then((person) => {
                            result.PersonMatched = person;
                            parallel([
                                () => { resolve(result) },
                                () => { TransactionService.saveInDB(user, result) }
                            ], function () {
                                console.log("complete successfully")
                            });
                        })
                    }
                })
            })
        } catch (e) {
            return null
        }
    }

    transactionTwo(user, path1, path2, token, transaction_no) {
        let result = {}
        let [username, id] = TransactionService.getUserMakeTransactionInfo(token);

        //rename images
        let path1_name = TransactionService.renameFile(token) + "&&" + "image1";
        let path2_name = TransactionService.renameFile(token) + "&&" + "image2";

        try {
            //save images in server
            transaction.saveFile(path1, path1_name, transaction_no);
            transaction.saveFile(path2, path2_name, transaction_no);

            return new Promise((resolve) => {
                pipeline2.pipeLineTwo(path1_name, path2_name, spawn).then((data) => {
                    let image1_full_path = path.resolve(`${path1_name}.jpg`);
                    image1_full_path = image1_full_path.replace(/\\[\, \w\.&-]+$/, "");
                    let part1_extracted = path.dirname(image1_full_path);
                    let image2_full_path = path.resolve(`${path2_name}.jpg`);
                    image2_full_path = image2_full_path.replace(/\\[\, \w\.&-]+$/, "");
                    let part2_extracted = path.dirname(image2_full_path);

                    result.transactionImage1Path = `${part1_extracted}\\DataBasesImages\\TransactionType2\\${path1_name}.jpg`;
                    result.transactionImage2Path = `${part2_extracted}\\DataBasesImages\\TransactionType2\\${path2_name}.jpg`;
                    result.user = username;
                    result.userId = id;
                    result.transactionType = "Two{compare image from crime scene with image of suspect person}";
                    result.isMatched = data;
                    parallel([
                        () => { resolve(result) },
                        () => { TransactionService.saveInDB(user, result) }
                    ], function () {
                        console.log("complete successfully")
                    });
                })
            })
        } catch (e) {
            return null
        }
    }

    transactionFour(user, file, token, transaction_no) {
        let result = {}
        let [username, id] = TransactionService.getUserMakeTransactionInfo(token);
        let path_name = TransactionService.renameFile(token);

        try {
            transaction.saveFile(file, path_name, transaction_no);

            return new Promise(function (resolve) {
                pipeline3.pipeLineThree(path_name, spawn).then((data) => {
                    let image_full_path = path.resolve(`${path_name}.jpg`);
                    image_full_path = image_full_path.replace(/\\[\, \w\.&-]+$/, "");
                    let part_extracted = path.dirname(image_full_path);
                    result.transactionImagePath = `${part_extracted}\\DataBasesImages\\TransactionType4\\${path_name}.jpg`;
                    result.user = username;
                    result.userId = id;
                    result.transactionType = "Four{Get Estimated Information's From FingerPrint Like (GENDER , HAND, FINGER)}";
                    result.informationEstimated = data;
                    parallel([
                        () => { resolve(result) },
                        () => { TransactionService.saveInDB(user, result) }
                    ], function () {
                        console.log("complete successfully")
                    });
                })
            })
        } catch (e) {
            return null
        }
    }

    async listAllTransactions() {
        try {
            return await transaction.getAllTransactions();
        } catch (e) {
            return null;
        }
    }

    async getTransactionById(id, user) {

        try {
            if (user.isAdmin === undefined) {
                return "relogin please"
            }

            if (user.isAdmin === true) {
                let Transaction = await transaction.getTransactionByID({ _id: ObjectId(id) });
                if (!Transaction) {
                    return null;
                } else {
                    return Transaction;
                }
            } else {
                let Transaction = await transaction.getTransactionByID({
                    _id: ObjectId(id),
                    confirmationResult: true
                });
                if (!Transaction) {
                    return "unauthorized";
                } else {
                    return Transaction;
                }
            }
        } catch (e) {
            return null;
        }
    }

    async getTransactionByUserId(id) {
        try {
            let Transactions = await transaction.getTransactionsByUserID({ userId: id });
            if (!Transactions) {
                return null;
            } else {
                return Transactions;
            }
        } catch (e) {
            return null;
        }
    }

    async getTransactionsNeedToConfirm() {
        try {
            return await transaction.getTransactionsNeedToConfirm();
        } catch (e) {
            return null;
        }
    }

    async getTransactionNeedToConfirmById(id) {
        try {
            let Transaction = await transaction.getTransactionNeedToConfirmById({ _id: ObjectId(id) });
            if (!Transaction) {
                return null;
            } else {
                return Transaction;
            }
        } catch (e) {
            return null;
        }
    }

    async ConfirmTransaction(token, id, confirm) {
        let [username, user_id] = TransactionService.getUserMakeTransactionInfo(token);
        try {
            let Transaction = await transaction.getTransactionNeedToConfirmById({ _id: ObjectId(id) });
            if (!Transaction) {
                return null;
            } else {
                let time = new Date().toLocaleString().replaceAll('/', '-').replaceAll(':', '.');
                if (confirm === true) {
                    Transaction.confirmedByAdmin = true;
                    Transaction.confirmationResult = true;
                    Transaction.confirmationTime = time;
                    transaction.saveTransaction(Transaction);
                    return await transaction.deleteTempTransaction({ _id: ObjectId(Transaction._id) });
                } else {
                    Transaction.userRefused = Transaction.user;
                    Transaction.user = username;
                    Transaction.userId = user_id;
                    Transaction.confirmedByAdmin = true;
                    Transaction.confirmationResult = false;
                    Transaction.confirmationTime = time;

                    if (Transaction.transactionImage1Path === undefined) {
                        let old_path = Transaction.transactionImagePath;
                        let old_path_dir = path.dirname(old_path);
                        let new_path = `${old_path_dir}\\${username}&&${time}.jpg`;
                        await transaction.renameImageOfDeclinedTransaction(old_path, new_path);
                        Transaction.transactionImagePath = new_path;
                    } else {
                        let image1_old_path = Transaction.transactionImage1Path;
                        let image2_old_path = Transaction.transactionImage2Path;
                        let image1_old_path_dir = path.dirname(image1_old_path);
                        let image2_old_path_dir = path.dirname(image2_old_path);
                        let image1_new_path = `${image1_old_path_dir}\\${username}&&${time}&&image1.jpg`;
                        let image2_new_path = `${image2_old_path_dir}\\${username}&&${time}&&image2.jpg`;
                        await transaction.renameImageOfDeclinedTransaction(image1_old_path, image1_new_path);
                        await transaction.renameImageOfDeclinedTransaction(image2_old_path, image2_new_path);
                        Transaction.transactionImage1Path = image1_new_path;
                        Transaction.transactionImage2Path = image2_new_path;
                    }
                    transaction.saveTransaction(Transaction);
                    return await transaction.deleteTempTransaction({ _id: ObjectId(Transaction._id) });
                }
            }
        } catch (e) {
            return null;
        }
    }

    async getLogsOfDeclinedTransactions(token) {
        let [username,] = TransactionService.getUserMakeTransactionInfo(token);
        try {
            let the_log = []
            let result = await transaction.getDeclinedTransactions({
                confirmationResult: false,
                userRefused: username
            });
            for (let i = 0; i < result.length; i++) {
                the_log.push({
                    transactionID: result[i]._id,
                    declineTime: result[i].confirmationTime,
                    confirmation: "refused",
                })
            }
            return the_log
        } catch (e) {
            return null;
        }
    }
}

module.exports = {
    TransactionService
}
