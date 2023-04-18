function citizenRoute(adminApp) {
    let {CitizenController} = require("../../Controllers/citizenController");
    let citizen_info_controller = new CitizenController();
    adminApp.get("/citizen/:id", citizen_info_controller.getPersonInfoById);
}
module.exports = {
    citizenRoute
}