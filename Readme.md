# Prueba tecnica by Alfredo Lozano

## De Beers

### Descripcion

### Funcionalidades Principales

### Tecnologia Empleada

- MERN Stack:

  MongoDB con Mongoose (Backend)
  Express (Backend)
  React (Frontend)
  Node (Backend)

-Pruebas:

Todas las funcionalidades están testadas con Jest hasta niveles optimos de produccion.

### Instrucciones de Ejecución

Antes de ejecutar el backend de la aplicación, asegúrese de tener instaladas las siguientes dependencias:

- Node.js: Descargar e instalar Node.js.
- MongoDB: Descargar e instalar MongoDB.

Configuración del Frontend:

1º Clone el repositorio:

`https://github.com/isdi-coders-2023/Alfredo-Lozano-Final-Project-front-202309-mad.git`

2º Navegue al directorio del proyecto:

`cd Alfredo-Lozano-Final-Project-front-202309-mad`

3º Instale las dependencias:

`npm install`

4º Inicie el servidor

`npm run build`
`npm run start:dev`

Con estos pasos, el frontend estará configurado y en ejecución.

### Usuarios

| Método | URL             | Descripción                                                                    |
| ------ | --------------- | ------------------------------------------------------------------------------ |
| POST   | /users/register | Registrar un nuevo usuario con campos obligatorios.                            |
| POST   | /users/login    | Autenticar un usuario con nombre de usuario o correo electrónico y contraseña. |
| GET    | /users/:id      | Obtener un usuario por su ID. (Solo puede realizarlo el administrador)         |
