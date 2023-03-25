const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

let {AdminMiddleWare} = require("./middleWares/adminMiddleWare");
const {adminRoutes} = require("./Routes/Admin/adminRoutes");
const {userRoutes} = require("./Routes/Website/userRoutes");
const {UserMiddleWare} = require("./middleWares/userMiddleWare");

const app = express();
const adminApp = express();
const userApp = express();

adminRoutes(adminApp)
userRoutes(userApp)

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use("/admin", AdminMiddleWare, adminApp);
app.use("/website", UserMiddleWare,userApp);

//const port = 8080;
const port = 8080 || process.env.PORT;
app.listen(port, function (){
    console.log(`running on http://localhost:${port}`)
});

