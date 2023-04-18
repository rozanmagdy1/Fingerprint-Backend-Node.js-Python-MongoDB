const {ObjectId} = require("mongodb");
const {CitizensModel} = require('../Model/citizens');
const citizen = new CitizensModel();

class CitizenService {
    async getPersonInfoById(id) {
        try {
            let person = await citizen.findPerson({_id: ObjectId(id)});
            if(!person){
                return null
            }else{
                return person
            }
        }catch (e) {
            return null;
        }
    }
}
module.exports = {
    CitizenService
};