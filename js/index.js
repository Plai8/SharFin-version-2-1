"use strict";
// DOM
const slider = document.querySelector('.popular-products-cards-carousel');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector(".prev");
const allProductType = ["surfboard", "wetsuits", "other"];
const sliderProducts = [];
const userPic = document.querySelector("#user-pic");
const userIcon = document.querySelector('.user-icon');
const userInfor = [
    {
        "id": 1,
        "firstName": "Peter",
        "lastName": "Lai",
        "phoneNumber": "0912345678",
        "address": "abc",
        "email": "a123456@gamil.com",
        "password": "123456",
        "cart": {
            "products": [{
                "name": "AQSS Soulstice Longboard 9'1- Sunrise",
                "mainImage": "../images/production-images/surfboard/002__95121.1550201513.1280.1280_900x.webp",
                "count": 1,
                "productStatus": "出貨中",
                "price": 10000,
                "priceTag": "$10,000",
                "brand": "AQSS",
                "productType": "products",
                "productSize": "9'7"
            }],
            "courses": [{
                "name": "半日體驗課程",
                "mainImage": "../images/index-images/surfing-course-halfday.jpg",
                "count": 1,
                "time": "09:30",
                "reservationDate": "2025-08-16",
                "isPaidDespoit": false,
                "price": 1500,
                "priceTag": "$1500",
                "productType": "courses"
            }],
            "rental": [
                {
                    "name": "長板",
                    "reservationDate": "2025-08-16",
                    "mainImage": "../images/production-images/surfboard/002__95121.1550201513.1280.1280_900x.webp",
                    "count": 1,
                    "price": 600,
                    "priceTag": "NT$600",
                    "productType": "rental"
                }
            ],
            "orderInfor": null
        },
        "order": [],
        "isLogin": false
    }
];
// fetch data of products
async function fetchData(productType) {
    try {
        const response = await fetch(`json/${productType}-products-list.json`);
        const data = await response.json();
        for (let product of data) {
            if (product.productTag === "精選商品") {
                sliderProducts.push(product);
            }
        }
        console.log(sliderProducts);
    } catch (err) {
        throw new Error(`fetch fail due to ${err}`)
    }
}
async function getSliderData() {
    ["currentProductName", "isSearchMode,", "currentProductPage", "currentPage"].forEach(item => {
        localStorage.removeItem(item);
    })
    await Promise.all(allProductType.map(type => fetchData(type)));
    showSliderData();
    const popProductsCard = document.querySelectorAll('.popular-product-card');
    popProductsCard.forEach(card => {
        const productName = card.childNodes[3].childNodes[1].textContent;
        card.addEventListener('click', () => {
            localStorage.setItem('productName', productName);
        })
    })
}

// 將使用者資料存入localStorage
function storeUserData() {
    // 假設 userInfor 是已經定義好的物件
    if (localStorage.getItem("userInfor") === null) {
        localStorage.setItem('userInfor', JSON.stringify(userInfor));
    }
};
function checkUserLogin() {
    let account;
    let userInfor = JSON.parse(localStorage.getItem("userInfor"));
    console.log(userInfor)
    for(let user of userInfor) {
        console.log(user.isLogin);
        if(user.isLogin) account = {...user};
    }
    if(account !== undefined) {
        if(account.isLogin) {
            userIcon.style.display = "none";
            userPic.style.display = "block";
        }else {
            userIcon.style.display = "block";
            userPic.style.display = "none";
        }
    }
}
function showSliderData() {
    // reset of products
    for (let i = 0; i < sliderProducts.length; i++) {
        sliderProducts[i].id = i + 1;
    }
    slider.innerHTML = "";
    for (let productData of sliderProducts) {
        const productCard = document.createElement('a');
        productCard.href = `html/preview-product.html?id=${productData.id}`
        productCard.classList.add('popular-product-card');
        let convertImgPath = productData.mainImage.slice(3);
        productCard.innerHTML = `
                <img src="${convertImgPath}">
                <div class="card-content">
                    <h3 class="goods-name">${productData.name}</h3>
                    <p class="goods-price">${productData.priceTag}</p>
                </div>
        `
        slider.append(productCard);
    }
}
function changeSlider(direction) {
    let scrolledNumber = slider.scrollLeft;
    console.log(scrolledNumber, slider.offsetWidth);
    let scrollAmount = slider.offsetWidth;
    if (direction === "next") {
        slider.scrollLeft = scrolledNumber + scrollAmount;
    } else {
        slider.scrollLeft = scrolledNumber - scrollAmount
    }
}

nextBtn.addEventListener('click', () => {
    changeSlider("next")
});
prevBtn.addEventListener('click', () => {
    changeSlider("prev")
});
window.addEventListener('load',() => { 
    getSliderData();
    storeUserData();
    checkUserLogin();
}
);