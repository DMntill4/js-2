// ============================================================
//  calculos.js
//  Todas las operaciones matemáticas y de validación.
//  Usa bucles for simples para que sea fácil de leer.
// ============================================================

// Nota mínima para aprobar
var NOTA_APROBACION = 55;


// ── Función: validar una nota ──────────────────────────────
// Devuelve un mensaje de error, o "" si la nota es válida.
function validarNota(valor, nombreCertamen) {
  // Verificar que no esté vacío
    if (valor === "" || valor === null) {
        return nombreCertamen + ": no puede estar vacío.";
    }

    var numero = parseFloat(valor);

    // Verificar que sea un número
    if (isNaN(numero)) {
        return nombreCertamen + ": debe ser un número.";
    }

    // Verificar que esté en el rango correcto
    if (numero < 0 || numero > 100) {
        return nombreCertamen + ": debe estar entre 0 y 100.";
    }

    return ""; // Sin error
}


// ── Función: validar el nombre ─────────────────────────────
// Devuelve un mensaje de error, o "" si el nombre es válido.
function validarNombre(nombre) {
    if (nombre === "" || nombre === null) {
        return "El nombre no puede estar vacío.";
    }
    if (nombre.trim().length < 2) {
        return "El nombre debe tener al menos 2 caracteres.";
    }
    return ""; // Sin error
}


// ── Función: calcular promedio de un alumno ────────────────
// Recibe el índice del alumno y suma sus 3 notas con un for.
function calcularPromedioAlumno(indice) {
    var suma = 0;

    for (var i = 0; i < 3; i++) {
        suma = suma + notas[indice][i];
    }

    return suma / 3;
}


// ── Función: calcular promedio de un certamen ──────────────
// Recibe qué certamen (0, 1 o 2) y promedia todos los alumnos.
function calcularPromedioCertamen(indiceCertamen) {
    var suma = 0;
    var total = totalAlumnos();

    for (var i = 0; i < total; i++) {
        suma = suma + notas[i][indiceCertamen];
    }

    return suma / total;
}


// ── Función: calcular promedio general del curso ───────────
// Promedia todos los promedios individuales.
function calcularPromedioGeneral() {
    var suma = 0;
    var total = totalAlumnos();

    for (var i = 0; i < total; i++) {
        suma = suma + calcularPromedioAlumno(i);
    }

    return suma / total;
}


// ── Función: contar alumnos aprobados ─────────────────────
function contarAprobados() {
    var aprobados = 0;

    for (var i = 0; i < totalAlumnos(); i++) {
        if (calcularPromedioAlumno(i) >= NOTA_APROBACION) {
        aprobados = aprobados + 1;
        }
    }

    return aprobados;
}


// ── Función: contar alumnos reprobados ────────────────────
function contarReprobados() {
    var reprobados = 0;

    for (var i = 0; i < totalAlumnos(); i++) {
        if (calcularPromedioAlumno(i) < NOTA_APROBACION) {
        reprobados = reprobados + 1;
        }
    }

    return reprobados;
}


// ── Función: construir arreglo de alumnos con promedios ────
// Devuelve un arreglo de objetos con nombre y promedio.
// Luego lo ordena de mayor a menor promedio (bubble sort).
function obtenerRanking() {
  // 1. Crear un arreglo con la info de cada alumno
    var lista = [];

    for (var i = 0; i < totalAlumnos(); i++) {
        lista.push({
        nombre:   nombres[i],
        c1:       notas[i][0],
        c2:       notas[i][1],
        c3:       notas[i][2],
        promedio: calcularPromedioAlumno(i)
        });
    }

    // 2. Ordenar de mayor a menor con Bubble Sort
    for (var i = 0; i < lista.length - 1; i++) {
        for (var j = 0; j < lista.length - 1 - i; j++) {
        if (lista[j].promedio < lista[j + 1].promedio) {
            // Intercambiar los dos elementos
            var temporal  = lista[j];
            lista[j]      = lista[j + 1];
            lista[j + 1]  = temporal;
        }
        }
    }

    return lista;
}


// ── Función: formatear número a 2 decimales ────────────────
function formatear(numero) {
    return numero.toFixed(2);
}


// ── Función: obtener etiqueta según la nota ────────────────
function etiquetaNivel(promedio) {
    if (promedio >= 90) return { texto: "Sobresaliente", clase: "nivel-s"  };
    if (promedio >= 70) return { texto: "Bueno",         clase: "nivel-b"  };
    if (promedio >= 55) return { texto: "Suficiente",    clase: "nivel-sf" };
    return                     { texto: "Insuficiente",  clase: "nivel-i"  };
}