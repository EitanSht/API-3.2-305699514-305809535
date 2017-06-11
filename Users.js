let DataBase = require ('./DButils.js');
let express = require('express');
let router = express.Router();

module.exports = router;
//-------------------------------------------------------------------------------------------------------------------

router.get('/getitemsbycategory', function (req, res) {
    let category = "'" + req.query.CategoryID + "'";
    let query = 'Select * from Items WHERE CategoryID = ' + category + '';

    DataBase.Select(query)
        .then(function (result) {
            if (result.length >= 1) {
                res.send(result)
            }
            else {
                res.send("The Category:" + category + " Does Not Exist.");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.get('/GetUsers', function (req, res) {
    let query = 'Select * from Users';

    DataBase.Select(query)
        .then(function (result) {
            res.send(result)
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.get('/login', function (req, res) {
    let user = "'" + req.query.UserName + "'";
    let pass = "'" + req.query.UserPassword + "'";
    let query = 'Select UserName from Users WHERE UserName = ' + user + ' AND UserPassword = ' + pass + '';
    let updateCookie = "UPDATE Users SET Cookie = 'true' WHERE UserName = " + user + " AND UserPassword = " + pass + "";
    let cartQuery = 'select itemID, amount from UserCart WHERE UserName = ' + user + '';

    /*
     SAVE COOKIE IN THE USER PC HERE
     */

    DataBase.Select(query)
        .then(function (result) {
            if (result.length >= 1) {
                DataBase.Select(cartQuery)
                    .then(function (cartResult) {
                        DataBase.Update(updateCookie)
                            .then(function (cResult) {
                                console.log("Cookie Updated.");
                            })
                            .catch(function (error) {
                                console.log("Could Not Update User Cookie.");
                                console.log(error.message);
                            });
                        if (cartResult.length >= 1) {

                            res.send(cartResult)
                        }
                        else {
                            console.log("Cart Is Empty For Usename: " + user);
                            res.send("Cart Is Empty For Usename: " + user);
                        }
                    })
                    .catch(function (error) {
                        console.log(error.message);
                    });
            }
            else {
                res.send("Username Or Password Incorrect");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.get('/getanswer', function (req, res) {
    let user = "'" + req.query.UserName + "'";
    let quest = "'" + req.query.UserQuestion + "'";
    let query = 'Select UserAnswer from Users WHERE UserName = ' + user + ' AND UserQuestion = ' + quest + '';

    DataBase.Select(query)
        .then(function (result) {
            if (result.length >= 1) {
                res.send(result)
            }
            else {
                res.send("Username Or User Question Incorrect");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.get('/getusercurrency', function (req, res) {
    let user = "'" + req.query.UserName + "'";
    let query = 'Select UserCurrency from Users WHERE UserName = ' + user + '';
    DataBase.Select(query)
        .then(function (result) {
            res.send(result)
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.get('/getuserdetails', function (req, res) {
    let user = "'" + req.query.UserName + "'";
    let query = 'Select * from Users WHERE UserName = ' + user + '';

    DataBase.Select(query)
        .then(function (result) {
            if (result.length >= 1) {
                res.send(result)
            }
            else {
                res.send("Username Incorrect.");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.get('/getuserpassword', function (req, res) {
    let user = "'" + req.query.UserName + "'";
    let quest = "'" + req.query.UserQuestion + "'";
    let answer = "'" + req.query.UserAnswer + "'";
    let query = 'Select UserPassword from Users WHERE UserName = ' + user + ' AND UserQuestion = ' + quest + ' ' +
        'AND UserAnswer = ' + answer + '';

    DataBase.Select(query)
        .then(function (result) {
            if (result.length >= 1) {
                res.send(result)
            }
            else {
                res.send("Username, User Question Or User Answer Are Incorrect.");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.get('/getusername', function (req, res) {
    let email = "'" + req.query.UserEmail + "'";
    let quest = "'" + req.query.UserQuestion + "'";
    let answer = "'" + req.query.UserAnswer + "'";
    let query = 'Select UserName from Users WHERE UserEmail = ' + email + ' AND UserQuestion = ' + quest + ' ' +
        'AND UserAnswer = ' + answer + '';

    DataBase.Select(query)
        .then(function (result) {
            if (result.length >= 1) {
                res.send(result)
            }
            else {
                res.send("User Email, User Question Or User Answer Are Incorrect.");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.get('/getusercart', function (req, res) {
    let userName = "'" + req.query.UserName + "'";
    let query = 'Select * from UserCart WHERE UserName = ' + userName + '';

    DataBase.Select(query)
        .then(function (result) {
            if (result.length >= 1) {
                res.send(result)
            }
            else {
                res.send("Username Incorrect.");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.get('/getuserorder', function (req, res) {
    let userName = "'" + req.query.UserName + "'";
    let orderid = "'" + req.query.OrderID + "'";
    let query = 'Select * from Orders WHERE UserName = ' + userName + ' AND OrderID = ' + orderid + '';

    DataBase.Select(query)
        .then(function (result) {
            if (result.length >= 1) {
                res.send(result)
            }
            else {
                res.send("Username Or Order ID Incorrect.");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.get('/getuserorders', function (req, res) {
    let userName = "'" + req.query.UserName + "'";
    let query = 'Select * from Orders WHERE UserName = ' + userName + '';

    DataBase.Select(query)
        .then(function (result) {
            if (result.length >= 1) {
                res.send(result)
            }
            else {
                res.send("Username Incorrect.");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.get('/getorderdetails', function (req, res) {
    let orderid = "'" + req.query.OrderID + "'";
    let query = 'Select * from Orders WHERE OrderID = ' + orderid + '';

    DataBase.Select(query)
        .then(function (result) {
            if (result.length >= 1) {
                res.send(result)
            }
            else {
                res.send("Order ID Incorrect.");
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.get('/getuserpermissions', function (req, res) {
    let userName = "'" + req.query.UserName + "'";
    let query = 'Select UserPermissionID from Users WHERE UserName = ' + userName + '';

    DataBase.Select(query)
        .then(function (result) {
            if (result.length >= 1) {
                res.send(result)
            }
            else {
                res.send("Username Incorrect: " + userName);
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------
router.post('/registeruser', function (req, res) {
    let query;
    let validityState;
    let cookie = "'false'";
    let userName = "'" + req.body.UserName + "'";
    let userPassword = "'" + req.body.UserPass + "'";
    let userFirstName = "'" + req.body.UserFirstName + "'";
    let userLastName = "'" + req.body.UserLastName + "'";
    let userEmail = "'" + req.body.UserEmail + "'";
    let userQuest = "'" + req.body.UserQuest + "'";
    let userAns = "'" + req.body.UserAns + "'";
    let userCountry = "'" + req.body.UserCountry + "'";
    let userPermission = "'" + req.body.UserPermission + "'";
    let userCurrency = "'" + req.body.UserCurrency + "'";

    validityState = ValidateInput(userName, userPassword, userFirstName, userLastName, userEmail, userQuest, userAns,
        userCountry, userCurrency);
    console.log(userLastName);
    if(validityState != "")
    {
        console.log(validityState);
        res.send(validityState);
    }

    query = 'INSERT INTO Users (UserName, UserPassword, UserFirstName, UserLastName, UserEmail, UserQuestion, ' +
        'UserAnswer, UserCountry, UserPermissionID, UserCurrency, Cookie) ' +
        'VALUES (' + userName + ', ' + userPassword + ', ' + userFirstName + ', ' + userLastName + ', ' + userEmail +
        ', ' + userQuest + ', ' + userAns + ', ' + userCountry + ', ' + userPermission + ', ' + userCurrency + ', '
        + cookie + ')';

    DataBase.Insert(query)
        .then(function (result) {
            res.send("User Registered.");
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------
router.put('/setuserdetailes', function (req, res) {
    let userToUpdate = req.body.user;

    this.checkIfUserExists(userToUpdate.userName).then(function (isUserExists) {
        let queryOfUserToUpdate;
        if(isUserExists) {
            queryOfUserToUpdate = "UPDATE users SET USERNAME='" + userToUpdate.userName +
                "', USERPASSWORD='" + userToUpdate.userPassword +
                "', USERFIRSTNAME='" + userToUpdate.userFirstName +
                "', USERLASTNAME='" + userToUpdate.userLastName +
                "', USEREMAIL='" + userToUpdate.userEmail +
                "', USERQUESTION='" + userToUpdate.userQuestion +
                "', USERANSWER='" + userToUpdate.userAnswer +
                "', USERCOUNTRY='" + userToUpdate.userCountry +
                "', USERCURRENCY='" + userToUpdate.userCurrency + "'" +
                "WHERE userName= '" + userToUpdate.userName + "'";

            DataBase.Update(queryOfUserToUpdate).then(function (isUserUpdate) {
                if (isUserUpdate) {
                    res.send(true);
                }
                else {
                    res.send(false);
                }
            });
        }
    });
});

exports.checkIfUserExists = function (userName) {
    return new Promise(function(resolve,reject) {
        let queryCheckUser = "SELECT * FROM Users WHERE (UserName = '" + userName + "')";

        DataBase.Select(queryCheckUser)
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
router.put('/setuseranswer', function (req, res) {
    let userName = "'" + req.body.UserName + "'";
    let userQuest = "'" + req.body.UserQuest + "'";
    let userAns = "'" + req.body.UserAns + "'";
    let validateAnswer;

    let queryCheckUser = 'SELECT * FROM Users WHERE (UserName = ' + userName + ' AND UserQuestion = ' + userQuest + ')';
    let queryUpdate = 'UPDATE Users SET UserAnswer = ' + userAns + ' WHERE UserName = ' + userName + ' AND UserQuestion = ' + userQuest + '';

    validateAnswer = TestLettersDigits(userAns , "UserAnswer");
    if("" != validateAnswer)
        return validateAnswer;

    DataBase.Select(queryCheckUser)
        .then(function (result) {
            if (result.length >= 1) {
                DataBase.Update(queryUpdate)
                    .then(function (resultUpdate) {
                        res.send("User Answer Updated.");
                    })
                    .catch(function (error) {
                        console.log(error.message);
                    });
            }
            else {
                res.send("Username Incorrect: " + userName + " Or User Question: " + userQuest);
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.put('/setusercurrency', function (req, res) {
    let userName = "'" + req.body.UserName + "'";
    let userCurrency = "'" + req.body.UserCurrency + "'";
    let validateCurrency;

    let queryCheckUser = 'SELECT * FROM Users WHERE UserName = ' + userName + '';
    let queryUpdate = 'UPDATE Users SET UserCurrency = ' + userCurrency + ' WHERE UserName = ' + userName + '';

    validateCurrency = TestLetters(userCurrency,"UserCurrency");
    if( "" != validateCurrency)
        res.send(validateCurrency);

    DataBase.Select(queryCheckUser)
        .then(function (result) {
            if (result.length >= 1) {
                DataBase.Update(queryUpdate)
                    .then(function (resultUpdate) {
                        res.send("User Currency Updated.");
                    })
                    .catch(function (error) {
                        console.log(error.message);
                    });
            }
            else {
                res.send("Username Incorrect: " + userName);
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------
router.put('/setuserpermission', function (req, res) {
    let userName = "'" + req.body.UserName + "'";
    let userPermission = "'" + req.body.UserPermission + "'";

    let queryCheckUser = 'SELECT * FROM Users WHERE (UserName = ' + userName + ')';
    let queryUpdate = 'UPDATE Users SET UserPermissionID = ' + userPermission + ' WHERE UserName = ' + userName + '';

    DataBase.Select(queryCheckUser)
        .then(function (result) {
            if (result.length >= 1) {
                DataBase.Update(queryUpdate)
                    .then(function (resultUpdate) {
                        res.send("User Permissions Updated.");
                    })
                    .catch(function (error) {
                        console.log(error.message);
                    });
            }
            else {
                res.send("Username Incorrect: " + userName);
            }
        })
        .catch(function (error) {
            console.log(error.message);
        });
});
//-------------------------------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------------------------------
router.delete('/deleteUser/:userName', function (req, res) {
    let userName =req.params.userName;

    this.checkIfUserExists(userName).then (function (isExist){
        let queryDelete = "DELETE FROM Users WHERE UserName = '" + userName + "'";

        if (isExist) {
            DataBase.Delete(queryDelete)
                .then(function (resultDelete) {
                    res.send(resultDelete);
                })
                .catch(function (error) {
                    console.log(error.message);
                });
        } else {
            res.send(isExist);
        }
    });
});
//-------------------------------------------------------------------------------------------------------------------
//------------------------------- V A L I D A T I O N    F U N C T I O N S ------------------------------------------
//-------------------------------------------------------------------------------------------------------------------

/**
 * @return {string}
 */
function ValidateInput(userName, userPassword, userFirst, userLast, userEmail, userQuestion , userAnswer, userCountry,
                       userCurrency)
{
    let checkExistance;
    let validateUsername;
    let validatePassword;
    let validateFirstName;
    let validateLastName;
    let validateEmail;
    let validateQuestion;
    let validateAnswer;
    let validateCountry;
    let validateCurrency;
    let defaultReturn = "";

    checkExistance = InputExists(userName, userPassword, userFirst, userLast, userEmail, userQuestion, userAnswer,
        userCountry, userCurrency);

    if( InputExists != "")
        return checkExistance;

    validateUsername = TestUserName(userName);
    if(validateUsername != "")
        return validateUsername;

    validatePassword = TestPassword(userPassword);
    if(validatePassword != "")
        return validatePassword;

    validateFirstName = TestLetters(userFirst,"UserFirstName");
    if( validateFirstName != "")
        return validateFirstName;

    validateLastName = TestLetters(userLast,"UserLastName");
    if( validateLastName != "")
        return validateLastName;

    validateEmail = TestEmail(userEmail);
    if(!validateEmail)
        return "Error: Invalid Email Address";

    validateQuestion = TestLettersDigits(userQuestion , "UserQuestion");
    if(validateQuestion != "")
        return validateQuestion;

    validateAnswer = TestLettersDigits(userAnswer , "UserAnswer");
    if(validateAnswer != "")
        return validateAnswer;

    validateCountry = TestLetters(userCountry,"UserCountry");
    if( validateCountry != "")
        return validateCountry;

    validateCurrency = TestLetters(userCurrency,"UserCurrency");
    if( validateCurrency != "")
        return validateCurrency;

    return defaultReturn;
}
//-------------------------------------------------------------------------------------------------------------------
/**
 * @return {string}
 */
function InputExists(userName, userPassword, userFirst, userLast, userEmail, userQuestion, userAnswer,
                     userCountry, userCurrency)
{
    let defaultQuery = "";

    if(userName == "'undefined'")
        return "Error: UserName Is Undefined";
    if(userPassword == "'undefined'")
        return "Error: UserPassword Is Undefined";
    if(userFirst == "'undefined'")
        return "Error: UserFirst Is Undefined";
    if(userLast == "'undefined'")
        return "Error: UserLast Is Undefined";
    if(userEmail == "'undefined'")
        return "Error: UserEmail Is Undefined";
    if(userQuestion == "'undefined'")
        return "Error: UserQuestion Is Undefined";
    if(userAnswer == "'undefined'")
        return "Error: UserAnswer Is Undefined";
    if(userCountry == "'undefined'")
        return "Error: UserCountry Is Undefined";
    if(userCurrency == "'undefined'")
        return "Error: UserCurrency Is Undefined";

    return defaultQuery;
}

//-------------------------------------------------------------------------------------------------------------------
/**
 * @return {string}
 */
function TestUserName(userName)
{
    let defaultQuery = "";

    if (userName !== userName.match(/^[a-zA-Z\s]+$/)){
        return "Error: UserName Field Must Contain Only Letters." ;
    }
    if(2 >= userName.length && 8 < userName.length) {
        return "Error: UserName Field Must Be Between 3 & 8 Characters.";}
    return defaultQuery;
}

//-------------------------------------------------------------------------------------------------------------------
/**
 * @return {string}
 */
function TestPassword(userPass)
{
    let defaultQuery = "";

    if(10 < userPass.length || 4 >= userPass.length){
        return "Error: The Password Must Contain Between 5 And 10 Characters.";
    }
    if(!/[a-z].*[0-9]|[0-9].*[a-z]/i.test(userPass)){
        return "Error: The Password Must Contain Letters And Digits.";
    }
    if(!/^\w+$/i.test(userPass)){
        return "Error: The Password Must Contain Letters And Digits.";
    }
    return defaultQuery;
}

//-------------------------------------------------------------------------------------------------------------------
/**
 * @return {boolean}
 */
function TestEmail(userEmail) {
    let regex;
    if (mail.length === 0)
        return false;
    regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    return regex.test(userEmail);
}

//-------------------------------------------------------------------------------------------------------------------
/**
 * @return {string}
 */
function TestLetters(value, field)
{
    let defaultQuery = "";

    if (name.match(/^[a-zA-Z\s]+$/) != name)
        return "Error: The Field: " + field + " Must Contain Only Letters.";
    return defaultQuery;
}

//-------------------------------------------------------------------------------------------------------------------
/**
 * @return {string}
 */
function TestLettersDigits(value, field)
{
    if (/^\w+$/i.test(value)) {
        return "";
    } else {
        return "Error: The Field: " + field + " Must Contain Digits & Letters";
    }
}
//-------------------------------------------------------------------------------------------------------------------
