# Servidor

Backend del proyecto final para curso de Graphql de Escalab.

## Instrucciones de instalación

Para iniciar la aplicación seguir los siguientes pasos.

1. Instalar las dependencias con `npm install`.

2. Usar la base `.env.example` para generar el archivo `.env` y ajustar la configuración con la base de MongoDB y las llaves de Cloudinary.

3. Crear el archivo `fbServiceAccountKey.json` en la carpeta `config` con la configuración autenticación de Firebase.

4. Ejecutar el script `yarn start`. Este comenzará la aplicación en el puerto indicado en la variable PORT de `.env`.