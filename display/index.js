require('dotenv').config();
const express = require('express');
const { engine } = require('express-handlebars');

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use("/static", express.static(__dirname + "/static"));
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/viewpart/login', (req, res) => {
    res.render("login", {
        layout: "bare"
    });
});

app.get("/viewpart/app", (req, res) => {
    res.render("loggedIn", {
        layout: "bare"
    });
});

app.get("/viewpart/hellotext", (req, res) => {
    res.render("hellotext", {
        layout: "bare",
        username: req.query.username
    })
})

app.post("/viewpart/renderData", express.json(), (req, res) => {
    res.render("data", {
        layout: "bare",
        payload: req.body.data
    });
})

app.listen(process.env.PORT);
