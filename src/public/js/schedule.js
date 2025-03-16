document.addEventListener("DOMContentLoaded", function () {
    const calendarDays = document.getElementById("calendarDays");
    const currentMonthYear = document.getElementById("currentMonthYear");
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");
    const selectedDateText = document.getElementById("selectedDate");
    const eventsList = document.getElementById("eventsList");

    let currentDate = new Date();
    const today = new Date();

    function renderCalendar() {
        calendarDays.innerHTML = "";
        let year = currentDate.getFullYear();
        let month = currentDate.getMonth();

        currentMonthYear.innerText = `Tháng ${month + 1} - ${year}`;

        // Thêm các header ngày trong tuần
        const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
        weekdays.forEach(day => {
            let dayHeader = document.createElement("div");
            dayHeader.classList.add("weekday-header");
            dayHeader.innerText = day;
            calendarDays.appendChild(dayHeader);
        });

        let firstDay = new Date(year, month, 1).getDay();
        let lastDate = new Date(year, month + 1, 0).getDate();

        // Tạo ô trống trước ngày đầu tháng
        for (let i = 0; i < firstDay; i++) {
            let emptyCell = document.createElement("div");
            emptyCell.classList.add("day", "empty-day");
            calendarDays.appendChild(emptyCell);
        }

        // Tạo các ngày trong tháng
        for (let day = 1; day <= lastDate; day++) {
            let dayCell = document.createElement("div");
            dayCell.classList.add("day");
            dayCell.innerText = day;

            // Đánh dấu ngày hiện tại
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayCell.classList.add("today");
            }

            dayCell.addEventListener("click", function () {
                document.querySelectorAll(".day").forEach(d => d.classList.remove("active"));
                dayCell.classList.add("active");

                // Định dạng ngày tháng đẹp hơn
                const formattedDay = String(day).padStart(2, '0');
                const formattedMonth = String(month + 1).padStart(2, '0');
                selectedDateText.innerText = `Lịch ngày ${formattedDay}/${formattedMonth}/${year}`;

                showEvents(day, month + 1, year);
            });

            calendarDays.appendChild(dayCell);
        }
    }

    async function showEvents(day, month, year) {
        eventsList.innerHTML = "";
    
        try {
            let loadingItem = document.createElement("li");
            loadingItem.innerText = "Đang tải lịch học...";
            eventsList.appendChild(loadingItem);
    
            const response = await fetch(`/student/schedule-data?day=${day}&month=${month}&year=${year}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
    
            eventsList.innerHTML = "";
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const events = await response.json();
    
            if (events && events.length > 0) {
                events.forEach(event => {
                    let li = document.createElement("li");
                    li.innerHTML = `
                        <strong>${event.tenTinChi}</strong><br>
                        Thời gian: Tiết ${event.tietBD}-${event.tietKT}<br>
                        Địa điểm: ${event.phong}<br>
                        Giảng viên: ${event.tenGV || 'Chưa phân công'}
                    `;
                    eventsList.appendChild(li);
                });
            } else {
                let li = document.createElement("li");
                li.classList.add("no-events");
                li.innerText = "Không có lịch học vào ngày này";
                eventsList.appendChild(li);
            }
        } catch (error) {
            console.error('Lỗi khi tải lịch học:', error);
            let errorItem = document.createElement("li");
            errorItem.classList.add("no-events");
            errorItem.innerText = "Có lỗi xảy ra khi tải lịch học. Vui lòng thử lại sau.";
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

    // Khởi tạo lịch khi trang được tải
    renderCalendar();

    // Tự động chọn ngày hôm nay
    setTimeout(() => {
        const todayCells = document.querySelectorAll('.day.today');
        if (todayCells.length > 0) {
            todayCells[0].click();
        }
    }, 100);
});