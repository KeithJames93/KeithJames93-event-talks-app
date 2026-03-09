document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule');
    const searchInput = document.getElementById('searchInput');
    let talksData = [];

    fetch('/api/talks')
        .then(response => response.json())
        .then(data => {
            talksData = data.talks;
            renderSchedule(talksData);
        });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTalks = talksData.filter(talk =>
            talk.category.some(cat => cat.toLowerCase().includes(searchTerm))
        );
        renderSchedule(filteredTalks);
    });

    function renderSchedule(talks) {
        scheduleContainer.innerHTML = '';
        let currentTime = new Date();
        currentTime.setHours(10, 0, 0, 0);

        talks.forEach((talk, index) => {
            if (index === 3) {
                // Lunch break after the 3rd talk
                const lunchBreak = document.createElement('div');
                lunchBreak.classList.add('schedule-item', 'break');
                const lunchTime = formatTime(currentTime);
                lunchBreak.innerHTML = `<p class="time">${lunchTime} - ${addMinutes(currentTime, 60)}</p><p>Lunch Break</p>`;
                scheduleContainer.appendChild(lunchBreak);
                currentTime.setMinutes(currentTime.getMinutes() + 60);
            }

            const talkElement = document.createElement('div');
            talkElement.classList.add('schedule-item');

            const startTime = formatTime(currentTime);
            const endTime = addMinutes(currentTime, talk.duration);

            talkElement.innerHTML = `
                <p class="time">${startTime} - ${endTime}</p>
                <h2>${talk.title}</h2>
                <p class="speakers">By: ${talk.speakers.join(', ')}</p>
                <p>${talk.description}</p>
                <div class="categories">
                    ${talk.category.map(cat => `<span class="category">${cat}</span>`).join('')}
                </div>
            `;
            scheduleContainer.appendChild(talkElement);

            currentTime.setMinutes(currentTime.getMinutes() + talk.duration + 10); // Add 10-minute break
        });
    }

    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function addMinutes(date, minutes) {
        const newDate = new Date(date);
        newDate.setMinutes(date.getMinutes() + minutes);
        return formatTime(newDate);
    }
});
