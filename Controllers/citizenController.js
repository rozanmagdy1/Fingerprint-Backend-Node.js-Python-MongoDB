let {CitizenService} = require("../Services/citizenService");
let service = new CitizenService();

class CitizenController {
    async getPersonInfoById(req,res) {
        let id = req.params.id;
        let result = await service.getPersonInfoById(id);
        if(result === null){
            res.status(404).json({
                message : "no user found!"
            })
        }else {
            res.json({
                "user" : result
            })
        }
    }
}
module.exports = {
    CitizenController
};