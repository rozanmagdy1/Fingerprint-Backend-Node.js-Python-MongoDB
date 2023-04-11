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

    //{transaction1}
    userApp.post(
        "/transactionOne",
        upload.single("fingerprint"),
        transaction_controller.transactionOne
    );

    //{transaction2}
    userApp.post(
        "/transactionTwo",
        upload.array("fingerprint",2),
        transaction_controller.transactionTwo
    );

    //{transaction3}
    userApp.post(
        "/transactionThree",
        upload.single("fingerprint"),
        transaction_controller.transactionThree
    );

    // {transaction4}
    userApp.post(
        "/transactionFour",
        upload.single("fingerprint"),
        transaction_controller.transactionFour
    );

    //get transaction by user id
    userApp.get("/transactions/:id", transaction_controller.getTransactionById);

    //get transaction by its id
    userApp.get("/transactions/user/:uid", transaction_controller.getTransactionByUserId);

    //get logs of declined transactions
    userApp.get("/declined/transactions", transaction_controller.getLogsOfDeclinedTransactions);

}

module.exports = {
    userRoutes
}