const express = require("express");
const app = express();

const mongoDBConnection = require("./DBConnection/connection");

const donorRouter= require("./Routers/donorRouter");
const donationRouter = require("./Routers/donationRouter")
const bloodBagRouter = require("./Routers/bloodBagRouter");
const bloodUsageRouter = require("./Routers/bloodUsageRouter")

const PORT = 5000;
mongoDBConnection("mongodb://127.0.0.1:27017/BloodBankDB");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

//Home Page
app.get("/", (req, res)=>{
    res.send("<h1>Home Page</h1>");
})
//Router with routes
app.use("/donors", donorRouter);
app.use("/donations", donationRouter);
app.use("/bloodbags", bloodBagRouter);
app.use("/bloodusage", bloodUsageRouter);


app.listen(PORT, ()=>console.log(`Server started at ${PORT} port`));