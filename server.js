/**
 * server.js - Servidor para manejar el envío de formularios y programación de informes
 */

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { startReportScheduler } = require('./schedule-report');

// Cargar variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './')));

// Configuración de correo electrónico
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'solucionesworld2016@gmail.com',
        pass: 'hvyj qclp lcuy gsgt'
    }
});

// Ruta para la página principal del cuestionario
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para procesar el formulario del cuestionario
app.post('/submit-form', async (req, res) => {
    try {
        const formData = req.body;
        
        // Crear contenido HTML del correo
        const mailOptions = {
            from: 'solucionesworld2016@gmail.com',
            to: 'hristiankrasimirov7@gmail.com',
            subject: 'Adelgaza sin salir de casa - cuestionario',
            html: `
                <h2>Nuevo Cuestionario Completado</h2>
                <p><strong>Nombre:</strong> ${formData.nombre}</p>
                <p><strong>Email:</strong> ${formData.email}</p>
                <p><strong>Edad:</strong> ${formData.edad}</p>
                <p><strong>Género:</strong> ${formData.genero}</p>
                
                <h3>Respuestas:</h3>
                <p><strong>Objetivo principal:</strong> ${formData.goal}</p>
                <p><strong>¿Ha intentado adelgazar antes?:</strong> ${formData.tried_before}</p>
                <p><strong>Métodos probados:</strong> ${Array.isArray(formData.methods) ? formData.methods.join(', ') : formData.methods}</p>
                <p><strong>Mayor obstáculo:</strong> ${formData.obstacle}</p>
                <p><strong>Tiempo disponible diario:</strong> ${formData.daily_time}</p>
                <p><strong>Lugar preferido para ejercicio:</strong> ${formData.exercise_place}</p>
                <p><strong>Alimentos difíciles de reducir:</strong> ${Array.isArray(formData.difficult_foods) ? formData.difficult_foods.join(', ') : formData.difficult_foods}</p>
                
                <p>Fecha de envío: ${new Date().toLocaleString()}</p>
            `
        };

        // Enviar correo
        await transporter.sendMail(mailOptions);
        
        res.status(200).json({ 
            success: true, 
            message: 'Formulario enviado correctamente'
        });
    } catch (error) {
        console.error('Error al procesar el formulario:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al procesar el formulario'
        });
    }
});

// Ruta para generar y enviar un informe manual
app.get('/generate-report', async (req, res) => {
    try {
        const WeeklyReport = require('./weekly-report');
        const report = new WeeklyReport();
        const result = await report.generateAndSendReport();
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al generar informe:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al generar informe',
            error: error.message
        });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
    
    // Iniciar el servicio de informes semanales
    if (process.env.ENABLE_REPORTS === 'true') {
        startReportScheduler();
    }
}); 