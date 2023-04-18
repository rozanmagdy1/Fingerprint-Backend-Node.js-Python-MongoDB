const {findOne, find} = require("../DB/Db");
let dataBaseName = "global";
let collectionOneName = "persons";
let collectionTwoName = "crimes";

class CitizensModel {
    async findPerson(filter) {
        let person = await findOne(dataBaseName, collectionOneName, filter);
        if(person){
            person.fingers = person.fingers.map((value) => {
                return `https://firebasestorage.googleapis.com/v0/b/fingerprints-5241d.appspot.com/o/allFingerPrints%2F${value}?alt=media&token=04a55892-afbe-418a-93bd-57c04cd5ad9f`;
            });
            if (person['precedent'] === true){
                person.previousCrimes = await find(dataBaseName, collectionTwoName, {_id: person['precedent_id']});
            }
            return person
        }else{
            return null
        }
    }

}

module.exports = {
    CitizensModel
}
