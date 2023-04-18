const {TransactionController} = require("../../Controllers/transactionController");
let transaction_controller = new TransactionController();
const multer = require("multer");
let upload = multer({dest : './DataBasesImages/'});
function transactionRoute(adminApp) {
    adminApp.post(
        "/transactionOne",
        upload.single("fingerprint"),
        transaction_controller.transactionOne
    );
    adminApp.post(
        "/transactionTwo",
        upload.array("fingerprint",2),
        transaction_controller.transactionTwo
    );
    adminApp.post(
        "/transactionThree",
        upload.single("fingerprint"),
        transaction_controller.transactionThree
    );
    adminApp.post(
        "/transactionFour",
        upload.single("fingerprint"),
        transaction_controller.transactionFour
    );
    adminApp.get("/transactions", transaction_controller.getAllTransactions);
    adminApp.get("/transactions/:id", transaction_controller.getTransactionById);
    adminApp.get("/transactions/user/:uid", transaction_controller.getTransactionByUserId);
    adminApp.get("/confirmation/transactions", transaction_controller.getTransactionsNeedToConfirm);
    adminApp.get("/confirmation/transactions/:id", transaction_controller.getTransactionNeedToConfirmById);
    adminApp.post("/confirmation/transactions/:id", transaction_controller.ConfirmTransaction)
}
module.exports = {
    transactionRoute
}