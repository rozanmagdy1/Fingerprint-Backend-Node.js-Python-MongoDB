const {UserController} = require("../../Controllers/userController");
let user_controller = new UserController();
const {TransactionController} = require("../../Controllers/transactionController");
let transaction_controller = new TransactionController();
const multer = require("multer");
let upload = multer({dest : './DataBasesImages/'});

function userRoutes(userApp) {
    userApp.post("/login", user_controller.login);
    userApp.post('/verify', user_controller.verify);
    userApp.post('/resend',user_controller.resendCode);
    userApp.post(
        "/transactionOne",
        upload.single("fingerprint"),
        transaction_controller.transactionOne
    );
    userApp.post(
        "/transactionTwo",
        upload.array("fingerprint",2),
        transaction_controller.transactionTwo
    );
    userApp.post(
        "/transactionThree",
        upload.single("fingerprint"),
        transaction_controller.transactionThree
    );
    userApp.post(
        "/transactionFour",
        upload.single("fingerprint"),
        transaction_controller.transactionFour
    );
    userApp.get("/transactions/:id", transaction_controller.getTransactionById);
    userApp.get("/transactions/user/:uid", transaction_controller.getTransactionByUserId);
    userApp.get("/declined/transactions", transaction_controller.getLogsOfDeclinedTransactions);
}
module.exports = {
    userRoutes
}