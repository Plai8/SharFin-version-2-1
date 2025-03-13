"use strict"
// user data
const userInfor = [
    {
        "id": 1,
        "firstName": "Peter",
        "lastName": "Lai",
        "phoneNumber": "0912345678",
        "address": "abc",
        "email": "a123456@gamil.com",
        "account": "peter01230",
        "password": "123456",
        "cart": {
            "products": [{
                "name": "002__95121.1550201513.1280.1280_900x",
                "mainImage": '../images/production-images/surfboard/002__95121.1550201513.1280.1280_900x.webp',
                "count": 2,
                "productStatus": "出貨中",
                "price": 10000,
                "priceTag": "$10,000",

            },
            ],
            "courses": [{
                "courseName": "半日體驗課程",
                "mainImage": '../images/index-images/surfing-course-halfday.jpg',
                "count": 1,
                "time": "09:30",
                "reservationDate": "2025-08-16",
                "isPaidDespoit": true,
                "price": 1500,
                "deposit":"$460",
                "priceTag": "$1500"
            }],
            "rental": [
            //     {
            //     "boardType": "長板",
            //     "reservationDate": "2025-08-16",
            //     "mainImage": '../images/production-images/surfboard/002__95121.1550201513.1280.1280_900x.webp',
            //     "count": 1,
            //     "price": 600,
            //     "deposit":"$460",
            //     "priceTag": "NT$600"
            // }
        ],
            "isPaidOff": true
        },
        "isLogin": false
    }
];


//DOM 元素
const wrapper = document.querySelector(".login-wrapper");
const switchBtns = document.querySelectorAll('.switch-btn');
const signUpField = document.querySelector('.sign-up-field');
const loginField = document.querySelector('.login-field');
const userAccount = document.querySelector('#userAccount');
const userPassword = document.querySelector('#userPassword');
let usersData;
const accountWarnSign = document.querySelector('.account-warning-msg');
const passwordWarnSign = document.querySelector('.password-warning-msg');
let account;
const inputFields = document.querySelectorAll("input");
const submitBtn = document.querySelector('.login-btn');
const alertMsgWrapper = document.querySelector('.login-alert-msg-wrapper');
// 頁面功能
// 滾動至 wrapper
function scrollToWrapper() {
    wrapper.scrollIntoView();
}

// 處理按鈕切換功能
function handleSwitchBtnClick(event) {
    // 移除所有按鈕的 'btn-actived' class
    switchBtns.forEach(btn => btn.classList.remove('btn-actived'));

    // 添加 'btn-actived' 到被點擊的按鈕
    const clickedBtn = event.currentTarget;
    clickedBtn.classList.add('btn-actived');

    // 顯示對應的內容區域
    const isLoginBtn = clickedBtn.classList.contains('switch-btn-login');
    loginField.style.display = isLoginBtn ? 'block' : 'none';
    signUpField.style.display = isLoginBtn ? 'none' : 'block';
}

// 初始化按鈕事件
switchBtns.forEach(btn => {
    btn.addEventListener('click', handleSwitchBtnClick);
});

// 設定初始顯示的內容
function fieldDivide() {
    const isWideScreen = window.innerWidth >= 1024;
    if (isWideScreen) {
        signUpField.style.display = "block";
        loginField.style.display = "block";
        scrollToWrapper();
    } else {
        signUpField.style.display = "none";
        loginField.style.display = "block";
        // 確保切換按鈕狀態初始化為登入按鈕
        switchBtns[0].classList.remove('btn-actived');
        switchBtns[1].classList.add('btn-actived');
    }

}

// 會員資料
// 將使用者資料存入localStorage
function storeUserData() {
    let userInforData = JSON.stringify(userInfor);
    if (localStorage.getItem("userInfor") === null) localStorage.setItem('userInfor', userInforData);
    usersData = JSON.parse(localStorage.getItem('userInfor'));
    fieldDivide();
};

function checkUserAccount() {
    // 檢查帳號或信箱是否存在
    for (let user of usersData) {
        if (userAccount.value !== user.email && userAccount.value !== "") {
            warningMsg("account", "email不存在!!");
            console.log(userAccount.value, userAccount.value !== user.account);
        } else if (userAccount.value === "") {
            warningMsg("account", "請輸入email!!");
        } else {
            account = { ...user };
        }
    }
    // 檢查密碼是否正確
    if (userPassword.value !== account.password && userPassword.value !== "") {
        warningMsg("password", "密碼錯誤！！");
    } else if (userPassword.value === "") {
        warningMsg("password", "請輸入密碼！！");
    } else {
        account.isLogin = true;
        for (let user of usersData) {
            console.log(user);
            if (user.id === account.id) usersData[user.id - 1] = account;
        }
        localStorage.setItem('userInfor', JSON.stringify(usersData));
        alertMsgWrapper.style.display = "block";
    }
}

function warningMsg(inputType, msg) {
    let currentInput = inputType;
    if (currentInput === "account") {
        accountWarnSign.style.display = "block";
        userAccount.style.border = "1px solid red";
        accountWarnSign.textContent = msg
    } else {
        userPassword.style.border = "1px solid red";
        passwordWarnSign.style.display = "block";
        passwordWarnSign.textContent = msg;
    }
}
// 事件監聽器
window.addEventListener("resize", fieldDivide);
window.addEventListener('DOMContentLoaded', scrollToWrapper);
window.addEventListener('load', storeUserData);
inputFields.forEach(input => {
    input.addEventListener("focus", () => {
        input.style.border = "none";
        accountWarnSign.style.display = "none";
        passwordWarnSign.style.display = "none";
    })
})
submitBtn.addEventListener('click', checkUserAccount);