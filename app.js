const express = require('express')
const cors = require("cors");
const app = express()
const port = 3000
const cookieParser = require("cookie-parser");
const controllers = require("./controllers");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
  })
);
app.use(cookieParser());

app.post("/signin", controllers.login);
app.post("/signUp", controllers.signUp);
app.post("/like", controllers.like);
app.post("/comment", controllers.addComment);
app.delete("/comment", controllers.removeComment);
app.patch("/comment", controllers.updateComment);
app.post("/addBanWord", controllers.addBanWord);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})