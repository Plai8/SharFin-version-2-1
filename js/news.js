let newsList;
let displayData = [];
let totalPages;
let currentPage = 1;
let perPageItem = 6;
const rightArrow = document.querySelector('.change-page-right-btn')
const leftArrow = document.querySelector('.change-page-left-btn')
const pageNumList = document.querySelector('.news-page-num');
const newsItemsWrapper = document.querySelector('.news-items-wrapper');
const newsTitle = document.querySelector('.news-list-title');
const pageNumBtns = document.querySelectorAll('.page');
const mainArea = document.querySelector('.news-list-field');
const userPic = document.querySelector("#user-pic");
const userIcon = document.querySelector('.user-icon');
const userInfor = JSON.parse(localStorage.getItem('userInfor'));

function showUserPic() {
    let isLogin = false;
    userInfor.forEach(account => {
        if (account.isLogin) {
            isLogin = true;
        }
    });
    console.log(isLogin)
    if (isLogin) {
        userIcon.style.display = "none";
        userPic.style.display = "block";
    } else {
        userIcon.style.display = "block";
        userPic.style.display = "none";
    }
}
function scrollTo() {
    mainArea.scrollIntoView();
}


//fetch news data
async function fetchData() {
    try {
        let response = await fetch('../json/news-list.json');
        let data = await response.json();
        console.log(data);
        newsList = data.reverse();//確保日期由最新排序至最舊
    } catch (err) {
        throw new Error(err);
    }
    //將目前頁數存入localStorage裡 note:移除localStorage的currentPage時機為，首頁最新消息btn、navbar最新消息btn
    if (currentPage === "") localStorage.removeItem('currentPage');
    localStorage.getItem('currentPage') === null ? localStorage.setItem('currentPage', currentPage) : currentPage = parseInt(localStorage.getItem('currentPage'));
    console.log(currentPage, typeof currentPage)
    displayPageNum();//顯示分頁頁碼
    displayPageData(currentPage);//將newsList data切分為displayData;
    displayNews();//將displayData資料放置畫面中
    //將頁碼新增事件聆聽
    const numBtns = document.querySelectorAll('.page');
    numBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentPage = parseInt(btn.textContent);
            updateNews();
        })
    })
}


function updateNews() {
    displayPageData(currentPage);
    //清空舊的最新消息資料
    localStorage.setItem('currentPage', currentPage);
    newsItemsWrapper.innerHTML = ''
    //更新最新消息資料
    displayNews();
    //檢測arrows是否為disable狀態
    updateArrows();
}
function displayNews() {
    //將資料顯示出來
    displayData.forEach(el => {
        let divEl = document.createElement('div');
        divEl.classList.add("news-item-card");
        divEl.innerHTML = `<div class="news-cover-img"><img src="${el.imagePath}" alt="最新消息圖片"></div>
        <div class="news-content">
        <p class="news-date">${el.date}</p>
                <h3 class="news-content-title">${el.title}</h3>
                <a class="read-more-btn" href="./news-content.html?id=${el.id}">閱讀更多<i class="fa-solid fa-arrow-right"></i></a>
            </div>`;
        newsItemsWrapper.append(divEl);
    });
    // newsTitle.append(newsItemsWrapper)
}

function displayPageNum() {
    pageNumList.innerHTML = '';
    //顯示總頁數
    totalPages = Math.ceil(newsList.length / perPageItem);
    //顯示page數目
    for (let i = 1; i <= totalPages; i++) {
        let pageNum = document.createElement('span');
        pageNum.textContent = i;
        pageNum.classList.add(`page`);
        //所currentPage等於該分頁的值時，新增class name 'actived'給它
        if (i === currentPage) pageNum.classList.add("actived");
        pageNumList.append(pageNum);
    }
    const pageNumBtns = document.querySelectorAll('.page');
    pageNumBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentPage = parseInt(btn.textContent);
            pageNumBtns.forEach(numBtn => {
                numBtn.classList.remove('actived');
                console.log(numBtn);
            });
            btn.classList.add('actived');
            console.log(currentPage)
            updateNews();
            scrollTo();
        })
    })
}
function displayPageData(currentPage) {
    displayData = [];
    //顯示開始與結束
    let start = perPageItem * (currentPage - 1);
    let end = Math.min(currentPage * perPageItem, newsList.length);//確保索引值不超過資料總數
    for (let i = start; i < end; i++) {
        displayData.push(newsList[i]);
    }
}
//箭頭分頁切換
function changePage(dirction) {
    dirction === "left" ? currentPage-- : currentPage++;//若箭頭方向為左邊currentPage減一，其他則加一
    currentPage = Math.max(1, Math.min(totalPages, currentPage));//檢查currentPage是否超過範圍
    const pageNumBtns = document.querySelectorAll('.page');
    pageNumBtns.forEach(btn => {
        parseInt(btn.textContent) === currentPage ? btn.classList.add("actived") : btn.classList.remove('actived');
        updateNews();
        scrollTo();
    })
}

function updateArrows() {
    leftArrow.disabled = currentPage === 1;
    rightArrow.disabled = currentPage === totalPages;
}

rightArrow.addEventListener('click', () => {
    changePage('right');
})
leftArrow.addEventListener('click', () => {
    changePage('left');
})

window.addEventListener('load', () => {
    fetchData();
    showUserPic();
});