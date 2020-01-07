const fs = require('fs');

module.exports = {

  //Hämta en slumpad julklapp från databasen baserat på dess ID och rendera en sida med den
  generateGift: (req, res) => {
    var randIndex = Math.floor(Math.random() * 11);

    let query = "SELCET * from items WHERE id='?'";
    let message = "something went wrong!";

        db.query(query, (err, result) => {
            if (err) {
              res.render('index.pug', message);
            }
            else {
              res.render('gift.pug', {
                name: json.stringify(result.name),
                image_name: json.stringify(result.image_name),
                link: json.stringify(result.link)

              });
            }


        });
  },

  getPostPage: (req, res) => {
    res.render('postGift.pug');
  },

  postGift: (req, res) => {
    if (!req.files) {
        return res.status(400).send("No files were uploaded.");
    }

    let message = '';
    let name = req.body.name;
    let link = req.body.link;
    let uploadedFile = req.files.image;
    let image_name = uploadedFile.name;

    let nameQuery = "SELECT * FROM `items` WHERE name = '" + name + "'";

    db.query(nameQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (result.length > 0) {
            message = "Name already exists in db"
            res.render('postGift.pug' , message);
        } else {
            // check the filetype before uploading it
            if (uploadedFile.mimetype === 'image/jpeg') {
                // upload the file to the /public/assets/img directory
                uploadedFile.mv(`public/images/${image_name}`, (err ) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    // send to database
                    let query = "INSERT INTO `items` (name, image, link) VALUES ('" +
                        name + "', '" + image_name + "', '" + link + "')";
                    db.query(query, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('back');
                    });
                });
            } else {
                message = "Invalid File format.";
                res.render('postGift.pug', message);
            }
        }
    });
  }


};
