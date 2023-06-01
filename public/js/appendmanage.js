var tfoot = $(`<tfoot>
<tr>
  <td colspan="1">
    <div  class="d-flex justify-content-between mx-3 my-2">
        <div>
        ${Array.from({ length: last }, (v, i) => `
            <span><a href="/manage/${change}/${i + 1}">${i + 1}</a></span>
        `).join('')}
        </div>
        <div style="margin-right: 20px;">總數 ${nums} 筆，共 ${curr}/${last} 頁</div>

    </div>
  </td>
</tr>
</tfoot>
`)


switch (change) {
    //會員
    case "member":
        console.log(change);
        $('#main').empty();
        $('#main').append(`<h3>會員列表</h3>
            <table>
                <thead>
                    <th>編號</th>
                    <th>帳號</th>
                    <th>名稱</th>
                    <th>電話</th>
                    <th>信箱</th>
                    <th>生日</th>
                    <th>地址</th>
                    <th>積分</th>
                    <th>總入場時間</th>
                    <th>更新時間</th>
                    <th>相片</th>
                    <th></th>                    
                </thead>
                ${data.map((item, index) => `
                <tr class="list${item.mid} list" >
                    <td>${item.mid}</td>
                    <td>${item.maccount}</td>
                    <td>${item.mname}</td>
                    <td>${item.mphone}</td>
                    <td>${item.memail}</td>
                    <td>${item.mbirth}</td>
                    <td>${item.maddress}</td>
                    <td>${item.point}</td>
                    <td>${item.total_times}</td>
                    <td>${item.updated_at}</td>
                    <td>
                        <span class="d-none">../${item.avatar}</span>
                        <button class="img" onclick="imgUpload(${item.mid})">圖片</button>
                    </td>
                    <td>
                        <button onclick="edit(${item.mid})">編輯</button>
                    </td>
                </tr>
            `).join('')}
                </tbody>
            </table>
            <dialog id="dialogmember">
                <form method="POST">
                    <input type="hidden" name="id">
                    <input type="hidden" name="account">
                    名稱: <input type="text" name="name"><br>
                    電話: <input type="text" name="phone"><br>
                    信箱: <input type="email" name="email"><br>
                    生日: <input type="date" name="birth"><br>
                    地址: <input type="text" name="address"><br>
                    <button type="submit" class="submit">更新</button>
                    <button type="button" class="close">關閉</button>
                </form>
            </dialog>
        `);
        var table_length = $('table  th').length;
        $('table').append(tfoot);
        $('tfoot td').eq(0).attr('colspan', table_length);
        $('table tr.list').each(function () {
            var ver = $(this).find('td:first-child');
            var ver2 = ver.text().padStart(7, "M000000");
            ver.replaceWith(`<td>${ver2}</td>`);
        });

        break;

    //團體課程
    case "teamClass":
        console.log(change);
        $('#main').empty();
        $('#main').append(`<h3>團體課程列表</h3>
            <button onclick="add()">新增表單</button>
            <table>
                <thead>
                    <th>編號</th>
                    <th>課程名稱</th>
                    <th>教練名稱</th>
                    <th>開始時間</th>
                    <th>結束時間</th>
                    <th>活動人數</th>
                    <th>場館</th>
                    <th></th>
                </thead>
                <tbody>
                    ${data.map((item, index) => `
                        <tr class="list${item.team_csid} list" >
                            <td>${item.team_csid} </td>
                            <td>${item.csname}</td>
                            <td>${item.cname}</td>
                            <td>${item.sdate}</td>
                            <td>${item.edate}</td>
                            <td>${item.total_number}</td>
                            <td>${item.building}</td>
                            <td>
                                <button onclick="edit(${item.team_csid})">編輯</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <dialog id="dialogteamClass">
            <form method="POST" class="teamClass">
                <input type="hidden" name="id">
                課程名稱: <input type="hidden" name="csname">
                <select name="csname" id=""></select><br>
                教練名稱: <input type="hidden" name="cname">
                <select name="cname" id=""></select><br>
                開始時間: <input type="date" name="sdate"><br>
                結束時間: <input type="date" name="edate"><br>
                活動人數: <input type="number" name="total_number"><br>
                <input type="hidden" name="building"><br>
                <button type="submit" class="submit">更新</button>
                <button type="button" class="close">關閉</button>
            </form>
            </dialog>

            <dialog id="addteamClass">
            <form method="POST" class="teamClass">
                <input type="hidden" name="id">
                課程名稱: 
                <select name="csname" id=""></select><br>
                教練名稱: 
                <select name="cname" id=""></select><br>
                開始時間: <input type="date" name="sdate"><br>
                結束時間: <input type="date" name="edate"><br>
                活動人數: <input type="number" name="total_number"><br>
                <button type="submit" class="submitAdd">新增</button>
                <button type="button" class="close">關閉</button>
            </form>
        </dialog>`);
        var table_length = $('table  th').length;
        $('table').append(tfoot);
        $('tfoot td').eq(0).attr('colspan', table_length);

        $('table tr.list').each(function () {
            var ver = $(this).find('td:first-child');
            var ver2 = ver.text().padStart(7, "T000000");
            ver.replaceWith(`<td>${ver2}</td>`);
        });

        var myselect = $(`.teamClass select`)
        myselect.eq(0).append(
            `${add1.map((item, index) => `
        <option value="${item.csname}">${item.csname}</option>`
            ).join('')}`
        );
        myselect.eq(1).append(
            `${add2.map((item, index) => `
        <option value="${item.cname}">${item.cname}</option>`
            ).join('')}`
        );
        myselect.eq(2).append(
            `${add1.map((item, index) => `
            <option value="${item.csid}">${item.csname}</option>`
            ).join('')}`
        );
        myselect.eq(3).append(
            `${add2.map((item, index) => `
        <option value="${item.cid}">${item.cname}</option>`
            ).join('')}`
        );
        break;
    //產品
    case "products":
        console.log(change);
        $('#main').empty();
        $('#main').append(`<h3>產品列表</h3>
            <button onclick="add()">新增表單</button>
            <table>
                <thead>
                    <th>編號</th>
                    <th>名稱</th>
                    <th>價格</th>
                    <th>存貨</th>
                    <th>產品描述</th>
                    <th></th>
                </thead>
                <tbody>
                     ${data.map((item, index) => `
                        <tr class="list${item.productid} list" >
                            <td>${item.productid} </td>
                            <td>${item.product_name}</td>
                            <td>${item.price}</td>
                            <td>${item.inventory}</td>
                            <td>${item.description}</td>
                            <td>
                                <button onclick="edit(${item.productid})">編輯</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <dialog id="dialogproducts">
            <form method="POST">
                <input type="hidden" name="id">
                產品名稱: <input type="text" name="name"><br>
                價格: <input type="number" name="price"><br>
                存貨: <input type="number" name="inventory"><br>
                產品描述: <input type="text" name="description"><br>
                <button type="submit" class="submit">更新</button>
                <button type="button" class="close">關閉</button>
            </form>
        </dialog>

        <dialog id="addproducts">
        <form method="POST">
            <input type="hidden" name="id">
            產品名稱: <input type="text" name="name"><br>
            價格: <input type="number" name="price"><br>
            存貨: <input type="number" name="inventory"><br>
            產品描述: <input type="text" name="description"><br>
            <button type="submit" class="submitAdd">新增</button>
            <button type="button" class="close">關閉</button>
        </form>
    </dialog>

        `);
        var table_length = $('table  th').length;
        $('table').append(tfoot);
        $('tfoot td').eq(0).attr('colspan', table_length);

        $('table tr.list').each(function () {
            var ver = $(this).find('td:first-child');
            var ver2 = ver.text().padStart(7, "P000000");
            ver.replaceWith(`<td>${ver2}</td>`);
        });
        break;
    //最新
    case "news":
        console.log(data);
        $('#main').empty();
        $('#main').append(`<h3>最新消息</h3>
                <button onclick="add()">新增表單</button>
                <table>
                    <thead>
                        <th>編號</th>
                        <th>標題</th>
                        <th class="cover">內文</th>
                        <th>圖片</th>
                        <th>種類</th>
                        <th>時間</th>
                        <th></th>
                    </thead>
                    <tbody class='test'>
                         ${data.map((item, index) => `
                            <tr class="list${item.newsid} list" >
                                <td>${item.newsid} </td>
                                <td>${item.news_title}</td>
                                <td class="cover">${item.news_text}</td>
                                <td>
                                    <span class="d-none">${item.news_img}</span>
                                    <button class="img" onclick="imgUpload(${item.newsid})">圖片</button>
                                </td>
                                <td >${item.news_class}</td>
                                <td >${item.created_at}</td>
                                <td>
                                    <button onclick="edit(${item.newsid})">編輯</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <dialog id="dialognews">
                <form method="POST">
                    <input type="hidden" name="id">
                    標題: <input type="text" name="title"><br>
                    內文:<input type="hidden" name="news_text"><br>
                    <textarea name="news_text" id="" cols="30" rows="10"></textarea><br>
                    <input type="hidden" name="img">
                    種類: <input type="hidden" name="kind">
                    <select name="kind" >
                        <option value="food">food</option>
                        <option value="exercise">exercise</option>
                        <option value="health">health</option>
                    </select> 
                    <br>
                    <button type="submit" class="submit">更新</button>
                    <button type="button" class="close">關閉</button>
                </form>
            </dialog>

            <dialog id="addnews">
            <form method="POST" enctype="multipart/form-data">
                <input type="hidden" name="id">
                標題: <input type="text" name="title"><br>
                內文: <br><textarea name="news_text"  cols="30" rows="10"></textarea><br>
                圖片: <input type="file" name="myfile" accept="image/*"><br>
                種類:
                <select name="kind" >
                    <option value="food">food</option>
                    <option value="exercise">exercise</option>
                    <option value="health">health</option>
                </select> 
                <br>
                <button type="submit" class="subimg" disabled>新增</button>
                <button type="button" class="close">關閉</button>
            </form>
        </dialog>

            `);
        var table_length = $('table  th').length;
        $('table').append(tfoot);
        $('tfoot td').eq(0).attr('colspan', table_length);

        $('table tr.list').each(function () {
            var ver = $(this).find('td:first-child');
            var ver2 = ver.text().padStart(7, "N000000");
            ver.replaceWith(`<td>${ver2}</td>`);
        });
        break;
    case "coach":
        console.log(change);
        $('#main').empty();
        $('#main').append(`<h3>教練列表</h3>
            <button onclick="add()">新增表單</button>
                <table>
                    <thead>
                        <th>編號</th>
                        <th>名稱</th>
                        <th>資訊</th>
                        <th>場館</th>
                        <th>照片</th>
                        <th></th>
                    </thead>
                    ${data.map((item, index) => `
                    <tr class="list${item.cid} list" >
                        <td>${item.cid}</td>
                        <td>${item.cname}</td>
                        <td>${item.skill}</td>
                        <td>${item.building}</td>
                        <td>
                           <span class="d-none">${item.cimg}</span>
                           <button class="img" onclick="imgUpload(${item.cid})">圖片</button>
                        </td>
                        <td>
                            <button onclick="edit(${item.cid})">編輯</button>
                        </td>
                    </tr>
                `).join('')}
                    </tbody>
                </table>

                <dialog id="dialogcoach">
                <form method="POST">
                    <input type="hidden" name="id">
                    名稱: <input type="text" name="name"><br>
                    技能: <input type="text" name="skill"><br>
                    資訊:<input type="hidden" name="info"><br>
                    <textarea name="info" id="" cols="30" rows="10"></textarea><br>
                    場館: <input type="hidden" name="building">
                    <select name="building" >
                        <option value="台北旗艦館">台北旗艦館</option>
                        <option value="台中文心館">台中文心館</option>
                        <option value="高雄草衙館">高雄草衙館</option>
                    </select> 
                    <br>
                    <button type="submit" class="submit">更新</button>
                    <button type="button" class="close">關閉</button>
                </form>
            </dialog>

            <dialog id="addcoach">
            <form method="POST" enctype="multipart/form-data">
                <input type="hidden" name="id">
                名稱: <input type="text" name="name"><br>
                技能: <input type="text" name="skill"><br>
                資訊: <br><textarea name="info" id="" cols="30" rows="10"></textarea><br>
                場館: 
                <select name="building" >
                    <option value="台北旗艦館">台北旗艦館</option>
                    <option value="台中文心館">台中文心館</option>
                    <option value="高雄草衙館">高雄草衙館</option>
                </select><br>
                圖片: <input type="file" name="myfile" accept="image/*"><br> 
                <br>
                <button type="submit" class="subimg" disabled>更新</button>
                <button type="button" class="close">關閉</button>
            </form>
        </dialog>

            `);
        var table_length = $('table  th').length;
        $('table').append(tfoot);
        $('tfoot td').eq(0).attr('colspan', table_length);

        $('table tr.list').each(function () {
            var ver = $(this).find('td:first-child');
            var ver2 = ver.text().padStart(7, "C000000");
            ver.replaceWith(`<td>${ver2}</td>`);
        });
        break;
    //進場
    case "enterTime":
        console.log(change);
        $('#main').empty();
        $('#main').append(`<h3>進場紀錄</h3>
                        <table>
                            <thead>
                                <th>會員</th>
                                <th>場館</th>
                                <th>進場時間</th>
                                <th>離場時間</th>
                            </thead>
                            <tbody>
                                 ${data.map((item, index) => `
                                    <tr class="list${item.entertime_id} list" >
                                        <td>${item.mname} </td>
                                        <td>${item.building} </td>
                                        <td>${item.entertime}</td>
                                        <td>${item.exittime}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    `);
        var table_length = $('table  th').length;
        $('table').append(tfoot);
        $('tfoot td').eq(0).attr('colspan', table_length);
        break;

    //課程
    case "classinfo":
        console.log(change);
        $('#main').empty();
        $('#main').append(`<h3>課程列表</h3>
                    <button onclick="add()">新增表單</button>
                        <table>
                            <thead>
                                <th>編號</th>
                                <th>名稱</th>
                                <th>細節</th>
                                <th></th>
                            </thead>
                            ${data.map((item, index) => `
                            <tr class="list${item.csid} list" >
                                <td>${item.csid}</td>
                                <td>${item.csname}</td>
                                <td>${item.csdetail}</td>
                                <td>
                                    <button onclick="edit(${item.csid})">編輯</button>
                                </td>
                            </tr>
                        `).join('')}
                            </tbody>
                        </table>

                    <dialog id="dialogclassinfo">
                        <form method="POST">
                            <input type="hidden" name="id">
                            名稱: <input type="text" name="name"><br>
                            細節: <input type="hidden" name="detail"><br>
                            <textarea name="detail" cols="30" rows="10"></textarea><br>
                            <button type="submit" class="submit">新增</button>
                            <button type="button" class="close">關閉</button>
                        </form>
                    </dialog>

                    <dialog id="addclassinfo">
                        <form method="POST">
                            <input type="hidden" name="id">
                            名稱: <input type="text" name="name"><br>
                            細節: <br><textarea name="detail" cols="30" rows="10"></textarea><br>
                            <button type="submit" class="submitAdd">新增</button>
                            <button type="button" class="close">關閉</button>
                        </form>
                    </dialog>
            `);
        var table_length = $('table  th').length;
        $('table').append(tfoot);
        $('tfoot td').eq(0).attr('colspan', table_length);

        $('table tr.list').each(function () {
            var ver = $(this).find('td:first-child');
            var ver2 = ver.text().padStart(7, "CS00000");
            ver.replaceWith(`<td>${ver2}</td>`);
        });
        break;

    //團課預約
    case "teamClassReserve":
        console.log(change);
        $('#main').empty();
        $('#main').append(`<h3>團課預約列表</h3>
                            <table>
                                <thead>
                                    <th>編號</th>
                                    <th>會員名稱</th>
                                    <th>課程名稱</th>
                                    <th></th>
                                </thead>
                                ${data.map((item, index) => `
                                <tr class="list${item.team_resid} list" >
                                    <td>${item.team_resid}</td>
                                    <td>${item.mname}</td>
                                    <td>${item.csname}</td>
                                    <td>
                                        <button onclick="edit(${item.team_resid})">編輯</button>
                                    </td>
                                </tr>
                            `).join('')}
                                </tbody>
                            </table>

                            <dialog id="dialog${change}">
                            <form method="POST">
                                <input type="hidden" name="id">
                                會員名稱: <input type="text" name="name"><br>
                                課程名稱: <input type="text" name="csname"><br>
                                <button type="submit" class="submit">新增</button>
                                <button type="button" class="close">關閉</button>
                            </form>
                        </dialog>
    
                        <dialog id="add${change}">
                            <form method="POST">
                                <input type="hidden" name="id">
                                會員名稱: <input type="text" name="name"><br>
                                課程名稱: <input type="text" name="csname"><br>
                                <button type="submit" class="submitAdd">新增</button>
                                <button type="button" class="close">關閉</button>
                            </form>
                        </dialog>
                        `);
        var table_length = $('table  th').length;
        $('table').append(tfoot);
        $('tfoot td').eq(0).attr('colspan', table_length);

        $('table tr.list').each(function () {
            var ver = $(this).find('td:first-child');
            var ver2 = ver.text().padStart(7, "TR00000");
            ver.replaceWith(`<td>${ver2}</td>`);
        });
        break;
        case "space":
        console.log(change);
        $('#main').empty();
        $('#main').append(`<h3>團體課程列表</h3>
            <button onclick="add()">新增表單</button>
            <table>
                <thead>
                    <th>編號</th>
                    <th>空間名稱</th>
                    <th>空間資訊</th>
                    <th>場館</th>
                    <th>圖片</th>
                    <th></th>
                </thead>
                <tbody>
                    ${data.map((item, index) => `
                        <tr class="list${item.spaceid} list" >
                            <td>${item.spaceid} </td>
                            <td>${item.space_name}</td>
                            <td>${item.space_info}</td>
                            <td>${item.building}</td>
                            <td>                           
                                <span class="d-none">${item.space_img}</span>
                                <button class="img" onclick="imgUpload(${item.spaceid})">圖片</button>
                            </td>
                            <td>
                                <button onclick="edit(${item.team_csid})">編輯</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <dialog id="dialog${change}">
            <form method="POST" >
                <input type="hidden" name="id">
                課程名稱: <input type="hidden" name="csname">
                <select name="csname" id=""></select><br>
                教練名稱: <input type="hidden" name="cname">
                <select name="cname" id=""></select><br>
                開始時間: <input type="date" name="sdate"><br>
                結束時間: <input type="date" name="edate"><br>
                活動人數: <input type="number" name="total_number"><br>
                <input type="hidden" name="building"><br>
                <button type="submit" class="submit">更新</button>
                <button type="button" class="close">關閉</button>
            </form>
            </dialog>

            <dialog id="add${change}">
            <form method="POST" >
                <input type="hidden" name="id">
                課程名稱: 
                <select name="csname" id=""></select><br>
                教練名稱: 
                <select name="cname" id=""></select><br>
                開始時間: <input type="date" name="sdate"><br>
                結束時間: <input type="date" name="edate"><br>
                活動人數: <input type="number" name="total_number"><br>
                <button type="submit" class="submitAdd">新增</button>
                <button type="button" class="close">關閉</button>
            </form>
        </dialog>`);
        $('table tr.list').each(function () {
            var ver = $(this).find('td:first-child');
            var ver2 = ver.text().padStart(7, "SP00000");
            ver.replaceWith(`<td>${ver2}</td>`);
        });
        break;
    default:
        break;
}
var btncenter = $('td button').parent();
btncenter.css('text-align', 'center');