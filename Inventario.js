
function guardarEnLocalStorage() {
    localStorage.setItem("productos", JSON.stringify(productos));
}

function cargarDesdeLocalStorage() {
    const data = localStorage.getItem("productos");
    return data ? JSON.parse(data) : null;
}

let productos = cargarDesdeLocalStorage() || [
    {
        nombre: 'Arroz',
        categoria: 'Granos',
        codigo: '12345',
        precioCompra: 1000,
        margen: 10,
        precioVenta: 1100,
        cantidad: 100
    },
    {
        nombre: 'Leche',
        categoria: 'Lácteos',
        codigo: '67890',
        precioCompra: 2000,
        margen: 20,
        precioVenta: 2400,
        cantidad: 3    // Para probar bajo stock
    }
];


function renderTabla(listaProductos, tablaId) {
    const tabla = document.getElementById(tablaId)?.getElementsByTagName('tbody')[0];
    if (!tabla) return;
    tabla.innerHTML = '';

    listaProductos.forEach(producto => {
        const fila = tabla.insertRow();

        fila.insertCell(0).textContent = producto.nombre;
        fila.insertCell(1).textContent = producto.categoria;
        fila.insertCell(2).textContent = producto.codigo;
        fila.insertCell(3).textContent = `$${producto.precioCompra.toLocaleString('es-CO')}`;
        fila.insertCell(4).textContent = `${producto.margen}%`;
        fila.insertCell(5).textContent = `$${producto.precioVenta.toLocaleString('es-CO')}`;
        fila.insertCell(6).textContent = producto.cantidad;

        const acciones = fila.insertCell(7);
        acciones.innerHTML = `
            <button onclick="editarProducto(this)">Editar</button>
            <button onclick="eliminarProducto(this)">Eliminar</button>
        `;
    });
}


function renderBajoStock() {
    const tabla = document.querySelector("#tabla-bajos tbody");
    if (!tabla) return;
    tabla.innerHTML = "";

    const bajos = productos.filter(p => p.cantidad < 5);

    bajos.forEach(p => {
        let fila = tabla.insertRow();
        fila.insertCell(0).textContent = p.nombre;
        fila.insertCell(1).textContent = p.cantidad;
        fila.insertCell(2).textContent = p.categoria;
    });
}


document.getElementById('form-producto').addEventListener('submit', function(e) {
    e.preventDefault();

    const codigo = document.getElementById('codigo').value;

    if (productos.some(p => p.codigo === codigo)) {
        alert("⚠ Ya existe un producto con ese código");
        return;
    }

    const nuevo = {
        nombre: document.getElementById('nombre').value,
        categoria: document.getElementById('categoria').value,
        codigo: codigo,
        precioCompra: parseFloat(document.getElementById('precio-compra').value),
        margen: parseFloat(document.getElementById('margen').value),
        precioVenta: parseFloat(document.getElementById('precio-venta').value),
        cantidad: parseInt(document.getElementById('cantidad').value)
    };

    productos.push(nuevo);
    guardarEnLocalStorage();

    renderTabla(productos, 'tabla-inventario');
    renderBajoStock();
    actualizarDashboard();

    this.reset();
    
});

function editarProducto(button) {
    const fila = button.parentElement.parentElement;
    const celdas = fila.cells;

    document.getElementById('nombre').value = celdas[0].textContent;
    document.getElementById('categoria').value = celdas[1].textContent;
    document.getElementById('codigo').value = celdas[2].textContent;
    document.getElementById('precio-compra').value = parseFloat(celdas[3].textContent.replace(/[^0-9.-]+/g,""));
    document.getElementById('margen').value = parseFloat(celdas[4].textContent);
    document.getElementById('precio-venta').value = parseFloat(celdas[5].textContent.replace(/[^0-9.-]+/g,""));
    document.getElementById('cantidad').value = celdas[6].textContent;

    eliminarPorCodigo(celdas[2].textContent);
}

function eliminarProducto(button) {
    const fila = button.parentElement.parentElement;
    const codigo = fila.cells[2].textContent;

    eliminarPorCodigo(codigo);
    fila.remove();

    actualizarDashboard();
    renderBajoStock();
}

function eliminarPorCodigo(codigo) {
    productos = productos.filter(p => p.codigo !== codigo);
    guardarEnLocalStorage();
}


const precioCompraInput = document.getElementById("precio-compra");
const margenInput = document.getElementById("margen");
const precioVentaInput = document.getElementById("precio-venta");

function calcularPrecioVenta() {
    const compra = parseFloat(precioCompraInput.value);
    const margen = parseFloat(margenInput.value);

    if (!isNaN(compra) && !isNaN(margen)) {
        const venta = compra + (compra * margen / 100);
        precioVentaInput.value = venta.toFixed(0);
    }
}

function calcularMargen() {
    const compra = parseFloat(precioCompraInput.value);
    const venta = parseFloat(precioVentaInput.value);

    if (!isNaN(compra) && !isNaN(venta) && compra > 0) {
        const margen = ((venta - compra) / compra) * 100;
        margenInput.value = margen.toFixed(2);
    }
}

precioCompraInput.addEventListener("input", () => {
    if (margenInput.value !== "") calcularPrecioVenta();
});
margenInput.addEventListener("input", calcularPrecioVenta);
precioVentaInput.addEventListener("input", calcularMargen);



// Buscar 



document.getElementById('buscarProducto').addEventListener('input', function() {
    const termino = this.value.toLowerCase();
    const filtrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(termino) ||
        p.categoria.toLowerCase().includes(termino) ||
        p.codigo.includes(termino)
    );
    renderTabla(filtrados, 'tabla-inventario');
});


// 📊 Dashboard 
function actualizarDashboard() {
    const totalProductos = productos.length;
    const bajoStock = productos.filter(p => p.cantidad <= 5).length;


    document.getElementById("valor-total-productos").textContent = totalProductos;
    document.getElementById("valor-bajo-stock").textContent = bajoStock;

    const cardBajoStock = document.getElementById("card-bajo-stock");

    if (bajoStock > 0) {
        cardBajoStock.classList.add("card-alerta");
    } else {
        cardBajoStock.classList.remove("card-alerta");
    }
}


// Inicializar
window.addEventListener('DOMContentLoaded', () => {
    renderTabla(productos, 'tabla-inventario');
    renderBajoStock();
    actualizarDashboard();
});
