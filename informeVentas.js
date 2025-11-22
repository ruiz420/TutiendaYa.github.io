
let informes = [];
let filtroActivo = 'todos';


window.onload = function() {
    cargarInformes();
    mostrarInformes();
    calcularEstadisticas();
};


function cargarInformes() {
    const datos = localStorage.getItem('informesVentas');
    informes = datos ? JSON.parse(datos) : [];
    console.log('Informes cargados:', informes.length); 
}


function mostrarInformes() {
    const tabla = document.getElementById('tablaInformes');
    if (!tabla) return;
    
    tabla.innerHTML = '';
    
    const informesFiltrados = obtenerInformesFiltrados();
    
    if (informesFiltrados.length === 0) {
        tabla.innerHTML = '<tr><td colspan="8">No hay informes para mostrar</td></tr>';
        return;
    }
    
    informesFiltrados.slice().reverse().forEach(informe => {
        const tr = document.createElement('tr');
        
        let claseDiferencia = '';
        if (informe.diferencia === 0) {
            claseDiferencia = 'correcto';
        } else if (informe.diferencia < 0) {
            claseDiferencia = 'faltante';
        } else {
            claseDiferencia = 'sobrante';
        }
        
        tr.innerHTML = `
            <td>${informe.fecha}</td>
            <td>${informe.hora}</td>
            <td>$${formatear(informe.fondoInicial)}</td>
            <td>$${formatear(informe.totalVentas)}</td>
            <td>${informe.cantidadVentas}</td>
            <td>$${formatear(informe.efectivoContado)}</td>
            <td class="${claseDiferencia}">$${formatear(informe.diferencia)}</td>
            <td>
                <button onclick="verDetalle(${informe.id})">Ver Detalle</button>
            </td>
        `;
        tabla.appendChild(tr);
    });
}

function calcularEstadisticas() {
    const informesFiltrados = obtenerInformesFiltrados();
    
    if (informesFiltrados.length === 0) {
        document.getElementById('totalVentas').textContent = '0';
        document.getElementById('totalIngresos').textContent = '$0';
        document.getElementById('promedioDiario').textContent = '$0';
        document.getElementById('cantidadCierres').textContent = '0';
        document.getElementById('ventaMaxima').textContent = '$0';
        document.getElementById('ventaMinima').textContent = '$0';
        document.getElementById('totalDiferencias').textContent = '$0';
        document.getElementById('cierresCuadrados').textContent = '0';
        return;
    }
    
    let totalVentas = 0;
    let totalIngresos = 0;
    let totalDiferencias = 0;
    let cierresCuadrados = 0;
    let ventas = [];
    
    informesFiltrados.forEach(informe => {
        totalVentas += informe.cantidadVentas;
        totalIngresos += informe.totalVentas;
        totalDiferencias += Math.abs(informe.diferencia);
        ventas.push(informe.totalVentas);
        
        if (informe.diferencia === 0) {
            cierresCuadrados++;
        }
    });
    
    const promedio = totalIngresos / informesFiltrados.length;
    const ventaMax = Math.max(...ventas);
    const ventaMin = Math.min(...ventas);
    const porcentajeCuadrados = ((cierresCuadrados / informesFiltrados.length) * 100).toFixed(1);
    
    document.getElementById('totalVentas').textContent = totalVentas;
    document.getElementById('totalIngresos').textContent = '$' + formatear(totalIngresos);
    document.getElementById('promedioDiario').textContent = '$' + formatear(promedio);
    document.getElementById('cantidadCierres').textContent = informesFiltrados.length;
    
    dibujarGrafico(informesFiltrados);
}

// ============================================
// DIBUJAR GRÁFICO
// ============================================

function dibujarGrafico(informesFiltrados) {
    const contenedor = document.getElementById('grafico');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    
    if (informesFiltrados.length === 0) return;
    
    const ultimos = informesFiltrados.slice(-10);
    const maxVenta = Math.max(...ultimos.map(i => i.totalVentas));
    
    ultimos.forEach(informe => {
        const porcentaje = (informe.totalVentas / maxVenta * 100);
        
        const barra = document.createElement('div');
        barra.className = 'barra';
        
        const contenido = document.createElement('div');
        contenido.className = 'barra-valor';
        contenido.style.height = porcentaje + '%';
        contenido.title = '$' + formatear(informe.totalVentas);
        
        const etiqueta = document.createElement('div');
        etiqueta.className = 'barra-etiqueta';
        const partes = informe.fecha.split('/');
        etiqueta.textContent = partes[1] + '/' + partes[0];
        
        barra.appendChild(contenido);
        barra.appendChild(etiqueta);
        contenedor.appendChild(barra);
    });
}


function verDetalle(id) {
    const informe = informes.find(i => i.id === id);
    if (!informe) return;
    
    let detalle = '=== DETALLE DEL CIERRE ===\n\n';
    detalle += `Fecha: ${informe.fecha} ${informe.hora}\n\n`;
    detalle += `Fondo Inicial: $${formatear(informe.fondoInicial)}\n`;
    detalle += `Total Ventas: $${formatear(informe.totalVentas)}\n`;
    detalle += `Efectivo Esperado: $${formatear(informe.efectivoEsperado)}\n`;
    detalle += `Efectivo Contado: $${formatear(informe.efectivoContado)}\n`;
    detalle += `Diferencia: $${formatear(informe.diferencia)}\n\n`;
    
    detalle += `=== VENTAS DEL DÍA (${informe.cantidadVentas}) ===\n\n`;
    
    informe.ventasDetalle.forEach(venta => {
        detalle += `Venta #${venta.numeroVenta} - ${venta.tipo} - ${venta.hora}\n`;
        
        venta.productos.forEach(p => {
            detalle += `  - ${p.nombre} x${p.cantidad} = $${formatear(p.subtotal)}\n`;
        });
        
        detalle += `  Total: $${formatear(venta.total)}\n\n`;
    });
    
    alert(detalle);
}


function cambiarFiltro() {
    const tipo = document.getElementById('tipoFiltro').value;
    filtroActivo = tipo;
    
    document.getElementById('filtrosDia').style.display = 'none';
    document.getElementById('filtrosMes').style.display = 'none';
    document.getElementById('filtrosAnio').style.display = 'none';
    document.getElementById('filtrosRango').style.display = 'none';
    
    if (tipo === 'dia') {
        document.getElementById('filtrosDia').style.display = 'block';
    } else if (tipo === 'mes') {
        document.getElementById('filtrosMes').style.display = 'block';
    } else if (tipo === 'anio') {
        document.getElementById('filtrosAnio').style.display = 'block';
    } else if (tipo === 'rango') {
        document.getElementById('filtrosRango').style.display = 'block';
    }
}

function aplicarFiltro() {
    mostrarInformes();
    calcularEstadisticas();
}

function limpiarFiltro() {
    document.getElementById('tipoFiltro').value = 'todos';
    filtroActivo = 'todos';
    cambiarFiltro();
    aplicarFiltro();
}

function obtenerInformesFiltrados() {
    if (filtroActivo === 'todos') {
        return informes;
    }
    
    let resultado = [];
    
    if (filtroActivo === 'dia') {
        const fecha = document.getElementById('fechaDia').value;
        if (!fecha) return informes;
        
        const fechaSeleccionada = convertirFecha(fecha);
        
        resultado = informes.filter(i => i.fecha === fechaSeleccionada);
    } else if (filtroActivo === 'mes') {
        const mes = document.getElementById('mes').value;
        const anio = document.getElementById('anioMes').value;
        
        resultado = informes.filter(i => {
            const partes = i.fecha.split('/');
            return partes[0] === mes && partes[2] === anio;
        });
    } else if (filtroActivo === 'anio') {
        const anio = document.getElementById('anio').value;
        
        resultado = informes.filter(i => {
            const partes = i.fecha.split('/');
            return partes[2] === anio;
        });
    } else if (filtroActivo === 'rango') {
        const inicio = document.getElementById('fechaInicio').value;
        const fin = document.getElementById('fechaFin').value;
        
        if (!inicio || !fin) return informes;
        
        const fechaInicio = new Date(inicio);
        const fechaFin = new Date(fin);
        
        resultado = informes.filter(i => {
            const partes = i.fecha.split('/');
            const fechaInforme = new Date(partes[2], partes[0] - 1, partes[1]);
            return fechaInforme >= fechaInicio && fechaInforme <= fechaFin;
        });
    }
    
    return resultado;
}

function convertirFecha(fechaInput) {
    const fecha = new Date(fechaInput + 'T00:00:00');
    const mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
    const dia = ('0' + fecha.getDate()).slice(-2);
    const anio = fecha.getFullYear();
    return mes + '/' + dia + '/' + anio;
}

function formatear(numero) {
    return Math.round(numero).toLocaleString('es-CO');
}
