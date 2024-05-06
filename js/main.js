//pop product carousel
let items = document.querySelectorAll('.popular-goods-card-list .good-cards ');
let cartBtn = document.getElementsByClassName("add-cart-btn")
let next = document.getElementById('next');
let prev = document.getElementById('prev')

let active = 3;
function loadShow() {
    let stt = 0;
    items[active].style.transform = "none";
    items[active].style.zIndex = 1;
    items[active].style.filter = 'none';
    items[active].style.opacity = 1;
    cartBtn[active].style.display = "block"
    items[active].style.backgroundColor = "#26a69a";

    for (var i = active + 1;i < items.length;i++) {
        stt++;
        items[i].style.transform = `translateX(${240*stt}px) scale(${1 - 0.2 * stt}) perspective(16px) rotateY(-1deg)`;
        items[i].style.zIndex = -stt;
        items[i].style.filter = "blur(5px)"
        items[i].style.opacity = stt > 2 ? 0:0.6;
        cartBtn[i].style.display = "none";
        items[i].style.backgroundColor = "#D9D9D9";
    }
    stt = 0;
    for ( var i = active - 1;i >= 0 ;i--) {
        stt++;
        items[i].style.transform = `translateX(${-240*stt}px) scale(${1 - 0.2 * stt}) perspective(16px) rotateY(1deg)`;
        items[i].style.zIndex = -stt;
        items[i].style.filter = "blur(5px)"
        items[i].style.opacity = stt > 2 ? 0:0.6;
        cartBtn[i].style.display = "none";
        items[i].style.backgroundColor = "#D9D9D9";

    }
}
loadShow();
next.onclick = function () {
    active = active + 1 < items.length ? active + 1: active;
    loadShow();
}
prev.onclick = function () {
    active = active - 1 >= 0 ? active - 1: active;
    loadShow();
}