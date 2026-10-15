# REST API de una biblioteca en Express
API sencilla para gestionar libros y prestamos , datos viven en memoria y se pierden al reeniciar.

## Req's
Node.js
npm 
## Para correr:
En linux:

```bash
npm init -y
npm install express
```
## Ejecucion

Una o otra
    
```bash
node index.js

NPM RUN DEV
```
Codigo usa `import`

```json
"type": "module"
```

Deberia poner " Server is running on port 3000"
Conectarse con postman a localhost:3000

## Para probar la api   
`GET /libros` | devuelve todos los libros
`GET /libros/:id` | devuelve el libro con ID especifico
`POST /libros/` | aniade un libro
`PUT /libros/:id` | actualiza un libro buscado por su ID
`PATCH /libros/:id` | actualizda libro por su ID
`DELETE /libros/:id` | Borra libro por su ID

`GET /prestamos` | muestra los prestamos
`GET libros/:id/prestamos` | Historial por ID
`POST libros/:id/prestar` | Presta un libro
`POST libros/:id/devolver` | devuelve un libro


`GET /estadisticas` | Devuelve estadisticas de la biblioteca