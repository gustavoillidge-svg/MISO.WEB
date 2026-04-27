/**
 * MISO ENGINE - v4.0.0 - Motor de Cálculos de Costeo Gastronómico
 * Zero-Server: Todo el procesamiento ocurre en el cliente
 * 
 * Este módulo centraliza toda la lógica de negocio para:
 * - Cálculos de insumos (gr/ml)
 * - Cálculos de merma y rendimiento
 * - Cálculos de sub-recetas/elaborados
 * - Cálculos de pricing y food cost
 * - Análisis BCG de menú
 */

class MisoEngine {
  constructor() {
    // Constantes de configuración
    this.IMPOCONSUMO = 0.08; // 8% impuesto colombiano
    this.FACTOR_SEGURIDAD = 0.05; // 5% para condimentos/desperdicios
    this.FOOD_COST_TARGET = 0.30; // 30% objetivo por defecto
    
    // Categorías de ingredientes
    this.categoriasInsumos = [
      'Proteínas', 'Vegetales', 'Lácteos', 'Granos', 'Especias', 
      'Empaques', 'Bebidas', 'Otros'
    ];
  }

  // ==================== MÓDULO 1: INSUMOS ====================
  
  /**
   * Calcula el costo por gramo/ml a partir del precio total y cantidad
   * @param {number} precioTotal - Costo total del insumo
   * @param {number} cantidadTotal - Cantidad total (en g, ml, kg, litros)
   * @param {string} unidad - Unidad de medida
   * @returns {number} Costo por unidad mínima
   */
  calcularCostoUnitario(precioTotal, cantidadTotal, unidad = 'g') {
    if (cantidadTotal <= 0) return 0;
    
    // Convertir a unidad mínima
    let cantidadEnUnidadMinima = this.convertirAUnidadMinima(cantidadTotal, unidad);
    return precioTotal / cantidadEnUnidadMinima;
  }

  /**
   * Convierte diferentes unidades a su equivalente en gramos/ml
   */
  convertirAUnidadMinima(cantidad, unidad) {
    const conversiones = {
      'kg': cantidad * 1000,
      'g': cantidad,
      'lb': cantidad * 453.592,
      'oz': cantidad * 28.3495,
      'l': cantidad * 1000,
      'ml': cantidad,
      'gal': cantidad * 3785.41,
      'und': cantidad // unidades se tratan como 1
    };
    
    const unidadLower = unidad.toLowerCase();
    return conversiones[unidadLower] || cantidad;
  }

  /**
   * Calcula el costo de una porción de insumo
   * @param {number} costoPorGramo - Costo por gramo/ml
   * @param {number} cantidadUsada - Cantidad usada en la receta
   * @returns {number} Costo de la porción
   */
  calcularCostoPorcion(costoPorGramo, cantidadUsada) {
    return costoPorGramo * cantidadUsada;
  }

  /**
   * Calcula el costo por unidad cuando se compra en paquete
   * @param {number} precioPaquete - Precio total del paquete
   * @param {number} unidadesPaquete - Número de unidades en el paquete
   * @param {number} pesoUnitario - Peso de cada unidad en gramos (opcional)
   * @returns {object} Costo por unidad y costo por gramo
   */
  calcularCostoPaquete(precioPaquete, unidadesPaquete, pesoUnitario = null) {
    const costoPorUnidad = precioPaquete / unidadesPaquete;
    
    if (pesoUnitario && pesoUnitario > 0) {
      return {
        costoPorUnidad,
        costoPorGramo: costoPorUnidad / pesoUnitario
      };
    }
    
    return { costoPorUnidad, costoPorGramo: null };
  }

  // ==================== MÓDULO 2: MERMAS Y RENDIMIENTO ====================

  /**
   * Calcula el porcentaje de rendimiento
   * @param {number} pesoBruto - Peso antes de procesar
   * @param {number} pesoNeto - Peso después de procesar
   * @returns {number} Porcentaje de rendimiento (0-100)
   */
  calcularRendimiento(pesoBruto, pesoNeto) {
    if (pesoBruto <= 0) return 0;
    return (pesoNeto / pesoBruto) * 100;
  }

  /**
   * Calcula el porcentaje de merma
   * @param {number} pesoBruto - Peso antes de procesar
   * @param {number} pesoNeto - Peso después de procesar
   * @returns {number} Porcentaje de merma (0-100)
   */
  calcularMerma(pesoBruto, pesoNeto) {
    return 100 - this.calcularRendimiento(pesoBruto, pesoNeto);
  }

  /**
   * Calcula el costo real considerando la merma
   * @param {number} costoBruto - Costo del producto sin procesar
   * @param {number} porcentajeRendimiento - Porcentaje de rendimiento (0-100)
   * @returns {number} Costo real del producto usable
   */
  calcularCostoReal(costoBruto, porcentajeRendimiento) {
    if (porcentajeRendimiento <= 0) return 0;
    return costoBruto / (porcentajeRendimiento / 100);
  }

  /**
   * Calcula la cantidad bruta necesaria para obtener una cantidad neta
   * @param {number} pesoNetoDeseado - Peso neto que se necesita
   * @param {number} porcentajeRendimiento - Porcentaje de rendimiento esperado
   * @returns {number} Peso bruto a comprar
   */
  calcularPesoBrutoNecesario(pesoNetoDeseado, porcentajeRendimiento) {
    if (porcentajeRendimiento <= 0) return 0;
    return pesoNetoDeseado / (porcentajeRendimiento / 100);
  }

  /**
   * Calcula el costo de una porción ya procesada
   * @param {number} costoBruto - Costo original
   * @param {number} porcentajeRendimiento - Rendimiento del proceso
   * @param {number} cantidadPorcion - Cantidad de la porción en la misma unidad
   * @returns {number} Costo de la porción
   */
  calcularCostoPorcionProcesada(costoBruto, porcentajeRendimiento, cantidadPorcion) {
    const costoPorUnidad = this.calcularCostoReal(costoBruto, porcentajeRendimiento);
    return costoPorUnidad * cantidadPorcion;
  }

  // ==================== MÓDULO 3: ELABORADOS / SUB-RECETAS ====================

  /**
   * Calcula el costo de un elaborado (sub-receta)
   * @param {Array} ingredientes - Array de {nombre, cantidad, costo}
   * @param {number} rendimientoTotal - Rendimiento total en unidades o gramos
   * @returns {object} Costo total y costo por porción
   */
  calcularCostoElaborado(ingredientes, rendimientoTotal) {
    const costoTotal = ingredientes.reduce((sum, ing) => sum + (ing.costo || 0), 0);
    const costoPorPorcion = rendimientoTotal > 0 ? costoTotal / rendimientoTotal : 0;
    
    return {
      costoTotal,
      costoPorPorcion,
      rendimientoTotal,
      ingredientes: ingredientes.map(ing => ({
        ...ing,
        costo: ing.costo || 0
      }))
    };
  }

  /**
   * Calcula el costo de una porción específica de un elaborado
   * @param {number} costoTotal - Costo total del elaborado
   * @param {number} cantidadTotal - Cantidad total producida
   * @param {number} cantidadPorcion - Cantidad de la porción
   * @returns {number} Costo de la porción
   */
  calcularCostoPorcionElaborado(costoTotal, cantidadTotal, cantidadPorcion) {
    if (cantidadTotal <= 0) return 0;
    return (costoTotal / cantidadTotal) * cantidadPorcion;
  }

  /**
   * Calcula el rendimiento en porciones
   * @param {number} cantidadTotal - Cantidad total producido
   * @param {number} tamanoPorcion - Tamaño de cada porción
   * @returns {number} Número de porciones
   */
  calcularPorciones(cantidadTotal, tamanoPorcion) {
    if (tamanoPorcion <= 0) return 0;
    return cantidadTotal / tamanoPorcion;
  }

  // ==================== MÓDULO 4: PRODUCTOS Y PRICING ====================

  /**
   * Calcula el precio sugerido basado en Food Cost Target
   * @param {number} costoTotal - Costo total del plato
   * @param {number} porcentajeFoodCost - Porcentaje de food cost deseado
   * @returns {number} Precio sugerido
   */
  calcularPrecioFoodCost(costoTotal, porcentajeFoodCost) {
    if (porcentajeFoodCost <= 0 || porcentajeFoodCost >= 100) return 0;
    return costoTotal / (porcentajeFoodCost / 100);
  }

  /**
   * Calcula el precio basado en margen deseado
   * @param {number} costoTotal - Costo total del plato
   * @param {number} porcentajeMargen - Margen deseado (0-100)
   * @returns {number} Precio de venta
   */
  calcularPrecioMargen(costoTotal, porcentajeMargen) {
    if (porcentajeMargen >= 100) return 0;
    return costoTotal / (1 - (porcentajeMargen / 100));
  }

  /**
   * Calcula el precio basado en markup
   * @param {number} costoTotal - Costo total del plato
   * @param {number} porcentajeMarkup - Markup deseado (0-100)
   * @returns {number} Precio de venta
   */
  calcularPrecioMarkup(costoTotal, porcentajeMarkup) {
    return costoTotal * (1 + (porcentajeMarkup / 100));
  }

  /**
   * Calcula el precio final con Impoconsumo (8%)
   * @param {number} precioSinImpuesto - Precio sin impuesto
   * @returns {number} Precio final con Impoconsumo
   */
  calcularPrecioConImpoconsumo(precioSinImpuesto) {
    return precioSinImpuesto * (1 + this.IMPOCONSUMO);
  }

  /**
   * Calcula el precio sin impuesto a partir del precio final
   * @param {number} precioFinal - Precio con impuesto
   * @returns {number} Precio sin impuesto
   */
  calcularPrecioSinImpoconsumo(precioFinal) {
    return precioFinal / (1 + this.IMPOCONSUMO);
  }

  /**
   * Calcula el valor del Impoconsumo
   * @param {number} precioSinImpuesto - Precio sin impuesto
   * @returns {number} Valor del impuesto
   */
  calcularValorImpoconsumo(precioSinImpuesto) {
    return precioSinImpuesto * this.IMPOCONSUMO;
  }

  /**
   * Calcula el Food Cost real de un plato
   * @param {number} costoTotal - Costo del plato
   * @param {number} precioVenta - Precio de venta sin impuesto
   * @returns {number} Porcentaje de food cost
   */
  calcularFoodCostReal(costoTotal, precioVenta) {
    if (precioVenta <= 0) return 0;
    return (costoTotal / precioVenta) * 100;
  }

  /**
   * Calcula el margen real de un plato
   * @param {number} costoTotal - Costo del plato
   * @param {number} precioVenta - Precio de venta sin impuesto
   * @returns {number} Porcentaje de margen
   */
  calcularMargenReal(costoTotal, precioVenta) {
    if (precioVenta <= 0) return 0;
    return ((precioVenta - costoTotal) / precioVenta) * 100;
  }

  /**
   * Aplica precio psicológico (terminación .900)
   * @param {number} precio - Precio base
   * @returns {number} Precio con terminación .900
   */
  aplicarPrecioPsicologico(precio) {
    const precioRedondeado = Math.floor(precio / 1000) * 1000;
    return precioRedondeado + 900;
  }

  // ==================== MÓDULO 5: MATRIZ BCG ====================

  /**
   * Clasifica un plato en la matriz BCG
   * @param {number} rentabilidad - Margen o rentabilidad (0-100)
   * @param {number} popularidad - Ventas o popularidad (0-100)
   * @returns {string} Clasificación: 'estrella', 'vaca', 'enigma', 'perro'
   */
  clasificarBCG(rentabilidad, popularidad) {
    if (popularidad >= 50 && rentabilidad >= 50) return 'estrella';
    if (popularidad >= 50 && rentabilidad < 50) return 'vaca';
    if (popularidad < 50 && rentabilidad >= 50) return 'enigma';
    return 'perro';
  }

  /**
   * Analiza un menú completo y clasifica los platos
   * @param {Array} platos - Array de {nombre, costo, precioVenta, ventas}
   * @returns {Array} Platos con clasificación BCG
   */
  analizarMenuBCG(platos) {
    // Calcular rentabilidad de cada plato
    return platos.map(plato => {
      const margen = this.calcularMargenReal(plato.costo, plato.precioVenta);
      const rentabilidad = Math.max(0, Math.min(100, margen));
      const popularidad = Math.max(0, Math.min(100, plato.ventas || 0));
      
      return {
        ...plato,
        margen,
        rentabilidad,
        popularidad,
        clasificacion: this.clasificarBCG(rentabilidad, popularidad)
      };
    });
  }

  /**
   * Genera recomendaciones BCG para el menú
   * @param {Array} platosClasificados - Platos con clasificación
   * @returns {object} Recomendaciones por categoría
   */
  generarRecomendacionesBCG(platosClasificados) {
    const recomendaciones = {
      estrella: [],
      vaca: [],
      enigma: [],
      perro: []
    };

    platosClasificados.forEach(plato => {
      switch (plato.clasificacion) {
        case 'estrella':
          recomendaciones.estrella.push({
            ...plato,
            accion: 'Mantener y potenciar - Son los platos estrellas del negocio'
          });
          break;
        case 'vaca':
          recomendaciones.vaca.push({
            ...plato,
            accion: 'Optimizar costos o subir precios - Alto volumen, bajo margen'
          });
          break;
        case 'enigma':
          recomendaciones.enigma.push({
            ...plato,
            accion: 'Promocionar para convertir en Estrella - Potencial de nicho'
          });
          break;
        case 'perro':
          recomendaciones.perro.push({
            ...plato,
            accion: 'Eliminar o reestructurar - No genera valor'
          });
          break;
      }
    });

    return recomendaciones;
  }

  // ==================== UTILIDADES ====================

  /**
   * Aplica factor de seguridad al costo
   * @param {number} costo - Costo base
   * @param {number} factor - Factor de seguridad (default 5%)
   * @returns {number} Costo con factor de seguridad
   */
  aplicarFactorSeguridad(costo, factor = this.FACTOR_SEGURIDAD) {
    return costo * (1 + factor);
  }

  /**
   * Formatea número como moneda COP
   * @param {number} numero - Número a formatear
   * @returns {string} Número formateado
   */
  formatearCOP(numero) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numero);
  }

  /**
   * Formatea número con separadores de miles
   * @param {number} numero - Número a formatear
   * @returns {string} Número formateado
   */
  formatearNumero(numero) {
    return new Intl.NumberFormat('es-CO').format(Math.round(numero));
  }

  /**
   * Validación de datos de entrada
   * @param {number} valor - Valor a validar
   * @returns {boolean} Si es válido
   */
  validarNumero(valor) {
    return typeof valor === 'number' && !isNaN(valor) && isFinite(valor);
  }
}

// Instancia singleton del motor
const misoEngine = new MisoEngine();

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.MisoEngine = MisoEngine;
  window.misoEngine = misoEngine;
}

export default MisoEngine;
export { misoEngine };
