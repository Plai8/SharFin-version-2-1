const longBoardPlus = document.querySelector('.longboard-amount-increase-btn');
const longBoardMinus = document.querySelector('.longboard-amount-decrease-btn');
const shortBoardPlus = document.querySelector('.shortboard-amount-increase-btn');
const shortBoardMinus = document.querySelector('.shortboard-amount-decrease-btn');
const longboardAmount = document.querySelector('#longboard');
const shortboardAmount = document.querySelector('#shortboard');
const reservationDate = document.querySelector('#rental-reservation-date');
const addCartBtn = document.querySelector('.addcart-btn');
const rentalTotalFee = document.querySelector('.rental-total-fee');
const warningMsg = document.querySelector('#warning-msg');
const surfboardRentalCart = { "浮板數量": 0, "衝浪板數量": 0, "預約日期": null ,"總金額":0};
const alertLightBox = document.querySelector('.alert-light-box-container');
const orderContent = document.querySelector('.order-contnet');
const cancelBtn = document.querySelector('.cancel-btn');
const shutdownBtn = document.querySelector('.alert-shutdown-btn');
const confirmBtn = document.querySelector('.confirm-btn');
const reservationSuccessInfo = document.querySelector('.alert-info-reservation-success');
const orderconfirmInfo = document.querySelector('.alert-info');
const spans = document.querySelectorAll('span');
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
    if (isLogin) {
        userIcon.style.display = "none";
        userPic.style.display = "block";
    } else {
        userIcon.style.display = "block";
        userPic.style.display = "none";
    }
}
// 新增或是刪除衝浪板數量以及計算租板總金額
// 函式參數說明：event=>判斷目前是click事件（數量加一或減一）或是input事件(直接輸入數量)。boardType=>判斷租板種類，分別為"long"與"short"。action=>為click事件下，
//是新增數量還是刪減數量。
function feeComputed(event, boardType, action) {
    let totalFee = 0;
    let board = document.querySelector(`#${boardType}board`);
    // 若為點擊事件時
    if (event !== "input") {
        // 判斷目前按鈕是增加還是刪減數量，並把目前數量更新。
        action === "increase" ? board.value++ : board.value--;
    }
     // input事件時
    // 防止數量出現小於零的情況
    if (board.value < 0) board.value = 0;
    console.log(board.value);
    totalFee = shortboardAmount.value * 300 + longboardAmount.value * 600;
    rentalTotalFee.textContent = totalFee;
}
// 新增事件聆聽至按鈕
longBoardPlus.addEventListener('click', () => {
    feeComputed('click', "long", "increase");
})
shortBoardPlus.addEventListener('click', () => {
    feeComputed('click', "short", "increase");
})
longBoardMinus.addEventListener('click', () => {
    feeComputed('click', "long", "decrease");
})
shortBoardMinus.addEventListener('click', () => {
    feeComputed('click', "short", "decrease");
})
longboardAmount.addEventListener('input', () => {
    feeComputed('input', "long", 'decrease');
})
shortboardAmount.addEventListener('input', () => {
    feeComputed('input', "short", 'decrease');
})
function showConfirmMsg (state) {
    alertLightBox.style.display = "block";
    if(state === "success"){
        for(let item in surfboardRentalCart){
            const orderItem = document.createElement('p');
            if(item === "總金額") {
                orderItem.textContent= `${item}:NT$${surfboardRentalCart[item]}`;
                orderContent.append(orderItem);
                return;
            };
            orderItem.textContent= `${item}:${surfboardRentalCart[item]}`
            orderContent.append(orderItem);
        }
    }else {
        const orderItem = document.createElement('p');
        orderItem.classList = "error-Msg";
        orderItem.textContent = '請輸入衝浪板數量！';
        orderContent.append(orderItem);
        cancelBtn.style.display = 'none';
        confirmBtn.style.display = 'none';

    }
}
function clearMsg() {
    orderContent.innerHTML = '';
    alertLightBox.style.display = 'none';
    cancelBtn.style.display = 'block';
    confirmBtn.style.display = 'block';
    
}

// 加入購物車
function addcart() {
    // 取得目前日期
    let now = new Date();
    let formattedDate = now.getTime();
    let reservformattedDate = new Date(reservationDate.value).getTime();
    if(reservationDate.value === '') {
        warningMsg.style.display = "block"; 
        warningMsg.textContent = "請選擇預約日期！";
        reservationDate.style.border = "1px solid red";
    }else if(formattedDate > reservformattedDate ) {// 判斷預約日期是否有效:未規定最多可以預約至多久以後的日期。
        warningMsg.style.display = "block"; 
        warningMsg.textContent = "預約日期無效！";
        reservationDate.style.border = "1px solid red";
    }else if(longboardAmount.value === '0' && shortboardAmount.value === "0" ) {
        showConfirmMsg ("fail");
    }else {
        // alert顯示購物車資訊
        surfboardRentalCart["衝浪板數量"] = longboardAmount.value;
        surfboardRentalCart["浮板數量"]= shortboardAmount.value;
        surfboardRentalCart["預約日期"] = reservationDate.value;
        surfboardRentalCart["總金額"] = parseInt(rentalTotalFee.textContent,10);
        showConfirmMsg ("success");
    };

   
}
// 事件聆聽
cancelBtn.addEventListener('click',clearMsg);
shutdownBtn.addEventListener('click',clearMsg);
reservationDate.addEventListener('focus',() => {
    warningMsg.style.display = "none"; 
    warningMsg.textContent = "";
    reservationDate.style.border = "1px solid #26a69a";
})
confirmBtn.addEventListener('click',()=> {
    orderconfirmInfo.style.display = "none";
    reservationSuccessInfo.style.display = "block";
    reservationDate.value = "";
    longboardAmount.value = "0";
    shortboardAmount.value = "0"
})
addCartBtn.addEventListener('click', addcart);
window.addEventListener('load',showUserPic);