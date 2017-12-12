var express = require('express');
var app = express();
var router = express.Router();
var xml2js = require('xml2js');
var apikey = "SEXTJPXWV94X65Q2";


//for post
var request = require('request');

//for parsing data in ajax post
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.use('/',router);
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var path = __dirname + '/views/';
  
router.get('/',function(req, res){
  res.sendFile(path + 'index.html');
});

router.get('/indicatorCharts',function(req, res){
  res.sendFile(path + 'indicator-charts.html');
});

router.get('/autocomplete', function(req, res) {
  request({
	 uri: 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input='+req.query.symbol,
  }).pipe(res);
});

router.get('/stockdetails', function(req, res) {
  request({
    uri: 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+req.query.symbol+'&outputsize=full&apikey='+apikey,
  }).pipe(res);
});


router.get('/newsfeed', function(req, res) {
  var url= 'https://seekingalpha.com/api/sa/combined/'+req.query.symbol+'.xml';
  var extractedData = "";
  var parser = new xml2js.Parser();
  
    request({ url: url}, function (err, response, body) {
	parser.parseString(body, function(err,result){
		  extractedData = result;
		  res.send(extractedData);
	});
	
  });
});

router.get('/indicatorData', function(req, res) {
  request({
    uri: 'https://www.alphavantage.co/query?function=' + req.query.indicator + '&symbol=' + req.query.symbol + '&interval=daily&time_period=10&series_type=close&apikey=' + apikey,
  }).pipe(res);
  
});


  
app.listen(8080,function(){
  console.log("Server running at Port 8080");
});