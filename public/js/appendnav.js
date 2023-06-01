var Nav =$('#appendnav')
Nav.append(`<nav class="navbar navbar-expand-md fixed-top" id="nav">
<div class="container-fluid">
  <a class="navbar-brand" href="/index">
    <img style="height: 60px;" src="../img/logo/Vitality Gym Logo2_工作區域 1.png" alt="">
  </a>
  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
    aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="navbarA collapse navbar-collapse" id="navbarCollapse">
    <div class="dropdownA">
      <button class="dropbtnA">最新消息</button>
      <div class="dropdown-contentA">
        <a href="/news">全部文章</a>
        <a href="/news#food">飲食文章</a>
        <a href="/news#health">健康文章</a>
        <a href="/news#exercise">運動文章</a>
      </div>
    </div>
    <a href="about">關於我們</a>
    <div class="dropdownA">
      <button class="dropbtnA">課程與設備</button>
      <div class="dropdown-contentA">
        <a href="/class_equip#groupclass">團體課程</a>
        <a href="/class_equip#private">私人教練</a>
        <a href="/class_equip#space">空間</a>
        <a href="/class_equip#coach">師資</a>
        <a href="/class_equip#equip">設備</a>
      </div>
    </div>
    <div class="dropdownA">
      <button class="dropbtnA">會員專區</button>
      <div class="dropdown-contentA">
        <a href="/member">個人資料</a>
        <a href="/member#mEnter">造訪歷史紀錄</a>
        <a href="/member#mReserve">預約歷史紀錄</a>
        <a href="/member#mExchange">兌換紀錄</a>
      </div>
    </div>
    <a href="/shop" class="me-auto">商城</a>
    <div class="dropdownA">
      <button class="dropbtnA drop"><i class="material-symbols-outlined" style="font-size: 36px;">person</i></button>
      <div class="dropdown-contentA member">
      </div>
    </div>
    <a href="#"><i id="mode" class="material-symbols-outlined" style="font-size: 33px;">dark_mode</i></a>
  </div>
</div>
</nav>`
);
if(!token){
  Nav.find('.member').empty();
  Nav.find('.member').append(`<a class="dropdown-item  "href="/login">登入</a>
                              <a class="dropdown-item gap-2 " href="/register">註冊</a>`);
} else{
    $('.drop').parent().before(`<span>Hi,${user_name[0].mname}</span>`);
    Nav.find('.member').empty();
    Nav.find('.member').append(`<a class="dropdown-item" href="/logout">登出</a>`);
}

$(document).ready(function () {
  var x = false;
  $("#mode").on("click", function () {
    document.body.classList.toggle("dark");
    document.getElementById("nav").classList.toggle("dark");
    document.getElementById("mode").classList.toggle("icon");
    if (x == true) {
      $("nav button").css("color", "white")
      $("nav a").css("color", "white")
      x = false;
    } else {
      $("nav button").css("color", "#003b64")
      $("nav a").css("color", "#003b64")
      x = true;
    }
  })
})
