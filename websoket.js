var ws = require("nodejs-websocket");
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('MyTestDB.db');
var fs = require('fs');
//var np = require('node-protobuf');
//var pb = new np(fs.readFileSync('rpc.proto');
// Scream server example: "hi" -> "HI!!!" 
var path = './tmp/'
var server = ws.createServer(function (conn) {
    console.log("New connection")
    sendNewest(conn)
    
    conn.on("binary", function(inStream){
	
	var fn = path +  new Date().toString()
//	var fwstream = fs.createWriteStream(fn)
//	inStream.pipe(fwstream)
//	var buf
//	inStream.on('data', function(chunk){
//	    buf+=chunk
//	})
    
	inStream.on('data', function(buf){
	   // var msg = pb.parse(buf,'Message')
	    fs.writeFile(fn,buf,function(err){perr(err)})

	    db.run("insert into content values (?)",fn,function(err){ perr(err)})
	    broadcastPost(buf)
	})
	plog("receive post: "+fn)
    })
    conn.on("text", function (str) {
    
        console.log("Received "+str)
	sendBefore(str,conn)
//	var fn = path +  new Date().toString()
//	fs.writeFile(fn,str,function(err){perr(err)})
//	db.run("INSERT INTO content values (?)",fn,function(err){})
//        broadcastNewMsg(str);
//	conn.sendText(str.toUpperCase()+"!!!")
    })
    conn.on("close", function (code, reason) {
        console.log("Connection closed")
    })
}).listen(8001)

function perr(err){
    if(err)console.log(err)
}

function plog(str){
    if(str)console.log(str)
}
function sendPost(fn,conn){
     fs.readFile(fn,function(err,data){
	if(err){perr(err)}
	else{
	    conn.sendBinary(data)
	    }
     })
}
	    
function broadcastPost(post){
    server.connections.forEach(function(conn){
	conn.sendBinary(post)
    })
}

function broadcastNewMsg(str){
    server.connections.forEach(function (connection){
	connection.sendText(str);
	})
}

function sendAfter(startID,conn){
   
      db.each("SELECT rowid AS id, post FROM content where rowid > ? LIMIT 10",startID, function(err, row) {
	  sendPost(row.post,conn)
      console.log(row.id + ": " + row.post);
  })
}

function sendNewest(conn){
    	db.each("select rowid as id, post from content order by rowid DESC LIMIT ?", 3 ,function(err,row){
	    sendPost(row.post,conn);
	    console.log(row.id+":"+row.post);
	    })
}

// retrive records from id, send over conn 
function sendBefore(id,conn){
    	db.each("select rowid as id, post from content where rowid<? order by rowid DESC LIMIT 10", id ,function(err,row){
	    conn.sendBinary(getPost(row.post))
	    console.log(row.id+":"+row.post);
	    })
}
