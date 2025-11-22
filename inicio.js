
window.addEventListener("DOMContentLoaded", () => {
  const sesion = JSON.parse(localStorage.getItem("sesion"));
  const userInfo = document.getElementById("usuarioActual");

  if (sesion && sesion.usuario && sesion.expira > Date.now()) {
    if (userInfo) {
      userInfo.textContent = `👤 Usuario: ${sesion.usuario}`;
    }
  } else {
    if (!window.location.href.includes("index.html")) {
      localStorage.removeItem("sesion"); 
      window.location.href = "index.html";
    }
  }
});


const cerrarBtn = document.getElementById("cerrarSesion");
if (cerrarBtn) {
  cerrarBtn.addEventListener("click", function(e) {
    e.preventDefault(); 
    localStorage.removeItem("sesion"); 
    window.location.href = "index.html"; 
  });
}


document.querySelectorAll(".opcion").forEach(boton => {
  boton.addEventListener("click", () => {
    alert(`🔧 Función "${boton.textContent.trim()}" en desarrollo`);
  });
});

document.querySelectorAll('.submenu-toggle').forEach(toggle => {
  toggle.addEventListener('click', function(e) {
    e.preventDefault();
    const submenu = this.nextElementSibling;
    submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
  });
});


window.onload = () => {
    let sesion = JSON.parse(localStorage.getItem("sesion"));
    if (!sesion || sesion.expira < Date.now()) {
        // redirige al login
        window.location.href = "index.html";
    }
};


