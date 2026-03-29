// ============================================================
//  app.js
//  Controla la interfaz: lee el formulario, muestra resultados.
//  Cada función hace UNA sola cosa para que sea fácil de leer.
// ============================================================


// ══════════════════════════════════════════════════════════
//  INICIO: cuando la página carga
// ══════════════════════════════════════════════════════════

window.onload = function () {
  crearPuntosProgreso();
  actualizarContador();
};


// ══════════════════════════════════════════════════════════
//  AGREGAR ALUMNO
//  Esta función se llama cuando se hace clic en el botón.
// ══════════════════════════════════════════════════════════

function agregarAlumno() {
  // 1. Leer los valores del formulario
  var nombre = document.getElementById("inputNombre").value.trim();
  var valC1  = document.getElementById("inputC1").value;
  var valC2  = document.getElementById("inputC2").value;
  var valC3  = document.getElementById("inputC3").value;

  // 2. Validar nombre
  var errorNombre = validarNombre(nombre);
  if (errorNombre !== "") {
    mostrarMensaje(errorNombre, "error");
    return;
  }

  // 3. Verificar que el nombre no esté repetido
  if (nombreYaExiste(nombre)) {
    mostrarMensaje('"' + nombre + '" ya fue ingresado. Usa un nombre diferente.', "advertencia");
    return;
  }

  // 4. Validar las notas
  var errorC1 = validarNota(valC1, "Certamen 1");
  if (errorC1 !== "") { mostrarMensaje(errorC1, "error"); return; }

  var errorC2 = validarNota(valC2, "Certamen 2");
  if (errorC2 !== "") { mostrarMensaje(errorC2, "error"); return; }

  var errorC3 = validarNota(valC3, "Certamen 3");
  if (errorC3 !== "") { mostrarMensaje(errorC3, "error"); return; }

  // 5. Verificar que el curso no esté lleno
  if (cursoLleno()) {
    mostrarMensaje("El curso ya tiene 10 alumnos.", "advertencia");
    return;
  }

  // 6. Guardar el alumno en los arreglos (datos.js)
  guardarAlumno(nombre, parseFloat(valC1), parseFloat(valC2), parseFloat(valC3));

  // 7. Actualizar todo lo visible en la página
  mostrarMensaje("✓ " + nombre + " fue agregado correctamente.", "exito");
  limpiarFormulario();
  actualizarContador();
  actualizarBarraProgreso();
  actualizarMiniLista();
  mostrarResultados();

  // 8. Bloquear el botón si el curso está lleno
  if (cursoLleno()) {
    var btn = document.getElementById("btnAgregar");
    btn.disabled = true;
    btn.textContent = "✓ Curso completo";
    document.getElementById("etiquetaForm").textContent = "Completo";
    document.getElementById("etiquetaForm").classList.add("completo");
  }
}


// ══════════════════════════════════════════════════════════
//  REINICIAR CURSO
// ══════════════════════════════════════════════════════════

function reiniciarCurso() {
  if (totalAlumnos() === 0) {
    mostrarMensaje("No hay alumnos que eliminar.", "advertencia");
    return;
  }

  var confirmar = confirm("¿Seguro que deseas reiniciar el curso? Se borrarán todos los datos.");
  if (!confirmar) return;

  // Vaciar datos (datos.js)
  vaciarDatos();

  // Resetear la interfaz
  limpiarFormulario();
  ocultarMensaje();
  actualizarContador();
  actualizarBarraProgreso();
  actualizarMiniLista();
  ocultarResultados();

  // Restaurar botón de agregar
  var btn = document.getElementById("btnAgregar");
  btn.disabled = false;
  btn.textContent = "+ Agregar Alumno";

  // Restaurar etiquetas
  var etiquetaForm = document.getElementById("etiquetaForm");
  etiquetaForm.textContent = "Registro";
  etiquetaForm.classList.remove("completo");

  var etiquetaResultados = document.getElementById("etiquetaResultados");
  etiquetaResultados.textContent = "En espera";
  etiquetaResultados.classList.remove("activo");
  etiquetaResultados.classList.add("espera");

  mostrarMensaje("Curso reiniciado correctamente.", "exito");
}


// ══════════════════════════════════════════════════════════
//  MOSTRAR RESULTADOS
//  Llama a cada función de renderizado por separado.
// ══════════════════════════════════════════════════════════

function mostrarResultados() {
  if (totalAlumnos() === 0) return;

  // Mostrar el contenedor de resultados
  document.getElementById("resultadosVacio").classList.add("oculto");
  document.getElementById("resultadosContenido").classList.remove("oculto");

  // Actualizar etiqueta del panel de resultados
  var etiqueta = document.getElementById("etiquetaResultados");
  etiqueta.textContent = "Activo";
  etiqueta.classList.remove("espera");
  etiqueta.classList.add("activo");

  // Llamar a cada sección por separado
  renderizarEstadisticas();
  renderizarCertamenes();
  renderizarTabla();
  renderizarRanking();
}

function ocultarResultados() {
  document.getElementById("resultadosVacio").classList.remove("oculto");
  document.getElementById("resultadosContenido").classList.add("oculto");
}


// ══════════════════════════════════════════════════════════
//  RENDERIZAR: Tarjetas de estadísticas generales
// ══════════════════════════════════════════════════════════

function renderizarEstadisticas() {
  var total       = totalAlumnos();
  var aprobados   = contarAprobados();
  var reprobados  = contarReprobados();
  var promGeneral = calcularPromedioGeneral();
  var porcentaje  = Math.round((aprobados / total) * 100);

  var contenedor = document.getElementById("estadisticasGrid");

  contenedor.innerHTML =
    '<div class="stat-card stat-total">'   +
      '<span class="stat-num">' + total + '</span>' +
      '<span class="stat-label">Alumnos</span>' +
    '</div>' +
    '<div class="stat-card stat-prom">'    +
      '<span class="stat-num">' + formatear(promGeneral) + '</span>' +
      '<span class="stat-label">Promedio General</span>' +
    '</div>' +
    '<div class="stat-card stat-aprobados">' +
      '<span class="stat-num">' + aprobados + '</span>' +
      '<span class="stat-label">Aprobados</span>' +
    '</div>' +
    '<div class="stat-card stat-reprobados">' +
      '<span class="stat-num">' + reprobados + '</span>' +
      '<span class="stat-label">Reprobados</span>' +
    '</div>' +
    '<div class="stat-card stat-pct">'     +
      '<span class="stat-num">' + porcentaje + '%</span>' +
      '<span class="stat-label">Tasa Aprobación</span>' +
    '</div>';
}


// ══════════════════════════════════════════════════════════
//  RENDERIZAR: Promedios por certamen
// ══════════════════════════════════════════════════════════

function renderizarCertamenes() {
  var promC1 = calcularPromedioCertamen(0);
  var promC2 = calcularPromedioCertamen(1);
  var promC3 = calcularPromedioCertamen(2);

  var contenedor = document.getElementById("certamenesCards");

  contenedor.innerHTML =
    crearTarjetaCertamen("Certamen 1", promC1) +
    crearTarjetaCertamen("Certamen 2", promC2) +
    crearTarjetaCertamen("Certamen 3", promC3);
}

// Función auxiliar para crear el HTML de una tarjeta de certamen
function crearTarjetaCertamen(titulo, promedio) {
  // La barra de color cambia según si el promedio es aprobatorio o no
  var claseColor = promedio >= 55 ? "barra-bien" : "barra-mal";

  return (
    '<div class="cert-card">' +
      '<span class="cert-titulo">' + titulo + '</span>' +
      '<span class="cert-valor">' + formatear(promedio) + '</span>' +
      '<div class="cert-barra-fondo">' +
        '<div class="cert-barra ' + claseColor + '" style="width:' + promedio + '%"></div>' +
      '</div>' +
    '</div>'
  );
}


// ══════════════════════════════════════════════════════════
//  RENDERIZAR: Tabla de alumnos
// ══════════════════════════════════════════════════════════

function renderizarTabla() {
  var cuerpoTabla = document.getElementById("tablaBody");
  cuerpoTabla.innerHTML = ""; // Limpiar tabla antes de llenarla

  // Recorrer todos los alumnos con un for
  for (var i = 0; i < totalAlumnos(); i++) {
    var promedio  = calcularPromedioAlumno(i);
    var aprobado  = promedio >= NOTA_APROBACION;
    var fila      = document.createElement("tr");

    // Clase de color según si aprobó o no
    fila.className = aprobado ? "fila-aprobado" : "fila-reprobado";

    // Construir el contenido de la fila
    fila.innerHTML =
      '<td class="td-num">'    + (i + 1) + '</td>' +
      '<td class="td-nombre">' + nombres[i] + '</td>' +
      '<td>' + formatear(notas[i][0]) + '</td>' +
      '<td>' + formatear(notas[i][1]) + '</td>' +
      '<td>' + formatear(notas[i][2]) + '</td>' +
      '<td class="td-prom"><strong>' + formatear(promedio) + '</strong></td>' +
      '<td><span class="badge ' + (aprobado ? "badge-ap" : "badge-rep") + '">' +
        (aprobado ? "Aprobado" : "Reprobado") +
      '</span></td>';

    cuerpoTabla.appendChild(fila);
  }
}


// ══════════════════════════════════════════════════════════
//  RENDERIZAR: Ranking ordenado
// ══════════════════════════════════════════════════════════

function renderizarRanking() {
  var contenedor = document.getElementById("listaRanking");
  contenedor.innerHTML = "";

  // obtenerRanking() viene de calculos.js y ya devuelve el arreglo ordenado
  var ranking = obtenerRanking();
  var medallas = ["🥇", "🥈", "🥉"];

  for (var i = 0; i < ranking.length; i++) {
    var alumno  = ranking[i];
    var nivel   = etiquetaNivel(alumno.promedio);
    var aprobado = alumno.promedio >= NOTA_APROBACION;

    // Usar medalla para los 3 primeros, número para el resto
    var puesto = i < 3 ? medallas[i] : (i + 1);

    var div = document.createElement("div");
    div.className = "ranking-item" + (aprobado ? "" : " ranking-rep");

    div.innerHTML =
      '<span class="rank-puesto">'  + puesto + '</span>' +
      '<span class="rank-nombre">'  + alumno.nombre + '</span>' +
      '<span class="rank-prom '     + nivel.clase + '">' + formatear(alumno.promedio) + '</span>' +
      '<span class="rank-nivel '    + nivel.clase + '">' + nivel.texto + '</span>';

    contenedor.appendChild(div);
  }
}


// ══════════════════════════════════════════════════════════
//  BARRA DE PROGRESO y PUNTOS
// ══════════════════════════════════════════════════════════

// Crea los 10 puntos de progreso al cargar la página
function crearPuntosProgreso() {
  var contenedor = document.getElementById("puntosProgreso");
  contenedor.innerHTML = "";

  for (var i = 0; i < 10; i++) {
    var punto = document.createElement("div");
    punto.className = "punto";
    punto.id = "punto-" + i;
    contenedor.appendChild(punto);
  }
}

// Actualiza la barra y los puntos según cuántos alumnos hay
function actualizarBarraProgreso() {
  var total = totalAlumnos();
  var porcentaje = (total / 10) * 100;

  // Ancho de la barra
  document.getElementById("barraRelleno").style.width = porcentaje + "%";

  // Activar puntos uno a uno
  for (var i = 0; i < 10; i++) {
    var punto = document.getElementById("punto-" + i);
    if (i < total) {
      punto.classList.add("punto-activo");
    } else {
      punto.classList.remove("punto-activo");
    }
  }
}


// ══════════════════════════════════════════════════════════
//  MINI LISTA (panel izquierdo)
// ══════════════════════════════════════════════════════════

function actualizarMiniLista() {
  var lista = document.getElementById("miniListaItems");
  lista.innerHTML = "";

  if (totalAlumnos() === 0) {
    document.getElementById("miniLista").classList.add("oculto");
    return;
  }

  document.getElementById("miniLista").classList.remove("oculto");

  // Mostrar cada nombre con un for
  for (var i = 0; i < totalAlumnos(); i++) {
    var elemento = document.createElement("li");
    elemento.innerHTML = '<span class="mini-num">' + (i + 1) + '</span> ' + nombres[i];
    lista.appendChild(elemento);
  }
}


// ══════════════════════════════════════════════════════════
//  CONTADOR DEL ENCABEZADO
// ══════════════════════════════════════════════════════════

function actualizarContador() {
  document.getElementById("contadorAlumnos").textContent = totalAlumnos();
}


// ══════════════════════════════════════════════════════════
//  FORMULARIO: limpiar campos
// ══════════════════════════════════════════════════════════

function limpiarFormulario() {
  document.getElementById("inputNombre").value = "";
  document.getElementById("inputC1").value = "";
  document.getElementById("inputC2").value = "";
  document.getElementById("inputC3").value = "";
  document.getElementById("inputNombre").focus();
}


// ══════════════════════════════════════════════════════════
//  MENSAJES DE ALERTA
// ══════════════════════════════════════════════════════════

function mostrarMensaje(texto, tipo) {
  var caja = document.getElementById("cajaMensaje");
  caja.textContent = texto;
  caja.className = "mensaje mensaje-" + tipo;  // mensaje-exito / mensaje-error / mensaje-advertencia
  caja.classList.remove("oculto");

  // Ocultar el mensaje de éxito automáticamente después de 3 segundos
  if (tipo === "exito") {
    setTimeout(ocultarMensaje, 3000);
  }
}

function ocultarMensaje() {
  document.getElementById("cajaMensaje").classList.add("oculto");
}