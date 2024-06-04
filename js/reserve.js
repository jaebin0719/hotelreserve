document.addEventListener("DOMContentLoaded", function () {
  const cityMenu = document.querySelector(".city-menu");
  const cityList = cityMenu.querySelector("ul");

  cityMenu.addEventListener("click", function () {
    cityList.classList.toggle("active");
  });

  // 도시를 선택하면 선택한 도시로 변경 및 메뉴 닫기
  cityList.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
      const selectedCity = e.target.textContent;
      const spanText = cityMenu.querySelector("span");
      spanText.textContent = selectedCity;
      cityList.classList.remove("active");
    }
  });

  // 도시 선택 메뉴가 외부를 클릭하면 닫기
  document.addEventListener("click", function (e) {
    if (!cityMenu.contains(e.target)) {
      cityList.classList.remove("active");
    }
  });
});
