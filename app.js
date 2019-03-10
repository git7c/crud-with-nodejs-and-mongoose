const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const twig = require('twig');
const app = express();
const MONGODB_URL = 'mongodb://localhost:27017/mongoose';
const Post = require('./models/post');

// SET VIEW ENGINE and VIEWS
app.set('view engine', 'html');
app.engine('html', twig.__express);
app.set('views','views');

// APPLY BODY-PARSER MIDDLEWARE
app.use(bodyParser.urlencoded({extended:false}));

// HOME PAGE
app.get('/', (req, res) => {
    // FETCH ALL POST FROM DATABASE
    Post.find()
    // SET descending ORDER BY createdAt
    .sort({createdAt: 'descending'})
    .then(result => {
        if(result){
            // RENDERING HOME VIEW WITH ALL POST
            res.render('home',{
                allpost:result
            });
        }
    })
    .catch(err => {
        if (err) throw err;
    }); 
});


// INSERT POST
app.post('/', (req, res) => {
    new Post({
        title:req.body.title,
        content:req.body.content,
        author_name:req.body.author
    })
    .save()
    .then(result => {
        res.redirect('/');
    })
    .catch(err => {
        if (err) throw err;
    });
});


// EDIT POST
app.get('/edit/:id', (req, res) => {

    Post.findById(req.params.id)
    .then(result => {
        if(result){
            res.render('edit',{
                post:result
            });
        }
        else{
            res.redirect('/');
        }
    })
    .catch(err => {
        res.redirect('/');
    });
});

// UPDATE POST
app.post('/edit/:id', (req, res) => {
    Post.findById(req.params.id)
    .then(result => {
        if(result){
            result.title = req.body.title;
            result.content = req.body.content;
            result.author_name = req.body.author;
            return result.save();
        }
        else{
            console.log(err);
            res.redirect('/');
        }
    })
    .then(update => {
        res.redirect('/');
    })
    .catch(err => {
        res.redirect('/');
    });
});

// DELETE POST
app.get('/delete/:id', (req, res) => {
    Post.findByIdAndDelete(req.params.id)
    .then(result => {
        res.redirect('/');
    })
    .catch(err => {
        console.log(err);
        res.redirect('/');
    })
});

// IF DATABASE CONNECTION IS SUCCESSFULLY THEN RUN APP on PORT 3000
mongoose.connect(MONGODB_URL, {useNewUrlParser: true}).then(result => {
    app.listen(3000);
}).catch(err => {
    if (err) throw err;
});
