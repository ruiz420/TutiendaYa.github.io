document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioActual"));
  const campos = {
    nombre: document.getElementById("nombre"),
    correo: document.getElementById("correo"),
    telefono: document.getElementById("telefono"),
    direccion: document.getElementById("direccion"),
    descripcion: document.getElementById("descripcion"),
    tema: document.getElementById("tema"),
    fechaRegistro: document.getElementById("fechaRegistro"),
    foto: document.getElementById("fotoPerfil"),
  };

  if (usuario) {
    campos.nombre.value = usuario.nombre || "";
    campos.correo.value = usuario.correo || "";
    campos.telefono.value = usuario.telefono || "";
    campos.direccion.value = usuario.direccion || "";
    campos.descripcion.value = usuario.descripcion || "";
    campos.tema.value = usuario.tema || "claro";
    campos.fechaRegistro.value = usuario.fechaRegistro || "01/01/2025";
    campos.foto.src = usuario.foto || "/TUtiendaya/Imagenes/cajero.jpg";
  }

  const btnEditar = document.getElementById("btnEditar");
  const btnGuardar = document.getElementById("btnGuardar");

  btnEditar.addEventListener("click", () => {
    Object.values(campos).forEach(campo => {
      if (campo.tagName !== "IMG" && campo.id !== "correo" && campo.id !== "fechaRegistro") {
        campo.removeAttribute("readonly");
        campo.removeAttribute("disabled");
      }
    });

    btnGuardar.disabled = false;
    btnEditar.disabled = true; // Deshabilitar el botón de editar
  });

  btnGuardar.addEventListener("click", () => {
    const datosActualizados = {
      ...usuario,
      nombre: campos.nombre.value,
      telefono: campos.telefono.value,
      direccion: campos.direccion.value,
      descripcion: campos.descripcion.value,
      tema: campos.tema.value
    };

    localStorage.setItem("usuarioActual", JSON.stringify(datosActualizados));
    alert("✅ Perfil actualizado correctamente.");
    Object.values(campos).forEach(campo => {
      if (campo.tagName !== "IMG") {
        campo.setAttribute("readonly", true);
        campo.setAttribute("disabled", true);
      }
    });

    // Deshabilitar el botón de guardar y habilitar el botón de editar
    btnGuardar.disabled = true;
    btnEditar.disabled = false;
  });
});
