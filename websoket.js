var ws = require("nodejs-websocket")
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('MyTestDB.db');
// Scream server example: "hi" -> "HI!!!" 
var server = ws.createServer(function (conn) {
    console.log("New connection")
    conn.on("text", function (str) {
        console.log("Received "+str)
	db.run("INSERT INTO content values (?)",str,function(err){})
        broadcastNewMsg(str);
	conn.sendText(str.toUpperCase()+"!!!")
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
}).listen(8001)

function broadcastNewMsg(str){
    server.connections.forEach(function (connection){
	connection.sendText(str);
	})
}
