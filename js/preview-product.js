'use struict'
// DOM
const mainImage = document.querySelector('.main-image img');
const mainArea = document.querySelector('main');
const productAmount = document.querySelector('#product-amount');
const previewImageWrapper =  document.querySelectorAll('.preview-product-image');
const previewImages = document.querySelectorAll('.preview-product-image img');
const minusBtn = document.querySelector('.amount-minus');
const plusBtn = document.querySelector('.amount-plus');
const goBackPage = document.querySelector('.go-back-btn');
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


async function fetchData() {
    let isSearchMode;
    localStorage.getItem("isSearchMode") === "true" ? isSearchMode = true : isSearchMode = false;
    // 判斷是否為主頁精選商品
    try {
        if(isSearchMode === false && localStorage.getItem('productName') === null) {
        let response = await fetch(`../json/${currentProduct}-products-list.json`);
        productData = await response.json();
        console.log(productData);
        }else {
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
        console.log(productData);
        scrollTo();
        displayProduct();
    }catch(err) {
        throw new Error(`fetch fail due to ${err}`)
    }
}

//display products 
function displayProduct() {
    if(localStorage.getItem('productName') !== null) {
        let popProductInfo;
        for(let product of productData) {
            if(product.name === localStorage.getItem('productName')) id = product.id;
        }
    }
   // 顯示圖片
   mainImage.src = productData[id - 1 ].mainImage;
   let index = 0
   previewImages.forEach(img => {
    if(productData[id - 1].preveiwImages[index] === undefined) previewImageWrapper[index].remove();
    img.src = productData[id - 1].preveiwImages[index];
    img.addEventListener('click', () => {
        showMainImage(img);
    })
    index++;
})
    // 顯示商品資訊
    brandName.textContent = productData[id - 1].brand;
    productName.textContent = productData[id - 1].name;
    priceTag.textContent = productData[id - 1].priceTag;
    productDescrible.textContent = productData[id - 1].describe;
    // 商品尺寸
    if(productData[id - 1].size === undefined) {
        document.querySelector("#product-size-select").remove();
    }else {
        for(let item of productData[id - 1].size) {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            selectTag.append(option);
        }
    }
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
window.addEventListener('load', fetchData);