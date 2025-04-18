/**
 * schedule-report.js - Configuración para programar informes semanales
 * Este archivo debe ejecutarse en un servidor Node.js con capacidad de ejecutar cron
 */

const cron = require('node-cron');
const WeeklyReport = require('./weekly-report');

/**
 * Función principal que configura la tarea cron para enviar informes
 * Ejecuta la tarea todos los lunes a las 9:00 AM
 */
function setupWeeklyReportSchedule() {
    console.log('Configurando programación de informes semanales...');
    
    // Programar para cada lunes a las 9:00 AM
    // Formato cron: segundo(0-59) minuto(0-59) hora(0-23) día-del-mes(1-31) mes(1-12) día-de-la-semana(0-6, 0=domingo)
    cron.schedule('0 0 9 * * 1', async () => {
        console.log('Ejecutando tarea programada de informe semanal:', new Date().toISOString());
        
        try {
            const report = new WeeklyReport();
            const result = await report.generateAndSendReport();
            
            if (result.success) {
                console.log('Informe semanal enviado con éxito a', result.sentTo);
            } else {
                console.error('Error al enviar el informe semanal:', result.message);
            }
        } catch (error) {
            console.error('Error crítico al ejecutar la tarea programada:', error);
        }
    }, {
        timezone: "Europe/Madrid" // Ajustar a tu zona horaria
    });
    
    console.log('Informe semanal programado para todos los lunes a las 9:00 AM');
}

/**
 * Inicia el servicio de programación de informes
 */
function startReportScheduler() {
    try {
        setupWeeklyReportSchedule();
        console.log('Servicio de informes semanales iniciado correctamente');
    } catch (error) {
        console.error('Error al iniciar el servicio de informes semanales:', error);
    }
}

// Iniciar el programador si este script se ejecuta directamente
if (require.main === module) {
    startReportScheduler();
}

module.exports = {
    startReportScheduler
}; 