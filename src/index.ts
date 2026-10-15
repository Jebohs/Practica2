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

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});