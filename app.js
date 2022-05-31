const express = require('express');

const app = express();

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Sadio:Coulibali25@cluster0.ys7kmsw.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.post('/api/auth/login',(req,res,next)=> {
    console.log(req.body);
    res.status(201).json({
        message:'Utilisateur connecté !'
    });
})
app.get('/api/auth/login',(req,res,next) => {
    const login =[
    { 
        email:'user@domaine.com',
        password :'jhudyg5ml'

    }
];

res.status(200).json(login)
});
   
  
 

module.exports = app;