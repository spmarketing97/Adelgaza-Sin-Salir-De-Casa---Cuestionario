# Cuestionario - Adelgaza Sin Salir de Casa

Este directorio contiene el cuestionario para conocer al cliente ideal del programa "Adelgaza Sin Salir de Casa". El cuestionario recopila información importante sobre los objetivos, hábitos y preferencias de los usuarios interesados en el programa.

## Características

- Cuestionario de múltiples pasos con UI amigable
- Validación de campos requeridos
- Envío de datos por email
- Redirección automática a la landing page principal
- Generación de informes semanales automatizados
- Diseño responsive adaptado a todos los dispositivos

## Archivos principales

- `index.html` - Estructura del cuestionario
- `style.css` - Estilos y diseño visual
- `script.js` - Lógica del cuestionario en el frontend
- `server.js` - Servidor Node.js para procesar formularios
- `weekly-report.js` - Generador de informes semanales
- `schedule-report.js` - Programador de informes

## Instalación y ejecución

### Requisitos previos
- Node.js (v14.0.0 o superior)
- npm (v6.0.0 o superior)

### Pasos de instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
   - Copiar el archivo `.env.example` a `.env`
   - Editar `.env` con las credenciales apropiadas

3. Iniciar el servidor:
```bash
npm start
```

El servidor se iniciará en http://localhost:3000 (o el puerto configurado en .env).

## Envío de informes semanales

Los informes se envían automáticamente todos los lunes a las 9:00 AM si la variable `ENABLE_REPORTS` está activada en el archivo `.env`.

Para generar un informe manualmente:
```bash
npm run generate-report
```

## Estructura del proyecto

```
cuestionario/
│
├── index.html              # Página principal del cuestionario
├── style.css               # Estilos CSS
├── script.js               # JavaScript del frontend
│
├── server.js               # Servidor Express
├── weekly-report.js        # Generador de informes
├── schedule-report.js      # Programador de tareas
│
├── package.json            # Dependencias y scripts
├── .env                    # Variables de entorno
│
└── README.md               # Documentación
```

## Notas de seguridad

- Las credenciales sensibles no deben publicarse en GitHub
- El archivo `.env` está incluido en `.gitignore`
- Para producción, utilizar variables de entorno del servidor en lugar de archivos .env

## Contribuir

Para contribuir a este proyecto:

1. Haz un fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/nueva-caracteristica`)
3. Realiza tus cambios y haz commit (`git commit -m 'Añadir nueva característica'`)
4. Sube los cambios a tu fork (`git push origin feature/nueva-caracteristica`)
5. Crea un Pull Request

## Licencia

Este proyecto es propiedad de SPMarketing – ImpactoDigital. Todos los derechos reservados. 