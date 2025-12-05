const form = document.querySelector(".form-login form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  })
    .then((r) => {
      if (r.ok === true) {
        return r.json();
      } else {
        const messageError = document.getElementById("error-message");
        messageError.innerText = "Erreur dans l’identifiant ou le mot de passe";
        messageError.style.color = "red";
      }
    })
    .then((data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user-id", data.userId);
      window.location.href = "index.html";
    });
});
