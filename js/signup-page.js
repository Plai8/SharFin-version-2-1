const wrapper = document.querySelector('.signUp-wrapper');

function scrollTo() {
    wrapper.scrollIntoView();
}

const switchBtns = document.querySelectorAll('.switch-btn');
const signupBtn = document.querySelector('.switch-btn-signup');
const loginBtn = document.querySelector('.switch-btn-login')
const signUpField = document.querySelector('.signUp-field ')
const loginField = document.querySelector('.login-field ')

switchBtns.forEach(switchBtn => {
    switchBtn.addEventListener('click',el => {
        //先把全部'btn-actived' class移除。
        switchBtns.forEach(el => {
            el.classList.remove('btn-actived');
        })
        console.log(el.target)
        //新增btn-actived'至被點擊到的btn
        el.target.classList.add('btn-actived');
        if(el.target.classList.contains('switch-btn-signup')){
            signUpField.style.display = "block";
            loginField.style.display = "none";
        }else {
            signUpField.style.display = "none";
            loginField.style.display = "block";
        }
    })
})

window.addEventListener("resize",() => {
    if(window.innerWidth >= 1024) {
        signUpField.style.display = "block";
        loginField.style.display = "block";
    }else {
        signUpField.style.display = "block";
        loginField.style.display = "none";
        //確保switch btn為defult狀態
        switchBtns[0].classList.add('btn-actived')
        switchBtns[1].classList.remove('btn-actived')
    }
})
window.addEventListener('DOMContentLoaded', scrollTo)