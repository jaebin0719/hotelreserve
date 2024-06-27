document.addEventListener('DOMContentLoaded', function () {
    const reservePlace = document.querySelector('.reserve-place');
    const citySearch = document.getElementById('city-search');
    const cityListItems = document.querySelectorAll('#city-list li');
    const citySearchBar = document.querySelector('.city-search-bar');
    const citySpan = document.querySelector('.reserve-place span');

    reservePlace.addEventListener('click', function () {
        citySearch.style.display = citySearch.style.display === 'block' ? 'none' : 'block';
    });

    cityListItems.forEach(function (item) {
        item.addEventListener('click', function () {
            const city = this.querySelector('span:first-child').textContent;
            citySpan.textContent = city;
            citySearch.style.display = 'none';
        });
    });

    citySearchBar.addEventListener('input', function () {
        const input = citySearchBar.value.toLowerCase();
        cityListItems.forEach(function (item) {
            const cityName = item.textContent.toLowerCase();
            item.style.display = cityName.includes(input) ? 'flex' : 'none';
        });
    });

    document.addEventListener('click', function (event) {
        if (!citySearch.contains(event.target) && !reservePlace.contains(event.target)) {
            citySearch.style.display = 'none';
        }
    });
});
// 체크인 체크아웃 선택------------------------------------------------------------
// 날짜 포맷 정규식 (yyyy-mm-dd)
const regexDate = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
// date 객체 만들기
const thisDate = new Date();
// 오늘 날짜 (yyyy-mm-dd 00:00:00)
const today = new Date();
// 달력이도 최대 개월 수
const limitMonth = 4;
// 달력에서 표기하는 날짜 객체
let thisMonth = today;
// 달력에서 표기하는 년
let currentYear = thisMonth.getFullYear();
// 달력에서 표기하는 월
let currentMonth = thisMonth.getMonth();
// 체크인 날짜
let checkInDate = "";
// 체크아웃 날짜
let checkOutDate = "";

document.addEventListener('DOMContentLoaded', function () {
    const reserveSel = document.querySelector('.checktext-box');
    const calendarWrap = document.querySelector('.calendar-wrap');
    const confirmButton = document.querySelector('.checkInOutBtn');

    calendarWrap.style.display = 'none';

    // 체크인 체크아웃 날짜 설정 창 열기
    reserveSel.addEventListener('click', function (event) {
        calendarWrap.style.display = 'block';
        event.stopPropagation();  // 이벤트 버블링 방지
    });

    // 확인 버튼 클릭 시
    confirmButton.addEventListener('click', function (event) {
        calendarWrap.style.display = 'none';
        // 여기에 확인 버튼 눌렸을 때의 동작 추가 가능
    });

    // 캘린더 외부를 클릭하면 닫기
    document.addEventListener('click', function (event) {
        const target = event.target;
        if (!calendarWrap.contains(target) && !reserveSel.contains(target)) {
            calendarWrap.style.display = 'none';
        }
    });
});

window.onload = function () {
    // 달력 만들기
    calendarInit(thisMonth);

    // 이전달로 이동
    document.querySelector('.go-prev').addEventListener('click', function () {
        const startDate = document.querySelector('.start-year-month').innerHTML.split('.');

        // 달력이 현재 년 월 보다 같거나 작을경우 뒤로가기 막기
        if (getLimitMonthCheck(parseInt(startDate[0]), parseInt(startDate[1])) <= 0) {
            return;
        }

        thisMonth = new Date(currentYear, currentMonth - 1, 1);
        calendarInit(thisMonth);
    });

    // 다음달로 이동
    document.querySelector('.go-next').addEventListener('click', function () {
        const lastDate = document.querySelector('.last-year-month').innerHTML.split('.');

        // 예약 가능 최대 개월수와 같거나 크다면 다음달 이동 막기
        if (getLimitMonthCheck(parseInt(lastDate[0]), parseInt(lastDate[1])) >= limitMonth) {
            alert('최대예약 기간은 ' + limitMonth + '개월 입니다.');
            return;
        }

        let limitYear = today.getFullYear();
        if (currentMonth + limitMonth >= 12) {
            limitYear = limitYear + 1;
        }

        thisMonth = new Date(currentYear, currentMonth + 1, 1);
        calendarInit(thisMonth);
    });
};

// 달력 그리기
function calendarInit(thisMonth) {

    // 렌더링을 위한 데이터 정리
    currentYear = thisMonth.getFullYear();
    currentMonth = thisMonth.getMonth();

    // 렌더링 html 요소 생성
    let start_calendar = '';
    let last_calendar = '';

    makeStartCalendar();
    makeLastCalendar();

    // start_calendar
    function makeStartCalendar() {
        // 이전 달의 마지막 날 날짜와 요일 구하기
        const startDay = new Date(currentYear, currentMonth, 0);
        const prevDate = startDay.getDate();
        const prevDay = startDay.getDay();

        // 이번 달의 마지막날 날짜와 요일 구하기
        const endDay = new Date(currentYear, currentMonth + 1, 0);
        const nextDate = endDay.getDate();
        const nextDay = endDay.getDay();

        // 지난달
        for (let i = prevDate - prevDay; i <= prevDate; i++) {
            start_calendar += pervDisableDay(i);
        }

        // 이번달
        for (let i = 1; i <= nextDate; i++) {
            // 이번달이 현재 년도와 월이 같을경우
            if (currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
                // 지난 날짜는 disable 처리
                if (i < today.getDate()) {
                    start_calendar += pervDisableDay(i);
                } else {
                    start_calendar += dailyDay(currentYear, currentMonth, i);
                }
            } else {
                start_calendar += dailyDay(currentYear, currentMonth, i);
            }
        }

        // 다음달 7 일 표시
        for (let i = 1; i <= (6 - nextDay); i++) {
            start_calendar += nextDisableDay(i);
        }

        document.querySelector('.start-calendar').innerHTML = start_calendar;
        // 월 표기
        document.querySelector('.start-year-month').textContent = currentYear + '.' + zf((currentMonth + 1));
    }

    // last_calendar
    function makeLastCalendar() {
        let tempCurrentYear = currentYear;
        let tempCurrentMonth = currentMonth + 1;

        if (tempCurrentMonth >= 12) {
            tempCurrentYear = parseInt(tempCurrentYear) + 1;
            tempCurrentMonth = 0;
        }

        // 이전 달의 마지막 날 날짜와 요일 구하기
        const startDay = new Date(tempCurrentYear, tempCurrentMonth, 0);
        const prevDate = startDay.getDate();
        const prevDay = startDay.getDay();

        // 이번 달의 마지막날 날짜와 요일 구하기
        const endDay = new Date(tempCurrentYear, tempCurrentMonth + 1, 0);
        const nextDate = endDay.getDate();
        const nextDay = endDay.getDay();

        // 지난달
        for (let i = prevDate - prevDay; i <= prevDate; i++) {
            last_calendar += pervDisableDay(i);
        }

        // 이번달
        for (let i = 1; i <= nextDate; i++) {
            // 이번달이 현재 년도와 월이 같을경우
            if (tempCurrentYear === today.getFullYear() && tempCurrentMonth === today.getMonth()) {
                // 지난 날짜는 disable 처리
                if (i < today.getDate()) {
                    last_calendar += pervDisableDay(i);
                } else {
                    last_calendar += dailyDay(tempCurrentYear, tempCurrentMonth, i);
                }
            } else {
                last_calendar += dailyDay(tempCurrentYear, tempCurrentMonth, i);
            }
        }

        // 다음달 7 일 표시
        for (let i = 1; i <= (6 - nextDay); i++) {
            last_calendar += nextDisableDay(i);
        }

        document.querySelector('.last-calendar').innerHTML = last_calendar;
        // 월 표기
        document.querySelector('.last-year-month').textContent = tempCurrentYear + '.' + zf((tempCurrentMonth + 1));
    }

    // 지난달 미리 보기
    function pervDisableDay(day) {
        return '<div class="day prev disable">' + day + '</div>';
    }

    // 이번달
    function dailyDay(currentYear, currentMonth, day) {
        const date = currentYear + '' + zf((currentMonth + 1)) + '' + zf(day);

        if (checkInDate === date) {
            return '<div class="day current checkIn" data-day="' + date + '" onclick="selectDay(this)"><span>' + day + '</span><p class="check_in_out_p"></p><p>' + '</div>';
        } else if (checkOutDate === date) {
            return '<div class="day current checkOut" data-day="' + date + '" onclick="selectDay(this)"><span>' + day + '</span><p class="check_in_out_p"></p><p>' + '</div>';
        } else {
            return '<div class="day current" data-day="' + date + '" onclick="selectDay(this)"><span>' + day + '</span><p class="check_in_out_p"></p><p>' + '</div>';
        }
    }

    // 다음달 미리 보기
    function nextDisableDay(day) {
        return '<div class="day next disable">' + day + '</div>';
    }

    addClassSelectDay();
}

// 체크인 체크아웃 기간 안에 날짜 선택 처리
function addClassSelectDay() {
    if (checkInDate !== "" && checkOutDate !== "") {
        document.querySelectorAll('.day').forEach(function (day) {
            const data_day = day.getAttribute('data-day');

            if (data_day !== null && data_day >= checkInDate && data_day <= checkOutDate) {
                day.classList.add('selectDay');
            }
        });

        document.querySelector('.checkIn .check_in_out_p').textContent = '체크인';
        document.querySelector('.checkOut .check_in_out_p').textContent = '체크아웃';
    }
}

// 달력 날짜 클릭
function selectDay(obj) {
    if (checkInDate === "") {
        obj.classList.add('checkIn');
        obj.querySelector('.check_in_out_p').textContent = '체크인';

        checkInDate = obj.getAttribute('data-day');

        document.querySelector('.check_in_day').innerHTML = getCheckIndateHtml();

        lastCheckInDate();
    } else {
        // 체크인 날짜를 한번더 클릭했을때 아무 동작 하지 않기
        if (parseInt(checkInDate) === parseInt(obj.getAttribute('data-day'))) {
            return;
        }

        // 체크인 날짜보다 체크아웃 날짜를 더 앞으로 찍었을경우 체크인 날짜와 체크아웃 날짜를 바꿔준다
        if (checkOutDate === "" && parseInt(checkInDate) > parseInt(obj.getAttribute('data-day'))) {
            document.querySelector('.checkIn .check_in_out_p').textContent = '';
            document.querySelectorAll('.day').forEach(day => day.classList.remove('checkIn'));
            document.querySelector('.check_in_day').innerHTML = "";

            checkOutDate = checkInDate;
            checkInDate = obj.getAttribute('data-day');

            obj.classList.add('checkIn');
            obj.querySelector('.check_in_out_p').textContent = '체크인';

            document.querySelector('.day[data-day="' + checkOutDate + '"]').classList.add('checkOut');
            document.querySelector('.checkOut .check_in_out_p').textContent = '체크아웃';

            document.querySelector('.check_in_day').innerHTML = getCheckIndateHtml();
            document.querySelector('.check_out_day').innerHTML = getCheckOutdateHtml();

            addClassSelectDay();

            return;
        }

        // 체크아웃
        if (checkOutDate === "") {
            obj.classList.add('checkOut');
            obj.querySelector('.check_in_out_p').textContent = '체크아웃';

            checkOutDate = obj.getAttribute('data-day');

            document.querySelector('.check_out_day').innerHTML = getCheckOutdateHtml();

            addClassSelectDay();
        } else {
            // 체크아웃을 날짜 까지 지정했지만 체크인 날짜를 변경할 경우
            if (confirm('체크인 날짜를 변경 하시겠습니까?')) {
                document.querySelector('.checkIn .check_in_out_p').textContent = '';
                document.querySelector('.checkOut .check_in_out_p').textContent = '';

                document.querySelectorAll('.day').forEach(day => {
                    day.classList.remove('checkIn');
                    day.classList.remove('checkOut');
                    day.classList.remove('selectDay');
                });

                obj.classList.add('checkIn');
                obj.querySelector('.check_in_out_p').textContent = '체크인';

                checkInDate = obj.getAttribute('data-day');
                checkOutDate = "";

                document.querySelectorAll('.check_in_day').innerHTML = getCheckIndateHtml();
                document.querySelector('.check_out_day').innerHTML = "";

                lastCheckInDate();
            }
        }
    }
}

// 체크인 날짜 표기
function getCheckIndateHtml() {
    checkInDate = checkInDate.toString();
    return checkInDate.substring('0', '4') + "-" + checkInDate.substring('4', '6') + "-" + checkInDate.substring('6', '8') + " ( " + strWeekDay(weekday(checkInDate)) + " )";
}

// 체크아웃 날짜 표기
function getCheckOutdateHtml() {
    checkOutDate = checkOutDate.toString();
    return checkOutDate.substring('0', '4') + "-" + checkOutDate.substring('4', '6') + "-" + checkOutDate.substring('6', '8') + " ( " + strWeekDay(weekday(checkOutDate)) + " )";
}

// 체크인 날짜 클릭시 예약 가능한 마지막 날인지 체크 마지막날 일경우 체크아웃 날짜 자동 선택
function lastCheckInDate() {
    // 날짜 비교를 위해 시간값을 초기화 하기위해 체크인 날짜 다시 셋팅
    let thisCheckDate = new Date(conversion_date(checkInDate, 1));
    thisCheckDate = new Date(thisCheckDate.getFullYear(), thisCheckDate.getMonth(), thisCheckDate.getDate());

    // 예약 가능한 마지막달의 마지막 날짜 셋팅
    let thisLastDate = new Date(today.getFullYear(), ((today.getMonth() + 1) + limitMonth), 0);

    // 체크인 날짜 클릭시 해당일이 예약 가능한 달에 마지막 날짜 일때 체크아웃 강제 표기
    if (thisCheckDate.getTime() === thisLastDate.getTime()) {
        // 체크인 날짜에 하루 더하기
        let thisCheckOutDate = new Date(thisCheckDate.getFullYear(), thisCheckDate.getMonth(), thisCheckDate.getDate());
        thisCheckOutDate.setDate(thisCheckOutDate.getDate() + 1);
        // YYYYMMDD 형태로 변환
        thisCheckOutDate = thisCheckOutDate.getFullYear() + "" + zf((thisCheckOutDate.getMonth() + 1)) + "" + zf(thisCheckOutDate.getDate());

        checkOutDate = thisCheckOutDate;

        document.querySelector(".day[data-day='" + checkOutDate + "']").classList.add('checkOut');

        if (document.querySelector('.checkOut .holi_day_p')) {
            document.querySelector('.checkOut .holi_day_p').style.display = 'none';
        }

        document.querySelector('.checkOut .check_in_out_p').textContent = '체크아웃';

        document.querySelector('.check_out_day').innerHTML = getCheckOutdateHtml();

        addClassSelectDay();
    }
}
// 체크인 날짜 표기
function getCheckIndateHtml() {
    checkInDate = checkInDate.toString();
    const formattedDate = checkInDate.substring('0', '4') + "-" + checkInDate.substring('4', '6') + "-" + checkInDate.substring('6', '8') + " ( " + strWeekDay(weekday(checkInDate)) + " )";
    // Update check_in_day_write label
    document.querySelector('.check_in_day_write').textContent = formattedDate;
    return formattedDate;
}

// 체크아웃 날짜 표기
function getCheckOutdateHtml() {
    checkOutDate = checkOutDate.toString();
    const formattedDate = checkOutDate.substring('0', '4') + "-" + checkOutDate.substring('4', '6') + "-" + checkOutDate.substring('6', '8') + " ( " + strWeekDay(weekday(checkOutDate)) + " )";
    // Update check_out_day_write label
    document.querySelector('.check_out_day_write').textContent = formattedDate;
    return formattedDate;
}

// 최대 개월수 체크
function getLimitMonthCheck(year, month) {
    let months = ((today.getFullYear() - year) * 12);
    months -= (today.getMonth() + 1);
    months += month;

    return months;
}

// 날짜형태 변환
function conversion_date(YYMMDD, choice) {
    const yyyy = YYMMDD.substring(0, 4);
    const mm = YYMMDD.substring(4, 6);
    const dd = YYMMDD.substring(6, 8);

    return (choice === 1)
        ? yyyy + "-" + zf(mm) + "-" + zf(dd)
        : yyyy + "." + zf(mm) + "." + zf(dd);
}

// 몇요일인지 알려주는 함수 (숫자 형태)
function weekday(YYYYMMDD) {
    const weekday_year = YYYYMMDD.substring(0, 4);
    const weekday_menth = YYYYMMDD.substring(4, 6);
    const weekday_day = YYYYMMDD.substring(6, 8);

    return new Date(weekday_year + "-" + weekday_menth + "-" + weekday_day).getDay();
}

// 요일 리턴
function strWeekDay(weekday) {
    switch (weekday) {
        case 0: return "일";
        case 1: return "월";
        case 2: return "화";
        case 3: return "수";
        case 4: return "목";
        case 5: return "금";
        case 6: return "토";
    }
}
// 숫자 두자리로 만들기
function zf(num) {
    num = Number(num).toString();

    if (Number(num) < 10 && num.length == 1) {
        num = "0" + num;
    }

    return num;
}
// 객실 및 인원 선택
function changeNumber(type, delta) {
    const numElement = document.getElementById(type + '-num');
    let num = parseInt(numElement.textContent);

    if (type === 'adult' && num + delta < 1) {
        num = 1;
    } else if (num + delta < 0) {
        num = 0;
    } else {
        num += delta;
    }

    numElement.textContent = num;
}

function updateDisplay() {
    const roomNum = document.getElementById('room-num').textContent;
    const adultNum = document.getElementById('adult-num').textContent;
    const childNum = document.getElementById('child-num').textContent;

    document.getElementById('room-display').textContent = `객실 ${roomNum}개`;
    document.getElementById('adult-display').textContent = `성인 ${adultNum}명`;
    document.getElementById('child-display').textContent = `아동 ${childNum}명`;
}
document.addEventListener('DOMContentLoaded', function() {
    const reserveNum = document.querySelector('.reserve-num');
    const reservePerForm = document.querySelector('.reserve-per-form');
    const confirmBtn = document.querySelector('.reserve-per-btn');

    // reserve-num 클릭 시 reserve-per-form 열기
    reserveNum.addEventListener('click', function() {
        reservePerForm.style.display = 'block';
    });

    // 확인 버튼 클릭 시 reserve-per-form 닫기
    confirmBtn.addEventListener('click', function() {
        updateDisplay();
        reservePerForm.style.display = 'none';
    });

    // 바깥 클릭 시 reserve-per-form 닫기
    window.addEventListener('click', function(event) {
        if (!reservePerForm.contains(event.target) && !reserveNum.contains(event.target)) {
            reservePerForm.style.display = 'none';
        }
    });

    // stop propagation to prevent window click event when clicking inside the form
    reservePerForm.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});