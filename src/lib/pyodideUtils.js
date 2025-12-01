// src/lib/pyodideUtils.js

let pyodideInstance = null;
let isPyodideLoading = false;

/**
 * Carga e inicializa la instancia de Pyodide si no está lista.
 * Esto debe llamarse al iniciar la aplicación o antes de la primera ejecución.
 * NOTA: Asegúrese de tener el script de Pyodide cargado en index.html
 */
export const loadPyodideInstance = async () => {
    if (pyodideInstance || isPyodideLoading) {
        return pyodideInstance;
    }
    
    // Si window.loadPyodide no existe, Pyodide no está cargado en index.html
    if (typeof window.loadPyodide !== 'function') {
        console.error("Error: window.loadPyodide no está definido. Asegúrese de que el script de Pyodide esté en index.html.");
        return null;
    }

    isPyodideLoading = true;
    console.log("Iniciando Pyodide...");

    try {
        // La URL debe apuntar a la carpeta de archivos de Pyodide (normalmente la raíz)
        pyodideInstance = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/", // Puede usar una versión local o esta CDN
        });
        
        console.log("Pyodide cargado e inicializado.");
        // Opcional: Instalar librerías básicas si son necesarias
        // await pyodideInstance.loadPackage(['numpy']);

        return pyodideInstance;
    } catch (error) {
        console.error("Fallo al cargar Pyodide:", error);
        pyodideInstance = null;
        return null;
    } finally {
        isPyodideLoading = false;
    }
};

/**
 * Ejecuta código Python y captura la salida o los errores.
 * @param {string} code Código Python a ejecutar.
 * @returns {{output: string, error: string}}
 */
export const runPyodideCode = async (code) => {
    const instance = await loadPyodideInstance();
    
    if (!instance) {
        return { output: null, error: "Pyodide no está listo para ejecutar." };
    }

    // Usaremos un array para capturar las llamadas a print()
    const stdout = [];
    
    // Sobrescribir la función print de Python para redirigir la salida a nuestro array
    instance.globals.set('print', (args) => stdout.push(String(args)));

    try {
        // Ejecutar el código. El resultado de la última expresión se almacena en `pyodide.globals.get("_")`
        await instance.runPythonAsync(code); 
        
        // Unir la salida capturada por las llamadas a print()
        const output = stdout.join('\n');
        
        return { output: output, error: null };
    } catch (e) {
        // Capturar y formatear el error de Python
        return { output: null, error: e.toString() };
    }
};

// Se puede llamar a loadPyodideInstance() en un useEffect del App.jsx para precargar
// y reducir el tiempo de espera en el primer ejercicio.