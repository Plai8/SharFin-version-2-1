const goBackBtn = document.querySelector('.go-back-btn');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let id = urlParams.get('id');
let reponseData;
let displayData;
const newsImg = document.querySelector('.news-img');
const newsTitle = document.querySelector('.news-content-title');
const pulishDate = document.querySelector('.news-pulish-date');
const newsContent = document.querySelector('.news-content');
const userIcon = document.querySelector('.user-icon');
const userPic = document.querySelector("#user-pic");
const userInfor = JSON.parse(localStorage.getItem('userInfor'));

function showUserPic() {
    let isLogin = false;
    userInfor.forEach(account => {
        if (account.isLogin) {
            isLogin = true;
        }
    });
    if (isLogin) {
        userIcon.style.display = "none";
        userPic.style.display = "block";
    } else {
        userIcon.style.display = "block";
        userPic.style.display = "none";
    }
}



async function fetchData () {
    try {
       let reponse = await fetch('../json/news-list.json');
       reponseData = await reponse.json();
        console.log(reponseData);
    }catch(err){
        console.error(err)
    }
    showData();
}
function showData () {
    displayData = reponseData[id - 1];
    newsImg.src = displayData.imagePath;
    newsTitle.textContent = displayData.title;
    pulishDate.textContent = `刊登日期:${displayData.date}`;
    newsContent.textContent = displayData.content;

}
window.addEventListener('load',() => {
    fetchData();
    showUserPic();
})