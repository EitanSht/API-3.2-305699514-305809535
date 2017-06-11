let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');
let DataBase = require('./DBUtils');
let Connection = require('tedious').Connection;
let router = express.Router();
let app = express();

// Local Libraries
let Items = require('./Items');
let Users = require('./Users');
let Orders = require('./Orders');
let Cart = require('./Cart');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//------------------------------------  S E R V E R   C O N F I G  -----------------------------------------------------
let config = {
    userName: 'adminlogin',
    password: 'Eitan2703',
    server: 'shopdbserver.database.windows.net',
    requestTimeout: 15000,
    options: {encrypt: true, database: 'Shop'}
};
//----------------------------------------------------------------------------------------------------------------------
app.use(function (req, res, next) {
    let cookie = req.body.cookie;
    let query = "select * From Login WHERE UserName= '"  + (cookie) + "' AND Cookie ='true'";
    console.log(req.body);
    if (!cookie)
    {
        console.log("There is no cookie to this user");
        req.exist=false;
        next('route');
        return;
    }
    console.log(query);
    DataBase.Select(query)
        .then (function (result){
            if (1==result.length)
            {
                console.log(result);
                req.userName= result[0].UserName;
                req.exist=true;
            }
            else
                req.exist=false;
            next('route');
        })
        .catch(function (error) {
            console.log(error.message);
            res.sendStatus(400);
        });
});
//-------------------------------------------------------------------------------------------------------------------
let connection = new Connection(config);
let connected = false;
connection.on('connect', function(err) {
    if (err) {
        console.error('Error Connecting: ' + err.message);
    }
    else {
        console.log(">> Connected To Microsoft Azure");
        connected = true;
    }
});

app.use(function(req, res, next){
    if (connected)
        next();
    else
        res.status(503).send('Server Is Down');
});
//-------------------------------------------------------------------
let server = app.listen(4000, function () {
    let port = server.address().port;

    app.use('/', router);
    app.use('/Items', Items);
    app.use('/Users', Users);
    app.use('/Orders', Orders);
    app.use('/Cart', Cart);
    console.log(">> Server listening at port: %s", port) ;
}) ;
