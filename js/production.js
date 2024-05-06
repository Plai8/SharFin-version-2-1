//Javascript for tab navbar horizontal scroll btn
const btnLeft = document.querySelector('.left-btn');
const btnRight = document.querySelector('.right-btn');
const tabMenu = document.querySelector('.tab-menu');
tabMenu.scrollLeft = 0;
btnLeft.addEventListener('click',()=> {
    tabMenu.scrollLeft -= 150;
})
btnRight.addEventListener('click',()=> {
    tabMenu.scrollLeft += 150;
})
//JavaScript to make the tab nav draggable
let activeDrag = false;
tabMenu.addEventListener('mousemove',(drag)=> {
    if(!activeDrag) return;
    tabMenu.scrollLeft -= drag.movementX;
    tabMenu.classList.add('dragging')
});
document.addEventListener('mouseup',() => {
    activeDrag = false;
    tabMenu.classList.remove('dragging')
})
tabMenu.addEventListener('mousedown',() => {
    activeDrag = true;
})
//view tab contents on  click tab bitton
const tabs = document.querySelectorAll('.card-container')
const tabBtns = document.querySelectorAll('.tab-btn')
const tab_Nav = function (tabBtnClick) {
    tabBtns.forEach((tabBtn)=> {
        tabBtn.classList.remove('actived');
    })
    tabs.forEach((tab)=> {
        tab.classList.remove('actived-section')
    })
    tabBtns[tabBtnClick].classList.add('actived');
    tabs[tabBtnClick].classList.add('actived-section')
} 
tabBtns.forEach((tabBtns,i) => {
    tabBtns.addEventListener('click',()=> {
        tab_Nav(i);
    })
})
const addCartBtns = document.querySelectorAll('.add-cart-btn');
let addCartAmount = document.querySelector('#cart-amount');
let cartAmount = 0;
const cancelIcon = document.querySelectorAll('.fa-cart-shopping');
const additems = function (addCartClick) {
    addCartBtns[addCartClick].classList.toggle('added-cart');
    if (addCartBtns[addCartClick].classList.contains('added-cart')) {
        addCartBtns[addCartClick].innerHTML = '<i class="fa-solid fa-xmark add-cart-icon  style="color: #000;"><i/>取消';
        cartAmount += 1;
        addCartAmount.innerHTML = cartAmount;
    }else {
        addCartBtns[addCartClick].innerHTML = '<i class="fa-solid fa-cart-shopping add-cart-icon  style="color: #000;"><i/>'+'加入購物車';
        cartAmount -= 1;
        addCartAmount.innerHTML = cartAmount;
    }

}
addCartBtns.forEach((addCartBtns,i) => {
    addCartBtns.addEventListener('click',()=> {
        additems(i);
    })
})
