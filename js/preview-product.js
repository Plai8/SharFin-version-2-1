'use struict'
// DOM
const mainImage = document.querySelector('.main-image img');
const mainArea = document.querySelector('main');
const productAmount = document.querySelector('#product-amount');
const previewImageWrapper = document.querySelectorAll('.preview-product-image');
const previewImages = document.querySelectorAll('.preview-product-image img');
const minusBtn = document.querySelector('.amount-minus');
const plusBtn = document.querySelector('.amount-plus');
const goBackPage = document.querySelector('.go-back-btn');
const productSize = document.querySelector('#product-size');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let id = urlParams.get('id');
let currentProduct = localStorage.getItem('currentProductName');
let currentProductPage = 1;
//production display area
const productImgWrapper = document.querySelector('.product-preview-area');
const productInfoWrapper = document.querySelector('.product-info-area');
const brandName = document.querySelector('.product-brand');
const productName = document.querySelector('.product-name');
const priceTag = document.querySelector('.product-price-tag');
const productDescrible = document.querySelector('.product-describe');
const selectTag = document.querySelector('#product-size');
let selectedProduct;
const productInfo = {
    "name": null,
    "mainImage": null,
    "count": 1,
    "productStatus": null,
    "price": null,
    "priceTag": null,
    "brand": null,
    "productType": "products",
    "productSize": null
}
// user's data 
const usersInfo = JSON.parse(localStorage.getItem('userInfor'));
let user;
// add cart btn
const addCartBtn = document.querySelector('.add-cart-btn');


async function fetchData() {
    let isSearchMode;
    localStorage.getItem("isSearchMode") === "true" ? isSearchMode = true : isSearchMode = false;
    // 判斷是否為主頁精選商品
    try {
        if (isSearchMode === false && localStorage.getItem('productName') === null) {
            let response = await fetch(`../json/${currentProduct}-products-list.json`);
            productData = await response.json();
            console.log(productData);
        } else {
            productData = [];
            const allProductType = ["accessories", "surfboard", "wetsuits", "other"];
            for (let i = 0; i < allProductType.length; i++) {
                let reponse = await fetch(`../json/${allProductType[i]}-products-list.json`);
                const receivedData = await reponse.json();// 一個陣列
                for (let j = 0; j < receivedData.length; j++) {
                    productData.push(receivedData[j]);
                    receivedData[j].id = productData.length;
                }
            };

        }
        scrollTo();
        getUserInfo();
        displayProduct();
    } catch (err) {
        throw new Error(`fetch fail due to ${err}`)
    }
}

// get user data 
function getUserInfo() {
    usersInfo.forEach(account => {
        if (account.isLogin) {
            user = { ...account };
            console.log(user);
        }
    })
}

// add product to cart
function addCart() {
    // add selected product's information
    productInfo.name = selectedProduct.name;
    productInfo.mainImage = selectedProduct.mainImage;
    productInfo.count = Number(productAmount.value);
    productInfo.productStatus = "確認訂單中";
    productInfo.price = selectedProduct.price;
    productInfo.priceTag = selectedProduct.priceTag;
    productInfo.brand = selectedProduct.brand;
    productInfo.productSize = productSize.value;
    usersInfo.forEach(account => {
        if (account.isLogin) {
            account = user;
            console.log(account);
        }
    })
    console.log(usersInfo);
        // 若item未存在於cart裡，將productInfo存入
        checkItemExist(productInfo.name);
        console.log(checkItemExist(productInfo.name))
        if(!checkItemExist(productInfo.name)) {
            user.cart.products.push(productInfo);
        }else {
            for(let item of user.cart.products) {
                if(item.name === productInfo.name) item = { ...productInfo };
            }
        }
    console.log(user.cart);
    console.log(productInfo);
    localStorage.setItem('userInfor', JSON.stringify(usersInfo));
    alert("加入成功！");
}

function checkItemExist(itemName) {
    return user.cart.products.find(item => item.name === itemName);
}

//display products 
function displayProduct() {
    selectedProduct = productData[id - 1];
    // 顯示圖片
    console.log(selectedProduct)
    mainImage.src = selectedProduct.mainImage;
    let index = 0
    previewImages.forEach(img => {
        if (selectedProduct.preveiwImages[index] === undefined) previewImageWrapper[index].remove();
        img.src = selectedProduct.preveiwImages[index];
        img.addEventListener('click', () => {
            showMainImage(img);
        })
        index++;
    })
    // 顯示商品資訊
    brandName.textContent = selectedProduct.brand;
    productName.textContent = selectedProduct.name;
    priceTag.textContent = selectedProduct.priceTag;
    productDescrible.textContent = selectedProduct.describe;
    // 商品尺寸
    if (selectedProduct.size === undefined) {
        document.querySelector("#product-size-select").remove();
    } else {
        for (let item of selectedProduct.size) {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            selectTag.append(option);
        }
    };
    if (localStorage.getItem('productName') !== null) {
        // 搜尋下
        for (let product of productData) {
            if (product.name === localStorage.getItem('productName')) id = product.id;
        }
        selectedProduct = productData[id - 1];
    } else if (user.cart.products.length !== 0) {
        for (let cartItem of user.cart.products) {
            if (cartItem.name === selectedProduct.name) {
                console.log(selectedProduct);
                productAmount.value = cartItem.count;
                productSize.value = cartItem.productSize;
                console.log(cartItem.productSize);
                console.log(productSize.value);
            }
        }
    };
}

[minusBtn, plusBtn].forEach(btn => {
    btn.classList.contains('amount-minus') ? btn.addEventListener('click', () => {
        showProductAmount("minus");
    }) : btn.addEventListener('click', () => {
        showProductAmount("plus")
    });
});
goBackPage.addEventListener('click', () => {
    window.history.back();
})
// 商品數量增加與刪減
function showProductAmount(action) {
    if (action === "plus") {
        productAmount.value++
    } else {
        productAmount.value < 2 ? productAmount.value = 1 : productAmount.value--
    }
}
// 畫面鎖定至主畫面
function scrollTo() {
    mainArea.scrollIntoView();
}
// 切換預覽圖片
function showMainImage(image) {
    scrollTo();
    mainImage.src = image.src;
}
addCartBtn.addEventListener('click', addCart);
window.addEventListener('load', fetchData);