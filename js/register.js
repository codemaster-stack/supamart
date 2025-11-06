document.addEventListener('DOMContentLoaded', () => {
  const phoneInput = document.querySelector("#phone");
  const iti = window.intlTelInput(phoneInput, {
    initialCountry: "auto",
    geoIpLookup: function(callback) {
      fetch('https://ipinfo.io/json?token=<YOUR_TOKEN>')
        .then(res => res.json())
        .then(data => callback(data.country))
        .catch(() => callback('us'));
    },
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.19/js/utils.js"
  });

  document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const fullPhone = iti.getNumber();

    const userData = { fullname, email, password, phone: fullPhone };
    console.log('Signup data:', userData);

    // TODO: Connect to backend API
  });
});
