const express = require('express');
const Datastore = require('nedb');
const shortId = require('shortid');
const path = require('path');
const morgan = require('morgan');
const app = express();

app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

const db = new Datastore({ 
  filename: path.resolve(__dirname, 'Database','shorturl.db' ), 
  autoload: true 
});

app.get('/', (req, res) => {
  res.status(200).render(`index`);
});

app.get('/s/:short', (req, res) => {
  let id = req.url.slice(3);
  db.findOne({_id: id}, (err, doc) => {
    if(err){
      res.status(500).send('Internal error');
    }else{
      if(doc){
        res.redirect(doc.fullurl);
      }else{
        res.status(404).end();
      }
    }
  });
});

app.post('/shorturl', (req, res) => {

  db.findOne({ fullurl: req.body.fullurl}, (err, doc) => {
    if(err){
      res.status(404).render('newurl', { shorturl: 'deu ruim'})
    }else{
      if(doc){
        res.status(200).render(`newurl`, { 
          fullurl: doc.fullurl, 
          shorturl: doc.shorturl 
        });
      }else{
        let _id  = shortId.generate();

        let newDoc = {
          fullurl: req.body.fullurl,
          shorturl: `http://${req.headers.host}/s/${_id}`,
          _id
        }

        db.insert(newDoc, (err) => {
          if(err){
            res.status(500).redirect('/');
          }else{
            globalUrl = newDoc.shorturl;
            res.status(200).render(`newurl`, { 
              fullurl: newDoc.fullurl, 
              shorturl: newDoc.shorturl 
            });
          }
        });
      }
    }
  });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, (req, res) => {
  console.log(`server running on http://localhost:${PORT}`);
});