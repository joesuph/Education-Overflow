const express = require('express')
const path = require('path')
const {Pool, Client} = require('pg'); 
const PORT = process.env.PORT || 5000
const connectionString = 'postgres://qbvuctkdcmsyaa:ddb9775efa8242e0a10f6b4f710540b2678ddf64c7ea00178e5f820b5b685590@ec2-54-221-243-211.compute-1.amazonaws.com:5432/d5qprouao3u0ih?ssl=true';
const pool = new Pool({connectionString: connectionString});

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', function(req, res) {res.render('pages/tableView.ejs',{tableHeader: "Majors"});})
  .get("/majors",function(req,res){res.render('pages/tableView.ejs',{tableHeader: "Classes"});})
  .get("/classes",function(req,res){res.render('pages/tableView.ejs',{tableHeader: "Topics"});})
  .get("/topics",function(req,res){
    var  infoGrabber = require('./processing/getTopicInfo.js');
    infoGrabber.getInfo(req,res,pool);
  })
  .get("/buildpage",function(req,res){
    res.render("pages/createPage.ejs");
  })
  .get("/submitpage",function(req,res){
    console.log("right before query");
    pool.query("INSERT INTO topics(host,class,name,timeestimation,xml)values(1," + req.query.classid + ",'unnamed',2,'"+ req.query.pd+"')",function(err,result){
                                                        console.log("INSERT INTO topics (host,class,name,timeestimation,xml) values(1," + req.query.classid + 
                                                        ",'unnamed',2,'"+ req.query.pd+"')");
                                                        console.log(err);
                                                      });   
    res.render('pages/tableView.ejs',{tableHeader: "Majors"});
  })
  .get("/filter",function(req,res){
    var  filter = require('./processing/filter.js');
    var query = req.query;
    filter.filter(query,pool, res)})
  
  .get("/addAddition",function(req,res){
    var itemAdder = require('./processing/addNewItem.js');
    var layer = req.query.layer;
    itemAdder.addItem(layer,req,res,pool);
  })
  /*********************************************
   * Returns message whether major exists in
   * database and if it does not, we add it.
   ********************************************/

.get("/addItem",function(req,res){
  res.render("partials/addItemRenderer.ejs",{req});
})

  .listen(PORT, () => console.log(`Listening on ${ PORT }`))