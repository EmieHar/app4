
const express = require('express');
const router = new express.Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const session = require('express-session');

router.use(session({
    secret: 'une phrase sel pour le hash',
    resave: true, 
    saveUninitialized: true,
    cookie: {maxAge:6000}

}));


router.get('/', (req, res) => {
    res.render("inscription")
})

router.post('/enregistrer', function(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;

let salt = bcrypt.genSaltSync(10)   
let hashpassword =   bcrypt.hashSync(password, salt)

   User.findOne({email:email}).then((user)=>{

       if(!user){


           let newUser = new User ({
                                       email:email,
                                       password:hashpassword,
                                       firstname:firstname,
                                       lastname:lastname
                                   })
           newUser.save()
           .then((user)=>{
               console.log('New user created:', user);
               res.json({ message: 'User created successfully' });
           })
           .catch((error) => {
               console.error('Error creating user:', error);
               res.status(500).json({ error: 'Error creating user' });
             })
        
       }else{
        console.log("email existe")
        res.json({ message: 'email existant' });
       } 
    }).catch((err)=>{
        console.log(err)
    })
    
})

router.get('/connection', (req, res)=>{
    res.render("connection")
})

router.post('/seconnecte', (req, res)=>{

    let email = req.body.email;
    let password = req.body.password;

    let verifemail = User.findOne({email:email})
                        .then((user)=>{
                            if(user){
                               if(bcrypt.compareSync(password, user.password))
                               {

                                    req.session.id = user.id
                                    req.session.email = user.email
                                    req.session.firstname = user.firstname
                                    req.session.lastname = user.lastname

                                res.render('accueil', {session: req.session})



                               }else{
                                    console.log("mauvais mot de passe")
                               }
                                 
                            }else{
                                console.log("mauvais mail")
                            }
                        })
                        .catch((err)=>{
                            console.log(err)
                        })

    

})

router.get('/logout', (req, res) => {
        req.session.destroy(function(err){
             res.render('connection')
        })
})

module.exports = router;
