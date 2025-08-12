/******************************************************************************** 
*  WEB322 – Assignment 06 
* 
*  I declare that this assignment is my own work and completed based on my 
*  current understanding of the course concepts. 
*  
*  The assignment was completed in accordance with: 
*  a. The Seneca's Academic Integrity Policy 
*  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html 
*  
*  b. The academic integrity policies noted in the assessment description 
*   
*  I did NOT use generative AI tools (ChatGPT, Copilot, etc) to produce the code  
*  for this assessment. 
* 
*  Name: Gretchen Ding  Student ID: 123509242 
* 
********************************************************************************/

const HTTP_PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
app.set("view engine", "ejs");      //ejs
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views'); //vercel
app.use(express.urlencoded({ extended: true })); //forms

// setup sessions
const session = require('express-session')
app.use(session({
   secret: "the quick brown fox jumped over the lazy dog 1234567890",  // random string, used for configuring the session
   resave: false,
   saveUninitialized: true
}))

require("dotenv").config()   
const mongoose = require('mongoose')

// TODO: Put your model and schemas here
//define database
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
const User = new mongoose.model("users", userSchema)

const carSchema = new mongoose.Schema({
    model: String,
    imageUrl: String,
    returnDate: String,
    renter: { type: mongoose.Schema.Types.ObjectId, ref: "users"}
});
const Car = new mongoose.model("cars", carSchema);


//home page - login
app.get("/", async (req, res) => {  
    console.log("DEBUG: What's in req.session?")
    console.log(req.session)
    console.log(`Session id: ${req.sessionID}`)
    return res.render("login.ejs", {errorMessage: ""})
})

//receive info from the form->after authentication, redirect
app.post("/login", async (req, res)=>{
    try {
        const result = await User.findOne({email:req.body.email, password:req.body.password})
        //if both email & pw match
        if (result != null){
            req.session.currentUser = result       // save the database User to the session
            console.log("logged in")
            console.log(`SESSION ID: ${req.sessionID}`)
            console.log(req.session)
            return res.redirect("/cars")
        }
        else { 
            //try finding the user
            const userExisted = await User.findOne({email:req.body.email});
            //if the email exists 
            if (userExisted != null){
                return res.render("login.ejs", {errorMessage: "Invalid username or password"}) 
            }
            else { //no email found
                    const newUser = await User.create({email:req.body.email, password:req.body.password});
                    console.log("New user was created.")
                    req.session.currentUser = newUser;
                    return res.redirect("/cars")
            }
        }  
    } catch (error) {
        console.log(error);
        return res.send("Error, please refresh the page and try again.")
    }
});

//log out and back to home page
app.get("/logout", async (req,res) => {
    req.session.destroy();
    console.log("logout")
    return res.redirect("/")
})

//send cars info to the car list page -> user must login
app.get("/cars", async (req, res) => {  
    if (req.session.currentUser === undefined){
        //return res.render("login.ejs", {errorMessage: "Invalid username or password"}) //???
         return res.redirect("/")
    } else {
        try {
            const allCars = await Car.find().populate('renter');
            return res.render("cars.ejs", {cars: allCars, currentUser: req.session.currentUser})

        } catch (error) {
            console.log("Error fetching cars:", error);
            res.send("Error loading cars page");
        }
    }
});
//get form data (return button)
app.post("/return/:carID", async(req, res) => {
    if (req.session.currentUser === undefined){
        return res.redirect("/")
    } else {
        try {
            const carID = req.params.carID;
            await Car.findByIdAndUpdate(carID, 
                {
                    returnDate: "",
                    renter: null
                });
            console.log("Car returned.")
            return res.redirect("/cars");
        } catch (error) {
            console.log(error);
            res.send("Error returning the car.")
        } 
    }
})

//authenticate user logged in first
app.get("/book/:carId", async (req,res)=>{
    if (req.session.currentUser === undefined){
        return res.redirect("/")
    } else {
        try {
            const thisCar = await Car.findById(req.params.carId);
            res.render("bookingForm.ejs", { car: thisCar });
        } catch (error) {
            console.log("Error:", error);
            res.redirect("/cars");
        }
    }
})

// get booking form data
app.post("/book/:carId", async (req,res)=>{
    try {
        const carId = req.params.carId;
        
        await Car.findByIdAndUpdate(carId, {
            renter: req.session.currentUser._id,
            returnDate: req.body.date
        });
        
        console.log("Car booked successfully");
        res.redirect("/cars");
    } catch (error) {
        console.log("Error booking car:", error);
        res.redirect("/cars");
    }
})

//pre-populate the database with 5 cars
async function populateDatabase() {
    console.log("DEBUG....")
    const carCount = await Car.countDocuments()

    console.log(`What is the count: ${carCount}`)
    if (carCount === 0) {
        const c1 = await Car.create({
            model:"Mini Clubman", 
            imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4Rfpl43z7Nys93WT7vsyaV13RNzTIfcnbbw&s",
            returnDate: ""
        })
        const c2 = await Car.create({
            model:"Volkswagen Beetle", 
            imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOUma8FIKRP0v01VT-e7RMo1yG6Na2uvlJKw&s",
            returnDate: ""
        })
        const c3 = await Car.create({
            model:"Jeep Wrangler", 
            imageUrl:"https://www.jeep.com/content/dam/fca-brands/na/jeep/en_us/2025/wrangler/gallery/desktop/my25-jeep-wrangler-gallery-01-exterior-desktop.jpg",
            returnDate: ""
        })
        const c4 = await Car.create({
            model:"Ford Mustang", 
            imageUrl:"https://www.ford.ca/is/image/content/dam/na/ford/en_ca/images/mustang/2025/dm/25_Mustang_Dark_Horse_13_v2.tif?croppathe=1_21x9&wid=3840&fmt=webp",
            returnDate: ""
        })
        const c5 = await Car.create({
            model:"Toyota Supra", 
            imageUrl:"https://toyotacanada.scene7.com/is/image/toyotacanada/toyota-2026-hero-supra-3.0-premium-stratosphere-l?fit=constrain&wid=2200",
            returnDate: ""
        })

        console.log("DEBUG: cars created")

        await User.insertMany([
            { email: "gretchen@gmail.com", password: "12345"},
            { email: "gougou@gmail.com", password: "12345"},
            { email: "jiji@gmail.com", password: "12345"}
        ]);
        console.log("DEBUG: Employees created.")
    }

}

async function startServer() {
    try {    
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING)

        //if db not exists, create 
        await populateDatabase();

        console.log("SUCCESS connecting to MONGO database")
        
        // Only start the server if we're not in Vercel environment
        if (process.env.NODE_ENV !== 'production') {
            console.log("STARTING Express web server")        
            app.listen(HTTP_PORT, () => {     
                console.log(`server listening on: http://localhost:${HTTP_PORT}`) 
            })    
        }
    }
    catch (err) {        
        console.log("ERROR: connecting to MONGO database")        
        console.log(err)
        console.log("Please resolve these errors and try again.")
    }
}
startServer()

module.exports = app;

