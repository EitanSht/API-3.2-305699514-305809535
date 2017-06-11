let DataBase = require ('./DButils.js');
let express = require('express');
let router = express.Router();

module.exports = router;
//-------------------------------------------------------------------------------------------------------------------
router.get('/getitems', function (req,res) {
    let query = 'Select * from Items';

    DataBase.Select (query)
        .then (function (result){
            res.send(result)
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.get('/getitemsbycategory', function(req, res) {
    let category = "'" + req.query.CategoryID + "'";
    let query = 'Select * from Items WHERE CategoryID = '+category+'';

    DataBase.Select (query)
        .then (function (result){
            if( result.length >= 1){
                res.send(result)
            }
            else{
                res.send("The Category:" + category +" Does Not Exist.");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.get('/getitembyid', function(req, res) {
    let item = "'" + req.query.ItemID + "'";
    let query = 'Select * from Items WHERE ItemID = '+item+'';

    DataBase.Select (query)
        .then (function (result){
            if( result.length >= 1){
                res.send(result)
            }
            else{
                res.send("The ItemID:" + item +" Does Not Exist.");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.get('/getitembyname', function(req, res) {
    let itemName = "'" + req.query.ItemName + "'";
    let query = 'Select * from Items WHERE ItemName = '+itemName+'';

    DataBase.Select (query)
        .then (function (result){
            if( result.length >= 1){
                res.send(result)
            }
            else{
                res.send("The Item:" + itemName +" Does Not Exist.");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.get('/getrecentitems', function(req, res) {
    let query = 'Select * from Items WHERE DateAdded >= DATEADD(month,-1,GETDATE()) ORDER BY DateAdded';

    DataBase.Select (query)
        .then (function (result){
            if( result.length >= 1){
                res.send(result)
            }
            else{
                res.send("Error Occured.");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.get('/gettrending', function(req, res) {

    let query = 'select TOP 5 itemid, sum(amount) AS TotalAmount from itemsinorder ioo WHERE ioo.orderid in ' +
        '(select orderid from orders ' + 'WHERE OrderDate >= DATEADD(week,-1,GETDATE())) GROUP BY itemid ' +
        'ORDER BY TotalAmount DESC';

    DataBase.Select (query)
        .then (function (result){
            if( result.length >= 1){
                res.send(result)
            }
            else{
                res.send("Error Occured.");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.get('/getrecommended', function(req, res) {
    let userName = "'" + req.query.UserName + "'";

    let query = 'select * from items where ' +
        '(items.CategoryID ' +
        'in(select ClientCategories.categoryid from ClientCategories where username = '+userName+' ' +
        'AND ' +
        'ClientCategories.categoryid ' +
        'in (select items.categoryid from items where items.itemid ' +
        'in (select iio.itemid from itemsinorder iio GROUP BY iio.itemid)))) ' +
        'AND ' +
        '(items.itemid in (select io.itemid from itemsinorder io))';

    DataBase.Select (query)
        .then (function (result){
            if( result.length >= 1){
                res.send(result)
            }
            else{
                res.send("Error Occured While Searching For Recommended Items For: " + userName);
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.get('/getcategories', function(req, res) {
    let query = 'Select CategoryName from Categories ';

    DataBase.Select (query)
        .then (function (result){
            if( result.length >= 1){
                res.send(result)
            }
            else{
                res.send("Error Occured");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.get('/getitemidbyname', function(req, res) {
    let itemName = "'" + req.query.ItemName + "'";
    let query = 'Select ItemID FROM Items WHERE ItemName = '+itemName+'';

    DataBase.Select (query)
        .then (function (result){
            if( result.length >= 1){
                res.send(result)
            }
            else{
                res.send("The Item Was Not Found: " + itemName);
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------
router.delete('/deleteitem', function(req, res) {
    let itemID = req.body.ItemID;

    let queryCheckUser = 'SELECT * FROM Items WHERE (ItemID = '+itemID+')';
    let queryDelete = 'DELETE FROM Items WHERE ItemID = '+itemID+'';

    DataBase.Select (queryCheckUser)
        .then (function (result){
            if( result.length >= 1){
                DataBase.Delete (queryDelete)
                    .then (function (resultDelete){
                        res.send("Item Deleted: " + itemID);
                    })
                    .catch(function (error) {
                        console.log(error.message);
                    });
            }
            else{
                res.send("Item ID Incorrect: " + itemID);
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------
router.put('/updateitemstock', function(req, res) {
    let itemID = req.body.ItemID;
    let itemQuantity = "'" + req.body.ItemQuantity + "'";

    let queryCheckUser = 'SELECT * FROM Items WHERE itemID = '+itemID+'';
    let queryUpdate = 'UPDATE Items SET ItemQuantity = '+itemQuantity+' WHERE ItemID = '+itemID+'';

    DataBase.Select (queryCheckUser)
        .then (function (result){
            if( result.length >= 1){
                DataBase.Update (queryUpdate)
                    .then (function (resultUpdate){
                        res.send("Item Quantity Updated TO: " + itemQuantity);
                    })
                    .catch(function (error) {
                        console.log(error.message);
                    });
            }
            else{
                res.send("Item ID Incorrect: " + itemID);
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.post('/AddItemToInventory',function (req,res) {
    let newItem = req.body.item;
    this.checkIfItemExists(newItem.itemID).then(function(ok){
        let newItemQuery;
        if (ok) {
            res.send(false);
        } else {
            newItemQuery= "INSERT INTO Items VALUES('"+ newItem.itemID  +
                "','"+newItem.categoryId  +
                "','"+newItem.comanyId  +
                "','"+newItem.itemName  +
                "','"+newItem.itemDescription  +
                "','"+newItem.itemPrice  +
                "','"+newItem.itemQuantity +
                "','"+newItem.itemPicturePath +
                "','"+newItem.dateAdded + "');";

            DataBase.Insert(newItemQuery).then(function (success){
                res.send(true);
            },function (failed) {
                res.send(false);
            });
        }
    });
});
//-------------------------------------------------------------------------------------------------------------------
router.put('/setItemdetailes', function (req, res) {
    let itemToUpdate = req.body.item;

    this.checkIfItemExists(itemToUpdate.itemID).then(function (isItemExists) {
        let queryOfItemToUpdate;
        if(isItemExists) {
            queryOfItemToUpdate = "UPDATE items SET itemID='" + itemToUpdate.itemID +
                "', categoryId='" + itemToUpdate.categoryId +
                "', comanyId ='" + itemToUpdate.comanyId  +
                "', itemName='" + itemToUpdate.itemName +
                "', itemDescription='" + itemToUpdate.itemDescription +
                "', itemPrice='" + itemToUpdate.itemPrice +
                "', itemQuantity='" + itemToUpdate.itemQuantity +
                "', itemPicturePath='" + itemToUpdate.itemPicturePath +
                "' WHERE itemID= '" + itemToUpdate.itemID + "'";

            DataBase.Update(queryOfItemToUpdate).then(function (isItemUpdate) {
                if (isItemUpdate) {
                    res.send(true);
                }
                else {
                    res.send(false);
                }
            });
        }
    });
});
//-------------------------------------------------------------------------------------------------------------------
exports.checkIfItemExists = function (itemID) {
    return new Promise(function(resolve,reject) {
        let queryCheckItem = "SELECT * FROM Items WHERE (ItemID = '" + itemID + "')";

        DataBase.Select(queryCheckItem)
            .then(function (result) {
                if (result.length >= 1) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, function(err){
                reject(err);
            });
    });
};
//-------------------------------------------------------------------------------------------------------------------
