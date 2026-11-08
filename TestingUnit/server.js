const cookieParser = require('cookie-parser');
const express = require('express');
const path = require("path");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
const session=require('express-session');
app.use(session({
   secret: 'mycode',
  resave: false,
  saveUninitialized: true,
}));

app.get('/', (req, res) => {
    const { name } = req.query;
    res.cookie("name", `${name}`);
    res.send("cookies;")
})

app.get("/hellousingCookie", (req, res) => {
    res.send(`send the name:${req.cookies.name}`);
})


app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080')
});