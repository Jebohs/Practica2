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
  }

  res.json(libroBuscado);
});

app.post("/libros", (req, res) => { 
  if (!req.body){
    res.status(400).json({ message: "Esto es un post creation endpoint, necesitas mandra un body" });
    return //terminamos proceso si no hay body
  }
  if (!req.body.titulo || !req.body.autor || !req.body.año) { //se podian hacer 3 ifs
    res.status(400).json({ message: "Falta un campo(s): titulo, autor, año" });
    return //terminamos proceso si faltan campos
  }

  const nuevoLibro = {
    id: libros.length + 1,
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

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});