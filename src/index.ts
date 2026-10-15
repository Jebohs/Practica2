import express from "express";
import { platform } from "node:os";

const app = express();
app.use(express.json());

let libros = [ //Initial data set to implement API on
  { id: 1, titulo: "Clean Code", autor: "Robert C. Martin", año: 2008, disponible: true },
  { id: 2, titulo: "El Quijote", autor: "Miguel de Cervantes", año: 1605, disponible: true },
  { id: 3, titulo: "Sapiens", autor: "Yuval Noah Harari", año: 2011, disponible: false }
];
 
let prestamos = [
  { id: 1, libroId: 3, usuario: "Ana", fechaPrestamo: "2026-10-01", fechaDevolucion: null }
];

app.get("/libros", (req, res) => {  //Lista todos los libros
  res.json(libros);
});

app.get("/libros/:id", (req, res) => {  //Lista un libro por ID
  const id = Number(req.params.id); //pasamos a number
  const libroBuscado = libros.find((x) => x.id === id);
  
  if (!libroBuscado) {
    res.status(404).json({ message: `No se ha podido encontrar el libro con ID ${id} en nuestra base de datos`});
    return;
  }

  res.json(libroBuscado);
});

app.post("/libros", (req, res) => { 
  if (!req.body){
    res.status(400).json({ message: "Esto es un post creation endpoint, necesitas mandra un body" });
    return //terminamos proceso si no hay body
  }
  if (!req.body.titulo || !req.body.autor || !req.body.año) { //se podian hacer 3 ifs
    res.status(400).json({ message: "Falta campo(s): titulo, autor, año" });
    return //terminamos proceso si faltan campos
  }

  if (libros.find((x) => x.titulo === req.body.titulo && x.autor === req.body.autor)) {
    res.status(409).json({ message: "El libro ya existe en la base de datos" });
    return;
  }

  const nuevoLibro = {
    id: libros.length + 1, //server incrementa el ID 
    titulo: req.body.titulo,
    autor: req.body.autor,
    año: req.body.año,
    disponible: true
  };

  libros.push(nuevoLibro);
  res.status(201).json(nuevoLibro);
});

app.put("/libros/:id", (req, res) => { //Actualiza un libro por ID
  const id = Number(req.params.id);
  if(!req.body){
    res.status(400).json({ message: "Esto es un put update endpoint, necesitas mandra un body" });
    return //terminamos proceso si no hay body
  }

  if(!req.body.titulo || !req.body.autor || !req.body.año || req.body.disponible === undefined) { //se podian hacer 3 ifs
    res.status(400).json({ 
      message: "Falta un campo(s): titulo, autor, año, disponible" });
    return //terminamos proceso si faltan campos
  }

  const cambioLibro = {
    id: id,
    titulo: req.body.titulo,
    autor: req.body.autor,
    año: req.body.año,
    disponible: req.body.disponible
  };

  libros = libros.map((libro) => (libro.id === id ? cambioLibro : libro));

  res.json({
    message: `El libro con ID ${id} ha sido actualizado`
  });
});

app.patch("/libros/:id", (req, res) => { //Actualiza parcialmente un libro por ID
  const id = Number(req.params.id);
  if(!req.body){
    res.status(400).json({ message: "Esto es un patch update endpoint, necesitas mandra un body" });
    return //terminamos proceso si no hay body
  }
  //todo change so it can work if 1 singlular value is passed
  if(!req.body.titulo || !req.body.autor || !req.body.año ||req.body.disponible === undefined){
    res.status(400).json({
      message: "No hay valores para actualizar"
    });
    return;
  }

  const libroAActualizar = libros.find((libro) => libro.id === id);
  if (!libroAActualizar) {
    res.status(404).json({ message: `No se ha podido encontrar el libro con ID ${id} en nuestra base de datos`});
    return //terminamos proceso si no hay libro
  }

  const libroActualizado = {
    ...libroAActualizar,
    titulo: req?.body?.titulo ? req.body.titulo : libroAActualizar.titulo,
    autor: req?.body?.autor ? req.body.autor : libroAActualizar.autor,
    año: req?.body?.año ? req.body.año : libroAActualizar.año,
    disponible: req?.body?.disponible !== undefined ? req.body.disponible : libroAActualizar.disponible
  };
  
  libros = libros.map((x)=>x.id===id?libroActualizado:x);

  res.json({
    message: `El libro con ID ${id} ha sido actualizado parcialmente`
  })
});

app.delete("/libros/:id", (req, res) => { //Elimina un libro por ID
  const id = Number(req.params.id);
  const libroBuscado = libros.find((x) => x.id === id);
  if (!libroBuscado) {
    res.status(404).json({ message: `No se ha podido encontrar el libro con ID ${id} en nuestra base de datos`});
    return //terminamos proceso si no hay libro
  }

  if (prestamos.find((x) => x.libroId === id && x.fechaDevolucion === null)) {
    res.status(409).json({ message: `El libro con ID ${id} no puede ser eliminado porque está prestado` });
    return //terminamos proceso si libro esta prestado
  }

  const nuevoArrayDeLibros = libros.filter((x) => x.id !== id);
  libros = nuevoArrayDeLibros;

  res.json({
    message: `El libro con ID ${id} ha sido eliminado`
  })
});




app.get("/prestamos", (req, res) => {  //Lista todos los prestamos
  res.json(prestamos);
});

app.get("/libros/:id/prestamos", (req, res) => {  //Historial
  const id = Number(req.params.id);
  const libroBuscado = libros.find((x) => x.id === id);
  if (!libroBuscado) {
    res.status(404).json({ message: `No se ha podido encontrar el libro con ID ${id} en nuestra base de datos`});
    return //terminamos proceso si no hay libro
  }
  
  const prestamosDelLibro = prestamos.filter((x) => x.libroId === id);
  res.json(prestamosDelLibro);
});

app.post("/libros/:id/prestar", (req, res) => {  //Prestar libro
  const id = Number(req.params.id);
  const libroBuscado = libros.find((x) => x.id === id);
  if (!libroBuscado) {
    res.status(404).json({ message: `No se ha podido encontrar el libro con ID ${id} en nuestra base de datos`});
    return //terminamos proceso si no hay libro
  }
  if (!req.body){
    res.status(400).json({ message: "Esto es un post prestar endpoint, necesitas mandra un body" });
    return //terminamos proceso si no hay body
  }

  if (!req.body.usuario) {
    res.status(400).json({ message: "Falta campo(s): usuario" });
    return //terminamos proceso si faltan campos
  }
  
  if (!libroBuscado.disponible) {
    res.status(409).json({ message: `El libro con ID ${id} no está disponible para prestamo` });
    return //terminamos proceso si libro no disponible
  }


  //un usuario no puede tener 2 prestamos
  if (prestamos.find((x) => x.usuario === req.body.usuario && x.fechaDevolucion === null)) {
    res.status(409).json({ message: `El usuario ${req.body.usuario} ya tiene un libro prestado` });
    return
  }
  //Si se presta se crea el registro nuevo con fecha actual y fechadevolucion null, y disponbile = false
  const nuevoPrestamo = {
    id: prestamos.length + 1,
    libroId: id,
    usuario: req.body.usuario,
    fechaPrestamo: new Date().toISOString().split("T")[0], //fecha actual en formato YYYY-MM-DD
    fechaDevolucion: null
  };

  prestamos.push(nuevoPrestamo);
  libroBuscado.disponible = false; //actualizamos disponibilidad del libro

  res.status(201).json({
    message: `El libro con ID ${id} ha sido prestado a ${req.body.usuario}`
  });
  
});


app.post("/libros/:id/devolver", (req, res) => {  //Devolver libro
  const id = Number(req.params.id);
  const libroBuscado = libros.find((x) => x.id === id);
  if (!libroBuscado) {
    res.status(404).json({ message: `No se ha podido encontrar el libro con ID ${id} en nuestra base de datos`});
    return //terminamos proceso si no hay libro
  }

  const prestamoActivo = prestamos.find((x) => x.libroId === id && x.fechaDevolucion === null);
  if (!prestamoActivo) {
    res.status(400).json({ message: `El libro con ID ${id} no está prestado actualmente` });
    return
  }
  libroBuscado.disponible = true; //actualizamos disponibilidad del libro

  res.json({
    message: `El libro con ID ${id} ha sido devuelto`
  });
});

app.get("/estadisticas", (req, res) => {  //Estadisticas
  const totalLibros = libros.length;
  const librosDisponibles = libros.filter((x) => x.disponible).length;
  const librosPrestados = totalLibros - librosDisponibles;

  res.json({
    message:`ESTADISTICAS DEL NEGOCIO:
    Total de libros: ${totalLibros}
    Libros disponibles: ${librosDisponibles}
    Libros prestados: ${librosPrestados}`
  });
});

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});