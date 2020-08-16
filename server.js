// impoerting different modules
const {globalVariables} = require('./config/configuration');

const passport = require('passport');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const expresshandlebars = require('express-handlebars');
const {mongoDbUrl} = require('./config/configuration');
const {PORT} = require('./config/configuration');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const mongoStore = require("connect-mongo")(session);
const {selectOption} = require('./config/customFunctions');
// const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');



const app = express();

// configure mongoose to connect to mongoDB
mongoose.connect(mongoDbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(response =>{
        console.log('mongoDB connected successfully.');
    }).catch(err =>{
        console.log('Database connection failed.');
    })


// configure express
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



app.use(cookieParser());


// flash and session
app.use(session({
    secret: 'zacks1',
    saveUninitialized: true,
    resave: true,
    store: new mongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
        maxAge: 180 * 60 * 1000
      }


}));


//initialize passport
app.use(passport.initialize());
app.use(passport.session());

// global variable
app.use(flash());
app.use(globalVariables);


  

// fileupload
// app.use(fileUpload());


// setup view engine to use handlebars
app.engine(
    ".hbs",
    expresshandlebars({
      defaultLayout: "default",
      helpers: {select: selectOption},
      extname: ".hbs"
    })
  );
  app.set("view engine", ".hbs");


// method override middleware
app.use(methodOverride('newMethod'));




// Route grouping
const defaultRoutes = require('./routes/defaultRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use("/", defaultRoutes);
app.use("/admin", adminRoutes);











app.listen(PORT, () =>{
    console.log(`app started at port ${PORT}`);
});