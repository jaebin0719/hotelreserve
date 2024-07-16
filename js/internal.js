$(document).ready(function () {
    var swiper = new Swiper(".internalSwiper", {
        slidesPerView: 6,
        spaceBetween: 10,
        loop:true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
})