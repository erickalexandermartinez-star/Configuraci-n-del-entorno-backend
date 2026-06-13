const express = require('express');
const app = express();
const PORT = 3000;

// Middleware para permitir que el servidor entienda formato JSON en las peticiones POST y PUT
app.use(express.json());

// Datos quemados iniciales (Array de estudiantes)
let estudiantes = [
    { id: 1, nombre: "Ana García", edad: 20, carrera: "Ingeniería" },
    { id: 2, nombre: "Luis Martínez", edad: 22, carrera: "Medicina" },
    { id: 3, nombre: "Sofía López", edad: 21, carrera: "Derecho" }
];

// 1. GET - Obtener todos los estudiantes
app.get('/estudiantes', (req, res) => {
    res.status(200).json(estudiantes);
});

// 2. GET por ID - Obtener un estudiante específico
app.get('/estudiantes/:id', (req, res) => {
    const idBuscar = parseInt(req.params.id);
    const estudiante = estudiantes.find(e => e.id === idBuscar);

    if (!estudiante) {
        return res.status(404).json({ mensaje: "Estudiante no encontrado" });
    }

    res.status(200).json(estudiante);
});

// 3. POST - Agregar un nuevo estudiante
app.post('/estudiantes', (req, res) => {
    const { nombre, edad, carrera } = req.body;

    // Validación básica de campos obligatorios
    if (!nombre || !edad || !carrera) {
        return res.status(400).json({ mensaje: "Todos los campos (nombre, edad, carrera) son obligatorios" });
    }

    // Autoincrementar el ID basándonos en el último elemento
    const nuevoId = estudiantes.length > 0 ? estudiantes[estudiantes.length - 1].id + 1 : 1;

    const nuevoEstudiante = {
        id: nuevoId,
        nombre,
        edad: parseInt(edad),
        carrera
    };

    estudiantes.push(nuevoEstudiante);
    res.status(201).json({ mensaje: "Estudiante agregado con éxito", estudiante: nuevoEstudiante });
});

// 4. PUT - Actualizar un estudiante existente
app.put('/estudiantes/:id', (req, res) => {
    const idActualizar = parseInt(req.params.id);
    const { nombre, edad, carrera } = req.body;

    const estudianteIndex = estudiantes.findIndex(e => e.id === idActualizar);

    if (estudianteIndex === -1) {
        return res.status(404).json({ mensaje: "Estudiante no encontrado" });
    }

    // Actualizar solo los campos que vengan en la petición (o mantener los anteriores)
    estudiantes[estudianteIndex] = {
        ...estudiantes[estudianteIndex],
        nombre: nombre || estudiantes[estudianteIndex].nombre,
        edad: edad ? parseInt(edad) : estudiantes[estudianteIndex].edad,
        carrera: carrera || estudiantes[estudianteIndex].carrera
    };

    res.status(200).json({ mensaje: "Estudiante actualizado con éxito", estudiante: estudiantes[estudianteIndex] });
});

// 5. DELETE - Eliminar un estudiante
app.delete('/estudiantes/:id', (req, res) => {
    const idEliminar = parseInt(req.params.id);
    const estudianteIndex = estudiantes.findIndex(e => e.id === idEliminar);

    if (estudianteIndex === -1) {
        return res.status(404).json({ mensaje: "Estudiante no encontrado" });
    }

    // Eliminar del array
    const estudianteEliminado = estudiantes.splice(estudianteIndex, 1);

    res.status(200).json({ mensaje: "Estudiante eliminado con éxito", estudiante: estudianteEliminado[0] });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor de estudiantes corriendo en http://localhost:${PORT}`);
}); 
