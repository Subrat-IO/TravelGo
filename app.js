if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}
// ---------- Dependencies ----------
const express = require("express");
const app = express();


const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

// ---------- Models ----------
const User = require("./models/user");
const Listing = require("./models/listing");
const Review = require("./models/review");

// ---------- Routers ----------
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

// ---------- DB Connection ----------
// const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";
const dbUrl = process.env.ATLASDB_URL;
mongoose.connect(dbUrl)
  .then(() => console.log("✅ Connected to DB"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// ---------- Middleware ----------
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));



// ---------- Session & Flash ----------

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24 * 3600,

});

store.on("error", ()=>{
  console.log("error in mongo session store", err)
})

const sessionOptions = {
  store:store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }
};



app.use(session(sessionOptions));
app.use(flash());

// ---------- Passport Setup ----------
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ---------- Flash Middleware ----------
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error"); 
  res.locals.currentUser = req.user; 
  next();
});

// ---------- View Engine ----------
app.engine("ejs", engine); 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ---------- Demo Route ----------
// app.get("/demouser", async (req, res) => {
//   try {
//     let fakeuser = new User({
//       email: "subrat@gmail.com",
//       username: "subha",
//     });

//     let registeredUser = await User.register(fakeuser, "helloSubh");
//     res.send(registeredUser);
//   } catch (err) {
//     res.send(err.message);
//   }
// });


// ---------- Main Routes ----------
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// ---------- Root Route ----------
// app.get("/", (req, res) => {
//   res.send("Hi, I am root.");
// });

// ---------- Start Server ----------
app.listen(8080, () => {
  console.log("🚀 Server is running on port 8080");
});