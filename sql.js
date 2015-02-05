var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database(':memory:');
var db = new sqlite3.Database('MyTestDB.db');
 
db.serialize(function() {
  db.run("CREATE TABLE if not exists content(post TEXT)");
 
  var stmt = db.prepare("INSERT INTO content valuES (?)");
  for (var i = 0; i < 10; i++) {
      stmt.run("post " + i);
  }
  stmt.finalize();
 
  db.each("SELECT rowid AS id, post FROM content", function(err, row) {
      console.log(row.id + ": " + row.post);
  });
});
 
db.close();
