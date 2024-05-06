let items = document.querySelectorAll('.slider .list .item');
let next = document.querySelector('#next');
let pre = document.querySelector('#pre');
let thumbnail = document.querySelectorAll('.thumbnail .item');
let countItem = items.length;
let itemActive = 0;
next.addEventListener('click',()=> {
    itemActive = itemActive + 1;
    if(itemActive >= countItem) {
        itemActive = 0;
    }
    showSlider();
})
pre.addEventListener('click',()=> {
    itemActive = itemActive -1;
    if(itemActive < 0) {
        itemActive = countItem - 1;
    }
    showSlider();
})
//aoto run slider 
let refreshInterval = setInterval(()=>{
    next.click();
},3000)
function showSlider() {
    let itemActiveOld = document.querySelector('.slider .list .item.active')
    let thumbnailOld = document.querySelector('.thumbnail .item.active')
    console.log(itemActiveOld);
    itemActiveOld.classList.remove('active');
    thumbnailOld.classList.remove('active');
    items[itemActive].classList.add('active');
    thumbnail[itemActive].classList.add('active');
    //clear auto time run slider
    clearInterval(refreshInterval);
    refreshInterval = setInterval(()=>{
        next.click();
    },5000)
}
thumbnail.forEach((thumbnail,index) => {
    thumbnail.addEventListener('click',()=> {
        itemActive = index;
        showSlider();
    })
})