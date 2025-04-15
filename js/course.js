"use strict"
// DOM 
// 取得網址的課程id
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const courseID = urlParams.get("id");
const courseTitle = document.querySelector('.course-title');
const courseIntro = document.querySelector('.course-intro');
const coursePriceTag = document.querySelector('.course-price');
const courseIntroImg = document.querySelector('.course-intro-image img');
const scheduleSwitchBtnWrapper = document.querySelector(".switch-btn-wrapper");
const courseScheduleImg = document.querySelector('.course-schedule-content-img-wrapper img');
const courseScheduleContentWrapper = document.querySelector('.course-schedule-content-wrapper');
const courseScheduleContent = document.querySelector(".course-schedule-content");
const courseReservationTimeWrapper = document.querySelector('.course-time-input-wrapper');
// reservation input area
const attendanceInput = document.querySelector('#number-of-attendance');
const feeDescription = document.querySelector('.fee-description');
const courseTimeWrapper = document.querySelector('.course-time-input-wrapper');
const courseTime2 = document.querySelector('.course-time-2');
const totalCostNum = document.querySelector('.total-cost');
const depositFeeNum = document.querySelector('.deposit-fee-amount');
const addCartBtn = document.querySelector('.add-cart-sumit-btn')
const reservationDate = document.querySelector('#course-date');
const attendanceNum = document.querySelector('#number-of-attendance');
const warnSign = document.querySelectorAll('.warning-info');
const coursesData = [
    {
        id: 1,
        courseTitle: "衝浪半日體驗",
        courseIntroduce: "不需要任何有關海洋的經驗，無論是在陸地還是在水中，教練將隨時隨地與您同在，我們會在水深到腰的淺灘，水性不好、不會游泳也能體驗衝浪的樂趣！ 我們團隊擁有豐富的經驗和專業知識，以簡單理解的課程方式，確保您在衝浪和學習中獲得最佳體驗讓您安心學習，新手也能享受站上衝浪板的快感 ！",
        coursePriceTag: "NT$1500/一人",
        courseImages: [
            "../images/index-images/surfing-course-halfday.jpg",
            "../images/halfday-courses-image/half-day-course-schedule-img.jpg"
        ],
        courseSchedule: [
            ["上課前20鐘店裡報到、填寫保險、著裝",
                "40分 ISA國際衝浪教學岸上課程",
                "40分 第一次下水實戰練習",
                "10分 岸上動作調整",
                "40分 第二次下水實戰練習",
                "60分 午休 & 自由時間",
                "40分 進階技巧教學 & 下水練習",
                "10分 岸上檢討 & 個人動作調整",
                "40分 最後一次下水挑戰",
                "下課後自由練習",
            ]
        ],
        courseReservationTime: ["09:30"],
        coursePriceDescription: "1人 NT$1,500。",
        coursePrice: 1500,
        depositFee: 300,

    },
    {
        id: 2,
        courseTitle: "衝浪一日體驗",
        courseIntroduce: "不需要任何海洋經驗，水性不好、不會游泳也沒問題！我們的課程設計讓你在安全的淺灘（水深約腰部）中學習，專業教練全程陪伴，確保你的安全與學習效果。我們的教學團隊擁有豐富經驗，透過簡單易懂的教學方式，讓你輕鬆掌握衝浪技巧，安心享受衝浪的樂趣！即使是新手，也能體驗站上衝浪板的成就感！",
        coursePriceTag: "NT$2400/一人",
        courseImages: [
            "../images/courses-images/onday-course-bgi.jpg",
            "../images/halfday-courses-image/one-day-course-schedule-img.jpg"
        ],
        courseSchedule: [
            ["上課前20鐘店裡報到、填寫保險、著裝",
                "40分 ISA國際衝浪教學岸上課程",
                "40分 第一次下水實戰練習",
                "10分 岸上動作調整",
                "40分 第二次下水實戰練習",
                "60分 午休 & 自由時間",
                "40分 進階技巧教學 & 下水練習",
                "10分 岸上檢討 & 個人動作調整",
                "40分 最後一次下水挑戰",
                "下課後自由練習",
            ]
        ],
        courseReservationTime: "09:30",
        coursePriceDescription: "1人 NT$2,400。",
        coursePrice: 2400,
        depositFee: 480,

    },
    {
        id: 3,
        courseTitle: "兩天一夜衝浪輕旅行",
        courseIntroduce: "我們以ISA國際衝浪證照專業衝浪教練指導您如何有效率地實現目標，提高您的衝浪技術和您的衝浪知識！教練將帶您體驗衝浪在海上的速度感，您只需帶著輕便的行李、放鬆的心情即刻出發烏石港海灘！衝浪的迷人之處等你來體驗，一起來享受衝浪假期吧！",
        coursePriceTag: "NT$3,880/一人",
        courseImages: [
            "../images/courses-images/vip-course-bgi.jpg",
            "../images/halfday-courses-image/two-days-course-schedule-img-day1.jpg",
            "../images/halfday-courses-image/two-days-course-schedule-img-day2.jpg",

        ],
        courseSchedule: [
            [
                "13:30報到、填寫保險、著裝",
                "40分 ISA國際衝浪教學岸上課程",
                "40分 教練陪同下水衝浪練習",
                "10分 岸上修正衝浪動作",
                "40分 教練陪同下水衝浪練習",
                "自由練習下課回民宿"
            ],
            [
                "40分 衝浪照片講解、如何選浪",
                "40分 教練陪同下水衝浪練習划水追浪",
                "10分 岸上修正衝浪動作",
                "40分 教練陪同下水衝浪練習划水追浪",
                "自由練習",
                "開心回家"
            ]
        ],
        courseReservationTime: "09:30",
        coursePriceDescription: "1人 NT$3,880。",
        coursePrice: 3880,
        depositFee: 776,

    }
];
const userPic = document.querySelector("#user-pic");
const userIcon = document.querySelector('.user-icon');
const userInfor = JSON.parse(localStorage.getItem('userInfor'));
let user;
const courseInfo = {
    "name": null,
    "mainImage": null,
    "count": 1,
    "time": null,
    "reservationDate": null,
    "isPaidDespoit": false,
    "price": null,
    "priceTag": null,
    "productType": "course"
}

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

function getUserInfo() {
    userInfor.forEach(account => {
        if (account.isLogin) {
            user = { ...account };
        }
    })
}

function updateCourseContent(id) {
    // 依照課成Id更新課程內容
    let selectedCourse = coursesData[id - 1];
    courseTitle.textContent = selectedCourse.courseTitle;
    courseIntro.textContent = selectedCourse.courseIntroduce;
    coursePriceTag.textContent = selectedCourse.coursePriceTag;
    courseIntroImg.src = selectedCourse.courseImages[0];
    courseScheduleImg.src = selectedCourse.courseImages[1];
    // 顯示第二天課程按鈕
    if (selectedCourse.courseSchedule.length !== 1) {
        scheduleSwitchBtnWrapper.innerHTML = "";
        for (let i = 1; i <= 2; i++) {
            const switchBtn = document.createElement('button');
            switchBtn.classList.add('course-schedule-date-switch-btn');
            if (i === 1) switchBtn.classList.add('actived');
            switchBtn.textContent = `第${i}天`;
            scheduleSwitchBtnWrapper.append(switchBtn);
        };
        updateCourseScheduleContent(1, selectedCourse);
        const scheduleSwitchBtns = document.querySelectorAll(".course-schedule-date-switch-btn");
        scheduleSwitchBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                for (let btn of scheduleSwitchBtns) {
                    btn.classList.remove("actived");
                }
                btn.classList.add('actived');
                btn.textContent === "第2天" ? updateCourseScheduleContent(2, selectedCourse) : updateCourseScheduleContent(1, selectedCourse);;
            })
        })
    } else {
        updateCourseScheduleContent(1, selectedCourse);
    }
    updateSignupField(selectedCourse);
    priceUpdate(selectedCourse);
}

function updateCourseScheduleContent(day, selectedCourse) {
    courseScheduleContent.innerHTML = "";
    for (let i = 0; i < selectedCourse.courseSchedule[day - 1].length; i++) {
        let li = document.createElement('li');
        li.textContent = selectedCourse.courseSchedule[day - 1][i];
        courseScheduleContent.append(li);
    }
    courseScheduleContentWrapper.append(courseScheduleContent);
    courseScheduleImg.src = selectedCourse.courseImages[day];
}

function updateSignupField(selectedCourse) {
    if (courseID === "1") {
        courseTimeWrapper.innerHTML = `
        <span>課程時段 :</span>
        <label for="course-time-1">
                        <input type="radio" name="course-time" id="course-time-1" value="09:30" checked>
                        <span>09:30</span>
                    </label>
    
    `;
    } else {
        courseTimeWrapper.innerHTML = `
    <span>課程時段 :</span>
        <label for="course-time-1">
                        <input type="radio" name="course-time" id="course-time-1" value="09:30" checked>
                        <span>09:30</span>
                    </label>
    
    `;
    }
    feeDescription.textContent = selectedCourse.coursePriceDescription;
    totalCostNum.textContent = `NT$${selectedCourse.coursePrice}`;
    depositFeeNum.textContent = `NT$${selectedCourse.depositFee}`;
}

function priceUpdate(selectedCourse) {
    attendanceNum.addEventListener('input', () => {
        let currentNum = Number(attendanceNum.value);
        if (currentNum >= 50) {
            attendanceNum.value = 50;
            currentNum = 50;
        } else if (currentNum < 0 || currentNum === false) {
            attendanceNum.value = 1;
            currentNum = 1;
        };
        totalCostNum.textContent = `NT$${Math.max(selectedCourse.coursePrice * currentNum, selectedCourse.coursePrice)}`;
    })
}

function checkSignUpData() {
    const reservDate = new Date(reservationDate.value).getTime();
    const today = new Date().getTime();
    if (reservDate < today) {
        warnSign[0].style.display = "block";
        reservationDate.style.border = "1px solid red";
        addCartBtn.disabled = true;

    } else {
        warnSign[0].style.display = "none";
        reservationDate.style.border = "1px solid #26a69a";
        addCartBtn.disabled = false;
    }
}

function displayReserveCourseInfo() {
    let selectedItem = user.cart.courses.filter(item => item.name === coursesData[courseID - 1].courseTitle);
    attendanceInput.value = selectedItem[0].count;
    reservationDate.value = selectedItem[0].reservationDate;
}

function reserveCourse() {
    courseInfo.name = coursesData[courseID - 1].courseTitle;
    courseInfo.mainImage = coursesData[courseID - 1].courseImages[0];
    courseInfo.time = "09:30";
    courseInfo.count = Number(attendanceNum.value);
    if(reservationDate.value === "") {
        alert("請輸入預約日期");
        return;
    }else {
        courseInfo.reservationDate = reservationDate.value;
    }
    courseInfo.price = coursesData[courseID - 1].coursePrice;
    courseInfo.priceTag = `$${coursesData[courseID - 1].coursePrice}`;
    user.cart.courses.push(courseInfo);
    userInfor.forEach(account => {
        if (account.isLogin) {
            account = user;
        }
    })
    localStorage.setItem('userInfor', JSON.stringify(userInfor));
    alert("預約成功！");
    attendanceInput.value = 1;
    reservationDate.value = "";

};

reservationDate.addEventListener("input", checkSignUpData);
addCartBtn.addEventListener('click', reserveCourse);
window.addEventListener('load', () => {
    updateCourseContent(courseID);
    showUserPic();
    getUserInfo()
});



