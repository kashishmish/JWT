const router=require("express").Router()
const pool=require("../db");
const bcrypt=require("bcrypt");
const jwtGenerator=require("../utils/jwtGenerator");
const validInfo=require("../middleware/validinfo");//5218
const authorization=require("../middleware/authorization");


//registering route

router.post("/register",validInfo,async(req,res)=>{
    try {
        // 1 destructure the req.body(name,email,password)
        const {name,email,password}=req.body;

        // 2 check if user exists (if user exist then throw error)
        const user= await pool.query("select * from users where user_email=$1",[email]);
        if (user.rows.length !==0)
        {
            return res.status(401).send("user already");//person is un authenticated and 403 means person is not authorized
        }
        // 3 Bcrypt the user password
        else{
            const saltRound =10 //how encrypted password is going to be
            const Salt=await bcrypt.genSalt(saltRound);
            const bcryptPassword=await bcrypt.hash(password,Salt);
       
        // 4 enter the new user in our database

        const newUser=await pool.query("insert into users (user_name,user_email,user_password) values ($1,$2,$3) returning *",[name,email,bcryptPassword]);
            // res.json(newUser.rows);
        // 5 generate our jwt token
        const token=jwtGenerator(newUser.rows[0].user_id);

        res.json({token});
        }



    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
})

//login route
router.post("/login",validInfo,async(req,res)=>{//middleware saare middle mein aate h
    try {
        // 1 destructure the req.body
        const {email,password}=req.body;
        // 2 check if user doesn't exists
        const user=await pool.query("select * from users where user_email=$1",[email]);
        if(user.rows.length===0)
        {
            return res.status(403).json("user doesnt exists")
        }
        // 3 check if incoming password is same as database password

        const validPassword=await bcrypt.compare(password,user.rows[0].user_password)
        console.log(validPassword);
        if(!validPassword)
        {
            return res.status(401).json("password is incorrect");
        }
        // 4 give them the jwt token 

        const token=jwtGenerator(user.rows[0].user_id);
        res.json({token});// toh ab jb bhi user login krne k baad dashboard pe jaana chahta h toh usse apna yeh token server side ko dikhana hoga tb hi aage jaa skta h vo toh yeh kaam hum saara middleware vale mein krenge
    } catch (error) {
        console.error(err.message);
        res.status(500).send("server error");
    }
})

router.get("/is-verify",authorization,async(req,res)=>{
    try {
        console.log(req.user);
        res.json(true);
        
    } catch (error) {
        console.error(err.message);
        res.status(500).send("server error");
    }
})


module.exports=router;