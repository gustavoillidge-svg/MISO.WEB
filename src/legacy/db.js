// db.js - MisoWebDB: Sistema de Persistencia IndexedDB - v4.0.0

const db = new Dexie('MisoWebDB');

// Esquema de tablas con índices
db.version(1).stores({
  // Configuración global: modo actual, progreso del usuario, preferencias
  configuracion: 'key, value',
  
  // Catálogo de ingredientes con datos de costo y merma
  ingredientes: '++id, nombre, unidad, costo, merma, categoria, fechaCreacion',
  
  // Recetas completas con cálculos de precio
  recetas: '++id, nombre, costoTotal, margenDeseado, precioSugerido, precioFinal, categoria, fechaCreacion, ingredientes',
  
  // Seguimiento de entrenamiento por módulos
  entrenamiento: '++id, moduloId, completado, racha, ultimaFecha, intentos',
  
  // Historial de preguntas respondidas
  historialPreguntas: '++id, preguntaId, categoria, respondida, respondidaCorrecta, timestamp',
  
  // Platos para análisis BCG
  platos: '++id, nombre, costo, precioVenta, ventasMes, rentabilidad, categoria, fechaCreacion'
});

// Datos iniciales por defecto
const configInicial = {
  modoActual: 'aprendizaje',
  sonidoFeedback: true,
  formatoNumero: 'cop',
  ultimoModulo: 1,
  rachaActual: 0,
  totalPreguntasCorrectas: 0
};

// Inicializar configuración si no existe
async function inicializarConfiguracion() {
  const count = await db.configuracion.count();
  if (count === 0) {
    await db.configuracion.bulkPut(
      Object.entries(configInicial).map(([key, value]) => ({ key, value }))
    );
  }
}

// Funciones utilitarias de base de datos
window.misoDB = {
  // Configuración
  async getConfig(key) {
    const item = await db.configuracion.get(key);
    return item?.value;
  },
  
  async setConfig(key, value) {
    await db.configuracion.put({ key, value });
  },
  
  async getAllConfig() {
    const items = await db.configuracion.toArray();
    return Object.fromEntries(items.map(i => [i.key, i.value]));
  },

  // Ingredientes
  async agregarIngrediente(data) {
    return await db.ingredientes.add({
      ...data,
      fechaCreacion: new Date().toISOString()
    });
  },
  
  async obtenerIngredientes() {
    return await db.ingredientes.toArray();
  },
  
  async actualizarIngrediente(id, data) {
    return await db.ingredientes.update(id, data);
  },
  
  async eliminarIngrediente(id) {
    return await db.ingredientes.delete(id);
  },

  // Recetas
  async agregarReceta(data) {
    return await db.recetas.add({
      ...data,
      fechaCreacion: new Date().toISOString()
    });
  },
  
  async obtenerRecetas() {
    return await db.recetas.toArray();
  },
  
  async actualizarReceta(id, data) {
    return await db.recetas.update(id, data);
  },
  
  async eliminarReceta(id) {
    return await db.recetas.delete(id);
  },

  // Entrenamiento
  async getProgresoModulo(moduloId) {
    return await db.entrenamiento.where('moduloId').equals(moduloId).first();
  },
  
  async guardarProgreso(moduloId, completado, racha) {
    const existente = await db.entrenamiento.where('moduloId').equals(moduloId).first();
    if (existente) {
      return await db.entrenamiento.update(existente.id, {
        moduloId,
        completado: completado || existente.completado,
        racha: racha || existente.racha,
        ultimaFecha: new Date().toISOString()
      });
    } else {
      return await db.entrenamiento.add({
        moduloId,
        completado: false,
        racha: 0,
        intentos: 0,
        ultimaFecha: new Date().toISOString()
      });
    }
  },
  
  async obtenerTodoProgreso() {
    return await db.entrenamiento.toArray();
  },

  // Historial de Preguntas
  async guardarRespuesta(preguntaId, categoria, correcta) {
    return await db.historialPreguntas.add({
      preguntaId,
      categoria,
      respondida: true,
      respondidaCorrecta: correcta,
      timestamp: new Date().toISOString()
    });
  },
  
  async getHistorialCategoria(categoria) {
    return await db.historialPreguntas.where('categoria').equals(categoria).toArray();
  },
  
  async getTotalCorrectas() {
    return await db.historialPreguntas.where('respondidaCorrecta').equals(1).count();
  },

  // Platos (para Matriz BCG)
  async agregarPlato(data) {
    return await db.platos.add({
      ...data,
      fechaCreacion: new Date().toISOString()
    });
  },
  
  async obtenerPlatos() {
    return await db.platos.toArray();
  },
  
  async eliminarPlato(id) {
    return await db.platos.delete(id);
  },

  // Almacenamiento persistente
  async solicitarAlmacenamientoPersistente() {
    if (navigator.storage && navigator.storage.persist) {
      const esPersistente = await navigator.storage.persist();
      console.log('[DB] Almacenamiento persistente:', esPersistente ? 'ACTIVADO' : 'DENEGADO');
      return esPersistente;
    }
    console.log('[DB] API de almacenamiento no disponible');
    return false;
  },

  async verificarEstadoAlmacenamiento() {
    if (navigator.storage && navigator.storage.estimate) {
      const estimate = await navigator.storage.estimate();
      const usageMB = (estimate.usage / 1024 / 1024).toFixed(2);
      const quotaMB = (estimate.quota / 1024 / 1024).toFixed(2);
      const percentage = ((estimate.usage / estimate.quota) * 100).toFixed(2);
      
      console.log('[DB] Uso de almacenamiento:', {
        usado: `${usageMB} MB`,
        cuota: `${quotaMB} MB`,
        porcentaje: `${percentage}%`
      });
      
      return {
        usage: estimate.usage,
        quota: estimate.quota,
        usageMB,
        quotaMB,
        percentage
      };
    }
    return null;
  },

  async verificarPersistencia() {
    if (navigator.storage && navigator.storage.persisted) {
      return await navigator.storage.persisted();
    }
    return false;
  },

  // Inicialización
  inicializar: inicializarConPersistencia
};

window.db = db;

// Solicitar almacenamiento persistente al inicializar
async function inicializarConPersistencia() {
  await inicializarConfiguracion();
  
  // Verificar si ya es persistente
  const esPersistente = await misoDB.verificarPersistencia();
  if (!esPersistente) {
    console.log('[DB] Solicitando almacenamiento persistente...');
    await misoDB.solicitarAlmacenamientoPersistente();
  }
  
  // Mostrar estado de almacenamiento
  const estado = await misoDB.verificarEstadoAlmacenamiento();
  if (estado) {
    console.log(`[DB] Almacenamiento: ${estado.usageMB}MB / ${estado.quotaMB}MB (${estado.percentage}%)`);
  }
}

// Referencia al objeto db para uso directo a través de window.db