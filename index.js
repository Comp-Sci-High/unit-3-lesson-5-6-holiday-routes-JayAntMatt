const express = require("express")
const app = express()

app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
})

//A route handler that gets the summons page information, interaction,  etc. This allows the client to click on a button bringing them to a different page
app.get("/summon", (req, res) => {
  res.sendFile(__dirname + "/public/summon.html")
})

app.listen(3000, () => {
  console.log(`Holiday Server is Running!`)
});
