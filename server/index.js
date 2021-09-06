const express=require("express");
const app=express();
const cors=require("cors");
const pool=require("./db");


// middleware
app.use(cors())// this is used to make our server ready for interaction with client 
app.use(express.json())//req.body (frontend se data recieve kr ske)


//Routes//

//register and login routes

app.use("/auth",require("./routes/jwtAuth"));

//dashboard route
app.use("/dashboard",require("./routes/dashboard"));


// app.get("/",async(req,res)=>{
//     // const insert=await pool.query("insert into users (user_name,user_email,user_password) values ('kashish','k@gmail.com','12345')");
//     // res.send("hello");
// })


app.listen(4000,()=>{
    console.log(`server listening at 4000 port number`)
});