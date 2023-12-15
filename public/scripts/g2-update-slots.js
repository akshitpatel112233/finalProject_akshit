const APPOINTMENT_SLOTS = [
  { time: "9:00" },
  { time: "10:30" },
  { time: "10:00" },
  { time: "11:30" },
  { time: "12:00" },
  { time: "12:30" },
  { time: "1:00" },
  { time: "1:30" },
  { time: "2:00" },
];

const handleDateChange = async (event) => {
  const slotsRes = await fetch(`/get-slots-by-date?date=${event.target.value}`);
  const data = await slotsRes.json();

  const slotTimeSelect = document.getElementById("appointment_id");

  slotTimeSelect.innerHTML = "";

  let newOptions;

  if (data && data.slots && data.slots.length > 0) {
    newOptions = data.slots.map((slot) => {
      const opt = document.createElement("option");
      opt.value = slot._id;
      opt.innerHTML = slot.time;
      opt.disabled = !slot.isAvailable;
      return opt;
    });

    const selectTimeOption = document.createElement("option");
    selectTimeOption.innerHTML = "Select a time slot";
    selectTimeOption.disabled = true;
    selectTimeOption.selected = true;

    newOptions.unshift(selectTimeOption);
  } else {
    const nothingOption = document.createElement("option");
    nothingOption.innerHTML = "No slots available on this date.";
    nothingOption.disabled = true;
    nothingOption.selected = true;
    newOptions = [nothingOption];
  }

  slotTimeSelect.replaceChildren(...newOptions);
};

document.addEventListener("DOMContentLoaded", function () {
  const slotDateInput = document.getElementById("slot_date");
  const loadAppointments = () => {
    fetch('/getExamResultForUser')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => updateAppointments(data))
      .catch(error => console.error('Error fetching appointments:', error));
  };

  const updateAppointments = (appointments) => {
    const appointmentsHTML = appointments.map(user => `
      <div class="custom card">
        <p class="mb-1">First Name: ${user.firstName}</p>
        <p class="mb-1">Test Type: ${user.testType}</p>
        <p class="mb-1">Test Result: ${user.testResult}</p>
      </div>
    `).join('');
    document.getElementById('appointments').innerHTML = appointmentsHTML;
  };

  loadAppointments();

  slotDateInput.addEventListener("change", handleDateChange);
});
