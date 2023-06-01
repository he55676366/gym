var express = require("express");
//資料庫
var db = require('../database');
var { Success, Error } = require('../response');
var index = express.Router();

//上傳用
var multer = require('multer')



//沒有會壞掉
const flash = require('connect-flash');
index.use(flash());

//加密
const bcrypt = require('bcryptjs');
const saltRounds = 10;

//使用jwt cookie
const passport = require('passport');
const JWTstrategy = require("passport-jwt").Strategy;
const jwt = require('jsonwebtoken');
const cookieparser = require('cookie-parser');
index.use(cookieparser());

index.use(passport.initialize());


index.get("/test", function (req, res) {
    res.render('main');
})

//首頁
index.get('/index', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.error('Passport error:', err);
            return next(err);
        }
        if (!user) {
            var navtoken = user?.mid
            console.log(navtoken);
            return res.render('index', { token: navtoken, user_name: null });
        } else {
            console.log(user)
            // 渲染頁面的程式碼
            var sql = `SELECT mname,avatar FROM member WHERE mid =?`

            db.query(sql, [user.mid],
                function (err, result, field) {
                    console.log(result)
                    res.render('index', {
                        user_name: result,
                        token: user.mid
                    });
                }
            )
        };
    })(req, res, next);
});



index.get('/class_equip', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.error('Passport error:', err);
            return next(err);
        }
        if (!user) {
            var navtoken = req.cookies?.access_token;
            res.render('class_equip', { token: navtoken,user_name:null });
        } else {
            var sql = `SELECT mname,avatar FROM member WHERE mid =?;`;
                db.query(sql, [user.mid],
                    function (err, result, field) {
                        console.log(result)
                        res.render('class_equip', { token: user.mid , user_name:result})
                    })
        }
    })(req, res, next);
});

index.get('/news', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.error('Passport error:', err);
            return next(err);
        }
        if (!user) {
            var navtoken = user?.mid
            var sql = `SELECT newsid,news_title,news_text,news_img,news_class,DATE_FORMAT(created_at, '%Y-%m-%d')AS created_at FROM  news order by newsid desc;`;
            console.log("123")
            db.query(sql, [],
                function (err, result, field) {
                    console.log(err);
                    console.log("pk")
                    return res.render('news', {
                        data: result,
                        token: navtoken,
                        user_name: null
                    });
                }
            );
        } else {
            // 渲染頁面的程式碼
            var navtoken = user?.mid
            var sql = `SELECT newsid,news_title,news_text,news_img,news_class,DATE_FORMAT(created_at, '%Y-%m-%d')AS created_at FROM  news order by newsid desc;
        SELECT mname,avatar FROM member WHERE mid =?;`;
            db.query(sql, [user.mid],
                function (err, result, field) {
                    console.log(result[1])
                    res.render('news', {
                        data: result[0],
                        token: user.mid,
                        user_name: result[1]
                    });
                }
            );
        }
    })(req, res, next);
});



index.get('/about', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            console.error('Passport error:', err);
            return next(err);
        }
        if (!user) {
            var navtoken = user?.mid
            console.log(navtoken);
            return res.render('about', { token: navtoken, user_name: null });
        } else {
            console.log(user)
            // 渲染頁面的程式碼
            var sql = `SELECT mname,avatar FROM member WHERE mid =?`

            db.query(sql, [user.mid],
                function (err, result, field) {
                    console.log(result)
                    res.render('about', {
                        user_name: result,
                        token: user.mid
                    });
                }
            );
        }
    })(req, res, next);
});

//會員註冊
index.get("/register", function (req, res) {
    res.render('register');

})


//會員註冊輔助 加密
index.post('/add', function (req, res) {
    var writein = req.body;
    bcrypt.hash(writein.password, 10, function (err, hash) {
        if (err) {
            res.send("註冊有問題");
        }
        var sql = `INSERT INTO member(maccount,mPW,mname,mphone,memail,mbirth,maddress) VALUES(?,?,?,?,?,?,?);`;
        var data = [writein.abc, hash, writein.userName, writein.phone, writein.email, writein.birth, writein.address];
        console.log(data);
        db.query(sql, data, function (err, result, field) {
            console.log(err);
            console.log("pk");
            // console.log(result);
            if (result.insertId) {
                res.end(
                    JSON.stringify(new Success('register success'))
                )
            } else {
                res.end(
                    JSON.stringify(new Error('register failed'))
                )
            }
        });
    });
})

//登入
index.get('/login', function (req, res) {
    if (req.cookies.access_token) {
        res.redirect('/member');
    };
    res.render('login');
})

//登入認證
index.post('/login', (req, res, next) => {
    const { account, password } = req.body;//變數名稱需與name相同
    findUserByUsername(account, (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Error' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Incorrect username.' });
        }
        bcrypt.compare(password, user.mPW, (err, isPasswordValid) => {
            if (err) {
                return res.status(500).json({ message: 'bcrypt Error' });
            }
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Incorrect password.' });
            }
            const body = { mid: user.mid, account: user.maccount };
            const token = jwt.sign({ user: body }, 'TOP_SECRET');
            console.log(token);

            return res.cookie("access_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            })
                .end(
                    JSON.stringify(new Success('register success'))
                )

        });
    });
});
//登出
index.get('/logout', (req, res, next) => {
    res.clearCookie('access_token');
    res.redirect("/index");
})


//用cookie拉會員資料
function getJwt(req, res) {
    const jwtcookie = req.cookies.access_token;
    console.log("jwt:" + jwtcookie);
    return jwtcookie;
}
passport.use(
    new JWTstrategy(
        {
            secretOrKey: "TOP_SECRET",
            jwtFromRequest: getJwt,
        },
        async (token, done) => {
            console.log("jwt strat token: ", token);//解碼
            if (token?.user?.mid == "tokenerror") {//判斷命名內容
                console.log("123")
                let testError = new Error(
                    "something bad happened. we've simulated an application error in the JWTstrategy callback for users with an email of 'tokenerror'."
                );
                return done(testError, false);
            }
            if (token?.user?.mid == "emptytoken") {
                console.log("456")
                return done(null, false, { message: "Unauthorized" }); // unauthorized
            }
            return done(null, token.user);
        }
    )
);





//協助登入抓資料
function findUserByUsername(account, callback) {
    var sql = 'SELECT * FROM member WHERE maccount = ?';
    // console.log(account);
    db.query(sql, [account],
        (err, result, field) => {
            if (result.length === 0) {
                // console.log("err");
                return callback(null, null);
            }
            const user = result[0];
            // console.log(result);
            return callback(null, user);
        }
    );
}

function changePW(id, callback) {
    var sql = 'SELECT * FROM member WHERE mid = ?';
    console.log(id);
    db.query(sql, [id],
        (err, result, field) => {
            if (result.length === 0) {
                // console.log("err");
                return callback(null, null);
            }
            const user = result[0];
            // console.log(result);
            return callback(null, user);
        }
    );
}


//會員資料
index.get("/member", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), (req, res, next) => {
    // var navtoken = req.cookies?.access_token;
    var mid = req.user.mid;//uid為token值
    var sql = `select * from member where mid = ?;
    SELECT DATE_FORMAT(entertime, '%Y-%m-%d')AS enterdate,building,DATE_FORMAT(entertime, '%H:%i')AS entertime,DATE_FORMAT(exittime, '%H:%i')AS exittime FROM entertime WHERE mid =? ORDER BY enterdate DESC;
    SELECT personal_csid,DATE_FORMAT(sdate, '%Y-%m-%d')AS sdate,DATE_FORMAT(sdate, '%H:%i')AS stime,DATE_FORMAT(edate, '%H:%i')AS etime,building,cname,state FROM personalclass,coach WHERE coach.cid=personalclass.cid and mid =? ;
    SELECT team_resid,DATE_FORMAT(sdate, '%Y-%m-%d')AS sdate,DATE_FORMAT(sdate, '%H:%i')AS stime,DATE_FORMAT(edate, '%H:%i')AS etime,building,csname,state FROM teamclassreserve,classinfo,teamclass,coach WHERE coach.cid=teamclass.cid and classinfo.csid=teamclass.csid and teamclass.team_csid=teamclassreserve.team_csid and mid=?;
    SELECT space_resid,DATE_FORMAT(sdate, '%Y-%m-%d')AS sdate,DATE_FORMAT(sdate, '%H:%i')AS stime,DATE_FORMAT(edate, '%H:%i') AS etime,building,space_name,state FROM spacereserve,space WHERE space.spaceid=spacereserve.spaceid and mid=?;
    SELECT DATE_FORMAT(purchase_time, '%Y-%m-%d')AS pdate,purchase_id,purchase_item,purchase_quantity,totalprice FROM purchaselist WHERE mid = ?;`;
    db.query(sql, [mid, mid, mid, mid, mid, mid],
        function (err, result, field) {
            res.render('member', {
                person: result[0],
                enterHistory: result[1],
                personalClass: result[2],
                teamClass: result[3],
                space: result[4],
                purchase: result[5],
                token: req.user.mid
            });
        }
    );
})

index.put("/member/:update", passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), (req, res, next) => {
    var mid = req.user.mid;
    var update = req.params.update;
    var writein = req.body;
    switch (update) {
        case "info":
            var sql = `UPDATE member SET mphone = ? ,memail = ? ,maddress = ?, updated_at=now() WHERE mid = ?;`;
            var data = [writein.phone, writein.email, writein.address, mid];
            console.log(data);
            db.query(sql, data, function (err, result, field) {
                console.log(result);
                if (result.affectedRows) {
                    res.end(
                        JSON.stringify(new Success('update success'))
                    )
                } else {
                    res.end(
                        JSON.stringify(new Error('update failed'))
                    )
                }
            });
            break;
        case "password":
            changePW(mid, (err, user) => {
                if (err) {
                    return res.status(500).json({ message: 'Error' });
                }
                if (!user) {
                    return res.status(401).json({ message: 'Incorrect username.' });
                }
                bcrypt.compare(writein.old, user.mPW, (err, isPasswordValid) => {
                    if (err) {
                        return res.status(500).json({ message: 'bcrypt Error' });
                    }
                    if (!isPasswordValid) {
                        return res.status(401).json({ message: 'Incorrect password.' });
                    }
                    bcrypt.hash(writein.new, 10, function (err, hash) {
                        if (err) {
                            res.send("註冊有問題");
                        }
                        var sql = `UPDATE member SET mPW = ?, updated_at=now() WHERE mid = ?;`;
                        var data = [hash, mid];
                        db.query(sql, data, function (err, result, field) {
                            console.log(result);
                            if (result.affectedRows) {
                                res.end(
                                    JSON.stringify(new Success('update success'))
                                )
                            } else {
                                res.end(
                                    JSON.stringify(new Error('update failed'))
                                )
                            }
                        });
                    })
                })
            })
            break;
        case "class":
            switch (writein.way) {
                case "person":
                    console.log("人員")
                    var sql = `UPDATE personalclass SET state = "取消" WHERE personal_csid = ?;`;
                    db.query(sql, writein.id, function (err, result, field) {
                        console.log(result);
                        if (result.affectedRows) {
                            res.end(
                                JSON.stringify(new Success('update success'))
                            )
                        } else {
                            res.end(
                                JSON.stringify(new Error('update failed'))
                            )
                        }
                    });
                    break;
                case "team":
                    console.log("組別")
                    var sql = `UPDATE teamclassreserve SET state = "取消" WHERE team_resid = ?;`;
                    db.query(sql, writein.id, function (err, result, field) {
                        console.log(result);
                        if (result.affectedRows) {
                            res.end(
                                JSON.stringify(new Success('update success'))
                            )
                        } else {
                            res.end(
                                JSON.stringify(new Error('update failed'))
                            )
                        }
                    });
                    break;
                case "space":
                    console.log("空間")
                    var sql = `UPDATE spacereserve SET state = "取消" WHERE space_resid = ?;`;
                    db.query(sql, writein.id, function (err, result, field) {
                        console.log(result);
                        if (result.affectedRows) {
                            res.end(
                                JSON.stringify(new Success('update success'))
                            )
                        } else {
                            res.end(
                                JSON.stringify(new Error('update failed'))
                            )
                        }
                    });
                    break;
                default:
                    break;
            }
            break;

        default:
            break;
    }
})


// -------------------------------------
// 查看資料庫 products 的內容
index.get('/products', function (req, res) {
    var sql = "SELECT products_id, products_name, products_image, products_description, products_price, products_inventory, purchases_number, category FROM products;";
    db.query(sql,
        function (err, results, fields) {
            res.send(JSON.stringify(results));
        })
})

// -------------------------------------
// 查看資料庫 products/nutritional 的內容
index.get('/products/nutritional', function (req, res) {
    var sql = "SELECT products_id, products_name, products_image, products_description, products_price, products_inventory, purchases_number FROM products WHERE category = 'nutritional';";
    db.query(sql,
        function (err, results, fields) {
            res.send(JSON.stringify(results));
        })
})

// -------------------------------------
// 查看資料庫 collect 的內容
index.get('/collect', passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), function (req, res) {
    var sql = "SELECT collect_id, products_name, products_price, products_image FROM collect where mid= ?;";
    db.query(sql, req.user.mid,
        function (err, results, fields) {
            res.send(JSON.stringify(results));
        })
})

// -------------------------------------
// 查看資料庫 purchaselist 的內容
index.get('/purchaselist', function (req, res) {
    var sql = "SELECT purchase_id, mid, purchase_item, totalprice,purchase_time, purchase_quantity, purchase_venue FROM purchaselist;";
    db.query(sql,
        function (err, results, fields) {
            res.send(JSON.stringify(results));
        })
})

// -------------------------------------
// 1. 獲得 products 的內容，渲染到 sport.ejs
// 2. 獲得 collect 的內容，渲染到 sport.ejs
const util = require('util');

index.get('/shop', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        const sql = "SELECT products_id, products_name, products_image, products_description, products_price, products_inventory, purchases_number, category FROM products;";
        var navtoken = req.cookies?.access_token;
        if (err) {
            console.error('Passport error:', err);
            return next(err);
        }
        if (!user) {
            const sql_1 = "SELECT products_id, products_name, products_image, products_description, products_price, products_inventory, purchases_number, category FROM products;";

            const query = util.promisify(db.query).bind(db);

            try {
                const [products] = await Promise.all([query(sql_1)]);
                const nutritional = products.filter(product => product.category === 'nutritional');
                const massage = products.filter(product => product.category === 'massage');
                const equipment = products.filter(product => product.category === 'equipment');


                res.render('shopnologin', { products, nutritional, massage, equipment});
            } catch (err) {
                res.send('select發生錯誤', err);
            }
        } else {
            console.log(user)
            // 渲染頁面的程式碼
            var navtoken = req.cookies?.access_token;
            const sql_1 = "SELECT products_id, products_name, products_image, products_description, products_price, products_inventory, purchases_number, category FROM products;";
            // const sql_2 = `SELECT collect_id, products_name, products_price, products_image, products_description, collectBoolean, update_at FROM collect WHERE mid = ? AND collectBoolean = 1 ORDER BY update_at;`;

            // 合併 sql_1 只取 purchases_number 跟 sql_2
            const sql_3 = `SELECT p.purchases_number, c.collect_id, c.products_name, c.products_price, c.products_image, c.products_description, c.collectBoolean, c.update_at FROM products p LEFT JOIN collect c ON p.products_name = c.products_name WHERE c.mid = ? AND c.collectBoolean = 1 ORDER BY c.update_at;`;
            const sql_4 = `SELECT mname,point FROM member where mid = ?;`;
            const sql_5 = `SELECT products_name, collectBoolean FROM collect;`;

            // 合併 sql_1 + sql_5
            const sql_6 = "SELECT p.products_id, p.products_name, p.products_image, p.products_description, p.products_price, p.products_inventory, p.purchases_number, p.category, c.collectBoolean FROM products p LEFT JOIN collect c ON p.products_name = c.products_name AND c.mid = ? ORDER BY p.products_id;";
            var mid = user.mid;
            const query = util.promisify(db.query).bind(db);

            try {
                const [products, collect, point, collectBoolean, proCol] = await Promise.all([query(sql_1), query(sql_3, [mid]), query(sql_4, [mid]), query(sql_5), query(sql_6,[mid])]);
                const nutritional = proCol.filter(product => product.category === 'nutritional');
                const massage = proCol.filter(product => product.category === 'massage');
                const equipment = proCol.filter(product => product.category === 'equipment');

                res.render('shop', { products, nutritional, massage, equipment, collect, point, token: navtoken, collectBoolean, proCol,token:user.mid});
            } catch (err) {
                res.send('select發生錯誤', err);
            }
        }
    })(req, res, next);
});

// -------------------------------------
// 點擊加入收藏，將 data 傳送至 collect
index.post('/collect', express.urlencoded(), passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), function (req, res) {
    var selectSql = "SELECT collectBoolean FROM collect WHERE products_name = ? AND mid = ?;";
    db.query(selectSql, [req.body.name, req.user.mid], function (err, selectResults, selectFields) {
        if (err) {
            console.log('資料檢查失敗' + JSON.stringify(err));
            res.send('資料檢查失敗' + JSON.stringify(err));
        } else {
            if (selectResults.length > 0) {
                console.log(selectResults[0].collectBoolean);
                // 資料已存在，進行更新操作
                var updateSql = "UPDATE collect SET collectBoolean = ?, update_at= now() WHERE products_name = ? AND mid = ?;";
                var newCollectBoolean = selectResults[0].collectBoolean === 0 ? 1 : selectResults[0].collectBoolean;
                console.log(newCollectBoolean, 'pika');

                db.query(updateSql, [newCollectBoolean, req.body.name, req.user.mid], function (updateErr, updateResults, updateFields) {
                    if (updateErr) {
                        console.log('更新失敗' + JSON.stringify(updateErr));
                        res.send('更新失敗' + JSON.stringify(updateErr));
                    } else {
                        console.log('更新成功');
                        res.send('更新成功');
                    }
                });
            } else {
                // 資料不存在，進行新增操作
                var insertSql = "INSERT INTO collect (products_image, products_name, products_price, products_description, mid, collectBoolean) VALUES (?,?,?,?,?,1);";
                db.query(insertSql, [req.body.images, req.body.name, req.body.price, req.body.description, req.user.mid], function (insertErr, insertResults, insertFields) {
                    if (insertErr) {
                        console.log('新增失敗' + JSON.stringify(insertErr));
                        res.send('新增失敗' + JSON.stringify(insertErr));
                    } else {
                        console.log('新增成功');
                        res.send('新增成功');
                    }
                });
            }
        }
    });

})

// ----------------------------------------------------
// 刪除收藏
index.put('/collect', express.urlencoded(), passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), function (req, res) {
    console.log('1. 我是delete');
    var sql = "UPDATE collect set collectBoolean = 0 where mid = ? AND products_name  = ?;";
    // var sql = "DELETE FROM collect WHERE mid = ?;";
    db.query(sql,
        [req.user.mid, req.body.productName],
        function (err, results, fields) {
            if (err) {
                console.log('1. 刪除失敗' + JSON.stringify(err))
                res.send('2. 刪除失敗' + JSON.stringify(err))
            } else {
                console.log('3. 刪除成功')
                res.send('4. 刪除成功')
                console.log(req.body.productName + '  12313213')
            }
        })
})

// ----------------------------------------------------
// 新增兌換紀錄、變更購買次數
index.post('/purchaselist', express.urlencoded(), passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), async function (req, res) {
    try {
        var sql_1 = "INSERT INTO purchaselist (mid, purchase_item, purchase_quantity, totalprice, purchase_venue) VALUES (?,?,?,?,?);";
        var sql_2 = "UPDATE products SET purchases_number = ? WHERE products_name = ?;";
        var sql_3 = "UPDATE member SET point = ? WHERE mid = ?;"
        const query = util.promisify(db.query).bind(db);

        await query(sql_1, [
            req.user.mid,
            req.body.purchaseItem,
            req.body.purchaseQuantity,
            req.body.totalPrice,
            req.body.selectedVenue,
        ]);

        // 执行 sql_2
        await query(sql_2, [
            req.body.newPurchasesNumber, // 更新的 purchases_number 值
            req.body.purchaseItem // WHERE 条件中的 products_name
        ]);

        // 執行 sql_3
        await query(sql_3, [
            req.body.remainingPoints,
            req.user.mid
        ]);

        console.log('3. 新增成功');
        res.send('4. 新增成功');
    } catch (err) {
        console.log('1. 新增失敗' + JSON.stringify(err));
        res.send('2. 新增失敗' + JSON.stringify(err));
    }
});

// ----------------------------------------------------
// 更新member point 數據
index.get('/getMemberPoint', express.urlencoded(), passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), function (req, res) {
    // res.send('pika');
    sql = "UPDATE member SET point = point + 100 WHERE mid = ?";
    db.query(sql, [req.user.mid],
        function (err, results, fields) {
            if (err) {
                res.send('update 發生錯誤', err);
                console.log(err);
            } else {
                console.log(results);
                res.json(results);
            }
        })

})

// ----------------------------------------------------
// memberRight
index.post('/updateMemberRights', express.urlencoded(), passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), function (req, res) {
    sql = "UPDATE member SET rights = ? where mid = ?;"
    db.query(sql,
        [req.body.memberRights, req.user.mid],
        function (err, results, fields) {
            if (err) {
                res.send('update 發生錯誤', err);
                console.log(err);
            } else {
                console.log(results);
                res.json(results);
            }
        })
})


//====新增課程

index.post('/buildingcoach', express.urlencoded(), function (req, res) {

    var sql = `select distinct cid ,cname  from  coach where building = ? ;
                `;
    console.log(req.body.building);
    db.query(sql, [req.body.building],
        function (err, results, fields) {

            if (err) {
                res.send('select 發生錯誤', err);
                console.log(err);
            } else {
                console.log(results);
                res.json(results);
            }

        })
})
index.post('/class', express.urlencoded(), function (req, res) {

    var sql = `select teamclass.team_csid,classinfo.csname,classinfo.csdetail,coach.cname,teamclass.cid,teamclass.csid, DATE_FORMAT(sdate , '%Y/%m/%d %H:%i') sdate,DATE_FORMAT(sdate, '%c') month
                from teamclass, classinfo, coach
                where coach.building = ? AND DATE_FORMAT(sdate, '%c')= ?  AND teamclass.csid = classinfo.csid AND coach.cid = teamclass.cid
                order by sdate ;
                `;
    console.log(req.body.building, typeof req.body.month);
    db.query(sql, [req.body.building, req.body.month],
        function (err, results, fields) {

            if (err) {
                res.send('select 發生錯誤', err);
                console.log(err);
            } else {
                console.log(results);
                res.json(results);
            }

        })
})

index.post('/coachtimetable', express.urlencoded(), function (req, res) {

    var sql = `select *  from  personalclass,coach 
                where personalclass.cid = coach.cid AND personalclass.cid = ?
                AND  DATE_FORMAT(sdate, '%c') = ? AND coach.building = ?
                AND state = "未完成";
                `;
    console.log(req.body.building);
    db.query(sql, [req.body.cid, req.body.month, req.body.building],
        function (err, results, fields) {

            if (err) {
                res.send('select 發生錯誤', err);
                console.log(err);
            } else {
                console.log(results);
                res.json(results);
            }

        })
})

index.get('/teamclasscoach', express.urlencoded(), function (req, res) {

    var sql = `select distinct cid  from  teamclass ;
                `;
    db.query(sql,
        function (err, results, fields) {

            if (err) {
                res.send('select 發生錯誤', err);
                console.log(err);
            } else {
                console.log(results);
                res.json(results);
            }

        })
})

index.post('/coachinfo', express.urlencoded(), function (req, res) {

    var sql = `select * from  coach where cid = ? ;
                `;
    console.log(req.body.coachid);
    db.query(sql, [req.body.coachid],
        function (err, results, fields) {

            if (err) {
                res.send('select 發生錯誤', err);
                console.log(err);
            } else {
                console.log(results);
                res.json(results);
            }

        })
})

index.get('/personalclasscoach', express.urlencoded(), function (req, res) {

    var sql = `select distinct cid  from  personalclass ;
                `;
    db.query(sql,
        function (err, results, fields) {

            if (err) {
                res.send('select 發生錯誤', err);
                console.log(err);
            } else {
                console.log(results);
                res.json(results);
            }

        })
})

index.post('/space', express.urlencoded(), function (req, res) {

    var sql = `select * from space where building = ? ;
                `;
    db.query(sql, [req.body.building],
        function (err, results, fields) {

            if (err) {
                res.send('select 發生錯誤', err);
                console.log(err);
            } else {
                console.log(results);
                res.json(results);
            }

        })
})
index.post('/spacestate', express.urlencoded(), function (req, res) {
    var sql = `select * from space,spacereserve 
                where space.spaceid=spacereserve.spaceid  AND space.spaceid = ? ;
                `;
    console.log(req.body.spaceid);
    db.query(sql, [req.body.spaceid],
        function (err, results, fields) {

            if (err) {
                res.send('select 發生錯誤', err);
                console.log(err);
            } else {
                console.log(results);
                res.json(results);
            }

        })
})
index.post('/spacereserve', express.urlencoded(), function (req, res) {
    var sql = `INSERT INTO spacereserve  (mid, spaceid , spacePeopleNumber, sdate , edate , state) 
                VALUES (?,?,?,?,DATE_ADD(?,INTERVAL 1 HOUR ),'預約成功') ;
                `;
    var data =[req.body.mid, req.body.spaceid, req.body.number, req.body.sdate, req.body.sdate]
    db.query(sql,data,
        function (err, results, fields) {
            if (err) {
                res.send('select 發生錯誤', err);
                console.log(err);
            } else {
                console.log(results);
                res.json(results);
            }
        })
})

index.put('/teamclassreserve', express.urlencoded(),passport.authenticate('jwt', { session: false, failureRedirect: '/login' }), function (req, res) {

    var sql = `INSERT INTO teamclassreserve ( mid, team_csid, state) VALUES ( ?, ?, '預約成功') ;
                UPDATE teamclass SET present_number = present_number+1 WHERE team_csid = ?; 
                `;
    db.query(sql, [req.body.mid, req.body.csid, req.body.csid],
        function (err, results, fields) {
            if (err) {
                res.send('select 發生錯誤', err);
                console.log(err);
            } else {
                console.log(results);
                res.json(results);
            }
        })
})

index.put('/selfclassreserve', express.urlencoded(), function (req, res) {

    var sql = `
    UPDATE personalclass SET state  = '預約成功' ,mid = ? WHERE personalclass.personal_csid = ?;
            `;
    db.query(sql, [req.body.mid, req.body.personalcsid],
        function (err, results, fields) {

            if (err) {
                res.send('select 發生錯誤', err);
                console.log(err);
            } else {
                console.log(results);
                res.json(results);
            }

        })
})
index.get('/classinfo', express.urlencoded(), function (req, res) {
    var sql = `select * from classinfo;`;
    db.query(sql,
        function (err, results, fields) {
            if (err) {
                res.send('select 發生錯誤', err);
                console.log(err);
            } else {
                console.log(results);
                res.json(results);
            }
        })
})






var admin = require("./part/admin");

index.use('/', admin)

module.exports = index;