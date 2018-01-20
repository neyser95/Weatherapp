var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    request    = require("request");

var data = undefined;    
var err  = undefined;
var code = undefined;

app.use(express.static('public'));    
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/", function(req, res){
    res.render("index", {data: data, err: err, code: code});
    
});

app.post("/", function(req, res){
    
    var cityName = req.body.city;
    
    request('http://api.openweathermap.org/data/2.5/weather?q=' + cityName +'&APPID=AddAPIKey', function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body),
                fah  = Math.floor(Number(data["main"]["temp"]) * 9/5 - 459.67);
                
            res.render("index", {data: data, cityName: cityName, fah: fah, err: err, code: code}, function(err, html){
                if(!err){
                    res.send(html);
                }else{
                    
                    console.log(err);
                    res.send(response);
                    
                }
                
            });
        }else {
            
            data = JSON.parse(body);
            
            var err  = error,
                code = data["cod"],
                mess = data["message"];
                
            res.render("index", {data: data, err: err, mess: mess, code: code}, function(err, html){
                if(!err){
                    res.send(html);
                }else{
                    console.log(err);
                    res.send(response);
                    
                }
            });
            
             console.log(err);
             
        }
    });
    
});

app.listen(process.env.PORT, process.env.IP, function(){
    
   console.log("Server Started"); 
    
});