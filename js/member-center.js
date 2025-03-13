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
const backToHomePageBtn = document.querySelector('.go-back-index-btn');
let account;
const alertLoginMsg = document.querySelector('.go-to-login-msg');
//  main information display fields
const memberInfo = document.querySelector('.member-info-display-container');
const cartInfo = document.querySelector('.member-cart-status-info-container');
const courseInfo = document.querySelector('.surfing-course-info-container');
const surfingBoardRentalInfo = document.querySelector('.sufing-board-rental-info-container');
const noItemMsg = document.querySelectorAll('.no-item-msg')
// member information area
let navUserAccountName = document.querySelector('.user-account-name');
let userName = document.querySelector('.user-name');
let userFirstName = document.querySelector('#user-first-name');
let userLastName = document.querySelector('#user-last-name');
let userEmail = document.querySelector("#user-email");
let userPhoneNum = document.querySelector("#user-phone-number");
let userAddress = document.querySelector("#user-address");
// const productList = [];
// const userCart = {
//     cartInfo: [],
//     courseInfo: [],
//     surfingBoardRentalInfo: []
// };

//處理導航欄項目點擊效果
navbarItems.forEach(item => {
    item.addEventListener('click', () => {
        navbarItems.forEach(item => {
            item.classList.remove('asidebar-actived-btn');
        })
        item.classList.add('asidebar-actived-btn');
        displayMainField(item.classList[1]);
    })
})
//處理導航欄項目點擊效果手機版
navbarItemsMobile.forEach(item => {
    item.addEventListener('click', () => {
        navbarItemsMobile.forEach(item => {
            item.classList.remove('asidebar-actived-btn-mobile');
        })
        item.classList.add('asidebar-actived-btn-mobile');
        document.querySelector('.burger-toggle-btn').checked = false;
        displayMainField(item.classList[1]);
    })
})
//登出lightbox開關
function closeLightbox(event) {
    //若event.target裡面包涵以下class name時，不能調用closeLightbox函式
    const noncloseClasses = ['alert-info', 'warning-sign', 'warning-sign-title', 'comfirm-btn'];
    if (!noncloseClasses.some(className => event.target.classList.contains(className))) {
        lightbox.style.display = 'none';
    }
}

function openLightbox() {
    lightbox.style.display = 'block';
}
function logoutsPopup(event) {
    event.stopPropagation()
    alertMsg.style.display = 'none';
    successMsg.style.display = "block";
    lightbox.removeEventListener('click', closeLightbox)
}

function checkUserLogin() {
    let userInfor = JSON.parse(localStorage.getItem('userInfor'));
    if (userInfor === null) {
        alertLoginMsg.style.display = "block";
    }else {
    for (let user of userInfor) {
        if (user.isLogin) account = { ...user };
        console.log(account);
    }
}
};

function updateUserInfo() {
    // 確認是否有登入
    if (account === undefined || !account.isLogin) alertLoginMsg.style.display = "block";
    // 若有登入
    // 更新使用者資料在member info display container裡
    userFirstName.value = account.firstName;
    userLastName.value = account.lastName;
    userPhoneNum.value = account.phoneNumber;
    userEmail.value = account.email;
    userAddress.value = account.address;
    displayUserCartItem("products",0,"cart-info-field");
    displayUserCartItem("courses",1,"course-info-field");
    displayUserCartItem("rental",2,"sufing-board-rental-info-field");
}

function displayUserCartItem(target,index,selectDisplayField) {
    const displayField = document.querySelector(`.${selectDisplayField}`);
    const targetTable = document.querySelectorAll('table')[2];
    console.log(targetTable)
    console.log(account.cart[target].length);
  if(account.cart[target].length === 0) {
    noItemMsg[index].style.display = 'block';
    targetTable.style.display = "none"
  }else {
    let cartList = document.querySelectorAll('.cart-info-card-list')[index];
    let targetTableBody = document.querySelectorAll('tbody')[index];
    for(let i = 0;i < account.cart[target].length;i++) {
        let tr = document.createElement('tr');
        let div = document.createElement('div');
        div.classList.add('cart-item-card');
       if(index === 0) {
            tr.innerHTML = `
            <td class="item-number">${i + 1}</td>
                        <td class="product-img-wrapper"><img class="item-img"
                                src="${account.cart[target][i].mainImage}"
                                alt="${account.cart[target][i].name}的圖片"></td>
                        <td class="item-name">${account.cart[target][i].name}</td>
                        <td class="item-price-tag">${account.cart[target][i].priceTag}</td>
                        <td class="item-amount">${account.cart[target][i].count}</td>
                        <td class="item-status"><span class="product-status-sign"></span>${account.cart[target][i].productStatus}</td>
            `;
            div.innerHTML = `
                 <p class="product-img-wrapper"><img class="item-img"
                                src="${account.cart[target][i].mainImage}"
                                alt="${account.cart[target][i].name}的圖片"></p>
                        <div class="cart-item-card-content">
                            <p><span class="item-name">${account.cart[target][i].name}</span></p>
                            <p>金額：<span class="item-price-tag">${account.cart[target][i].priceTag}</span></p>
                            <p>商品狀態：<span class="product-status-sign"></span><span class="item-status">${account.cart[target][i].productStatus}</span></p>
                            <p>數量：<span class="item-amount">${i + 1}</span></p>
                        </div>
            `;

       }else if (index === 1) {
        tr.innerHTML = `
                    <td class="product-img-wrapper"><img class="item-img"
                            src="${account.cart[target][i].mainImage}"
                            alt="${account.cart[target][i].courseName}的圖片"></td>
                    <td class="item-name" colspan="2">${account.cart[target][i].courseName}</td>
                    <td class="item-price-tag">${account.cart[target][i].priceTag}</td>
                    <td class="item-price-tag">${account.cart[target][i].reservationDate}</td>
                    <td class="item-amount">${account.cart[target][i].count}人</td>
                    <td class="item-deposit">${account.cart[target][i].deposit}</td>
        `;
        div.innerHTML = `
             <p class="product-img-wrapper"><img class="item-img"
                            src="${account.cart[target][i].mainImage}"
                            alt="${account.cart[target][i].courseName}的圖片"></p>
                    <div class="cart-item-card-content">
                       <p>課程類型：<span class="item-name">${account.cart[target][i].courseName}</span></p>
                            <p>上課日期：<span class="item-course-date">${account.cart[target][i].reservationDate}</span></p>
                            <p>總金額：<span class="item-price-tag">${account.cart[target][i].priceTag}</span></p>
                            <p>押金：<span class="item-deposit">${account.cart[target][i].deposit}</span></p>
                            <p>人數：<span class="item-amount">${account.cart[target][i].count}人</span>人</p>
                    </div>
        `;
       }else {
        tr.innerHTML = `
                    <td colspan="2" class="product-img-wrapper"><img class="item-img"
                            src="${account.cart[target][i].mainImage}"
                            alt="${account.cart[target][i].boardType}的圖片"></td>
                    <td colspan="2" class="item-name">${account.cart[target][i].boardType}</td>
                    <td class="item-price-tag">${account.cart[target][i].priceTag}</td>
                    <td class="item-price-tag">${account.cart[target][i].reservationDate}</td>
                    <td class="item-amount">${account.cart[target][i].count}個</td>
        `;
        div.innerHTML = `
             <p class="product-img-wrapper"><img class="item-img"
                            src="${account.cart[target][i].mainImage}"
                            alt="${account.cart[target][i].name}的圖片"></p>
                    <div class="cart-item-card-content">
                      <p>租板類型：<span class="item-name">${account.cart[target][i].boardType}</span></p>
                            <p>預約日期：<span class="item-reservation-date">${account.cart[target][i].reservationDate}</span></p>
                            <p>總金額：<span class="item-price-tag">${account.cart[target][i].priceTag}</span></p>
                            <p>數量：<span class="item-amount">${account.cart[target][i].count}個</span></p>
                    </div>
        `;
       }
       targetTableBody.append(tr);
       cartList.append(div);
    }

  }
   

}

    // aside bar switch display area 
    function displayMainField(asideItem) {
        // 判斷目前item
        let currentItem = asideItem;
        // 按照目前item顯示相對應得main field
        [memberInfo, cartInfo, courseInfo, surfingBoardRentalInfo].forEach(field => {
            if (field.classList.contains(currentItem)) {
                field.classList.add('main-info-actived');
            } else {
                field.classList.remove('main-info-actived');
            }
        })
    }


    [closeIcon, cancelBtn, lightbox].forEach(el => el.addEventListener('click', closeLightbox));
    [openLightboxBtn, openLightboxBtnMobile].forEach(el => el.addEventListener('click', openLightbox));
    comfirmBtn.addEventListener('click', logoutsPopup);
    window.addEventListener('load',() => {
        checkUserLogin();
        updateUserInfo()
    });
