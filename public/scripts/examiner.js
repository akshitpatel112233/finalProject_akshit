document.addEventListener('DOMContentLoaded', () => {

    function loadAppointments(testType = "") {
      fetch(`/getExamData?testType=${testType}`)
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
            <p class="mb-1">Appointment Date: ${appointment.date}</p>
            <p class="mb-1">Appointment Time: ${appointment.time}</p>
            <p class="mb-1">Test Type: ${user.testType}</p>
            <form action="/getUserDetailsForExam/${user.userId}" style="box-shadow: none;" method="post">
                <button class="btn btn-primary" type="submit">Details</button>
            </form>
          </div>`;
      }).join("");
      document.getElementById("appointments").innerHTML = appointmentsHTML;
    }
  
    const filter = document.getElementById("filter");
    filter.addEventListener("change", function () {
      loadAppointments(this.value);
    });
  
    loadAppointments();
  });
  