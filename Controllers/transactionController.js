let {TransactionService} = require("../Services/transactionService");
let service = new TransactionService();

class TransactionController {

    transactionOne(req,res) {
        let token = req.headers["authorization"];
        if(req.file === undefined){
            res.json({
                message : "please upload image!"
            })
        }else{
            service.transactionOneAndThree(req.user, req.file.path, token, "People_That_Have_Previous_Crimes",1).then((data)=>{
                if(data === null){
                    res.json({
                        message : "their is an error happen!"
                    })
                }else {
                    if (req.user.isAdmin === true){
                        res.json({
                            "transactionReport" : data
                        })
                    }else{
                        res.json({
                            "message" : "Please wait admin to confirm the transaction to see the report of transaction"
                        })
                    }
                }
            })
        }
    }

    transactionThree(req,res) {
        if(req.file === undefined){
            res.json({
                message : "please upload image!"
            })
        }else{
            let token = req.headers["authorization"];
            service.transactionOneAndThree(req.user, req.file.path, token, "small",3).then((data)=>{
                if(data === null){
                    res.json({
                        message : "their is an error happen!"
                    })
                }else {
                    if (req.user.isAdmin === true){
                        res.json({
                            "transactionReport" : data
                        })
                    }else{
                        res.json({
                            "message" : "Please wait admin to confirm the transaction to see the report of transaction"
                        })
                    }
                }
            });
        }
    }
    transactionTwo(req,res) {
        if(req.files.length === 1){
            res.json({
                message : "please upload the second image!"
            })
        }else if(req.files.length === 0){
            res.json({
                message : "please upload images!"
            })
        }else{
            let token = req.headers["authorization"];
            service.transactionTwo(req.user, req.files[0].path, req.files[1].path, token, 2).then((data)=>{
                if(data === null){
                    res.json({
                        message : "their is an error happen!"
                    })
                }else {
                    if (req.user.isAdmin === true){
                        res.json({
                            "transactionReport" : data
                        })
                    }else{
                        res.json({
                            "message" : "Please wait admin to confirm the transaction to see the report of transaction"
                        })
                    }
                }
            });
        }
    }

    transactionFour(req,res) {
        if(req.file === undefined){
            res.json({
                message : "please upload image!"
            })
        }else{
            let token = req.headers["authorization"];
            service.transactionFour(req.user, req.file.path, token,4).then((data)=>{
                if(data === null){
                    res.json({
                        message : "their is an error happen!"
                    })
                }else {
                    if (req.user.isAdmin === true){
                        res.json({
                            "transactionReport" : data
                        })
                    }else{
                        res.json({
                            "message" : "Please wait admin to confirm the transaction to see the report of transaction"
                        })
                    }
                }
            });
        }
    }

    async getAllTransactions(req,res) {
        let result = await service.listAllTransactions();
        if(result === null){
            res.json({
                message : "there is error to list all transaction"
            })
        }else {
            res.json({
                "transactions" : result
            })
        }
    }

    async getTransactionById(req,res) {
        let id = req.params.id;
        let result = await service.getTransactionById(id,req.user);
        if(result === null){
            res.status(404).json({
                message : "there is no transaction found!"
            })
        }else {
            res.json({
                "transaction" : result
            })
        }
    }

    async getTransactionByUserId(req,res) {
        let id = req.params.uid;
        let result = await service.getTransactionByUserId(id);
        if(result === null){
            res.status(404).json({
                message : "there is no transaction found!"
            })
        }else {
            res.json({
                "transaction" : result
            })
        }
    }

    async getTransactionsNeedToConfirm(req,res) {
        let result = await service.getTransactionsNeedToConfirm();
        if(result === null){
            res.json({
                message : "there is error to list all transactions need to confirm"
            })
        }else {
            res.json({
                "transactions" : result
            })
        }
    }

    async getTransactionNeedToConfirmById(req,res) {
        let id = req.params.id;
        let result = await service.getTransactionNeedToConfirmById(id);
        if(result === null){
            res.status(404).json({
                message : "there is no transaction found!"
            })
        }else {
            res.json({
                "transaction" : result
            })
        }
    }

    async ConfirmTransaction(req,res) {
        let token = req.headers["authorization"];
        let id = req.params.id;
        let {confirm} = req.body;
        let result = await service.ConfirmTransaction(token,id,confirm);
        if(result === null){
            res.status(404).json({
                message : "there is no transaction found!"
            })
        }else {
            if(confirm === true){
                res.json({
                    "decision" : "the transaction confirmed successfully"
                })
            }else{
                res.json({
                    "decision" : "the transaction declined successfully"
                })
            }
        }
    }

    async getLogsOfDeclinedTransactions(req,res) {
        let token = req.headers["authorization"];
        let result = await service.getLogsOfDeclinedTransactions(token);
        if(result === null){
            res.json({
                message : "there is error to get declined transactions"
            })
        }else {
            res.json({
                "result" : result
            })
        }
    }
}
module.exports = {
    TransactionController
}