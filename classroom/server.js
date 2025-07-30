const express = require("express");
const path = require("path"); // ✅ required for path.join
const session = require("express-session");
const flash = require("connect-flash");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(session({
    secret: "mysupersecretString",
    resave: false,
    saveUninitialized: true
}));
app.use(flash());



app.use((req,res,next)=>{
    res.locals.Successmsg = req.flash("success");
    res.locals.Errormsg = req.flash("error");
    next();
})

app.get("/register", (req, res) => {
    const { name = "anonymous" } = req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("error"," user not registered");
    }else{
        req.flash("success", "user register success");
    }
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    res.locals.Successmsg = req.flash("success");
    res.locals.Errormsg = req.flash("error");
    res.render("page.ejs", { name: req.session.name ,msg: req.flash("success")});
   
});

// Import routers
const userRoutes = require("./routers/user");
const postRoutes = require("./routers/post");

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
