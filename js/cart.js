"use strict"
// DOM
const userInfor = JSON.parse(localStorage.getItem('userInfor'));
const cartIiemsCount = document.querySelector('.cart-items-count');
const cardList = document.querySelector(".cart-items-card-list");
const selects = document.querySelectorAll('select');
const selectedMsg = document.querySelectorAll('.selected');
const selectedDetailMsg = document.querySelectorAll(".invioce-msg-wrapper label");
const warningMsg = document.querySelectorAll('.warning-msg');
const eInvoiceMsg = document.querySelector('.eInvoice-information');
const inputs = document.querySelectorAll('.input-wrapper input');
const inputWrappers = document.querySelectorAll('.input-wrapper');
const summaryDisplayArea = document.querySelector('.cart-summary-display-area');
const userPic = document.querySelector("#user-pic");
const userIcon = document.querySelector('.user-icon');
// order's detail Information
const paymentType = document.querySelector('#payment-type');
const invoiceType = document.querySelector('#invoice-type');
const mobileInvoiceCode = document.querySelector('#mobile-invoice-code');
const taxNumberCode = document.querySelector("#taxNumber-code");
const companyTitle = document.querySelector('#company-title');
const charityUnityTitle = document.querySelector('#charity-unity-title');
// order's total cost information 
const totalPriceNumber = document.querySelector('.total-price-number');
const shippingFeeNumber = document.querySelector('.shipping-fee-number');
const totalCostNumber = document.querySelector('.total-cost-number');
// 總計
const totalCartItemCount = document.querySelector('.cart-items-count');
let totalPrice = 0;
let totalCost = 0;
let totalItemCount = 0;
let shippingFee;
// sumit button
const submitBtn = document.querySelector('.submit-btn');
// 使用者資料
let userCartItems = [];
let user;
// 訂單資訊
let orderId;
let orderInfor = {
    "id": null,// 依照user.order.length來設定
    "totalCost": null,
    "shppingFee": null,
    "paymentType": null,
    "invoiceType": {
        "mobileInvoiceCode": null,
        "taxNum": {
            "taxNumberCode": null,
            "companyTitle": null
        },
        "charityUnity": null,
        "eInvioce": null,
    },
    "orderItems": [],
    "userCartItems": null,
    "isCheckoutSuccess": false,
    "deliveryAddress": null,
    "email": null,
    "lastName": null,
    "firstName": null,
    "phoneNumber": null
};

// 將userInfor裡的cart取得，並將其item存入userCartItems裡
function getUserCartItem() {
    userInfor.forEach(account => {
        // 檢查是否登入
        if (account.isLogin) {
            user = {...account};
            // 將cart裡的item放入userCartItems
            if (user.cart.orderInfor === null) {
                // user.cart.orderInfor === null代表1.購物車有商品但未進入結帳2.購物車為空
                for (let item in user.cart) {
                    if (item !== "orderInfor") {
                        if (user.cart[item].length !== 0) {
                            user.cart[item].forEach(product => {
                                userCartItems.push(product);
                            });
                        };
                    }
                };
                orderId = user["order"].length + 1;
                checkCartItem();
            } else {
                // user.cart.orderInfor !== null代表已經送checkout，但還沒付款完成
                userCartItems = user.cart.orderInfor.userCartItems;
                orderInfor = user.cart.orderInfor;
                paymentType.value = user.cart.orderInfor.paymentType;
                displayInputTitle(1);
                // 將useruser.cart.orderInfor的資訊傳回UI
                let UserinvoiceType;
                for (let type in user.cart.orderInfor.invoiceType) {
                    if (user.cart.orderInfor.invoiceType[type] !== null && type !== "taxNum") {
                        UserinvoiceType = type;
                    }
                }
                if (UserinvoiceType === undefined) {
                    UserinvoiceType = "taxNum";
                }
                if (UserinvoiceType === "mobileInvoiceCode") {
                    invoiceType.value = "個人-手機條碼載具";
                    mobileInvoiceCode.value = user.cart.orderInfor.invoiceType[UserinvoiceType];
                } else if (UserinvoiceType === "charityUnity") {
                    invoiceType.value = "捐贈發票";
                    charityUnityTitle.value = user.cart.orderInfor.invoiceType[UserinvoiceType];
                } else if (UserinvoiceType === "taxNum") {
                    invoiceType.value = "公司-統一編號";
                    taxNumberCode.value = user.cart.orderInfor.invoiceType[UserinvoiceType].taxNumberCode;
                    companyTitle.value = user.cart.orderInfor.invoiceType[UserinvoiceType].companyTitle;
                } else {
                    invoiceType.value = "二聯-電子發票";
                }
                displayInputTitle(2)
            };
            userIcon.style.display = "none";
            userPic.style.display = "block";

        } else {
            userIcon.style.display = "block";
            userPic.style.display = "none";
        }
    });
}

// 檢查usersCartItem是否為空
function checkCartItem() {
    userCartItems.length === 0 ? summaryDisplayArea.style.display = "none" : summaryDisplayArea.style.display = 'flex';
}


// 更新userCartItems的items，顯示在畫面
function displayCartItems() {
    cardList.innerHTML = "";
    totalPrice = 0;
    if (userCartItems.length !== 0) {
        for (let item of userCartItems) {
            if (item.count !== 0) {
                totalPrice += item.price * item.count;
                const div = document.createElement("div");
                div.classList.add('cart-item-card')
                div.innerHTML = `
             <div class="cart-item-img-wrapper">
                        <img src="${item.mainImage}" alt="${item.name}的圖片">
                    </div>
                    <div class="cart-item-content">
                        <div class="product-description">
                            <h3 class="item-name">${item.name}</h3>
                            <p class="item-brand">${item.brand === undefined ? "" : item.brand}</p>
                            <p class="item-reservation-date">${item.reservationDate === undefined ? "" : item.reservationDate}</p>
                            <p class="item-reservation-time">${item.time === undefined ? "" : item.time}</p>
                        </div>
                        <div class="item-price-tag">
                            ${item.priceTag}
                        </div>
                        <div class="cart-item-count">
                            <div class="item-count-wrapper">               
                                <p class="item-count"><i class="fa-solid fa-minus fa-minus-moblie"></i>${item.count}<i class="fa-solid fa-plus fa-plus-moblie"></i></p>
                            </div>
                        </div>
                        <div class="item-total-cost">$${priceReform(item.count * item.price)}</div>
                        <i class="fa-solid fa-xmark delete-cart-item-btn">
                        </i>
        
        `;
                cardList.append(div);
            }
        }
    } else {
        cardList.innerHTML = `
                    <p class="no-item-msg">購物車是空的喔！</p>
                    <a href="./production.html">按這裡開始購物吧</a>
        `
    };
    addEvent();
    deletecartItem();
    totalItemCount = userCartItems.length;
    totalCartItemCount.textContent = totalItemCount;
    if (totalItemCount >= 3 || userCartItems.length === 0) {
        shippingFee = 0;
    } else {
        shippingFee = 60;
    }
    totalCost = totalPrice + shippingFee;
    shippingFeeNumber.textContent = `$${shippingFee}`;
    totalPriceNumber.textContent = `$${priceReform(totalPrice)}`;
    totalCostNumber.textContent = `$${priceReform(totalCost)}`;
}

// 將價格數字變成貨幣形式
function priceReform(priceTag) {
    return Number(priceTag).toLocaleString();
}

// item的count加減
function changeCount(action, currentCount, index) {
    if (action === "increase") {
        userCartItems[index].count = currentCount += 1;
    } else if (action === "decrease" && currentCount !== 1) {
        userCartItems[index].count = currentCount -= 1;
    } else if (currentCount < 1) {
        userCartItems[index].count = 1;
    };
    updateCartItem();
}

function updateCartItem() {
    for(let productType in user.cart) {
        for(let item of userCartItems) {
            if(item.productType === productType) {
               for(let product of user.cart[productType]) {
                    if(product.name === item.name) {
                        product = {...item};
                    }
               }
            }
        }
        if(productType !== "orderInfor") {   
            user.cart[productType] =  user.cart[productType].filter((item) => item.count !== 0);
        }
    }
    for(let account of userInfor) {
        if(account.isLogin) {
            account = {...user};
        }
    }
    localStorage.setItem("userInfor", JSON.stringify(userInfor));
}

// item刪除
function deletecartItem() {
    const deleteBtns = document.querySelectorAll('.delete-cart-item-btn');
    for (let i = 0; i < deleteBtns.length; i++) {
        deleteBtns[i].addEventListener('click', () => {
            userCartItems[i].count = 0;
            userCartItems = userCartItems.filter((item) => item.count !== 0);
            updateCartItem();
            displayCartItems();
        });
    };
    checkCartItem();
}

// 將增加與減少按鈕新增事件聆聽
function addEvent() {
    const prodCountIncrease = document.querySelectorAll('.fa-plus')
    const prodCountDecrease = document.querySelectorAll('.fa-minus');
    for (let i = 0; i < prodCountDecrease.length; i++) {
        prodCountDecrease[i].addEventListener('click', () => {
            changeCount("decrease", userCartItems[i].count, i);
            displayCartItems();
        })

        prodCountIncrease[i].addEventListener('click', () => {
            changeCount("increase", userCartItems[i].count, i);
            displayCartItems();
        })
    }
}

function displayInputTitle(index) {
    let targetIndex = Number(index);
    selectedMsg[targetIndex].textContent = selects[targetIndex].value;
    if (targetIndex === selects.length - 1) {
        eInvoiceMsg.classList.remove('selected-msg');
        selectedDetailMsg.forEach(msg => {
            msg.classList.remove("selected-msg");
        });
        if (selectedMsg[targetIndex].textContent === "二聯-電子發票") {
            eInvoiceMsg.classList.add('selected-msg');
        } else {
            selectedMsg[targetIndex].textContent === "個人-手機條碼載具" ? selectedDetailMsg[0].classList.add('selected-msg') : selectedDetailMsg[0].classList.remove('selected-msg');
            selectedMsg[targetIndex].textContent === "捐贈發票" ? selectedDetailMsg[3].classList.add('selected-msg') : selectedDetailMsg[3].classList.remove('selected-msg');
            if (selectedMsg[targetIndex].textContent === "公司-統一編號") {
                selectedDetailMsg[1].classList.add('selected-msg');
                selectedDetailMsg[2].classList.add('selected-msg');
            } else {
                selectedDetailMsg[targetIndex].classList.remove('selected-msg');
                selectedDetailMsg[targetIndex].classList.remove('selected-msg');
            }
        }
    }
}

// 選單依照select的值顯示在自訂input裡面
function selectedOrderMsg() {
    for (let i = 0; i < selects.length; i++) {
        selects[i].addEventListener('change', () => {
            inputs.forEach(input => {
                input.value = "";
            })
            displayInputTitle(i);
        })
    }
}


function updateOrderInfo() {
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            for (let i = 0; i < inputs.length; i++) {
                warningMsg[i].style.display = "none";
                inputWrappers[i].classList.remove('actived');
            }
        })
    })
    orderInfor.id = orderId;
    orderInfor.totalCost = totalCost;
    orderInfor.shppingFee = shippingFee;
    orderInfor.paymentType = paymentType.value;
    // 紀錄發票處理方式
    if (invoiceType.value === "公司-統一編號") {
        if (taxNumberCode.value === "" || companyTitle.value === "") {
            inputWrappers[1].classList.add('actived');
            warningMsg[1].style.display = "block";
            inputWrappers[2].classList.add('actived');
            warningMsg[2].style.display = "block";
            return;
        } else {
            orderInfor.invoiceType.taxNum.taxNumberCode = taxNumberCode.value;
            orderInfor.invoiceType.taxNum.companyTitle = companyTitle.value;
        }
    } else {
        orderInfor.invoiceType.taxNum.taxNumberCode = null;
        orderInfor.invoiceType.taxNum.companyTitle = null;
    }
    if (invoiceType.value === "捐贈發票") {
        if (charityUnityTitle.value === '') {
            inputWrappers[3].classList.add('actived');
            warningMsg[3].style.display = "block";
            return;
        } else {
            orderInfor.invoiceType.charityUnity = charityUnityTitle.value
        }
    } else {
        orderInfor.invoiceType.charityUnity = null;
    }
    invoiceType.value === "二聯-電子發票" ? orderInfor.invoiceType.eInvioce = true : orderInfor.invoiceType.eInvioce = null;
    if (invoiceType.value === "個人-手機條碼載具") {
        if (mobileInvoiceCode.value === '') {
            inputWrappers[0].classList.add('actived');
            warningMsg[0].style.display = "block";
            return;
        } else {
            orderInfor.invoiceType.mobileInvoiceCode = mobileInvoiceCode.value
        }
    } else {
        orderInfor.invoiceType.mobileInvoiceCode = null
    }

    orderInfor.userCartItems = userCartItems;
    for (let item in userCartItems) {
        if (item.productType === "products") orderInfor.products.push(item);
        if (item.productType === "courses") orderInfor.cousrses.push(item);
        if (item.productType === "rental") orderInfor.rental.push(item);
    }
    userInfor.forEach(user => {
        if (user.isLogin) {
            user.cart.orderInfor = orderInfor;
        }
    })
    localStorage.setItem("userInfor", JSON.stringify(userInfor));
    window.location.assign("https://plai8.github.io/SharFin-version-2-1/html/cart-checkout.html")
}

submitBtn.addEventListener('click', updateOrderInfo);
window.addEventListener('load', () => {
    getUserCartItem();
    selectedOrderMsg();
    displayCartItems();
})