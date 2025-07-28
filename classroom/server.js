const express = require("express");
const app = express();
const session = require("express-session");


// Middleware to parse cookies

// Middleware to parse JSON
app.use(express.json());

const sessionoptions = {
    secret: "mysupersecretString",
    resave: false,
    saveUninitialize: true,
}

app.use(session(sessionoptions));

app.get("/register", (req, res) => {
    const { name } = req.query;
    req.session.name = name;
    res.redirect("/hello");
});


app.get("/hello", (req,res)=>{
    res.send(`Hello ${req.session.name}`);
})
// app.get("/test",(req,res)=>{
//     res.send("test success");
// })

// app.get("/recount", (req, res) => {
//     if (req.session.count) {
//         req.session.count++;

//     } else {
//         req.session.count = 1;
//     }


//     res.send(`you can sent request ${req.session.count} times`);
// });


// Import routers
const userRoutes = require("./routers/user");
const postRoutes = require("./routers/post");





// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
  