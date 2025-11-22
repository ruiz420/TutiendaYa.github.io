
let carrito = [];
let productos = [];
let ventas = [];
let numeroVenta = 1;


function guardarDatos(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function cargarDatos(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// CARGAR DATOS AL INICIAR
document.addEventListener('DOMContentLoaded', () => {
    carrito = cargarDatos('carrito');
    productos = cargarDatos('productosInventario');
    ventas = cargarDatos('historialVentas');
    
    if (ventas.length > 0) {
        numeroVenta = Math.max(...ventas.map(v => v.numeroVenta || 0)) + 1;
    }
    
    mostrarProductos();
    mostrarCarrito();
    mostrarHistorial();
    actualizarCierreCaja();
});

function mostrarProductos() {
    const contenedor = document.getElementById('lista-productos');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    
    if (productos.length === 0) {
        contenedor.innerHTML = '<p>No hay productos disponibles</p>';
        return;
    }
    
    productos.forEach(p => {
        const div = document.createElement('div');
        div.className = 'producto-card';
        div.innerHTML = `
            <h4>${p.nombre}</h4>
            <p>Precio: $${p.precioVenta.toLocaleString()}</p>
            <p>Stock: ${p.cantidad}</p>
        `;
        div.onclick = () => agregarAlCarrito(p.nombre, p.precioVenta);
        contenedor.appendChild(div);
    });
}

// BUSCAR PRODUCTOS

const inputBuscar = document.getElementById('buscarProducto');
if (inputBuscar) {
    inputBuscar.addEventListener('input', (e) => {
        const busqueda = e.target.value.toLowerCase();
        const filtrados = productos.filter(p => 
            p.nombre.toLowerCase().includes(busqueda)
        );
        mostrarProductosFiltrados(filtrados);
    });
}

function mostrarProductosFiltrados(lista) {
    const contenedor = document.getElementById('lista-productos');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    
    lista.forEach(p => {
        const div = document.createElement('div');
        div.className = 'producto-card';
        div.innerHTML = `
            <h4>${p.nombre}</h4>
            <p>Precio: $${p.precioVenta.toLocaleString()}</p>
        `;
        div.onclick = () => agregarAlCarrito(p.nombre, p.precioVenta);
        contenedor.appendChild(div);
    });
}

// CARRITO DE COMPRAS

function agregarAlCarrito(nombre, precio) {
    const existe = carrito.find(item => item.nombre === nombre);
    
    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }
    
    guardarDatos('carrito', carrito);
    mostrarCarrito();
}

function cambiarCantidad(nombre, cambio) {
    const item = carrito.find(p => p.nombre === nombre);
    if (!item) return;
    
    item.cantidad += cambio;
    
    if (item.cantidad <= 0) {
        carrito = carrito.filter(p => p.nombre !== nombre);
    }
    
    guardarDatos('carrito', carrito);
    mostrarCarrito();
}

function mostrarCarrito() {
    const tabla = document.getElementById('tablaCarrito');
    const totalElement = document.getElementById('totalCarrito');
    
    if (!tabla) return;
    
    tabla.innerHTML = '';
    let total = 0;
    
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.nombre}</td>
            <td>$${item.precio.toLocaleString()}</td>
            <td>
                <button onclick="cambiarCantidad('${item.nombre}', -1)">-</button>
                ${item.cantidad}
                <button onclick="cambiarCantidad('${item.nombre}', 1)">+</button>
            </td>
            <td>$${subtotal.toLocaleString()}</td>
        `;
        tabla.appendChild(tr);
    });
    
    if (totalElement) {
        totalElement.textContent = `Total: $${total.toLocaleString()}`;
    }
}

// FINALIZAR VENTA

const btnFinalizar = document.getElementById('finalizarVenta');
if (btnFinalizar) {
    btnFinalizar.addEventListener('click', finalizarVenta);
}

function finalizarVenta() {
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    const fecha = new Date();
    const venta = {
        id: Date.now(),
        numeroVenta: numeroVenta++,
        fecha: fecha.toLocaleDateString('es-CO'),
        hora: fecha.toLocaleTimeString('es-CO'),
        productos: [...carrito],
        total: carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
    };
    
    ventas.push(venta);
    guardarDatos('historialVentas', ventas);
    
    carrito = [];
    guardarDatos('carrito', carrito);
    
    alert(`✅ Venta #${venta.numeroVenta} registrada`);
    
    mostrarCarrito();
    mostrarHistorial();
    actualizarCierreCaja();
}


// VENTA RÁPIDA

const btnRapida = document.getElementById('btnRegistrarRapida');
if (btnRapida) {
    btnRapida.addEventListener('click', registrarVentaRapida);
}

function registrarVentaRapida() {
    const producto = document.getElementById('productoVenta').value;
    const precio = parseFloat(document.getElementById('precioVenta').value);
    const cantidad = parseInt(document.getElementById('productoCantidad').value);
    
    if (!producto || !precio || !cantidad) {
        alert('Completa todos los campos');
        return;
    }
    
    const fecha = new Date();
    const venta = {
        id: Date.now(),
        numeroVenta: numeroVenta++,
        fecha: fecha.toLocaleDateString('es-CO'),
        hora: fecha.toLocaleTimeString('es-CO'),
        productos: [{ nombre: producto, precio, cantidad, subtotal: precio * cantidad }],
        total: precio * cantidad
    };
    
    ventas.push(venta);
    guardarDatos('historialVentas', ventas);
    
    alert(`✅ Venta #${venta.numeroVenta} registrada`);
    
    document.getElementById('productoVenta').value = '';
    document.getElementById('precioVenta').value = '';
    document.getElementById('productoCantidad').value = '';
    
    mostrarHistorial();
}


// HISTORIAL DE VENTAS
function mostrarHistorial() {
    const tabla = document.getElementById('tablaHistorial');
    if (!tabla) return;
    
    tabla.innerHTML = '';
    
    ventas.slice().reverse().forEach(venta => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${venta.fecha} ${venta.hora}</td>
            <td>Venta #${venta.numeroVenta}</td>
            <td><button onclick="verDetalle(${venta.id})">Ver Detalle</button></td>
        `;
        tabla.appendChild(tr);
    });
}

function verDetalle(ventaId) {
    const venta = ventas.find(v => v.id === ventaId);
    if (!venta) return;
    
    let detalle = `Venta #${venta.numeroVenta}\n`;
    detalle += `Fecha: ${venta.fecha} ${venta.hora}\n\n`;
    detalle += `Productos:\n`;
    
    venta.productos.forEach(p => {
        detalle += `- ${p.nombre} x${p.cantidad} = $${(p.precio * p.cantidad).toLocaleString()}\n`;
    });
    
    detalle += `\nTotal: $${venta.total.toLocaleString()}`;
    
    alert(detalle);
}

// CIERRE DE CAJA

const inputFondo = document.getElementById('fondoInicial');
const inputContado = document.getElementById('efectivoContado');
const btnCerrar = document.getElementById('cerrarCajaBtn');

if (inputFondo) {
    inputFondo.addEventListener('input', actualizarCierreCaja);
}

if (inputContado) {
    inputContado.addEventListener('input', actualizarCierreCaja);
}

if (btnCerrar) {
    btnCerrar.addEventListener('click', cerrarCaja);
}

function actualizarCierreCaja() {
    const fondo = parseFloat(document.getElementById('fondoInicial')?.value) || 0;
    const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0);
    const esperado = fondo + totalVentas;
    const contado = parseFloat(document.getElementById('efectivoContado')?.value) || 0;
    const diferencia = contado - esperado;
    
    const elemVentas = document.getElementById('ventasEfectivoEsperadas');
    const elemEsperado = document.getElementById('efectivoTotalEsperado');
    const elemDiferencia = document.getElementById('diferenciaCaja');
    const elemMensaje = document.getElementById('mensajeCierre');
    
    if (elemVentas) elemVentas.textContent = `$${totalVentas.toLocaleString()}`;
    if (elemEsperado) elemEsperado.textContent = `$${esperado.toLocaleString()}`;
    if (elemDiferencia) elemDiferencia.textContent = `$${diferencia.toLocaleString()}`;
    
    if (elemMensaje) {
        if (diferencia === 0) {
            elemMensaje.textContent = '✅ La caja cuadra perfectamente';
        } else if (diferencia < 0) {
            elemMensaje.textContent = `⚠️ Faltante: $${Math.abs(diferencia).toLocaleString()}`;
        } else {
            elemMensaje.textContent = `⚠️ Sobrante: $${diferencia.toLocaleString()}`;
        }
    }
}

function cerrarCaja() {
    console.log('Informe guardado:', informe);
    const confirmar = confirm('¿Confirmar cierre de caja? Esto reiniciará el historial.');
    if (!confirmar) return;
    
    const informe = {
        id: Date.now(),
        fecha: new Date().toLocaleDateString('es-CO'),
        ventas: ventas.length,
        total: ventas.reduce((sum, v) => sum + v.total, 0)
    };
    
    let informes = cargarDatos('informesCierre');
    informes.push(informe);
    guardarDatos('informesCierre', informes);
    
    ventas = [];
    numeroVenta = 1;
    guardarDatos('historialVentas', ventas);
    
    document.getElementById('efectivoContado').value = '';
    
    alert('✅ Caja cerrada correctamente');
    
    mostrarHistorial();
    actualizarCierreCaja();
}

    // Crear informe completo para la sección de informes
    const informe = {
        id: Date.now(),
        fecha: fecha.toLocaleDateString('es-CO'),
        hora: fecha.toLocaleTimeString('es-CO'),
        fondoInicial: fondo,
        totalVentas: totalVentas,
        efectivoEsperado: esperado,
        efectivoContado: contado,
        diferencia: diferencia,
        cantidadVentas: ventas.length,
        ventasDetalle: [...ventas]
    };
    
    // Guardar en informes de ventas
    let informes = cargarDatos('informesVentas');
    informes.push(informe);
    guardarDatos('informesVentas', informes);
    
    // Reiniciar historial de ventas
    ventas = [];
    numeroVenta = 1;
    guardarDatos('historialVentas', ventas);
    
    // Limpiar campos
    document.getElementById('efectivoContado').value = '';
    
    alert('✅ Caja cerrada correctamente. Informe guardado.');
    
    mostrarHistorial();
    actualizarCierreCaja();
