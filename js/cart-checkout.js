"use strict"
// DOM 
const mainWrapper = document.querySelector('.cart-checkout-main-info-container');
// user information 
const usersInfo = JSON.parse(localStorage.getItem('userInfor'));
let user;
let userCartItems;
let userOrderInformation;
// order's information inputs
const userEmail = document.querySelector("#user-email");
const userLastName = document.querySelector('#user-last-name');
const userFirstName = document.querySelector('#user-first-name');
const deliveryAddress = document.querySelector("#delivery-address");
const userPhoneNumber = document.querySelector('#phone-number');
const creditCardInfoField = document.querySelector(".credit-card-information-wrapper");
const userInputWrappers = document.querySelectorAll('.user-info-input-wrapper');
// credit card auto switch input field
const InputWrappers = document.querySelectorAll('.card-number-input-wrapper .input-wrapper')
const creditNumInputs = document.querySelectorAll('.credit-card-number-input');
const paymentType = document.querySelector('#payment-type');
const paymentTypePlaceHolder = document.querySelector('.payment-type-placeholder');
const expirationDateMonth = document.querySelector("#expiration-date-MM");
const expirationDateYear = document.querySelector("#expiration-date-YY");
const CVVcode = document.querySelector("#CVV-code");
const expiraDateInputWrapper = document.querySelector('.card-expiration-date-input');
const CVVcodeInputWrapper = document.querySelector('.CVV-code-input');
const wrongNumMsg = document.querySelectorAll('.credit-card-wrong-num-msg p');
const creditCardInfo = {
    number: ["1234", "5678", "1234", "5678"],
    expirationDate: ["08", "28"],
    CVVcode: "123"
}
const userCreditInfo = {
    number: [],
    expirationDate: [],
    CVVcode: null
}
const submitBtn = document.querySelector('#comfirm-bitn');
const warningMsg = document.querySelectorAll('.warning-msg');
function getUser() {
    // window.location.reload();
    usersInfo.forEach(account => {
        if (account.isLogin === true) {
            user = { ...account };
            console.log(user);
            // 確認是否有訂單
            if (user.cart.orderInfor !== null) {
                userCartItems = [...user.cart.orderInfor.userCartItems];
                userOrderInformation = JSON.parse(JSON.stringify(user.cart.orderInfor));
            } else {
                // 重新引導至商品頁面
                return
            }
            paymentType.value = userOrderInformation.paymentType;
            paymentTypePlaceHolder.textContent = paymentType.value;
            if (userOrderInformation.paymentType === "信用卡/行動支付") {
                creditCardInfoField.style.display = "block";

            } else {
                creditCardInfoField.style.display = "none";
            }
            showOrderInfo();
            showOrderItems();
            showSummary();
            editOrderInfo();
        }
    })
}

function showPaymentType() {
    paymentTypePlaceHolder.textContent = paymentType.value;
    if (paymentType.value === "信用卡/行動支付") {
        creditCardInfoField.style.display = "block";

    } else {
        creditCardInfoField.style.display = "none";
    }
} 

function editOrderInfo() {
    userOrderInformation.deliveryAddress = deliveryAddress.value;
    userOrderInformation.email = userEmail.value;
    userOrderInformation.lastName = userLastName.value;
    userOrderInformation.firstName = userFirstName.value;
    userOrderInformation.phoneNumber = userPhoneNumber.value;
}

function checkCreditInfo() {
    let isTrue = true;
    for (let i = 0; i < creditCardInfo.number.length; i++) {
        if (String(userCreditInfo.number[i]) !== creditCardInfo.number[i]) {
            InputWrappers[i].classList.add("wrong-info-warning");
            wrongNumMsg[0].style.display = "block";
            isTrue = false
        }
    };
    for (let i = 0; i < creditCardInfo.expirationDate.length; i++) {
        if (String(userCreditInfo.expirationDate[i]) !== creditCardInfo.expirationDate[i]) {
            expiraDateInputWrapper.classList.add('wrong-info-warning');
            wrongNumMsg[1].style.display = "block";
            isTrue = false
        }
    }
    if (String(userCreditInfo.CVVcode) !== creditCardInfo.CVVcode) {
        CVVcodeInputWrapper.classList.add('wrong-info-warning');
        wrongNumMsg[2].style.display = "block";
        isTrue = false
    }
    return isTrue;

}

function checkOrderInfo(showed) {
    let action = showed === true ? "block" : "none";
    let outline = showed === true ? "1px solid red" : "none";
    let orderStatus;
    let inputs = [userEmail,userLastName,userFirstName,deliveryAddress,userPhoneNumber];
    for(let i = 0;i < inputs.length;i++) {
        if(inputs[i].value === " ") {
            warningMsg[i].style.display = action;
            userInputWrappers[i].style.outline = outline;
            orderStatus = false;
        }else {
            orderStatus = true;
        }
    };
    return orderStatus;
}

function showOrderInfo() {
    deliveryAddress.value = user.address;
    userEmail.value = user.email;
    userLastName.value = user.lastName;
    userFirstName.value = user.firstName;
    userPhoneNumber.value = user.phoneNumber;
}

function showOrderItems() {
    const cardItemListWrapper = document.querySelector('.cart-item-display-card-list-wrapper');
    cardItemListWrapper.innerHTML = "";
    for (let item of userCartItems) {
        const card = document.createElement("div");
        console.log(item);
        card.innerHTML = `
         <div class="cart-item-card">
            <div class="card-img-wrapper">
                <img src="${item.mainImage}"alt="${item.name}的圖片">
                            <span class="cart-item-quantity">${item.count}</span>
            </div>
            <div class="cart-item-content">
                <h3 class="cart-item-name">${item.name}</h3>
                <p class="cart-item-brand">${item.brand === true ? item.brand : ""}</p>
                <p class="cart-item-size">${item.productSize !== undefined ? item.productSize : ''}</p>
                <p class="item-reservation-date">${item.reservationDate === undefined ? "" : item.reservationDate}</p>
                <p class="item-reservation-time">${item.time === undefined ? "" : item.time}</p>
            </div>
            <div class="cart-item-price-wrapper">
                <p class="cart-item-price">${item.priceTag}</p>
            </div>
        
        `;
        cardItemListWrapper.append(card);
    }
}

function resetInputWarningMsg() {
    wrongNumMsg[0].style.display = "none";
    wrongNumMsg[1].style.display = "none";
    wrongNumMsg[2].style.display = "none";
    for (let i = 0; i < InputWrappers.length; i++) {
        InputWrappers[i].classList.remove('wrong-info-warning');
    };
    expiraDateInputWrapper.classList.remove('wrong-info-warning');
    CVVcodeInputWrapper.classList.remove('wrong-info-warning');
}

function priceReform(priceTag) {
    return Number(priceTag).toLocaleString();
}

function updateUserOrder() {
    editOrderInfo();
    for(let item of userOrderInformation.userCartItems) {
        userOrderInformation.orderItems.push(item);
    }
    userOrderInformation.userCartItems = null;
}

function showSummary() {
    const cartTotalCount = document.querySelector(".cart-item-total-quantity");
    const shppingFee = document.querySelector(".shipping-fee");
    const totalPrice = document.querySelector(".total-price");
    const totalCost = document.querySelector('.total-cost');
    cartTotalCount.textContent = userCartItems.length;
    shppingFee.textContent = userOrderInformation.shppingFee === 0 ? "免運" : "$60";
    totalCost.textContent = `$${priceReform(userOrderInformation.totalCost)}`;
    totalPrice.textContent = `$${priceReform(userOrderInformation.totalCost - userOrderInformation.shppingFee)}`;
}

for (let i = 0; i < creditNumInputs.length; i++) {
    creditNumInputs[i].addEventListener('input', () => {
        let numbers = creditNumInputs[i].value;
        console.log(numbers);
        if (numbers.length === 4) {
            userCreditInfo.number.push(numbers);
            i === creditNumInputs.length - 1 ? creditNumInputs[i].blur() : creditNumInputs[i + 1].focus();
        } else if (creditNumInputs[i].value.length >= 4) {
            creditNumInputs[i].value = numbers.slice(0, 4);
        }

    })
}

[expirationDateMonth, expirationDateYear].forEach(input => {
    input.addEventListener('input', () => {
        let value = input.value;
        if (input.classList.contains("date-MM")) {
            if (value.length === 2) {
                userCreditInfo.expirationDate.push(value);
                expirationDateYear.focus();
            } else if (input.value.length >= 2) {
                input.value = value.slice(0, 2);
            }
        } else {
            if (value.length === 2) {
                userCreditInfo.expirationDate.push(value);
                expirationDateYear.blur();
                console.log(userCreditInfo.expirationDate)
            } else if (input.value.length >= 2) {
                input.value = value.slice(0, 2);
            }
        }
    })
    input.addEventListener("focus", resetInputWarningMsg);

})

CVVcode.addEventListener('input', () => {
    let code = CVVcode.value;
    if (code.length === 3) {
        userCreditInfo.CVVcode = code;
        CVVcode.blur();
        console.log(userCreditInfo.CVVcode)
    } else if (code.length >= 3) {
        CVVcode.value = code.slice(0, 3);
        CVVcode.blur();
    };
});
CVVcode.addEventListener('focus', resetInputWarningMsg);

creditNumInputs.forEach(input => {
    input.addEventListener('focus', resetInputWarningMsg);
});

[userEmail, userLastName, userFirstName, deliveryAddress, userPhoneNumber].forEach(input => {
    input.addEventListener('focus', () => {
        checkOrderInfo(false)
    })
})

paymentType.addEventListener('change',showPaymentType);

submitBtn.addEventListener("click", () => {
    editOrderInfo();
    if(paymentType.value === "信用卡/行動支付") {
        checkCreditInfo();
    };
    checkOrderInfo(true);
    if(paymentType.value !== "信用卡/行動支付") {
        if(checkOrderInfo(true)) {
            usersInfo.forEach(account => {
                if(account.isLogin === true) {
                    updateUserOrder();
                    account.phoneNumber = userPhoneNumber.value;
                    account.address = deliveryAddress.value;
                    account.order.push(userOrderInformation);
                    account.cart.orderInfor = null;
                    account.cart.products = [];
                    account.cart.courses = [];
                    account.cart.rental = [];
                    console.log(account);
                }
            })
            localStorage.setItem('userInfor',JSON.stringify(usersInfo));
            alert("結帳成功！");
            window.location.assign("https://plai8.github.io/SharFin-version-2-1/html/cart.html")
        }
    }else {
        if(checkOrderInfo(true) &&  checkCreditInfo()) {
            usersInfo.forEach(account => {
                if(account.isLogin === true) {
                    updateUserOrder();
                    account.
                    userOrderInformation.isCheckoutSuccess = true;
                    account.order.push(userOrderInformation);
                    account.cart.orderInfor = null;
                    account.cart.products = [];
                    account.cart.courses = [];
                    account.cart.rental = [];
                    console.log(account);
                }
            })
            localStorage.setItem('userInfor',JSON.stringify(usersInfo));
            alert("結帳成功！");
            window.location.assign("http://127.0.0.1:5501/html/cart.html")
        }
    }
   
});
window.addEventListener('load', () => {
    getUser();
});
