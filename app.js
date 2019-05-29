var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/nodedemo", { useNewUrlParser: true });

var userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String
});

var User = mongoose.model("User", userSchema);

const sha256 = require('sha256');

class Block {
  constructor(index, timestamp, userData, prevHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.userData = userData;
    this.prevHash = prevHash;
    this.thisHash = sha256(
      this.index + this.timestamp + this.userData + this.prevHash
    );
  }
}
const blockLength = 0;

const createFirstBlock = () => new Block(0, Date.now(), 'First Block', '0');

const nextBlock = (previousBlock, data) =>
  new Block(previousBlock.index + 1, Date.now(), data, previousBlock.thisHash);
const blockchain = [createFirstBlock()];
var prevBlock = blockchain[0];

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});
app.post("/adduser", function(req, res){
  var myData = req.body;
  const blockToAdd = nextBlock(prevBlock, myData);
  blockchain.push(blockToAdd);
  prevBlock = blockToAdd;
  console.log(blockchain);
  res.send("Successfully user detail has been added. <a href='/userlist'>Click Here</a> to view the user list.");
    
});
app.get("/userlist", function(req, res){
  //res.render("userlist", {userlist : blockchain});
});
app.listen(port, function(){
  console.log("Server listening on port " + port);
});

