"use strict";
// DOM
const slider = document.querySelector('.popular-products-cards-carousel');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector(".prev");
const allProductType = ["surfboard", "wetsuits","other"];
const sliderProducts = [];

// fetch data of products
async function fetchData(productType) {
    try {
        const response = await fetch(`../json/${productType}-products-list.json`);
        const data = await response.json();
        for (let product of data) {
            if (product.productTag === "精選商品") {
                sliderProducts.push(product);
            }
        }
    } catch (err) {
        throw new Error(`fetch fail due to ${err}`)
    }
}
 async function getSliderData() {
    localStorage.clear();
    await Promise.all(allProductType.map(type => fetchData(type)));
    showSliderData();
    const popProductsCard = document.querySelectorAll('.popular-product-card');
    popProductsCard.forEach(card => {
        const productName = card.childNodes[3].childNodes[1].textContent;
        card.addEventListener('click',() => {
            localStorage.setItem('productName',productName);
        })
    })
}
 function showSliderData() {
    // reset of products
    for(let i = 0;i < sliderProducts.length;i++) {
       sliderProducts[i].id = i + 1;
    }
    slider.innerHTML = "";
    for(let productData of sliderProducts){
        const productCard = document.createElement('a');
        productCard.href = `./preview-product.html?id=${productData.id}`
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
    console.log(scrolledNumber,slider.offsetWidth);
    let scrollAmount = slider.offsetWidth;
    if(direction === "next") {
        slider.scrollLeft = scrolledNumber + scrollAmount;
    }else {
        slider.scrollLeft =  scrolledNumber - scrollAmount
    }
}

nextBtn.addEventListener('click',() => {
    changeSlider("next")});
prevBtn.addEventListener('click',() => {
        changeSlider("prev")});
window.addEventListener('load', getSliderData);