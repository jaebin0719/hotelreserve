$(document).ready(function () {
    var swiper = new Swiper(".pophotelSwiper", {
        loop: true,
        slidesPerView: 4,
        spaceBetween: 30, 
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
})