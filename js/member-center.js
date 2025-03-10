'use strict'
// 選取元素
const openLightboxBtn = document.querySelector('.logout-btn')
const openLightboxBtnMobile = document.querySelector('.logout-btn-mobile')
const lightbox = document.querySelector('.alert-light-box-container') 
const closeIcon = document.querySelector('.fa-x');
const cancelBtn = document.querySelector('.cancel-btn')
const comfirmBtn = document.querySelector('.comfirm-btn')
const navbarItems = document.querySelectorAll('.aside-navbar-item');
const navbarItemsMobile = document.querySelectorAll('.mobile-asidebar');
const heartIcon = document.querySelector('.fa-heart');
const successMsg = document.querySelector('.alert-info-logout-success');
const alertMsg = document.querySelector('.alert-info');
const backToHomePageBtn = document.querySelector('.go-back-index-btn')

//處理導航欄項目點擊效果
navbarItems.forEach(item => {
    item.addEventListener('click',()=>{
        navbarItems.forEach(item => {
            item.classList.remove('asidebar-actived-btn');
        })
            item.classList.add('asidebar-actived-btn');

    })
})
//處理導航欄項目點擊效果手機版
navbarItemsMobile.forEach(item => {
    item.addEventListener('click',()=>{
        navbarItemsMobile.forEach(item => {
            item.classList.remove('asidebar-actived-btn-mobile');
        })
            item.classList.add('asidebar-actived-btn-mobile');
    })
})
//登出lightbox開關
function closeLightbox (event) {
    //若event.target裡面包涵以下class name時，不能調用closeLightbox函式
    const noncloseClasses = ['alert-info', 'warning-sign', 'warning-sign-title','comfirm-btn'];
    if(!noncloseClasses.some(className => event.target.classList.contains(className))) {
        lightbox.style.display = 'none';
    }
}

function openLightbox () {
    lightbox.style.display = 'block';
}
function logoutsPopup (event) {
    event.stopPropagation()
    alertMsg.style.display = 'none';
    successMsg.style.display = "block";
    lightbox.removeEventListener('click',  closeLightbox)
}


[closeIcon, cancelBtn, lightbox].forEach(el => el.addEventListener('click', closeLightbox));
[openLightboxBtn,openLightboxBtnMobile].forEach(el => el.addEventListener('click', openLightbox));
comfirmBtn.addEventListener('click',logoutsPopup);
