document.addEventListener("DOMContentLoaded", function() {
    const calendarDays = document.getElementById("calendarDays");
    const currentMonthYear = document.getElementById("currentMonthYear");
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");
    const selectedDateText = document.getElementById("selectedDate");
    const eventsList = document.getElementById("eventsList");

    let currentDate = new Date();

    function renderCalendar() {
        calendarDays.innerHTML = "";
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth();

        currentMonthYear.innerText = `Tháng ${month + 1} - ${year}`;

        let firstDay = new Date(year, month, 1).getDay();
        let lastDate = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            let emptyCell = document.createElement("div");
            emptyCell.classList.add("day");
            calendarDays.appendChild(emptyCell);
        }

        for (let day = 1; day <= lastDate; day++) {
            let dayCell = document.createElement("div");
            dayCell.classList.add("day");
            dayCell.innerText = day;

            dayCell.addEventListener("click", function() {
                document.querySelectorAll(".day").forEach(d => d.classList.remove("active"));
                dayCell.classList.add("active");
                selectedDateText.innerText = `Lịch ngày ${day}/${month + 1}/${year}`;
                
                showEvents(day, month + 1, year);
            });

            calendarDays.appendChild(dayCell);
        }
    }

    function showEvents(day, month, year) {
        eventsList.innerHTML = "";

        let sampleEvents = {
            "5-3-2025": ["Thiết kế Web - 9:30-12:10"],
            "6-3-2025": ["Phân tích & Thiết kế PM - 13:00-15:40"],
            "7-3-2025": ["Chương trình dịch - 13:00-15:40"]
        };

        let key = `${day}-${month}-${year}`;
        if (sampleEvents[key]) {
            sampleEvents[key].forEach(event => {
                let li = document.createElement("li");
                li.innerText = event;
                eventsList.appendChild(li);
            });
        } else {
            eventsList.innerHTML = "<li>Không có lịch học</li>";
        }
    }

    prevMonthBtn.addEventListener("click", function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener("click", function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();
});
