var express = require('express');
var app = express();
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('db/datatilt.db');
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(request, response){
    response.send('Hello, Word');
});

app.get('/datatilt', function(request, response){
    console.log("GET request received at /datatilt");
    db.all('SELECT * FROM datatilt', function(err, rows){
        if(err){
            console.log("Error: " + err);
        }
        else{
            response.send(rows);
        }
    }); 
});

app.post('/datatilt', function(request, response){
    console.log("Post request received at /datatilt");
    db.run('INSERT INTO datatilt VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [request.body.lname, request.body.fname, 
        request.body.Fridgename, request.body.WashingMachinename, 
        request.body.TVname, request.body.Freezername, 
        request.body.Dishwashername, request.body.InductionStovename, 
        request.body.SmallLightname, request.body.BigLightname], function(err){
            if(err){
                console.log("Error: " + err);
            }
            else{
                response.status(200).redirect('hello.html');
            }
        });
});

app.listen(3000, function(){
    console.log("Server is running on port 3000");
});