let items = document.querySelectorAll('.slider .list .item');
let next = document.querySelector('#next');
let pre = document.querySelector('#pre');
let thumbnail = document.querySelectorAll('.thumbnail .item');
let countItem = items.length;
let itemActive = 0;
const userPic = document.querySelector("#user-pic");
const userIcon = document.querySelector('.user-icon');
const userInfor = JSON.parse(localStorage.getItem('userInfor'));
let isLogin = false;
userInfor.forEach(account => {
    if (account.isLogin) {
        isLogin = true;
    };
    showUserPic(isLogin);
});

function showUserPic(isLogin) {
    if(isLogin === true) {
        userPic.style.display = "block";
        userIcon.style.display = "none";
    }else {
        userPic.style.display = "none";
        userIcon.style.display = "block";
    }
}
next.addEventListener('click',()=> {
    itemActive = itemActive + 1;
    if(itemActive >= countItem) {
        itemActive = 0;
    }
    showSlider();
})
pre.addEventListener('click',()=> {
    itemActive = itemActive -1;
    if(itemActive < 0) {
        itemActive = countItem - 1;
    }
    showSlider();
})
//aoto run slider 
let refreshInterval = setInterval(()=>{
    next.click();
},3000)
function showSlider() {
    let itemActiveOld = document.querySelector('.slider .list .item.active')
    let thumbnailOld = document.querySelector('.thumbnail .item.active')
    itemActiveOld.classList.remove('active');
    thumbnailOld.classList.remove('active');
    items[itemActive].classList.add('active');
    thumbnail[itemActive].classList.add('active');
    //clear auto time run slider
    clearInterval(refreshInterval);
    refreshInterval = setInterval(()=>{
        next.click();
    },5000)
}
thumbnail.forEach((thumbnail,index) => {
    thumbnail.addEventListener('click',()=> {
        itemActive = index;
        showSlider();
    })
})