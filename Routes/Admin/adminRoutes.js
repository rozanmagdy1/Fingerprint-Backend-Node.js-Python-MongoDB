const {userRoute} = require("./users");
const {citizenRoute} = require("./citizen");
const {transactionRoute} = require("./transactions");

function adminRoutes(adminApp) {
    userRoute(adminApp);
    citizenRoute(adminApp);
    transactionRoute(adminApp);
}

module.exports = {
    adminRoutes
}