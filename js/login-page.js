"use strict"
// user data
const userInfor = [
    {
        id: 1,
        firstName: "Peter",
        lastName: "Lai",
        phoneNumber: "0912345678",
        address: "abc",
        email: "a123456@gamil.com",
        account: "peter01230",
        password: "plai5likes$$",
        cart: {
            products: {
                surfBoard: {
                    items: [],
                    productStatus: null,
                },
                accessories: {
                    items: [],
                    productStatus: null,
                },
                wetsuits: {
                    items: [],
                    productStatus: null,
                },
                other: {
                    items: [],
                    productStatus: null,
                },
            },
            courses: {
                halfDay: {
                    amount: 0,
                    time: "09:30",
                    reservationDate: null,
                    isPaidDespoit: true,
                    price: 1500
                },
                oneDay: {
                    amount: 0,
                    time: "09:30",
                    reservationDate: null,
                    isPaidDespoit: true,
                    price: 2400,
                },
                Vip: {
                    amount: 0,
                    time: "09:30",
                    reservationDate: null,
                    isPaidDespoit: true,
                    price: 3880
                }
            },
            rental: {
                longBoard: {
                    amount: 0,
                    reservationDate: null,
                    price: 600,
                },
                shortBoard: {
                    amount: 0,
                    reservationDate: null,
                    price: 300,
                }
            },
            isPaidOff: true,
        },
        isLogin: false,
        notification: null
    }
];

//DOM 元素
const wrapper = document.querySelector(".login-wrapper");
const switchBtns = document.querySelectorAll('.switch-btn');
const signUpField = document.querySelector('.sign-up-field');
const loginField = document.querySelector('.login-field');
const userAccount = document.querySelector('#userAccount');
const userPassword = document.querySelector('#userPassword');
let usersData = localStorage.getItem('userInfor');
const accountWarnSign = document.querySelector('.account-warning-msg');
const passwordWarnSign = document.querySelector('.password-warning-msg');
let account;
const inputFields = document.querySelectorAll("input");
const submitBtn = document.querySelector('.login-btn');
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
    if (localStorage.getItem("userInfor") === null) this.localStorage.setItem('userInfor', userInfor);
};

function checkUserAccount(inputType) {
    // 檢查帳號或信箱是否存在
    if (inputType === "account") {
        for (let user in usersData) {
            if (userAccount.value !==  user.account || userAccount.value !== user.email) {
                accountWarnSign.style.display = "block";
                userAccount.style.border = "1px solid red";
            }else {
                account = {...user};
                console.log(account);
                break;
            }
        }
    }else {
        // 檢查密碼是否正確
        if(userPassword.value !== account.password) {
            userPassword.style.border = "1px solid red";
            passwordWarnSign.style.display = "block";
        }
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
