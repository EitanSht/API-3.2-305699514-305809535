let DataBase = require ('./DButils.js');
let express = require('express');
let router = express.Router();

module.exports = router;
//----------------------------------------------------------------------------------------------------------------------
router.get('/getorderdatevalidation', function(req, res) {
    let orderdate = "'" + req.query.req.query.orderdate + "'";
    let shipmentdate = "'" + req.query.shipmentdate + "'";
    let query = 'Select * from Orders WHERE  (DATEDIFF ( day, '+orderdate+', '+shipmentdate+') >= 7 )';

    DataBase.Select (query)
        .then (function (result){
            if( result.length >= 1){
                res.send(result)
            }
            else{
                res.send("Problem In Data, Check Order Date And/Or Shipment Date.");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//----------------------------------------------------------------------------------------------------------------------
router.delete('/canceluserorder', function(req, res) {
    let userName = "'" + req.query.UserName + "'";
    let orderID = req.query.OrderID;
    let queryCheck = 'Select * from Orders WHERE (OrderID = '+orderID+' AND UserName ='+userName+')';
    let queryDeleteOrder = 'DELETE FROM Orders WHERE (OrderID = '+orderID+' AND UserName ='+userName+')';
    let queryDeleteItemsInOrder = 'DELETE FROM ItemsInOrder WHERE (OrderID = '+orderID+')';

    DataBase.Select (queryCheck)
        .then (function (result){
            if( result.length >= 1){
                DataBase.Delete (queryDeleteOrder)
                    .then (function (resultDelete){
                        console.log("Order Deleted");
                        DataBase.Delete (queryDeleteItemsInOrder)
                            .then (function (resultDeleteItems){
                                console.log("Items Deleted");
                                res.send(resultDeleteItems)
                            })
                            .catch(function (error) {
                                console.log(error.message);
                            });
                    })
                    .catch(function (error) {
                        console.log(error.message);
                    });
            }
            else{
                res.send("Incorrect Username Or OrderID.");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//----------------------------------------------------------------------------------------------------------------------
router.post('/SetUserOrder', function (req, res) {
    getNewOrderId().then(function(orderId){
        let orderDetails = req.body.OrderDetails;
        getCartPrice(orderDetails.userName).then(function (totalPrice) {
            let query = "INSERT INTO orders (ORDERDATE, OrderShipmentDate , ORDERID, USERNAME, USERADDRESS, " +
                "USERCREDITCARD, ORDERTOTALPRICE, USERCURRENCY) VALUES (" +
                "'" + "" +"', " +
                "'" + "" +"', " +
                "'" + orderId +"', " +
                "'" + orderDetails.userName + "', " +
                "'" + orderDetails.userAddress + "', " +
                "'" + orderDetails.creditCard + "', " +
                "'" + totalPrice[0].Price + "', " +
                "'" + orderDetails.userCurrency + "');";
            DataBase.Insert(query).then(function () {
                res.send("order completed");
            }, function () {
                res.send("Order not completed");
            });
        });
    });
});
//----------------------------------------------------------------------------------------------------------------------
getCartPrice = function (userNameInput) {
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
//----------------------------------------------------------------------------------------------------------------------
getNewOrderId = function(){
    return new Promise(function(resolve, reject){
        let query = "SELECT MAX(orderId) From orders";
        DataBase.Select(query).then(function (answer){
            resolve(answer[0][""] + 1);
        });
    });
};
//----------------------------------------------------------------------------------------------------------------------
