var express = require("express");
//資料庫
var db = require('../../database');
var { Success, Error } = require('../../response');
var { login_api_admin } = require('../../middleware/login');
var index = express.Router();
//沒有會壞掉
const flash = require('connect-flash');
index.use(flash());

var multer = require('multer')

index.get("/admin", function (req, res) {
    res.render('adminLogin');
})
//管理者登入輔助
index.post("/admin", function (req, res) {
    var sql = `SELECT * FROM admin WHERE adminAccount=? and adminPW=?;`
    var data = [req.body.account, req.body.password]
    db.query(sql, data, function (err, result, fields) {
        //result陣列的select為第二句 所以找[1]
        if (result) {
            req.session.admin = {
                id: result[0].adminId
            }
            res.end(
                JSON.stringify(new Success('login success'))
            )
        } else {
            res.end(
                JSON.stringify(new Error('login failed'))
            )
        };
    })
})

//管理頁面
index.get('/manage/:name/:page([0-9]+)', login_api_admin, function (req, res) {
    var page = req.params.page;
    var name = req.params.name;
    //把<=0的id強制改成1

    switch (name) {
        case "member":
            console.log(name);
            if (page <= 0) {
                res.redirect(`/manage/${name}/1`)
                return
            }
            //每頁資料數
            var nums_per_page = 10
            //定義資料偏移量
            var offset = (page - 1) * nums_per_page

            db.query(`SELECT mid,maccount,mname,mphone,memail,DATE_FORMAT(mbirth, '%Y-%m-%d')AS mbirth,maddress,point,total_times,DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s')AS updated_at,avatar FROM member LIMIT ${offset}, ${nums_per_page};`
                , [], function (err, data, fields) {
                    db.query(`SELECT COUNT(*) AS COUNT FROM member`, [], function (err, nums, fields) {
                        var last_page = Math.ceil(nums[0].COUNT / nums_per_page)

                        //避免請求超過最大頁數
                        if (page > last_page) {
                            res.redirect(`/manage/${name}` + last_page)
                            return
                        }

                        res.render('manage', {
                            data: data,
                            curr_page: page,
                            //本頁資料數量
                            total_nums: nums[0].COUNT,
                            //總數除以每頁筆數，再無條件取整數
                            last_page: last_page,
                            name: name,
                            add1: [], add2: [],
                        })
                    })
                });
            break;
        case "coach":
            console.log(name);
            if (page <= 0) {
                res.redirect(`/manage/${name}/1`)
                return
            }
            //每頁資料數
            var nums_per_page = 10
            //定義資料偏移量
            var offset = (page - 1) * nums_per_page

            db.query(`SELECT * FROM coach LIMIT ${offset}, ${nums_per_page};`
                , [], function (err, data, fields) {
                    db.query(`SELECT COUNT(*) AS COUNT FROM coach`, [], function (err, nums, fields) {
                        var last_page = Math.ceil(nums[0].COUNT / nums_per_page)

                        //避免請求超過最大頁數
                        if (page > last_page) {
                            res.redirect(`/manage/${name}` + last_page)
                            return
                        }
                        res.render('manage', {
                            data: data,
                            curr_page: page,
                            //本頁資料數量
                            total_nums: nums[0].COUNT,
                            //總數除以每頁筆數，再無條件取整數
                            last_page: last_page,
                            name: name,
                            add1: [], add2: [],
                        })
                    })
                });
            break;
        case "teamClass":
            console.log(name);
            if (page <= 0) {
                res.redirect(`/manage/${name}/1`)
                return
            }
            //每頁資料數
            var nums_per_page = 10
            //定義資料偏移量
            var offset = (page - 1) * nums_per_page

            db.query(`SELECT team_csid,coach.cid,classinfo.csid,csname,cname,DATE_FORMAT(sdate, '%Y-%m-%d')AS sdate,DATE_FORMAT(edate, '%Y-%m-%d')AS edate,total_number,building FROM teamclass,coach,classinfo WHERE teamclass.cid = coach.cid and teamclass.csid = classinfo.csid LIMIT ${offset}, ${nums_per_page};
            SELECT csid,csname From classinfo;
            SELECT cid,cname From coach;`
                , [], function (err, data, fields) {
                    db.query(`SELECT COUNT(*) AS COUNT FROM teamclass`, [], function (err, nums, fields) {
                        var last_page = Math.ceil(nums[0].COUNT / nums_per_page)

                        //避免請求超過最大頁數
                        if (page > last_page) {
                            res.redirect(`/manage/${name}` + last_page)
                            return
                        }
                        console.log(data);
                        res.render('manage', {
                            data: data[0],
                            curr_page: page,
                            //本頁資料數量
                            total_nums: nums[0].COUNT,
                            //總數除以每頁筆數，再無條件取整數
                            last_page: last_page,
                            name: name,
                            add1: data[1],
                            add2: data[2],
                        })
                    })
                });
            break;
        case "products":
            console.log(name);
            if (page <= 0) {
                res.redirect(`/manage/${name}/1`)
                return
            }
            //每頁資料數
            var nums_per_page = 10
            //定義資料偏移量
            var offset = (page - 1) * nums_per_page

            db.query(`SELECT productid,product_name,price,inventory,description FROM products LIMIT ${offset}, ${nums_per_page};`
                , [], function (err, data, fields) {
                    db.query(`SELECT COUNT(*) AS COUNT FROM products`, [], function (err, nums, fields) {
                        var last_page = Math.ceil(nums[0].COUNT / nums_per_page)

                        //避免請求超過最大頁數
                        if (page > last_page) {
                            res.redirect(`/manage/${name}` + last_page)
                            return
                        }
                        res.render('manage', {
                            data: data,
                            curr_page: page,
                            //本頁資料數量
                            total_nums: nums[0].COUNT,
                            //總數除以每頁筆數，再無條件取整數
                            last_page: last_page,
                            name: name,
                            add1: [], add2: [],
                        })
                    })
                });
            break;
        case "news":
            console.log(name);
            if (page <= 0) {
                res.redirect(`/manage/${name}/1`)
                return
            }
            //每頁資料數
            var nums_per_page = 10
            //定義資料偏移量
            var offset = (page - 1) * nums_per_page

            db.query(`SELECT newsid,news_title,news_text,news_img,news_class,DATE_FORMAT(created_at, '%Y-%m-%d')AS created_at FROM  news order by newsid desc LIMIT ${offset}, ${nums_per_page};`
                , [], function (err, data, fields) {
                    db.query(`SELECT COUNT(*) AS COUNT FROM news`, [], function (err, nums, fields) {
                        var last_page = Math.ceil(nums[0].COUNT / nums_per_page)

                        //避免請求超過最大頁數
                        if (page > last_page) {
                            res.redirect(`/manage/${name}` + last_page)
                            return
                        }
                        res.render('manage', {
                            data: data,
                            curr_page: page,
                            //本頁資料數量
                            total_nums: nums[0].COUNT,
                            //總數除以每頁筆數，再無條件取整數
                            last_page: last_page,
                            name: name,
                            add1: [], add2: [],
                        })
                    })
                });
            break;
        case "enterTime":
            console.log(name);
            if (page <= 0) {
                res.redirect(`/manage/${name}/1`)
                return
            }
            //每頁資料數
            var nums_per_page = 10
            //定義資料偏移量
            var offset = (page - 1) * nums_per_page

            db.query(`SELECT entertime_id,mname,building,DATE_FORMAT(entertime, '%Y-%m-%d %H:%i:%s')AS entertime,DATE_FORMAT(exittime, '%Y-%m-%d %H:%i:%s')AS exittime FROM  entertime,member where entertime.mid = member.mid LIMIT  ${offset}, ${nums_per_page};`
                , [], function (err, data, fields) {
                    db.query(`SELECT COUNT(*) AS COUNT FROM entertime`, [], function (err, nums, fields) {
                        var last_page = Math.ceil(nums[0].COUNT / nums_per_page)

                        //避免請求超過最大頁數
                        if (page > last_page) {
                            res.redirect(`/manage/${name}` + last_page)
                            return
                        }
                        res.render('manage', {
                            data: data,
                            curr_page: page,
                            //本頁資料數量
                            total_nums: nums[0].COUNT,
                            //總數除以每頁筆數，再無條件取整數
                            last_page: last_page,
                            name: name,
                            add1: [], add2: [],
                        })
                    })
                });
            break;
        case "classinfo":
            console.log(name);
            if (page <= 0) {
                res.redirect(`/manage/${name}/1`)
                return
            }
            //每頁資料數
            var nums_per_page = 10
            //定義資料偏移量
            var offset = (page - 1) * nums_per_page

            db.query(`SELECT * FROM  classinfo LIMIT ${offset}, ${nums_per_page};`
                , [], function (err, data, fields) {
                    db.query(`SELECT COUNT(*) AS COUNT FROM classinfo`, [], function (err, nums, fields) {
                        var last_page = Math.ceil(nums[0].COUNT / nums_per_page)

                        //避免請求超過最大頁數
                        if (page > last_page) {
                            res.redirect(`/manage/${name}` + last_page)
                            return
                        }
                        res.render('manage', {
                            data: data,
                            curr_page: page,
                            //本頁資料數量
                            total_nums: nums[0].COUNT,
                            //總數除以每頁筆數，再無條件取整數
                            last_page: last_page,
                            name: name,
                            add1: [], add2: [],
                        })
                    })
                });
            break;
        case "teamClassReserve":
            console.log(name);
            if (page <= 0) {
                res.redirect(`/manage/${name}/1`)
                return
            }
            //每頁資料數
            var nums_per_page = 10
            //定義資料偏移量
            var offset = (page - 1) * nums_per_page

            db.query(`SELECT team_resid,mname,csname FROM teamClassReserve,teamclass,classinfo,member WHERE teamClassReserve.mid = member.mid and teamClassReserve.team_csid = teamclass.team_csid and teamclass.csid = classinfo.csid LIMIT ${offset}, ${nums_per_page};`
                , [], function (err, data, fields) {
                    db.query(`SELECT COUNT(*) AS COUNT FROM teamClassReserve`, [], function (err, nums, fields) {
                        var last_page = Math.ceil(nums[0].COUNT / nums_per_page)

                        //避免請求超過最大頁數
                        if (page > last_page) {
                            res.redirect(`/manage/${name}` + last_page)
                            return
                        }
                        res.render('manage', {
                            data: data,
                            curr_page: page,
                            //本頁資料數量
                            total_nums: nums[0].COUNT,
                            //總數除以每頁筆數，再無條件取整數
                            last_page: last_page,
                            name: name,
                            add1: [], add2: [],
                        })
                    })
                });
            break;
        case "space":
            console.log(name);
            if (page <= 0) {
                res.redirect(`/manage/${name}/1`)
                return
            }
            //每頁資料數
            var nums_per_page = 10
            //定義資料偏移量
            var offset = (page - 1) * nums_per_page

            db.query(`SELECT * FROM space LIMIT ${offset}, ${nums_per_page};`
                , [], function (err, data, fields) {
                    db.query(`SELECT COUNT(*) AS COUNT FROM space`, [], function (err, nums, fields) {
                        var last_page = Math.ceil(nums[0].COUNT / nums_per_page)

                        //避免請求超過最大頁數
                        if (page > last_page) {
                            res.redirect(`/manage/${name}` + last_page)
                            return
                        }
                        res.render('manage', {
                            data: data,
                            curr_page: page,
                            //本頁資料數量
                            total_nums: nums[0].COUNT,
                            //總數除以每頁筆數，再無條件取整數
                            last_page: last_page,
                            name: name,
                            add1: [], add2: [],
                        })
                    })
                });
            break;
        default:
            break;
    }
})





//管理頁面更新
index.put('/manage/:name/update', function (req, res) {
    var name = req.params.name;
    console.log("1");
    switch (name) {
        case "member":
            var writein = req.body;
            var sql = `UPDATE member SET maccount= ?,mname = ?,mphone = ? ,memail = ? ,mbirth = ?,maddress = ?, updated_at=now() WHERE mid = ?;`;
            var data = [writein.account, writein.name, writein.phone, writein.email, writein.birth, writein.address, writein.id];
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
        case "teamClass":
            var writein = req.body;
            var sql = `UPDATE teamclass SET csid =(select csid FROM classinfo where csname = ?) ,cid = (SELECT cid FROM  coach where cname = ?),sdate=?,edate=?,total_number=? WHERE team_csid = ?;`;
            var data = [writein.csname, writein.cname, writein.sdate, writein.edate, writein.total_number, writein.id];
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
        case "products":
            var writein = req.body;
            var sql = `UPDATE products SET product_name =?,price=?,inventory=?,description=? WHERE productid = ?;`;
            var data = [writein.name, writein.price, writein.inventory, writein.description, writein.id];
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
        case "news":
            var writein = req.body;
            var sql = `UPDATE news SET news_title =?,news_text=?,news_class=? WHERE newsid = ?;`;
            var data = [writein.title, writein.news_text, writein.kind, writein.id];
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
        case "coach":
            var writein = req.body;
            var sql = `UPDATE coach SET cname =?,skill=?,cinfo=?,building=? WHERE cid = ?;`;
            var data = [writein.name, writein.skill, writein.info, writein.building, writein.id];
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
        case "classinfo":
            var writein = req.body;
            var sql = `UPDATE classinfo SET csname =?,csdetail=? WHERE csid = ?;`;
            var data = [writein.name, writein.detail, writein.id];
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
        default:
            break;
    }

})


// 新增
index.post('/manage/:name/add', function (req, res) {
    var name = req.params.name;
    console.log("add" + name);
    switch (name) {
        case "teamClass":
            var writein = req.body;
            var sql = `INSERT INTO teamclass (csid, cid, sdate, edate,total_number) VALUES (?,?,?,?,?);`;
            var data = [writein.csname, writein.cname, writein.sdate, writein.edate, writein.total_number];
            console.log(data);
            db.query(sql, data, function (err, result, field) {
                console.log(result);
                if (result.insertId) {
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
        case "products":
            var writein = req.body;
            var sql = `INSERT INTO products (product_name, price,inventory,description) VALUES (?,?,?,?);`;
            var data = [writein.name, writein.price, writein.inventory, writein.description];
            console.log(data);
            db.query(sql, data, function (err, result, field) {
                console.log(err);
                console.log("pk");
                console.log(result);
                if (result.insertId) {
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
        case "news":
            var writein = req.body;
            var sql = `INSERT INTO news (news_title,news_text,news_img,news_class) VALUES (?,?,?,?);`;
            var data = [writein.title, writein.news_text, writein.img, writein.kind];
            console.log(data);
            db.query(sql, data, function (err, result, field) {
                console.log(err);
                console.log("NEWS-info");
                console.log(result);
                if (result.insertId) {
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
        case "classinfo":
            var writein = req.body;
            var sql = `INSERT INTO classinfo (csname, csdetail) VALUES (?,?);`;
            var data = [writein.name, writein.detail];
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
        default:
            break;
    }
})

// 新增 圖片相關

var memberStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/img/avatar");
    },
    filename: function (req, file, cb) {
        var newName = 'member' + req.params.number + '.' + file.originalname.split('.')[1];
        cb(null, newName);
    }
})

var memberUpload = multer({
    storage: memberStorage,
    fileFilter: function (req, file, cb) {
        if (!file.mimetype.includes("image/png") &&
            !file.mimetype.includes("image/jpeg")) {
            return cb(new Error('類型錯誤'));
        }
        cb(null, true);
    }
});

index.post('/admin_upload/member/:number', memberUpload.single('myfile'), (req, res, next) => {
    var sql = `UPDATE member SET avatar = ?  WHERE mid = ?;`;
    var data = ["../img/avatar/" + req.file.filename, req.params.number];
    console.log(data);
    db.query(sql, data, function (err, result, field) {
        console.log(result);
        if (result.affectedRows) {
            res.redirect('back');
        } else {
            res.end(
                JSON.stringify(new Error('update failed'))
            )
        }
    });
});





var newsStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/img/news");
    },
    filename: function (req, file, cb) {
        var newName = 'news' + req.params.number + '.' + file.originalname.split('.')[1];
        cb(null, newName);
    }
})

var newsUpload = multer({
    storage: newsStorage,
    fileFilter: function (req, file, cb) {
        if (!file.mimetype.includes("image/png") &&
            !file.mimetype.includes("image/jpeg")) {
            return cb(new Error('類型錯誤'));
        }
        cb(null, true);
    }
});

index.post('/admin_upload/news/:number', newsUpload.single('myfile'), (req, res, next) => {
    var writein = req.body;
    console.log("找你" + writein.title);
    if (writein.title) {
        var sql = `INSERT INTO news (news_title,news_text,news_img,news_class) VALUES (?,?,?,?);`;
        var data = [writein.title, writein.news_text, "../../img/news/" + req.file.filename, writein.kind];
        console.log(data);
        db.query(sql, data, function (err, result, field) {
            console.log(result);
            if (result.insertId) {
                res.redirect('back');
            } else {
                res.end(
                    JSON.stringify(new Error('insert failed'))
                )
            }
        });
    } else {
        var sql = `UPDATE news SET news_img = ?  WHERE newsid = ?;`;
        var data = ["../../img/news/" + req.file.filename, req.params.number];
        db.query(sql, data, function (err, result, field) {
            console.log(result);
            if (result.affectedRows) {
                res.redirect('back');
            } else {
                res.end(
                    JSON.stringify(new Error('update failed'))
                )
            }
        });
    }
});

var coachStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/img/coach");
    },
    filename: function (req, file, cb) {
        var newName = 'coach' + req.params.number + '.' + file.originalname.split('.')[1];
        cb(null, newName);
    }
})

var coachUpload = multer({
    storage: coachStorage,
    fileFilter: function (req, file, cb) {
        if (!file.mimetype.includes("image/png") &&
            !file.mimetype.includes("image/jpeg")) {
            return cb(new Error('類型錯誤'));
        }
        cb(null, true);
    }
});

index.post('/admin_upload/coach/:number', coachUpload.single('myfile'), (req, res, next) => {
    var writein = req.body;
    console.log("找你" + writein.name);
    if (writein.name) {
        var sql = `INSERT INTO coach (cname,skill,cinfo,building,cimg) VALUES (?,?,?,?,?);`;
        var data = [writein.name, writein.skill, writein.info, writein.building, "../../img/coach/" + req.file.filename];
        console.log(data);
        db.query(sql, data, function (err, result, field) {
            console.log(result);
            if (result.insertId) {
                res.redirect('back');
            } else {
                res.end(
                    JSON.stringify(new Error('insert failed'))
                )
            }
        });
    } else {
        var sql = `UPDATE coach SET cimg = ?  WHERE cid = ?;`;
        var data = ["../../img/coach/" + req.file.filename, req.params.number];
        db.query(sql, data, function (err, result, field) {
            console.log(result);
            if (result.affectedRows) {
                res.redirect('back');
            } else {
                res.end(
                    JSON.stringify(new Error('update failed'))
                )
            }
        });
    }
});

var spaceStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/img/space");
    },
    filename: function (req, file, cb) {
        var newName = 'space' + req.params.number + '.' + file.originalname.split('.')[1];
        cb(null, newName);
    }
})

var spaceUpload = multer({
    storage: spaceStorage,
    fileFilter: function (req, file, cb) {
        if (!file.mimetype.includes("image/png") &&
            !file.mimetype.includes("image/jpeg")) {
            return cb(new Error('類型錯誤'));
        }
        cb(null, true);
    }
});

index.post('/admin_upload/space/:number', spaceUpload.single('myfile'), (req, res, next) => {
    var writein = req.body;
    console.log("找你" + writein.name);
    if (writein.name) {
        var sql = `INSERT INTO space (cname,skill,cinfo,building,cimg) VALUES (?,?,?,?,?);`;
        var data = [writein.name, writein.skill, writein.info, writein.building, "../../img/space/" + req.file.filename];
        console.log(data);
        db.query(sql, data, function (err, result, field) {
            console.log(result);
            if (result.insertId) {
                res.redirect('back');
            } else {
                res.end(
                    JSON.stringify(new Error('insert failed'))
                )
            }
        });
    } else {
        var sql = `UPDATE space SET space_img = ?  WHERE spaceid = ?;`;
        var data = ["../../img/space/" + req.file.filename, req.params.number];
        console.log(data);
        db.query(sql, data, function (err, result, field) {
            console.log(result);
            if (result.affectedRows) {
                res.redirect('back');
            } else {
                res.end(
                    JSON.stringify(new Error('update failed'))
                )
            }
        });
    }
});




module.exports = index;