/*
Kod: Jenny Enckell 17TS

Kommentarer:
  Har problem med renderingen av bilder på sidan, annars renderas namn och länk helt okej (Style kring detta måste fixas!)
  Då det tog extremt lång tid att få något som överhuvudtaget renderar och har funktioner har
  stylesheet och ljudet som skulle spelas i bakgrunden inte fixats ordentligt.
  Behöver en genomgång av hur view-engines bör hanteras samt lite om form-elementet.
*/

const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const mysql = require('mysql');
const errorhandler = require('errorhandler');
const bodyParser = require('body-parser');

//databsen testJul har kolumnerna "id", "name", "image_name" och "link"
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'testJul'
});

//Importera funktioner för att slumpa julklapp, hämta sidan för inlägg i databasen samt att lägga till i databas.
const {generateGift ,getPostPage, postGift} = require('./routes/giftGen.js');

// Koppla till db
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;

//Set view engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//Middleware setup
app.use(express.urlencoded())
app.use('/', router);
app.use(bodyParser.urlencoded({extended: true}));
app.use(errorhandler());


//Hämta Index-sidan
app.get('/', function(req, res) {
	var itemList = [];



	// Hämta alla julklappar och rendera på index-sidan
	db.query('SELECT * FROM items', function(err, rows, fields) {
	  	if (err) {
	  		res.status(500).json({"status_code": 500,"status_message": "internal server error"});
	  	} else {

	  		// Kolla igenom all data i tabellen
	  		for (var i = 0; i < rows.length; i++) {

	  			// Skapa ett objekt för datan
		  		var items = {
		  			'name':rows[i].name,
		  			'image_name':rows[i].image,
		  			'link':rows[i].link,
		  		}
		  		// Lägg till hämtad data i en array
		  		itemList.push(items);
	  	}

	  	// Rendera index.pug med objekten i listan
	  	res.render('index', {itemList: itemList});
	  	}
	});

	// Stäng MySQL
	db.end();

});




app.get("/gift", (req,res) => { generateGift(req,res)});
app.get("/post", (req,res) => { getPostPage(req,res)});
app.post("/post", (req,res) => { postGift(req,res)});

//Sätt views som default-mapp för rendering
app.use(express.static(__dirname + '/views'));


//Lyssna på localhost:3000
app.listen(3000);

console.log('Running at Port 3000');
