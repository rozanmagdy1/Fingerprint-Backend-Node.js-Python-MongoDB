const {TransactionController} = require("../../Controllers/transactionController");
let transaction_controller = new TransactionController();
const multer = require("multer");
let upload = multer({dest : './DataBasesImages/'});

function transactionRoute(adminApp) {

    //{transaction1}
    adminApp.post(
        "/transactionOne",
        upload.single("fingerprint"),
        transaction_controller.transactionOne
    );

    //{transaction2}
    adminApp.post(
        "/transactionTwo",
        upload.array("fingerprint",2),
        transaction_controller.transactionTwo
    );

    //{transaction3}
    adminApp.post(
        "/transactionThree",
        upload.single("fingerprint"),
        transaction_controller.transactionThree
    );

    // {transaction4}
    adminApp.post(
        "/transactionFour",
        upload.single("fingerprint"),
        transaction_controller.transactionFour
    );

    //get all transactions
    adminApp.get("/transactions", transaction_controller.getAllTransactions);

    //get transaction by id
    adminApp.get("/transactions/:id", transaction_controller.getTransactionById);

    //get transaction by user id
    adminApp.get("/transactions/user/:uid", transaction_controller.getTransactionByUserId);

    //view transactions need to confirm
    adminApp.get("/confirmation/transactions", transaction_controller.getTransactionsNeedToConfirm);

    //view transaction need to confirm by transaction id
    adminApp.get("/confirmation/transactions/:id", transaction_controller.getTransactionNeedToConfirmById);

    //confirm transaction
    adminApp.post("/confirmation/transactions/:id", transaction_controller.ConfirmTransaction)

}

module.exports = {
    transactionRoute
}


//redundant code in controller
