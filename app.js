require("dotenv").config();
const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const mongoose = require("mongoose")
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// const csrf = require('csurf');
const errorController = require('./controller/error');
const User = require('./modals/user');
// const User = require('../modals/user')
const multer = require('multer');



const MONGODB_URI = "mongodb+srv://kirtisri2002:kirtiAs54321@cluster0.5l7s2cy.mongodb.net/products?retryWrites=true&w=majority"
const app = express();
const store = new MongoDBStore({
   uri: MONGODB_URI,
   collection:'sessions'
});

// const csrfProtection = csrf();

try {
    var fileStorage = multer.diskStorage({
        destination: (req,file,cb)=> {
            cb(null,'images');
        },
        filename: (req,file,cb) => {
            console.log('line26',file);
            cb(null,new Date().getTime() + '-' + file.originalname);
        }
    });
    
     var fileFilter = (req,file,cb)=> {
        if(file.mimetype ==='image/jpeg'||file.mimetype ==='image/png' || file.mimetype ==='image/jpg'  || file.mimetype === 'application/pdf'){
        cb(null,true);
    } 
    else {
        console.log('i m here line 35')
        cb(null,false);}
    }
} catch(err){
    console.log(err)
}


app.set('view engine', 'ejs');
app.set('views','views');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname,"images")));

const authRoutes = require('./routes/auth');
const invoiceRoutes = require('./routes/invoices');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

try{

app.use(multer({storage:fileStorage , fileFilter: fileFilter }).single('file'))
} catch (err){
    console.log(err,'line')
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'my secret', resave:false, saveUninitialized: false,store:store}));

// app.use(csrfProtection);
app.use((req,res,next)=>{
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});
app.use((req,res,next) => {
    res.locals.isAuthenticated = req.session.isLogeedIn;
    // res.locals.csrfToken = req.csrfToken();
    next();
});

app.use( authRoutes);
app.use( invoiceRoutes);
app.use(errorController.get404);

console.log('start main server !!--- ');

mongoose.connect(MONGODB_URI)
.then(result => {
    app.listen(4000);
}).catch(err =>{
    console.log(err)
})

