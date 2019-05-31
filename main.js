var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
const sha256 = require('sha256');

// Block class
class Block {
    constructor (index, timestamp, data, previousHash = ""){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return sha256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data).toString());
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }
    createGenesisBlock(){
        return new Block(0, Date.now(), "Genesis Block", "0");
    }
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock){
        newBlock.index = this.getLatestBlock().index + 1;
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});
app.post("/addblock", (req, res) => {
    var myData = req.body;
    let userCoin = new Blockchain();
    /* let myData = {
        'fromAddress' : 'abccdef',
        'toAddress' : 'ghijklm',
        'amount' : 10
    }; */
    userCoin.addBlock(new Block(1, Date.now(), myData));
    console.log(JSON.stringify(userCoin, null, 2));
    res.send(userCoin);
});
app.get("/blocklist", function(req, res){
    let dataList = new Blockchain();
    res.send(dataList.chain);
});
app.listen(port, function(){
    console.log("Server listening on port " + port);
  });