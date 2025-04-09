"use strict"
// inputs
const userFirstName = document.querySelector("#userFirstName");
const userLastName = document.querySelector("#userLastName");
const userMail = document.querySelector("#userAccount");
const passWord = document.querySelector("#userPassword");
const wrapper = document.querySelector('.signUp-wrapper');
const userInfo = localStorage.getItem('userInfor');
const userInfor = JSON.parse(localStorage.getItem('userInfor'));
const newSignupData = {
        "id": null,
        "firstName": null,
        "lastName": null,
        "phoneNumber": " ",
        "address":" ",
        "email": null,
        "password":null,
        "cart": {
            "products": [],
            "courses": [],
            "rental": [],
            "orderInfor":null,
        },
        "order":[],
        "isLogin": false
    };

function scrollTo() {
    wrapper.scrollIntoView();
}

const switchBtns = document.querySelectorAll('.switch-btn');
const signupBtn = document.querySelector('.switch-btn-signup');
const loginBtn = document.querySelector('.switch-btn-login')
const signUpField = document.querySelector('.signUp-field ')
const loginField = document.querySelector('.login-field ');
const signBtn = document.querySelector('.submit-btn');

switchBtns.forEach(switchBtn => {
    switchBtn.addEventListener('click',el => {
        //先把全部'btn-actived' class移除。
        switchBtns.forEach(el => {
            el.classList.remove('btn-actived');
        })
        console.log(el.target)
        //新增btn-actived'至被點擊到的btn
        el.target.classList.add('btn-actived');
        if(el.target.classList.contains('switch-btn-signup')){
            signUpField.style.display = "block";
            loginField.style.display = "none";
        }else {
            signUpField.style.display = "none";
            loginField.style.display = "block";
        }
    })
})

window.addEventListener("resize",() => {
    if(window.innerWidth >= 1024) {
        signUpField.style.display = "block";
        loginField.style.display = "block";
    }else {
        signUpField.style.display = "block";
        loginField.style.display = "none";
        //確保switch btn為defult狀態
        switchBtns[0].classList.add('btn-actived')
        switchBtns[1].classList.remove('btn-actived')
    }
})

// 註冊功能
function signUpAccount() {
    // 檢查帳號是否已經存在
    for(let account of userInfor) {
        if(userMail.value === account.email) {
            alert("此帳號已存在！");
            userMail.value = " ";
        }
    };
    checkInputValue();
    if(!validateEmail()) {
        alert('Email 格式錯誤');
        return;
    }else {
        newSignupData.id = userInfor.length + 1;
        newSignupData.firstName = userFirstName.value;
        newSignupData.lastName = userLastName.value;
        newSignupData.email = userMail.value;
        newSignupData.password = passWord.value;
        if(newSignupData.firstName != "" &&  newSignupData.lastName !== "" && newSignupData.email !== "" && newSignupData.password !== "" ) {
            alert("註冊成功！");
            userInfor.push(newSignupData);
            localStorage.setItem("userInfor",JSON.stringify(userInfor));
            window.location.assign("http://127.0.0.1:5501/html/login.html")
        }
        console.log(newSignupData);
    }
   
};

function checkInputValue() {
    const inputWrapper = document.querySelectorAll(".input-icon-container");
    const warningMsg = document.querySelectorAll('.warning-msg');
    let inputs = [userFirstName,userLastName,userMail,passWord];
    for(let i = 0;i < inputs.length;i++) {
        if(inputs[i].value === "") {
            warningMsg[i].style.display = "block";
            inputWrapper[i].style.outline= "1px solid red";
        }else {
            warningMsg[i].style.display = "none";
            inputWrapper[i].style.outline = "none";
        }
    };
    // reset input warning message styling
    inputs.forEach(input => {
        input.addEventListener("focus",() => {
            for(let i = 0;i < inputs.length;i++ ) {
                warningMsg[i].style.display = "none";
                inputWrapper[i].style.outline = "none";
            }
        })
    })
}

function validateEmail() {
    const email = userMail.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if(!emailRegex.test(email)) {
        return false;
    }else {
        return true;
    }

}

signBtn.addEventListener('click',signUpAccount);



window.addEventListener('DOMContentLoaded', scrollTo)