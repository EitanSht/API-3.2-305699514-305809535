let DataBase = require ('./DButils.js');
let express = require('express');
let router = express.Router();

module.exports = router;
//----------------------------------------------------------------------------------------------------------------------
exports.getCartPrice = function (userNameInput) {
    return new Promise(function (resolve, reject) {
        let userName = "'" + userNameInput + "'";
        let queryCheckUser = 'Select * From UserCart WHERE UserName = ' + userName + '';
        let queryGetPrice = 'select sum(items.ItemPrice*UserCart.amount*Currency.CurrencyValue) AS Price ' +
            'from UserCart, items, Users, Currency ' +
            'where (UserCart.username = ' + userName + ' AND UserCart.ItemID = items.ItemID) ' +
            'AND ' +
            '(users.UserName = UserCart.username AND users.usercurrency = Currency.currencyName) ' +
            'AND ' +
            '(UserCart.UserName = users.UserName)';

        DataBase.Select(queryCheckUser)
            .then(function (result) {
                if (result.length >= 1) {
                    DataBase.Select(queryGetPrice)
                        .then(function (resultPrice) {
                            if (resultPrice != null) {
                                resolve(resultPrice)
                            }
                            else {
                                reject("Cart of the user: " + userName + " Was Not Found");
                            }
                        })
                        .catch(function (error) {
                            console.log(error.message);
                        });
                }
                else {
                    reject("Cart of the user: " + userName + " Was Not Found");
                }
            })
            .catch(function (error) {
                console.log(error.message);
            });
    });

};

router.get('/getcartprice', function (req, res) {
    this.getCartPrice(req.params.userName).then(function (totalPrice) {
        res.send(totalPrice);
    }, function (error) {
        res.send(error);
    });
});
//-------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------
router.post('/addtousercart', function(req, res) { // Handling in the client: When adding an item that already exists
    let userName = "'" + req.body.UserName + "'";
    let itemID = "'" + req.body.ItemID + "'";
    let itemQuantity = req.body.ItemQuantity;

    let queryCheckName = 'SELECT * FROM UserCart WHERE UserName = '+userName+'';
    let queryCheckItem = 'SELECT * FROM UserCart WHERE UserName = '+userName+' AND ItemID = '+itemID+'';
    let queryCheckItemsTable = 'SELECT ItemQuantity FROM Items WHERE ItemID = '+itemID+'';
    let query = 'INSERT INTO UserCart (UserName, ItemID, Amount) ' +
        'VALUES ('+userName+', '+itemID+', '+itemQuantity+');';

    DataBase.Select (queryCheckItemsTable)
        .then (function (resultItems){
            if( resultItems.length >= 1){
                if (itemQuantity <=  resultItems[0].ItemQuantity) {
                    DataBase.Select (queryCheckName)
                        .then (function (result){
                            if( result.length >= 1){
                                DataBase.Select (queryCheckItem)
                                    .then (function (resultItem){
                                        if( resultItem.length >= 1){
                                            DataBase.Insert (query)
                                                .then (function (resultQuery){
                                                    res.send("The Item Of User: "+userName+" Added: " + itemID + "" +
                                                        ", Quantity: " + itemQuantity);
                                                })
                                                .catch(function (error) {
                                                    console.log(error.message);
                                                });
                                        }
                                        else{
                                            res.send("Incorrect ItemID: " + itemID);
                                        }
                                    })
                                    .catch(function (error) {
                                        console.log(error.message);
                                    });
                            }
                            else{
                                res.send("Incorrect Username: " + userName);
                            }
                        })
                        .catch(function (error) {
                            console.log(error.message);
                        });
                }
                else {
                    res.send("There Are Only: "+resultItems[0].ItemQuantity+" Items Left, Select Less Items.");
                }
            }
            else{
                res.send("Item ID: "+itemID+" Was Not Found.");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------
router.put('/updateusercart', function(req, res) {
    let userName = "'" + req.body.UserName + "'";
    let itemID = "'" + req.body.ItemID + "'";
    let itemQuantity = req.body.ItemQuantity;

    let queryCheckName = 'SELECT * FROM UserCart WHERE UserName = '+userName+'';
    let queryCheckItem = 'SELECT * FROM UserCart WHERE UserName = '+userName+' AND ItemID = '+itemID+'';
    let queryCheckItemsTable = 'SELECT ItemQuantity FROM Items WHERE ItemID = '+itemID+'';
    let query = 'UPDATE UserCart SET Amount = '+itemQuantity+' WHERE UserName = '+userName+' AND ItemID = '+itemID+'';

    DataBase.Select (queryCheckItemsTable)
        .then (function (resultItems){
            if( resultItems.length >= 1){
                if (itemQuantity <=  resultItems[0].ItemQuantity) {
                    DataBase.Select (queryCheckName)
                        .then (function (result){
                            if( result.length >= 1){
                                DataBase.Select (queryCheckItem)
                                    .then (function (resultItem){
                                        if( resultItem.length >= 1){
                                            DataBase.Update (query)
                                                .then (function (resultQuery){
                                                    res.send("User Cart Of User: "+userName+" Updated: " + itemID + "" +
                                                        ", Quantity: " + itemQuantity);
                                                })
                                                .catch(function (error) {
                                                    console.log(error.message);
                                                });
                                        }
                                        else{
                                            res.send("Incorrect ItemID: " + itemID);
                                        }
                                    })
                                    .catch(function (error) {
                                        console.log(error.message);
                                    });
                            }
                            else{
                                res.send("Incorrect Username: " + userName);
                            }
                        })
                        .catch(function (error) {
                            console.log(error.message);
                        });
                }
                else {
                    res.send("There Are Only: "+resultItems[0].ItemQuantity+" Items Left, Select Less Items.");
                }
            }
            else{
                res.send("Item ID: "+itemID+" Was Not Found.");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });


});
//-------------------------------------------------------------------------------------------------------------------
router.get('/setcartcurrency', function(req, res) {
    let userName = "'" + req.query.UserName + "'";
    let currency = req.query.Currency;
    let currencyValue;

    let queryCheckName = 'SELECT * FROM UserCart WHERE UserName = '+userName+'';
    let queryGetCurrency = "SELECT CurrencyValue FROM Currency WHERE CurrencyName = '"+currency+"'";
    let querySetPrice = 'select sum(items.ItemPrice*UserCart.amount*Currency.CurrencyValue) AS Price ' +
        'from UserCart, items, Users, Currency ' +
        'where (UserCart.username = '+userName+' AND UserCart.ItemID = items.ItemID) ' +
        'AND ' +
        '(users.UserName = UserCart.username AND users.usercurrency = Currency.currencyName) ' +
        'AND ' +
        '(UserCart.UserName = users.UserName)';

    DataBase.Select (queryGetCurrency)
        .then (function (resultC){
            if( resultC.length >= 1){
                currencyValue = parseFloat(resultC[0].CurrencyValue);
            }
            else{
                res.send("The Currency Value Of: "+currency+" Was Not Found.");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });

    DataBase.Select (queryCheckName)
        .then (function (result){
            if( result.length >= 1){
                DataBase.Select (querySetPrice)
                    .then (function (resultPrice){
                        if( resultPrice.length >= 1){
                            let tempPrice;
                            if (currency == "ILS") {
                                tempPrice = resultPrice[0].Price * 1;
                                console.log(tempPrice);
                                res.send(tempPrice.toString() + " ILS");

                            }
                            else if (currency == "USD") {
                                tempPrice = resultPrice[0].Price / (3.5);
                                console.log(tempPrice);
                                res.send(tempPrice.toString() + " USD");
                            }
                            else {
                                res.send("Given Currency Should Match ILS/USD Only.");
                            }
                        }
                        else{
                            res.send("Was Unable To Get The Cart Price Of The Username: " + userName);
                        }
                    })
                    .catch(function (error) {
                        console.log(error.message);
                    });
            }
            else{
                res.send("The Cart Of The Username: " + userName + " Was Not Found.");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------
router.delete('/deletefromcart', function(req, res) {
    let userName = "'" + req.body.UserName + "'";
    let itemID = "'" + req.body.ItemID + "'";

    let queryCheckName = 'SELECT * FROM UserCart WHERE UserName = '+userName+'';
    let queryCheckItem = 'SELECT * FROM UserCart WHERE UserName = '+userName+' AND ItemID = '+itemID+'';
    let queryCheckItemsTable = 'SELECT ItemQuantity FROM Items WHERE ItemID = '+itemID+'';
    let query = 'DELETE FROM UserCart WHERE UserName = '+userName+' AND ItemID = '+itemID+'';

    DataBase.Select (queryCheckItemsTable)
        .then (function (resultItems){
            if( resultItems.length >= 1){
                DataBase.Select (queryCheckName)
                    .then (function (result){
                        if( result.length >= 1){
                            DataBase.Select (queryCheckItem)
                                .then (function (resultItem){
                                    if( resultItem.length >= 1){
                                        DataBase.Delete (query)
                                            .then (function (resultQuery){
                                                res.send("ItemID: "+itemID+" Was Deleted.");
                                            })
                                            .catch(function (error) {
                                                console.log(error.message);
                                            });
                                    }
                                    else{
                                        res.send("Incorrect ItemID: " + itemID);
                                    }
                                })
                                .catch(function (error) {
                                    console.log(error.message);
                                });
                        }
                        else{
                            res.send("Incorrect Username: " + userName);
                        }
                    })
                    .catch(function (error) {
                        console.log(error.message);
                    });
            }
            else{
                res.send("Item ID: "+itemID+" Was Not Found.");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
