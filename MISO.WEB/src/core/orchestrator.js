/**
 * MISO Orchestrator - Carga los módulos legacy en orden
 * No modifica ninguna función existente, solo asegura orden de carga
 */

(function() {
    console.log('[MISO] Orchestrator iniciado');
    
    // Función para cargar scripts dinámicamente
    function loadScript(src, isModule = false) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            if (isModule) {
                script.type = 'module';
            }
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load ${src}`));
            document.head.appendChild(script);
        });
    }
    
    // Cargar scripts en orden (db.js debe cargar antes que app.js)
    async function initialize() {
        try {
            // Cargar Dexie primero (desde CDN)
            await new Promise((resolve) => {
                if (window.Dexie) {
                    resolve();
                    return;
                }
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/dexie@4.0.10/dist/dexie.js';
                script.onload = resolve;
                document.head.appendChild(script);
            });
            
            // Cargar jsPDF
            await new Promise((resolve) => {
                if (window.jspdf) {
                    resolve();
                    return;
                }
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
                script.onload = resolve;
                document.head.appendChild(script);
            });
            
            // Cargar DB
            await loadScript('./src/legacy/db.js');
            console.log('[MISO] db.js cargado');
            
            // Cargar app.js (contiene toda la lógica)
            await loadScript('./src/legacy/app.js');
            console.log('[MISO] app.js cargado');
            
            // Disparar evento de inicialización
            const event = new CustomEvent('miso:ready');
            document.dispatchEvent(event);
            
            console.log('[MISO]Todos los módulos cargados correctamente');
        } catch (error) {
            console.error('[MISO] Error cargando módulos:', error);
        }
    }
    
    // Iniciar carga
    initialize();
})();
