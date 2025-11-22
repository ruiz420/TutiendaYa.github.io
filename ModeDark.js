// 🌗 Script global de modo oscuro
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const btnTema = document.getElementById("btnTema");

  // Aplicar el tema guardado
  const temaGuardado = localStorage.getItem("tema");
  if (temaGuardado === "oscuro") {
    body.classList.add("dark-mode");
    if (btnTema) btnTema.textContent = "☀️";
  } else {
    if (btnTema) btnTema.textContent = "🌙";
  }

  // Cambiar de tema
  if (btnTema) {
    btnTema.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      const nuevoTema = body.classList.contains("dark-mode") ? "oscuro" : "claro";
      localStorage.setItem("tema", nuevoTema);
      btnTema.textContent = nuevoTema === "oscuro" ? "☀️" : "🌙";
    });
  }
});
