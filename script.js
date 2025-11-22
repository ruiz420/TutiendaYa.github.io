// ELEMENTOS
const container = document.getElementById('container');
const loginButton = document.getElementById('login');
const registerButton = document.getElementById('register');
const signUpForm = document.getElementById('signUpForm');
const signInForm = document.querySelector('.sign-in form');



registerButton.addEventListener('click', () => {
    container.classList.add('active'); 
});

loginButton.addEventListener('click', () => {
    container.classList.remove('active'); 
});

// RUTAs
function irA(pagina) {
    const rutas = {
        inicio: "Inicio.html",  
        login: "index.html" ,        
    };

    if (rutas[pagina]) {
        window.open(rutas[pagina], "_self");
    } else {
        console.error("❌ Ruta no encontrada para:", pagina);
    }
}

// REGISTRO
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = signUpForm.querySelector('input[placeholder="Nombre"]').value.trim();
    const email = signUpForm.querySelector('input[placeholder="Email"]').value.trim();
    const password = signUpForm.querySelector('input[placeholder="Contraseña"]').value.trim();

    if (!name || !email || !password) {
        alert("Completa todos los campos");
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.some(user => user.email === email)) {
        alert("El usuario ya existe");
        return;
    }

    // Guarda el usuario
    users.push({ name, email, password: password.trim() });
    localStorage.setItem('users', JSON.stringify(users));

    alert("Usuario registrado correctamente");

    signUpForm.reset();
    container.classList.remove('active');
});



function mostrarLogin() {
    container.classList.remove('active');
}

// LOGIN
document.getElementById("signInForm").addEventListener("submit", (e) => {
    e.preventDefault();

    let usuario = document.getElementById("usuario").value.trim();
    let password = document.getElementById("password").value.trim();
    let usuarios = JSON.parse(localStorage.getItem("users")) || [];
    let user = usuarios.find(u => u.email === usuario && u.password === password);

if (user) {
  alert("✅ Bienvenido " + user.name);

  localStorage.setItem("sesion", JSON.stringify({
    usuario: user.email,
    expira: Date.now() + 24 * 60 * 60 * 1000
  }));

  localStorage.setItem("usuarioActual", JSON.stringify({
    nombre: user.name,
    correo: user.email,
    foto: user.foto || "/TUtiendaya/Imagenes/cajero.jpg"
  }));

  irA("inicio");
}
else {  alert("❌ Usuario o contraseña incorrectos");
}   
});