document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    // Add delete button listeners
document.querySelectorAll(".delete-btn").forEach((btn) => {
  btn.addEventListener("click", async (event) => {
    const activity = event.target.dataset.activity;
    const email = event.target.dataset.email;

    await fetch(`/activities/${activity}/unregister?email=${encodeURIComponent(email)}`, {
      method: "POST",
    });

    fetchActivities(); // refresh UI without reloading page
  });
});
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - (details.participants || []).length;

      activityCard.innerHTML = `
  <h4>${name}</h4>
  <p>${details.description}</p>
  <p><strong>Schedule:</strong> ${details.schedule}</p>
  <p><strong>Availability:</strong> ${spotsLeft} spots left</p>

  <h4>Participants</h4>
<ul class="participants-list">
 ${(details.participants || []).map(p => `
  <li class="participant-item">
    <span>${p}</span>
    <button class="delete-btn" data-activity="${name}" data-email="${p}">🗑️</button>
  </li>
`).join("")}
</ul>
        `;

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

  if (response.ok) {
  messageDiv.textContent = result.message;
  messageDiv.className = "success";
  signupForm.reset();

  await fetchActivities(); // <-- ESTA LINEA ES LA CLAVE
} else {
  messageDiv.textContent = result.detail || "An error occurred";
  messageDiv.className = "error";
}

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
document.addEventListener("click", async (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const activity = event.target.dataset.activity.trim();
const email = event.target.dataset.email.trim();


    try {
    const response = await fetch(
  `/activities/${encodeURIComponent(activity)}/unregister?email=${encodeURIComponent(email)}`,
  { method: "POST" }
);

      if (!response.ok) {
        const err = await response.json();
        alert(err.detail || "Error unregistering participant");
        return;
      }

      // refresh activities after delete
      fetchActivities();
    } catch (error) {
      console.error("Error unregistering:", error);
    }
  }
});

