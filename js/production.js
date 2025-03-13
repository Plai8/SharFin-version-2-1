"use strict"
// DOM
// toggle btn 
const toggleBtn = document.querySelector('.sort-options-lg');
const toggleBtnSM = document.querySelector('.sort-options-sm');
const dropDown = document.querySelector('.toggle-dropdown');
const chevron = document.querySelector('.fa-chevron-down');
const chevronSM = document.querySelector('.chevron-down-sm');
const closeDropDownBtn = document.querySelector('.close-dropDown-btn');
const dropDownSM = document.querySelector('.toggle-dropdown-sm');
const dropDownSMItems = document.querySelector('.toggle-dropdown-sm ul');
// 分頁
const productListWrapper = document.querySelector('.production-cards-display-area');
const mainArea = document.querySelector('main');
const currentProductTypeTitle = document.querySelector('.current-display-products-title');
let productItems = [];// 符合條件的product items
let perPageData = [];// 每頁所要顯示的product items
let data;//該類別的全部商品data
let currentProductName = "surfboard";//目前商品類別
let currentProductPage = 1;//目前所點擊的頁面
const perPageItem = 6;//商品列內卡片數量
let totalNum;//分頁最大頁碼
const rightArrow = document.querySelector('.change-page-right-btn');// 換頁按鈕
const leftArrow = document.querySelector('.change-page-left-btn');// 換頁按鈕
const pageNumList = document.querySelector('.news-page-num');// 分頁頁碼
const pageNumListWrapper = document.querySelector('.change-page-field')//分頁頁碼的container
// 篩選
const dropdownBtns = document.querySelectorAll('.dropdown-item');// 篩選按鈕
// 商品類別DOM
const productTypeBtns = document.querySelectorAll(".product-type-btn");
let currentProductData = "surfboard-products-list";
// 搜尋
const searchInput = document.querySelector('.production-search');
const searchInputSM = document.querySelector('#production-search-sm');
const searchBtn = document.querySelector('.magnifying-glass');
const searchFieldLightBox = document.querySelector('.search-field-sm-container');
const cancelSearchBtn = document.querySelector('.close-search-field-btn');
const searchSubmitBtn = document.querySelector('.search-submit-btn');
const searchFieldTrigger = document.querySelector('.search-field-trigger');
let searchMode = false;
const userPic = document.querySelector("#user-pic");
const userIcon = document.querySelector('.user-icon');
// 將畫面自動滑入特定的區域 area為目標元素
function scrollTo(area) {
    area.scrollIntoView();
}

function dropDownToggle(screenSize) {
    if (screenSize === "lg") {
        toggleBtn.classList.toggle('toggle-dropdown-actived');
        if (toggleBtn.classList.contains('toggle-dropdown-actived')) {
            dropDown.style.display = "block";
            chevron.classList.add('toggle-chevron-up');
        } else {
            dropDown.style.display = "none";
            chevron.classList.remove('toggle-chevron-up');
        }
    } else {
        toggleBtnSM.classList.toggle('toggle-dropdown-actived');
        if (toggleBtnSM.classList.contains("toggle-dropdown-actived")) {
            dropDownSM.style.display = "block";
            dropDownSMItems.style.bottom = "0%";
            chevronSM.classList.add('toggle-chevron-up');
        } else {
            dropDownSMItems.style.bottom = "-100%";
            dropDownSM.style.display = "none";
            chevronSM.classList.remove('toggle-chevron-up');
        }
    }
}
// fetch資料並顯示至商品列
// productType為目前商品類別(透過btn去切換)，透過該引數去fetch特定json的資料
async function fetchData() {
    scrollTo(mainArea);
    if(localStorage.getItem("currentProductName") === null) localStorage.setItem("currentProductName",currentProductName)
    // 判斷是否在做搜尋
    if (searchInput.value !== "" || searchInputSM.value !== "") {
        searchMode = true;
        localStorage.setItem("isSearchMode", true);
        localStorage.setItem("searchKeyWord", searchInput.value);
    } else {
        searchMode = false;
        localStorage.removeItem('isSearchMode')
        localStorage.removeItem("searchKeyWord");
    }
    try {
        if (searchMode === false) {// 沒有搜尋的情況下,顯示商品列
            currentProductName = localStorage.getItem('currentProductName') === null ? "surfboard" : localStorage.getItem('currentProductName');
            let response = await fetch(`../json/${currentProductName}-products-list.json`);
            data = await response.json();//將該商品類別資料存入data變數
            productItems = data;//初始狀態下，將該商品類別全部的商品存入productItems裡
            localStorage.getItem('currentProductPage') === null ? localStorage.setItem('currentProductPage', currentProductPage) : currentProductPage = parseInt(localStorage.getItem('currentProductPage'));
        } else {
            // 搜尋情況下
            // 將商品全部資料存放至data裡，並重置id數字
            searchInput.value = localStorage.getItem("searchKeyWord");
            data = [];
            currentProductPage = 1;
            const allProductType = ["accessories", "surfboard", "wetsuits", "other"];
            for (let i = 0; i < allProductType.length; i++) {
                let reponse = await fetch(`../json/${allProductType[i]}-products-list.json`);
                const receivedData = await reponse.json();// 一個陣列
                for (let j = 0; j < receivedData.length; j++) {
                    data.push(receivedData[j]);
                    receivedData[j].id = data.length;

                }
            };
            productItems = [];
            let keyWord;
            if (searchInput.value !== "") {
                keyWord = searchInput.value.trim().toLowerCase();
            } else if (searchInputSM.value !== "") {
                keyWord = searchInputSM.value.trim().toLowerCase()
            }
            currentProductName = keyWord;
            for (let product of data) {
                let productName = product.name.toLowerCase();
                let productBrand = product.brand.toLowerCase();
                if (productName.match(keyWord.toLocaleLowerCase()) || product.type.match(keyWord.toLocaleLowerCase()) || productBrand.match(keyWord.toLocaleLowerCase())) {
                    productItems.push(product);
                }
            }
        }
        displayPageData(currentProductPage);// 將productItems裡的資料依據目前頁碼，將資料存入perPageData裡
        showProductData();//依據分頁號碼來更新商品列
        displayPageNum();//顯示商品列表分頁號碼
    } catch (err) {
        throw new Error(`fetch fail due to ${err}`)
    }
}
//分頁
//顯示商品列表分頁號碼
function displayPageNum() {
    // 初始化pageNumList
    pageNumList.innerHTML = "";
    // 依據productItems的長度找出最大頁碼
    totalNum = Math.ceil(productItems.length / perPageItem);
    // 若最大頁碼小於等於1時，將分頁頁碼隱藏
    if (totalNum <= 1) {
        pageNumListWrapper.style.display = "none";
    } else {
        // 若大於將有頁碼顯示出來
        pageNumListWrapper.style.display = "flex"
        for (let i = 1; i <= totalNum; i++) {
            const pageNum = document.createElement('span');
            pageNum.classList.add(`page`);
            pageNum.textContent = i;
            if (i === currentProductPage) pageNum.classList.add("actived");
            pageNumList.append(pageNum);
        }
        const pageNumBtns = document.querySelectorAll('.page');
        // 將分頁頁碼新增事件聆聽，並currentProductPage變更為點擊到得頁碼
        pageNumBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                currentProductPage = parseInt(btn.textContent);
                pageNumBtns.forEach(numBtn => {
                    numBtn.classList.remove('actived');
                })
                btn.classList.add('actived');
                updateCardsItem();
            })
        })
    }
}

// 將productItems裡的資料依據目前頁碼，將資料存入perPageData裡
function displayPageData(currentProductPage) {
    perPageData = [];
    let start = perPageItem * (currentProductPage - 1);
    let end = Math.min(perPageItem * currentProductPage, productItems.length);
    for (let i = start; i < end; i++) {
        perPageData.push(productItems[i]);
    }
}

// 變更頁碼時，更新商品頁上的商品
function updateCardsItem() {
    localStorage.setItem('currentProductPage', currentProductPage);
    displayPageData(currentProductPage);//更新productItems裡面的商品
    showProductData();//顯示至商品列表
    scrollTo(mainArea);
    updateArrows();
}

// 將perPageData裡的資料掛上頁面上。
function showProductData() {
    currentProductTypeTitle.textContent = `${currentProductName}(${productItems.length})`;
    productListWrapper.innerHTML = '';
    if (perPageData.length !== 0) {
        for (let item of perPageData) {
            const productCard = document.createElement('a');
            productCard.href = `./preview-product.html?id=${item.id}`;
            productCard.classList.add("production-card");
            productCard.innerHTML = `
                    <div class="production-card-img">
                        <img src="${item.mainImage}" alt="商品圖片">
                    </div>
                    <div class="product-card-content">
                        <p class="production-tag">${item.productTag}</p>
                        <h3 class="production-card-title">${item.name}</h3>
                        <p class="production-brand">${item.brand}</p>
                        <p class="production-price">${item.priceTag}</p>
                    </div>`
            productListWrapper.append(productCard);
        }
    } else {
        const noProductImg = document.createElement('img');
        noProductImg.src = "../images/production-images/no-product-img copy.jpg";
        noProductImg.classList.add("no-product-img");
        noProductImg.alt = "找不到商品圖片";
        productListWrapper.append(noProductImg);
    }
}

// 換頁箭頭按鈕
function changePage(dirction) {
    dirction === "left" ? currentProductPage-- : currentProductPage++;
    currentProductPage = Math.max(1, Math.min(currentProductPage, totalNum));
    updateArrows();
    displayPageNum(data);
    updateCardsItem();
}
[leftArrow, rightArrow].forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.contains('change-page-left-btn') ? changePage("left") : changePage("right");
    })
})
function updateArrows() {
    leftArrow.disabled = currentProductPage === 1;
    rightArrow.disabled = currentProductPage === totalNum;
}
// 篩選
function filter(selectedItem, sort, screenSize) {
    productItems = [...data];
    currentProductPage = 1;
    localStorage.setItem('currentProductPage', 1)
    if (selectedItem !== null) {
        let currentTopic = selectedItem;
        productItems = data.filter(item => item.productTag === currentTopic);
    } else {
        if (sort === "decrease") {
            productItems.sort((a, b) => {
                return a.price - b.price;

            })
        } else {
            productItems.sort((b, a) => {
                return a.price - b.price;
            })
        }
    }
    // 更新頁碼與畫面商品更新
    displayPageNum();
    displayPageData(1);
    showProductData();
    screenSize === "sm" ? dropDownToggle('sm') : dropDownToggle('lg');
}

dropdownBtns.forEach(btn => {
    if (btn.classList.contains('product')) {
        btn.addEventListener('click', () => {
            currentProductPage = 1;
            filter(btn.textContent, null, btn.classList[2]);
        });
    } else {
        btn.classList.contains('increase') ? btn.addEventListener('click', () => {
            filter(null, "increase", btn.classList[2]);
            toggleBtn.classList.remove('toggle-dropdown-actived');
        }) : btn.addEventListener('click', () => {
            filter(null, "decrease", btn.classList[2]);
        })
    }
})
//商品類別切換
productTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        scrollTo(mainArea);
        searchInputSM.value = "";
        searchInput.value = "";
        currentProductData = btn.classList[0];
        localStorage.setItem('currentProductPage', 1)
        localStorage.setItem('currentProductName', btn.classList[2])
        fetchData();
    })
})
// 搜尋手機版
// 搜尋開關
function toggleSearchField() {
    searchFieldLightBox.classList.toggle('search-field-actived')
    if (searchFieldLightBox.classList.contains("search-field-actived")) {
        searchFieldLightBox.style.display = "block";
    } else {
        searchFieldLightBox.style.display = "none";
    }
}
// 使用者是否登入
function checkUserLogin() {
    let account;
    let userInfor = JSON.parse(localStorage.getItem("userInfor"));
    for(let user of userInfor) {
        if(user.isLogin) account = {...user};
        console.log(account);
    }
    // 登入時顯示頭像圖片
    if(account.isLogin) {
        userIcon.style.display = "none";
        userPic.style.display = "block";
    }else {
         // 未登入時顯示頭像icon
        userIcon.style.display = "block";
        userPic.style.display = "none";
    }
}
// 事件聆聽
searchInput.addEventListener('input', () => {
    if (searchInput.value === "") {
        fetchData();
    } else {
        searchBtn.addEventListener('click', fetchData);
    }
});
toggleBtn.addEventListener('click', () => {
    dropDownToggle('lg');
});
[toggleBtnSM, dropDownSM, closeDropDownBtn].forEach(btn => {
    btn.addEventListener('click', () => {
        dropDownToggle('sm');
    })
});
dropDownSMItems.addEventListener("click", (e) => {
    e.stopPropagation();
})
dropDown.addEventListener("click", (e) => {
    e.stopPropagation();
})
window.addEventListener('load',()=>{
     fetchData();
     checkUserLogin();
});
// 畫面尺寸切換時，refresh dropdown 與 search field
window.addEventListener("resize", () => {
    if (window.innerWidth > 1100 && searchInputSM.value !== "") {
        searchInput.value = searchInputSM.value;
        searchInput.value = "";
    } else if (window.innerWidth <= 1100 && searchInput.value !== "") {
        searchInputSM.value = searchInput.value;
        searchInputSM.value = "";
    }
    if (window.innerWidth > 1100) {
        if (toggleBtnSM.classList.contains('toggle-dropdown-actived')) dropDownToggle("sm");
        if (searchFieldLightBox.classList.contains("search-field-actived")) toggleSearchField();
        if (searchInputSM.value !== "") {
            searchInput.value = searchInputSM.value;
        }
    } else {
        if (toggleBtn.classList.contains('toggle-dropdown-actived')) dropDownToggle("lg");
        if (searchInput.value !== "") {
            searchInputSM.value = searchInput.value;
        }
    }
})
cancelSearchBtn.addEventListener("click", () => {
    searchInputSM.value = "";
    toggleSearchField()
});
searchFieldTrigger.addEventListener("click", toggleSearchField);
searchSubmitBtn.addEventListener('click', () => {
    if (searchInputSM.value === "") {
        return
    } else {
        fetchData();
        toggleSearchField();
    }
});
