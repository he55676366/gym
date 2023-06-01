

/* 介紹方塊 */
// showLeftSlide()
// 1師資
function showLeftSlide() {
    var popup = $("#popup_text_left");
    if (popup.hasClass("show")) {  //unshow
        popup.animate({ left: '500px', opacity: '0' }, 1000, function () {
            popup.removeClass("show");
        });
    } else { //show
        popup.addClass("show");
        popup.animate({ left: '700px', opacity: '1' }, 1000);
    }
}

// showRightSlide()
// 2課程
function showRightSlide() {
    var popup = $("#popup_text_right");
    if (popup.hasClass("show")) {
        popup.animate({ left: '500px', opacity: '0' }, 1000, function () {
            popup.removeClass("show");
        });
    } else {
        popup.addClass("show");
        popup.animate({ left: '350px', opacity: '1' }, 1000);
    }
}



// showRightSlide2()
// 3預約
function showLeftSlide2() {
    var popup = $("#popup_text_Left2");
    if (popup.hasClass("show")) {
        popup.animate({ left: '500px', opacity: '0' }, 1000, function () {
            popup.removeClass("show");
        });
    } else {
        popup.addClass("show");
        popup.animate({ left: '700px', opacity: '1' }, 1000);
    }
}

// showLeftSlide2()
// 4會員
function showRightSlide2() {
    var popup = $("#popup_text_Right2");
    if (popup.hasClass("show")) {
        popup.animate({ left: '500px', opacity: '0' }, 1000, function () {
            popup.removeClass("show");
        });
    } else {
        popup.addClass("show");
        popup.animate({ left: '350px', opacity: '1' }, 1000);
    }
}


// // 連連看 不能放這


  