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

  const slotTimeSelect = document.getElementById("slot_time");

  slotTimeSelect.innerHTML = "";

  const newOptions = APPOINTMENT_SLOTS.map((slot) => {
    const isAvailable = !!data.slots.find(
      (bookedSlot) => bookedSlot.time === slot.time
    );

    const opt = document.createElement("option");
    opt.value = slot.time;
    opt.innerHTML = slot.time;
    opt.disabled = isAvailable;
    return opt;
  });

  const selectTimeOption = document.createElement("option");
  selectTimeOption.innerHTML = "Select a time slot";
  selectTimeOption.disabled = true;
  selectTimeOption.selected = true;

  newOptions.unshift(selectTimeOption);

  slotTimeSelect.replaceChildren(...newOptions);
};

document.addEventListener("DOMContentLoaded", function () {
  const slotDateInput = document.getElementById("slot_date");
  

  slotDateInput.addEventListener("change", handleDateChange);

  function loadAppointments(testType = "") {
    fetch(`/getUserExamResults`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => updateAppointments(data))
      .catch(error => console.error("Error fetching appointments:", error));
  }

  function updateAppointments(appointments) {
    const appointmentsHTML = appointments.map(user => {
      const appointment = user.appointmentDetails;
      return `
        <div class="custom card">
          <p class="mb-1">First Name: ${user.firstName}</p>
          <p class="mb-1">Test Type: ${user.testType}</p>
          <p class="mb-1">Test Result: ${user.testResult}</p>
        </div>`;
    }).join("");
    document.getElementById("appointments").innerHTML = appointmentsHTML;
  }



  loadAppointments();

});
