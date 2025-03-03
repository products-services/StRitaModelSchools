
// Initialize attempt counter
var attempts = localStorage.getItem("attempts") || 5;
var lockedOut = localStorage.getItem("lockedOut") === "true";
var lockOutTime = localStorage.getItem("lockOutTime");
var timerInterval;

// Define password and redirect URLs
const passwords = 
{

  "6%tzyt": "ercBas6MrOnyemaOnyenankeya.html",
};

document.getElementById("login-form").addEventListener("submit", function(event) {
  event.preventDefault();

  // Get password
  var passwordInput = document.getElementById('password').value;

  // Check credentials
  if (passwords[passwordInput]) {
    window.location.href = passwords[passwordInput];
  } else {
    attempts--;
    localStorage.setItem("attempts", attempts);

    // Display error message
    if (attempts >= 0) {
      document.getElementById("error-message").innerHTML = "Incorrect password. Attempts left: " + attempts;
    } else {
      lockedOut = true;
      lockOutTime = Date.now() + 3600000; // 1 hour
      localStorage.setItem("lockedOut", true);
      localStorage.setItem("lockOutTime", lockOutTime);
      document.getElementById("error-message").innerHTML = "Account locked. Try again in 1 hour.";
      document.getElementById("login-form").style.display = "none";
      startLockoutTimer();
    }
  }
});

// Check if account is locked
if (lockedOut && lockOutTime) {
  var currentTime = Date.now();
  if (currentTime < parseInt(lockOutTime)) {
    document.getElementById("error-message").innerHTML = "Account locked. Try again in " + Math.ceil((parseInt(lockOutTime) - currentTime) / 60000) + " minutes.";
    document.getElementById("login-form").style.display = "none";
    startLockoutTimer();
  } else {
    lockedOut = false;
    localStorage.setItem("lockedOut", false);
    attempts = 5;
    localStorage.setItem("attempts", attempts);
  }
}

function startLockoutTimer() {
  var timeLeft = parseInt(lockOutTime) - Date.now();
  var minutes = Math.floor(timeLeft / 60000);
  var seconds = Math.floor((timeLeft % 60000) / 1000);

  document.getElementById("lockout-timer").innerHTML = "Time left: " + minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);

  timerInterval = setInterval(function() {
    timeLeft = parseInt(lockOutTime) - Date.now();
    minutes = Math.floor(timeLeft / 60000);
    seconds = Math.floor((timeLeft % 60000) / 1000);

    document.getElementById("lockout-timer").innerHTML = "Time left: " + minutes + ":" + (seconds < 10 ? "0" + seconds : seconds);

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      lockedOut = false;
      localStorage.setItem("lockedOut", false);
      attempts = 5;
      localStorage.setItem("attempts", attempts);
      document.getElementById("login-form").style.display = "block";
      document.getElementById("error-message").innerHTML = "";
      document.getElementById("lockout-timer").innerHTML = "";
    }
  }, 1000);
}
