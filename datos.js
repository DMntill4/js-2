// ============================================================
//  datos.js
//  Guarda la información de los alumnos.
//  - nombres: arreglo de 10 posiciones para los nombres
//  - notas:   matriz de 10 filas x 3 columnas para las notas
// ============================================================

// Arreglo unidimensional para los nombres (máximo 10 alumnos)
var nombres = [];

// Matriz para las notas: cada posición guarda un arreglo [c1, c2, c3]
var notas = [];

// Límite máximo de alumnos
var MAX_ALUMNOS = 10;


// ── Función: agregar un alumno ─────────────────────────────
// Recibe el nombre y las 3 notas, los guarda en los arreglos.
function guardarAlumno(nombre, c1, c2, c3) {
  nombres.push(nombre);
  notas.push([c1, c2, c3]);
}


// ── Función: vaciar todos los datos ───────────────────────
// Reinicia los arreglos a su estado original (vacío).
function vaciarDatos() {
  nombres = [];
  notas   = [];
}


// ── Función: saber cuántos alumnos hay ────────────────────
function totalAlumnos() {
  return nombres.length;
}


// ── Función: saber si el curso ya está lleno ──────────────
function cursoLleno() {
  return nombres.length >= MAX_ALUMNOS;
}


// ── Función: verificar si un nombre ya fue ingresado ──────
// Recorre el arreglo con un for y compara en minúsculas.
function nombreYaExiste(nombre) {
  for (var i = 0; i < nombres.length; i++) {
    if (nombres[i].toLowerCase() === nombre.toLowerCase()) {
      return true;
    }
  }
  return false;
}