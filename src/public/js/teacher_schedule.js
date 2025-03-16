document.addEventListener("DOMContentLoaded", function () {
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
            emptyCell.classList.add("btn", "btn-light", "disabled", "m-1", "p-3", "text-center");
            calendarDays.appendChild(emptyCell);
        }

        for (let day = 1; day <= lastDate; day++) {
            let dayCell = document.createElement("div");
            dayCell.classList.add("btn", "btn-light", "m-1", "p-3", "text-center");
            dayCell.innerText = day;

            dayCell.addEventListener("click", function () {
                document.querySelectorAll(".btn-light").forEach(d => d.classList.remove("active", "btn-warning"));
                dayCell.classList.add("active", "btn-warning");
                selectedDateText.innerText = `Lịch ngày ${day}/${month + 1}/${year}`;
                showEvents(day, month + 1, year);
            });

            calendarDays.appendChild(dayCell);
        }
    }

    async function showEvents(day, month, year) {
        eventsList.innerHTML = "";

        try {
            let loadingItem = document.createElement("li");
            loadingItem.classList.add("list-group-item", "mb-2");
            loadingItem.innerText = "Đang tải lịch dạy...";
            eventsList.appendChild(loadingItem);

            const response = await fetch(`/teacher/schedule-data?day=${day}&month=${month}&year=${year}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const events = await response.json();

            eventsList.innerHTML = "";

            if (events && events.length > 0) {
                events.forEach(event => {
                    let li = document.createElement("li");
                    li.classList.add("list-group-item", "mb-2");

                    let eventDetails = `
                        <strong>${event.tenTinChi}</strong><br>
                        Thời gian: Tiết ${event.tietBD}-${event.tietKT}<br>
                        Địa điểm: ${event.phong}<br>
                        <strong></strong><br>
                    `;

                    if (event.students && event.students.length > 0) {
                        event.students.forEach(student => {
                            eventDetails += ` - ${student.tenSV} (${student.maSV})<br>`;
                        });
                    } else {
                        eventDetails += "";
                    }

                    li.innerHTML = eventDetails;
                    eventsList.appendChild(li);
                });
            } else {
                let li = document.createElement("li");
                li.classList.add("list-group-item", "text-muted");
                li.innerText = "Không có lịch dạy vào ngày này";
                eventsList.appendChild(li);
            }
        } catch (error) {
            console.error('Lỗi khi tải lịch dạy:', error);
            let errorItem = document.createElement("li");
            errorItem.classList.add("list-group-item", "text-danger", "mb-2");
            errorItem.innerText = "Có lỗi xảy ra khi tải lịch dạy. Vui lòng thử lại sau.";
            eventsList.appendChild(errorItem);
        }
    }

    prevMonthBtn.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener("click", function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    renderCalendar();

    // Tự động chọn ngày hôm nay khi tải trang
    setTimeout(() => {
        const todayCells = document.querySelectorAll('.day');
        const today = new Date();
        const todayDay = today.getDate();
        const todayMonth = today.getMonth();
        const todayYear = today.getFullYear();

        if (currentDate.getMonth() === todayMonth && currentDate.getFullYear() === todayYear) {
            const todayCell = Array.from(todayCells).find(cell => parseInt(cell.innerText) === todayDay);
            if (todayCell) {
                todayCell.click();
            }
        }
    }, 100);
});