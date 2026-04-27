// CONTROLADOR DE VISTAS MISO - v4.0.0

// --- CONFIGURACIÓN SUPABASE ---
const SUPABASE_URL = 'https://rpcdbsffacwlybklheok.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_y05TjMilBVF4a8jOoLCNAA_kBLt1rL5'; 
const supabaseClient = (typeof supabase !== 'undefined') 
    ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            autoRefreshToken: true, // Renueva el token automáticamente antes de que expire
            persistSession: true,   // Guarda la sesión en el localStorage del navegador
            detectSessionInUrl: true // Útil si usas confirmación por email
        }
    }) 
    : null;

window.switchView = function(viewId) {
    console.log('switchView llamado:', viewId);
    const viewMap = {
        'home': 'view-home',
        'modulos': 'view-aprender',
        'info': 'view-info',
        'consultoria': 'view-consultoria',
        'costeo': 'view-costeo'
    };
    if (viewMap[viewId]) {
        viewId = viewMap[viewId];
    }

    // Ocultar todas las pestañas
    document.querySelectorAll('.pestaña-contenido').forEach(p => {
        p.classList.add('hidden');
    });

    // Mostrar la seleccionada
    const destino = document.getElementById(viewId);
    console.log('Destino encontrado:', !!destino, 'ID:', viewId);
    if (destino) {
        destino.classList.remove('hidden');
        window.scrollTo(0, 0);

        // Si es la vista de módulos de aprendizaje, mostrar el primer módulo por defecto
        if (viewId === 'view-aprender') {
            window.showModule(1);
        }

        // Costeador
        if (viewId === 'view-costeo') {
            initCosteador();
        }

        activateReveal();
    }

    // Actualizar estado activo en navegación
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.remove('active');
    });

    const viewName = viewId.replace('view-', '');
    const btnSearch = viewName === 'aprender' ? 'modulos' : viewName;
    const activeBtn = document.querySelector(`.nav-tab[data-action*="${btnSearch}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
};

// CONTROLADOR DE MÓDULOS
window.showModule = function(moduleNum) {
    document.querySelectorAll('.module-content').forEach(m => {
        m.classList.add('hidden');
    });

    const modulo = document.getElementById('module-' + moduleNum);
    if (modulo) {
        modulo.classList.remove('hidden');
    }

    for (let i = 1; i <= 7; i++) {
        const tab = document.getElementById('tab-' + i);
        if (tab) {
            if (i === moduleNum) {
                tab.classList.remove('text-gray-500', 'border-transparent');
                tab.classList.add('text-indigo-600', 'border-indigo-600');
            } else {
                tab.classList.remove('text-indigo-600', 'border-indigo-600');
                tab.classList.add('text-gray-500', 'border-transparent');
            }
        }
    }

    setTimeout(() => {
        document.getElementById('learning-content')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
};

window.copyFormula = function(formula) {
    navigator.clipboard.writeText(formula).then(() => {
        alert('Fórmula copiada: ' + formula);
    });
};

function activateReveal() {
    setTimeout(() => {
        const revealElements = document.querySelectorAll('.reveal:not(.active)');
        revealElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('active');
            }, index * 100);
        });
    }, 200);
}

// ============================================
// BUSCADOR PREDICTIVO - MISO
// ============================================


// ============================================
// MOTOR DE BÚSQUEDA MISO
// ============================================





// ============================================
// BANCO DE PREGUNTAS MISO
// ============================================
const bancoPreguntas = {
    insumos: [
        {enunciado:"Compras 50kg de harina por $200,000. ¿Costo por gramo (COP/g)?",opciones:["4","0.4","40","3"],correcta:"4"},
        {enunciado:"Compras 25kg de azúcar por $75,000. ¿Costo por gramo?",opciones:["3","0.3","30","2"],correcta:"3"},
        {enunciado:"Caja 30 huevos $18,000. ¿Costo por unidad?",opciones:["600","500","700","550"],correcta:"600"},
        {enunciado:"1L leche $3,200. ¿Costo por ml?",opciones:["3.2","0.32","32","2.5"],correcta:"3.2"},
        {enunciado:"10kg arroz $40,000. ¿Costo por gramo?",opciones:["4","3","5","2"],correcta:"4"},
        {enunciado:"5kg carne $90,000. ¿Costo por gramo?",opciones:["18","9","20","15"],correcta:"18"},
        {enunciado:"2L aceite $24,000. ¿Costo por ml?",opciones:["12","10","15","8"],correcta:"12"},
        {enunciado:"Caja 12 latas $36,000. ¿Costo por unidad?",opciones:["3000","2500","3500","2800"],correcta:"3000"},
        {enunciado:"20kg papa $60,000. ¿Costo por gramo?",opciones:["3","2","4","5"],correcta:"3"},
        {enunciado:"1kg sal $2,000. ¿Costo por gramo?",opciones:["2","0.2","1","3"],correcta:"2"},
        {enunciado:"500g especias $10,000. ¿Costo por gramo?",opciones:["20","10","15","25"],correcta:"20"},
        {enunciado:"3L crema $18,000. ¿Costo por ml?",opciones:["6","5","7","8"],correcta:"6"},
        {enunciado:"Caja 24 huevos $14,400. ¿Costo por unidad?",opciones:["600","500","650","550"],correcta:"600"},
        {enunciado:"15kg pollo $75,000. ¿Costo por gramo?",opciones:["5","4","6","3"],correcta:"5"},
        {enunciado:"1.5L salsa $9,000. ¿Costo por ml?",opciones:["6","5","7","4"],correcta:"6"},
        {enunciado:"8kg queso $96,000. ¿Costo por gramo?",opciones:["12","10","14","15"],correcta:"12"},
        {enunciado:"Caja 10 botellas $50,000. ¿Costo por unidad?",opciones:["5000","4000","6000","5500"],correcta:"5000"},
        {enunciado:"12kg harina $48,000. ¿Costo por gramo?",opciones:["4","3","5","2"],correcta:"4"},
        {enunciado:"2kg mantequilla $20,000. ¿Costo por gramo?",opciones:["10","8","12","9"],correcta:"10"},
        {enunciado:"4L jugo $16,000. ¿Costo por ml?",opciones:["4","3","5","6"],correcta:"4"},
        {enunciado:"30 und pan $15,000. ¿Costo por unidad?",opciones:["500","600","400","550"],correcta:"500"},
        {enunciado:"6kg tomate $18,000. ¿Costo por gramo?",opciones:["3","2","4","5"],correcta:"3"},
        {enunciado:"1kg ajo $8,000. ��Costo por gramo?",opciones:["8","7","6","9"],correcta:"8"},
        {enunciado:"3kg cebolla $9,000. ¿Costo por gramo?",opciones:["3","2","4","5"],correcta:"3"},
        {enunciado:"2L vinagre $8,000. ¿Costo por ml?",opciones:["4","3","5","6"],correcta:"4"},
        {enunciado:"Caja 20 cervezas $80,000. ¿Costo por unidad?",opciones:["4000","3500","4500","5000"],correcta:"4000"},
        {enunciado:"7kg carne $140,000. ¿Costo por gramo?",opciones:["20","18","22","15"],correcta:"20"},
        {enunciado:"1kg azúcar $3,000. ¿Costo por gramo?",opciones:["3","2","4","5"],correcta:"3"},
        {enunciado:"2kg arroz $8,000. ¿Costo por gramo?",opciones:["4","3","5","2"],correcta:"4"},
        {enunciado:"5L leche $15,000. ¿Costo por ml?",opciones:["3","2","4","5"],correcta:"3"}
    ],
    mermas: [
        {enunciado:"1000g bruto → 800g neto. ¿Rendimiento?",opciones:["80%","20%","75%","85%"],correcta:"80%"},
        {enunciado:"Rendimiento 80%. Kg $4,000. ¿Costo neto/kg?",opciones:["5000","4000","4500","4800"],correcta:"5000"},
        {enunciado:"Rendimiento 70%. Kg $10,000. ¿Costo neto?",opciones:["14285","13000","15000","12000"],correcta:"14285"},
        {enunciado:"1kg → 900g. ¿Rendimiento?",opciones:["90%","10%","85%","95%"],correcta:"90%"},
        {enunciado:"Costo $6,000, rendimiento 75%. ¿Costo neto?",opciones:["8000","7000","7500","7800"],correcta:"8000"},
        {enunciado:"1kg → 850g. ¿Merma?",opciones:["15%","85%","10%","20%"],correcta:"15%"},
        {enunciado:"Rendimiento 60%. Kg $20,000. ¿Costo neto?",opciones:["33333","30000","35000","28000"],correcta:"33333"},
        {enunciado:"1kg → 700g. ¿Rendimiento?",opciones:["70%","30%","65%","75%"],correcta:"70%"},
        {enunciado:"Costo $8,000, rendimiento 80%. ¿Costo neto?",opciones:["10000","9000","9500","8500"],correcta:"10000"},
        {enunciado:"1kg → 950g. ¿Merma?",opciones:["5%","10%","8%","6%"],correcta:"5%"},
        {enunciado:"Rendimiento 50%. $12,000/kg. ¿Costo neto?",opciones:["24000","20000","18000","22000"],correcta:"24000"},
        {enunciado:"1kg → 880g. ¿Rendimiento?",opciones:["88%","12%","85%","90%"],correcta:"88%"},
        {enunciado:"Costo $5,000, rendimiento 90%. ¿Costo neto?",opciones:["5556","5200","6000","5000"],correcta:"5556"},
        {enunciado:"1kg → 600g. ¿Merma?",opciones:["40%","60%","30%","50%"],correcta:"40%"},
        {enunciado:"Rendimiento 65%. $13,000/kg. ¿Costo neto?",opciones:["20000","19000","21000","18000"],correcta:"20000"},
        {enunciado:"1kg → 780g. ¿Rendimiento?",opciones:["78%","22%","80%","75%"],correcta:"78%"},
        {enunciado:"Costo $9,000, rendimiento 75%. ¿Costo neto?",opciones:["12000","11000","13000","10000"],correcta:"12000"},
        {enunciado:"1kg → 820g. ¿Merma?",opciones:["18%","20%","15%","10%"],correcta:"18%"},
        {enunciado:"Rendimiento 85%. $17,000/kg. ¿Costo neto?",opciones:["20000","19000","21000","18000"],correcta:"20000"},
        {enunciado:"1kg → 920g. ¿Rendimiento?",opciones:["92%","8%","90%","95%"],correcta:"92%"},
        {enunciado:"Costo $11,000, rendimiento 55%. ¿Costo neto?",opciones:["20000","19000","21000","18000"],correcta:"20000"},
        {enunciado:"1kg → 860g. ¿Merma?",opciones:["14%","10%","12%","15%"],correcta:"14%"},
        {enunciado:"Rendimiento 68%. $10,200/kg. ¿Costo neto?",opciones:["15000","14000","16000","13000"],correcta:"15000"},
        {enunciado:"1kg → 990g. ¿Merma?",opciones:["1%","2%","3%","5%"],correcta:"1%"},
        {enunciado:"Rendimiento 72%. $7,200/kg. ¿Costo neto?",opciones:["10000","9500","11000","9000"],correcta:"10000"},
        {enunciado:"1kg → 830g. ¿Rendimiento?",opciones:["83%","17%","80%","85%"],correcta:"83%"},
        {enunciado:"Costo $4,150, rendimiento 83%. ¿Costo neto?",opciones:["5000","4800","5200","4500"],correcta:"5000"},
        {enunciado:"1kg → 760g. ¿Merma?",opciones:["24%","20%","22%","25%"],correcta:"24%"},
        {enunciado:"Rendimiento 40%. $8,000/kg. ¿Costo neto?",opciones:["20000","18000","22000","16000"],correcta:"20000"},
        {enunciado:"1kg → 910g. ¿Rendimiento?",opciones:["91%","9%","90%","92%"],correcta:"91%"}
    ],
    elaborados: [
        {enunciado:"2,000 ml salsa $24,000. ¿Costo/ml?",opciones:["12","10","15","8"],correcta:"12"},
        {enunciado:"Costo/ml = 12. ¿Costo 50 ml?",opciones:["600","500","700","550"],correcta:"600"},
        {enunciado:"5kg masa $40,000. ¿Costo por g?",opciones:["8","7","9","10"],correcta:"8"},
        {enunciado:"Costo/g = 8. ¿Costo 250g?",opciones:["2000","1800","2200","2100"],correcta:"2000"},
        {enunciado:"3L salsa $30,000. ¿Costo/ml?",opciones:["10","12","8","15"],correcta:"10"},
        {enunciado:"Costo/ml =10. ¿Costo 100 ml?",opciones:["1000","900","1100","1200"],correcta:"1000"},
        {enunciado:"4kg relleno $20,000. ¿Costo/g?",opciones:["5","4","6","7"],correcta:"5"},
        {enunciado:"Costo/g=5. ¿Costo 150g?",opciones:["750","700","800","900"],correcta:"750"},
        {enunciado:"1L salsa $8,000. ¿Costo/ml?",opciones:["8","7","9","6"],correcta:"8"},
        {enunciado:"Costo/ml=8. ¿Costo 30ml?",opciones:["240","200","260","300"],correcta:"240"},
        {enunciado:"2kg mezcla $14,000. ¿Costo/g?",opciones:["7","6","8","9"],correcta:"7"},
        {enunciado:"Costo/g=7. ¿Costo 100g?",opciones:["700","600","800","750"],correcta:"700"},
        {enunciado:"3kg masa $18,000. ¿Costo/g?",opciones:["6","5","7","8"],correcta:"6"},
        {enunciado:"Costo/g=6. ¿Costo 200g?",opciones:["1200","1000","1400","1300"],correcta:"1200"},
        {enunciado:"5L caldo $25,000. ¿Costo/ml?",opciones:["5","6","4","7"],correcta:"5"},
        {enunciado:"Costo/ml=5. ¿Costo 300ml?",opciones:["1500","1400","1600","1700"],correcta:"1500"},
        {enunciado:"1kg mezcla $9,000. ¿Costo/g?",opciones:["9","8","10","7"],correcta:"9"},
        {enunciado:"Costo/g=9. ¿Costo 50g?",opciones:["450","400","500","480"],correcta:"450"},
        {enunciado:"2L jugo $6,000. ¿Costo/ml?",opciones:["3","2","4","5"],correcta:"3"},
        {enunciado:"Costo/ml=3. ¿Costo 250ml?",opciones:["750","700","800","900"],correcta:"750"},
        {enunciado:"4kg salsa $16,000. ¿Costo/g?",opciones:["4","3","5","6"],correcta:"4"},
        {enunciado:"Costo/g=4. ¿Costo 400g?",opciones:["1600","1500","1700","1800"],correcta:"1600"},
        {enunciado:"3L crema $21,000. ¿Costo/ml?",opciones:["7","6","8","9"],correcta:"7"},
        {enunciado:"Costo/ml=7. ¿Costo 60ml?",opciones:["420","400","450","480"],correcta:"420"},
        {enunciado:"5kg mezcla $35,000. ¿Costo/g?",opciones:["7","6","8","9"],correcta:"7"},
        {enunciado:"Costo/g=7. ¿Costo 300g?",opciones:["2100","2000","2200","2300"],correcta:"2100"},
        {enunciado:"2kg relleno $12,000. ¿Costo/g?",opciones:["6","5","7","8"],correcta:"6"},
        {enunciado:"Costo/g=6. ¿Costo 120g?",opciones:["720","700","750","800"],correcta:"720"},
        {enunciado:"1L salsa $5,000. ¿Costo/ml?",opciones:["5","4","6","7"],correcta:"5"},
        {enunciado:"Costo/ml=5. ¿Costo 80ml?",opciones:["400","350","450","500"],correcta:"400"}
    ],
    productos: [
        {enunciado:"Costo $10,000. Food cost 25%. ¿Precio?",opciones:["40000","35000","45000","30000"],correcta:"40000"},
        {enunciado:"Costo $12,000. FC 30%. ¿Precio?",opciones:["40000","38000","42000","35000"],correcta:"40000"},
        {enunciado:"Costo $8,000. FC 40%. ¿Precio?",opciones:["20000","18000","22000","16000"],correcta:"20000"},
        {enunciado:"Costo $9,000. FC 30%. ¿Precio?",opciones:["30000","28000","32000","27000"],correcta:"30000"},
        {enunciado:"Costo $15,000. FC 50%. ¿Precio?",opciones:["30000","28000","32000","35000"],correcta:"30000"},
        {enunciado:"Costo $7,500. FC 25%. ¿Precio?",opciones:["30000","28000","32000","35000"],correcta:"30000"},
        {enunciado:"Costo $11,000. FC 22%. ¿Precio?",opciones:["50000","48000","52000","45000"],correcta:"50000"},
        {enunciado:"Costo $6,000. FC 30%. ¿Precio?",opciones:["20000","18000","22000","25000"],correcta:"20000"},
        {enunciado:"Costo $14,000. FC 35%. ¿Precio?",opciones:["40000","38000","42000","45000"],correcta:"40000"},
        {enunciado:"Costo $5,000. FC 20%. ¿Precio?",opciones:["25000","23000","27000","30000"],correcta:"25000"},
        {enunciado:"Costo $13,000. FC 26%. ¿Precio?",opciones:["50000","48000","52000","55000"],correcta:"50000"},
        {enunciado:"Costo $16,000. FC 40%. ¿Precio?",opciones:["40000","38000","42000","45000"],correcta:"40000"},
        {enunciado:"Costo $9,500. FC 30%. ¿Precio?",opciones:["31667","30000","32000","28000"],correcta:"31667"},
        {enunciado:"Costo $18,000. FC 45%. ¿Precio?",opciones:["40000","38000","42000","45000"],correcta:"40000"},
        {enunciado:"Costo $4,000. FC 20%. ¿Precio?",opciones:["20000","18000","22000","25000"],correcta:"20000"},
        {enunciado:"Costo $20,000. FC 50%. ¿Precio?",opciones:["40000","38000","42000","45000"],correcta:"40000"},
        {enunciado:"Costo $10,500. FC 35%. ¿Precio?",opciones:["30000","28000","32000","35000"],correcta:"30000"},
        {enunciado:"Costo $8,400. FC 28%. ¿Precio?",opciones:["30000","28000","32000","35000"],correcta:"30000"},
        {enunciado:"Costo $6,600. FC 33%. ¿Precio?",opciones:["20000","18000","22000","25000"],correcta:"20000"},
        {enunciado:"Costo $7,200. FC 24%. ¿Precio?",opciones:["30000","28000","32000","35000"],correcta:"30000"},
        {enunciado:"Costo $3,000. FC 15%. ¿Precio?",opciones:["20000","18000","22000","25000"],correcta:"20000"},
        {enunciado:"Costo $25,000. FC 50%. ¿Precio?",opciones:["50000","48000","52000","55000"],correcta:"50000"},
        {enunciado:"Costo $12,500. FC 25%. ¿Precio?",opciones:["50000","48000","52000","55000"],correcta:"50000"},
        {enunciado:"Costo $9,000. FC 20%. ¿Precio?",opciones:["45000","40000","48000","42000"],correcta:"45000"},
        {enunciado:"Costo $6,000. FC 15%. ¿Precio?",opciones:["40000","38000","42000","45000"],correcta:"40000"},
        {enunciado:"Costo $8,000. FC 20%. ¿Precio?",opciones:["40000","38000","42000","45000"],correcta:"40000"},
        {enunciado:"Costo $10,000. FC 40%. ¿Precio?",opciones:["25000","23000","27000","30000"],correcta:"25000"},
        {enunciado:"Costo $14,000. FC 28%. ¿Precio?",opciones:["50000","48000","52000","55000"],correcta:"50000"},
        {enunciado:"Costo $18,000. FC 36%. ¿Precio?",opciones:["50000","48000","52000","55000"],correcta:"50000"},
        {enunciado:"Costo $5,000. FC 25%. ¿Precio?",opciones:["20000","18000","22000","25000"],correcta:"20000"}
    ],
    pricing: [
        {enunciado:"Precio base $30,000. ¿Final con 8%?",opciones:["32400","32000","33000","31000"],correcta:"32400"},
        {enunciado:"Precio final $32,400. ¿Base?",opciones:["30000","29000","31000","28000"],correcta:"30000"},
        {enunciado:"Base $25,000. ¿Final?",opciones:["27000","26000","28000","29000"],correcta:"27000"},
        {enunciado:"Final $54,000. ¿Base?",opciones:["50000","48000","52000","45000"],correcta:"50000"},
        {enunciado:"Base $40,000. ¿Final?",opciones:["43200","42000","44000","41000"],correcta:"43200"},
        {enunciado:"Final $21,600. ¿Base?",opciones:["20000","19000","21000","18000"],correcta:"20000"},
        {enunciado:"Base $10,000. ¿Final?",opciones:["10800","10500","11000","10000"],correcta:"10800"},
        {enunciado:"Final $10,800. ¿Base?",opciones:["10000","9500","10500","9000"],correcta:"10000"},
        {enunciado:"Base $50,000. ¿Final?",opciones:["54000","52000","55000","53000"],correcta:"54000"},
        {enunciado:"Final $27,000. ¿Base?",opciones:["25000","24000","26000","23000"],correcta:"25000"},
        {enunciado:"Base $18,000. ¿Final?",opciones:["19440","19000","20000","18000"],correcta:"19440"},
        {enunciado:"Final $19,440. ¿Base?",opciones:["18000","17000","18500","16000"],correcta:"18000"},
        {enunciado:"Base $60,000. ¿Final?",opciones:["64800","63000","66000","62000"],correcta:"64800"},
        {enunciado:"Final $64,800. ¿Base?",opciones:["60000","58000","62000","55000"],correcta:"60000"},
        {enunciado:"Base $22,000. ¿Final?",opciones:["23760","23000","24000","22000"],correcta:"23760"},
        {enunciado:"Final $23,760. ¿Base?",opciones:["22000","21000","23000","20000"],correcta:"22000"},
        {enunciado:"Base $35,000. ¿Final?",opciones:["37800","36000","39000","35000"],correcta:"37800"},
        {enunciado:"Final $37,800. ¿Base?",opciones:["35000","34000","36000","33000"],correcta:"35000"},
        {enunciado:"Base $12,000. ¿Final?",opciones:["12960","12000","13000","12500"],correcta:"12960"},
        {enunciado:"Final $12,960. ¿Base?",opciones:["12000","11000","12500","10000"],correcta:"12000"},
        {enunciado:"Base $28,000. ¿Final?",opciones:["30240","29000","31000","28000"],correcta:"30240"},
        {enunciado:"Final $30,240. ¿Base?",opciones:["28000","27000","29000","26000"],correcta:"28000"},
        {enunciado:"Base $45,000. ¿Final?",opciones:["48600","47000","49000","46000"],correcta:"48600"},
        {enunciado:"Final $48,600. ¿Base?",opciones:["45000","44000","46000","43000"],correcta:"45000"},
        {enunciado:"Base $55,000. ¿Final?",opciones:["59400","58000","60000","57000"],correcta:"59400"},
        {enunciado:"Final $59,400. ¿Base?",opciones:["55000","53000","56000","52000"],correcta:"55000"},
        {enunciado:"Base $15,000. ¿Final?",opciones:["16200","15000","17000","16000"],correcta:"16200"},
        {enunciado:"Final $16,200. ¿Base?",opciones:["15000","14000","15500","13000"],correcta:"15000"},
        {enunciado:"Base $70,000. ¿Final?",opciones:["75600","74000","77000","73000"],correcta:"75600"},
        {enunciado:"Final $75,600. ¿Base?",opciones:["70000","68000","72000","65000"],correcta:"70000"}
    ],
    bcg: [
        {enunciado:"Alta venta + alto margen",opciones:["ESTRELLA","VACA","ENIGMA","PERRO"],correcta:"ESTRELLA"},
        {enunciado:"Alta venta + bajo margen",opciones:["VACA","ESTRELLA","PERRO","ENIGMA"],correcta:"VACA"},
        {enunciado:"Baja venta + alto margen",opciones:["ENIGMA","VACA","PERRO","ESTRELLA"],correcta:"ENIGMA"},
        {enunciado:"Baja venta + bajo margen",opciones:["PERRO","ENIGMA","VACA","ESTRELLA"],correcta:"PERRO"},
        {enunciado:"Mucho volumen, utilidad estable",opciones:["VACA","ESTRELLA","PERRO","ENIGMA"],correcta:"VACA"},
        {enunciado:"Alta rentabilidad pero no rota",opciones:["ENIGMA","ESTRELLA","VACA","PERRO"],correcta:"ENIGMA"},
        {enunciado:"Producto que destruye margen",opciones:["PERRO","ENIGMA","VACA","ESTRELLA"],correcta:"PERRO"},
        {enunciado:"Producto ideal",opciones:["ESTRELLA","VACA","PERRO","ENIGMA"],correcta:"ESTRELLA"},
        {enunciado:"Mucho volumen pero bajo margen",opciones:["VACA","ESTRELLA","ENIGMA","PERRO"],correcta:"VACA"},
        {enunciado:"Baja venta pero rentable",opciones:["ENIGMA","PERRO","VACA","ESTRELLA"],correcta:"ENIGMA"},
        {enunciado:"No rota ni deja dinero",opciones:["PERRO","ENIGMA","VACA","ESTRELLA"],correcta:"PERRO"},
        {enunciado:"Top ventas + top margen",opciones:["ESTRELLA","VACA","PERRO","ENIGMA"],correcta:"ESTRELLA"},
        {enunciado:"Rotación alta, margen bajo",opciones:["VACA","ESTRELLA","PERRO","ENIGMA"],correcta:"VACA"},
        {enunciado:"Margen alto, rotación baja",opciones:["ENIGMA","PERRO","VACA","ESTRELLA"],correcta:"ENIGMA"},
        {enunciado:"Margen bajo, rotación baja",opciones:["PERRO","ENIGMA","VACA","ESTRELLA"],correcta:"PERRO"},
        {enunciado:"Alta demanda y rentabilidad",opciones:["ESTRELLA","VACA","PERRO","ENIGMA"],correcta:"ESTRELLA"},
        {enunciado:"Sostiene flujo de caja",opciones:["VACA","ESTRELLA","PERRO","ENIGMA"],correcta:"VACA"},
        {enunciado:"Potencial sin explotar",opciones:["ENIGMA","ESTRELLA","VACA","PERRO"],correcta:"ENIGMA"},
        {enunciado:"Eliminar del menú",opciones:["PERRO","ENIGMA","VACA","ESTRELLA"],correcta:"PERRO"},
        {enunciado:"Producto líder",opciones:["ESTRELLA","VACA","PERRO","ENIGMA"],correcta:"ESTRELLA"},
        {enunciado:"Genera volumen constante",opciones:["VACA","ESTRELLA","PERRO","ENIGMA"],correcta:"VACA"},
        {enunciado:"Requiere estrategia",opciones:["ENIGMA","ESTRELLA","VACA","PERRO"],correcta:"ENIGMA"},
        {enunciado:"Debe salir del menú",opciones:["PERRO","ENIGMA","VACA","ESTRELLA"],correcta:"PERRO"},
        {enunciado:"Mayor rentabilidad y rotación",opciones:["ESTRELLA","VACA","PERRO","ENIGMA"],correcta:"ESTRELLA"},
        {enunciado:"Margen estable, alto volumen",opciones:["VACA","ESTRELLA","PERRO","ENIGMA"],correcta:"VACA"},
        {enunciado:"Difícil de vender pero rentable",opciones:["ENIGMA","ESTRELLA","VACA","PERRO"],correcta:"ENIGMA"},
        {enunciado:"No rentable ni popular",opciones:["PERRO","ENIGMA","VACA","ESTRELLA"],correcta:"PERRO"},
        {enunciado:"Top desempeño",opciones:["ESTRELLA","VACA","PERRO","ENIGMA"],correcta:"ESTRELLA"},
        {enunciado:"Base del negocio",opciones:["VACA","ESTRELLA","PERRO","ENIGMA"],correcta:"VACA"},
        {enunciado:"Alta rentabilidad incierta",opciones:["ENIGMA","ESTRELLA","VACA","PERRO"],correcta:"ENIGMA"}
    ],
    claridad: [
        {enunciado:"Costo $10,000, precio $30,000. ¿Margen unitario?",opciones:["20000","15000","25000","10000"],correcta:"20000"},
        {enunciado:"Margen unitario $5,000, ventas 200. ¿Utilidad mensual?",opciones:["1000000","1500000","2000000","500000"],correcta:"1000000"},
        {enunciado:"Costo $8,000, precio $20,000. ¿Food cost %?",opciones:["40%","30%","50%","60%"],correcta:"40%"},
        {enunciado:"Food cost 25%. ¿Margen %?",opciones:["75%","70%","80%","65%"],correcta:"75%"},
        {enunciado:"Utilidad mensual $3000000, margen $10000. ¿Ventas mensuales?",opciones:["300","200","400","500"],correcta:"300"}
    ]
};

const PLANTILLA_INSUMOS = {
  id: 'insumos',
  name: 'Insumos Elaborados',
  colors: {
    indigo: [139, 92, 246],
    gris: [55, 65, 81],
    grisClaro: [209, 213, 219]
  },
  layout: {
    pageWidth: 210,
    pageHeight: 297,
    marginLeft: 20,
    marginRight: 190,
    afterLogo: 45,
    afterLogoFallback: 5,
    titleSpacing: 15,
    lineSpacing: 7,
    afterHeaderBlock: 12,
    afterLine: 10,
    tableHeaderHeight: 8,
    tableRowHeight: 6,
    afterTable: 8,
    betweenSummaryItems: 6,
    afterCostSummary: 12,
    beforeFinalPrice: 8,
    marginTop: 20
  },
  fonts: {
    title: 12,
    label: 10,
    sectionTitle: 11,
    tableHeader: 9,
    tableRow: 8,
    summaryLabel: 10,
    finalPrice: 12,
    footer: 8
  },
  table: {
    columns: [
      { label: 'Nombre', x: 22 },
      { label: 'Cantidad', x: 80 },
      { label: 'Unidad', x: 105 },
      { label: 'Costo Unit.', x: 135 },
      { label: 'Subtotal', x: 170 }
    ]
  },
  backgroundImage: './assets/images/plantillainsumose.png'
};

const PLANTILLA_PRODUCTOS = {
  id: 'productos',
  name: 'Productos para la Venta',
  colors: {
    indigo: [139, 92, 246],
    gris: [55, 65, 81],
    grisClaro: [209, 213, 219]
  },
  layout: {
    pageWidth: 210,
    pageHeight: 297,
    marginLeft: 20,
    marginRight: 190,
    afterLogo: 45,
    afterLogoFallback: 5,
    titleSpacing: 15,
    lineSpacing: 7,
    afterHeaderBlock: 12,
    afterLine: 10,
    tableHeaderHeight: 8,
    tableRowHeight: 6,
    afterTable: 8,
    betweenSummaryItems: 6,
    afterCostSummary: 12,
    beforeFinalPrice: 8,
    marginTop: 20
  },
  fonts: {
    title: 18,
    label: 12,
    sectionTitle: 11,
    tableHeader: 9,
    tableRow: 8,
    summaryLabel: 10,
    finalPrice: 12,
    footer: 8
  },
  table: {
    columns: [
      { label: 'Nombre', x: 22 },
      { label: 'Cantidad', x: 90 },
      { label: 'Unidad', x: 115 },
      { label: 'Costo Unit.', x: 140 },
      { label: 'Subtotal', x: 175 }
    ]
  },
  backgroundImage: './assets/images/plantillaproductos.png'
};

// ============================================
// MOTOR DE QUIZ MISO
// ============================================
let quizState = { modulo: '', indice: 0, seleccion: null, intentos: 0 };
const consejosMISO = {
    insumos: "Fórmula: Precio Total / Cantidad. Ejemplo: $180,000 / 50,000g = $3.6/g.",
    mermas: "Fórmula: (Peso Limpio / Peso Bruto) * 100. El costo neto sube si el rendimiento baja.",
    elaborados: "Fórmula: Suma de Insumos / Rendimiento de Receta. Cada porción debe absorber el costo base.",
    productos: "Fórmula: Costo / Margen Objetivo. No olvides sumar el 8% de Impoconsumo al final.",
    pricing: "Fórmula: Precio Base * 1.08. El margen real se calcula sobre el precio sin impuesto.",
    bcg: "Lógica: Analiza Rentabilidad vs Rotación. Estrella = +/+ | Perro = -/-"
};

window.abrirQuizMISO = function(categoria) {
    console.log('abrirQuizMISO llamado con:', categoria);
    quizState.modulo = categoria;
    quizState.indice = 0;
    quizState.seleccion = null;
    
    // Limpiar estilos de selección previa del grid
    const grid = document.getElementById('quizOptionsGrid');
    grid.querySelectorAll('button').forEach(function(b) {
        b.classList.remove('border-indigo-600', 'bg-indigo-100');
        b.classList.add('border-gray-200');
    });
    
    cargarPreguntaMISO();
    document.getElementById('misoQuizModal').classList.remove('hidden');
};

function cargarPreguntaMISO() {
    const preg = bancoPreguntas[quizState.modulo][quizState.indice];
    if (!preg) return;
    const grid = document.getElementById('quizOptionsGrid');
    document.getElementById('quizModuleTitle').innerText = quizState.modulo.charAt(0).toUpperCase() + quizState.modulo.slice(1);
    document.getElementById('quizProgress').innerText = 'Pregunta ' + (quizState.indice + 1) + ' de ' + bancoPreguntas[quizState.modulo].length;
    document.getElementById('quizEnunciado').innerText = preg.enunciado;
    document.getElementById('quizFeedback').classList.add('hidden');
    document.getElementById('btnSiguiente').classList.add('hidden');
    document.getElementById('btnVerificar').classList.remove('hidden');
    document.getElementById('btnVerificar').disabled = true;
    grid.innerHTML = '';
    grid.querySelectorAll('button').forEach(function(b) {
        b.classList.remove('border-indigo-600', 'bg-indigo-100');
        b.classList.add('border-gray-200');
    });
    quizState.seleccion = null;
    quizState.intentos = 0;
    preg.opciones.forEach(function(opt) {
        const btn = document.createElement('button');
        btn.className = "text-left px-4 py-3 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all w-full font-medium text-gray-700";
        btn.innerText = opt;
        btn.onclick = function() {
            grid.querySelectorAll('button').forEach(function(b) {
                b.classList.remove('border-indigo-600', 'bg-indigo-100');
                b.classList.add('border-gray-200');
            });
            btn.classList.remove('border-gray-200');
            btn.classList.add('border-indigo-600', 'bg-indigo-100');
            quizState.seleccion = opt;
            document.getElementById('btnVerificar').disabled = false;
        };
        grid.appendChild(btn);
    });
}

window.verificarMISO = function() {
    const preg = bancoPreguntas[quizState.modulo][quizState.indice];
    const feedback = document.getElementById('quizFeedback');
    
    if (quizState.seleccion === preg.correcta) {
        feedback.className = "mt-4 p-4 rounded-xl border-2 border-green-300 bg-green-50 text-green-800";
        feedback.innerHTML = "<strong>✅ ¡Respuesta correcta!</strong><br><span class='text-sm opacity-80'>Precisión validada.</span>";
        feedback.classList.remove('hidden');
        document.getElementById('btnVerificar').classList.add('hidden');
        document.getElementById('btnSiguiente').classList.remove('hidden');
    } else {
        feedback.className = "mt-4 p-4 rounded-xl border-2 border-amber-300 bg-amber-50 text-amber-800";
        feedback.innerHTML = "<strong>⚠️ Desviación detectada</strong><br>" + consejosMISO[quizState.modulo];
        feedback.classList.remove('hidden');
    }
};

window.siguientePreguntaMISO = function() {
    quizState.indice = (quizState.indice + 1) % bancoPreguntas[quizState.modulo].length;
    cargarPreguntaMISO();
};

window.cerrarQuizMISO = function() {
    document.getElementById('misoQuizModal').classList.add('hidden');
};

// ============================================
// MENÚ MOBILE Y BÚSQUEDA
// ============================================

window.toggleMobileMenu = function() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
            // Forzar reflujo para que la transición funcione
            mobileMenu.offsetHeight;
            mobileMenu.classList.remove('-translate-y-4', 'opacity-0');
        } else {
            mobileMenu.classList.add('-translate-y-4', 'opacity-0');
            // Esperar a que termine la animación para ocultar
            setTimeout(() => {
                if (mobileMenu.classList.contains('opacity-0')) {
                    mobileMenu.classList.add('hidden');
                }
            }, 300);
        }
    }
};


// ============================================
// PWA: GESTIÓN DE INSTALACIÓN Y ESTADO
// ============================================
let deferredPrompt;

// Detección de iOS para mostrar instrucciones personalizadas
const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

const isStandalone = () => {
    return (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone);
};

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('installAppBtn');
    if (installBtn) {
        installBtn.classList.remove('hidden');
        installBtn.classList.add('animate-spring-in'); // Aprovechamos tus animaciones existentes
    }
});

// Si es iOS y no está instalada, podríamos mostrar un mensaje sutil
if (isIOS() && !isStandalone()) {
    console.log('[MISO] Sugerencia: Para instalar en iOS, usa "Compartir" -> "Añadir a pantalla de inicio"');
    // Aquí podrías activar un banner específico para iOS
}

window.addEventListener('online', () => {
    document.body.classList.remove('offline-mode');
    console.log('[MISO] Conexión restaurada');
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline-mode');
    console.log('[MISO] Operando en modo offline');
});

// ============================================
// EVENT LISTENERS - v4.0.0
// ============================================

function initApp() {
    // --- SISTEMA DE NOTIFICACIONES MISO ---
    window.showMisoAlert = function(title, message, type = 'success') {
        const modal = document.getElementById('misoNotificationModal');
        const iconContainer = document.getElementById('notification-icon');
        const titleEl = document.getElementById('notification-title');
        const messageEl = document.getElementById('notification-message');

        if (!modal || !iconContainer || !titleEl || !messageEl) return;

        titleEl.innerText = title;
        messageEl.innerText = message;

        // Reset y aplicar estilos según el tipo
        iconContainer.className = 'w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl text-2xl';
        if (type === 'success') {
            iconContainer.classList.add('bg-green-100', 'text-green-600');
            iconContainer.innerHTML = '✅';
        } else if (type === 'error') {
            iconContainer.classList.add('bg-red-100', 'text-red-600');
            iconContainer.innerHTML = '❌';
        } else {
            iconContainer.classList.add('bg-indigo-100', 'text-indigo-600');
            iconContainer.innerHTML = '💡';
        }
        modal.classList.remove('hidden');
    };

    // --- GESTIÓN DE ESTADO DE SESIÓN ---
    function updateAuthUI(session) {
        const btnDesktop = document.getElementById('auth-btn-desktop');
        const btnMobile = document.getElementById('auth-btn-mobile');
        const textMobile = document.getElementById('auth-text-mobile');

        if (session) {
            // Usuario autenticado: Mostrar "Salir"
            if (btnDesktop) {
                btnDesktop.innerText = 'Salir';
                btnDesktop.dataset.action = 'auth:logout';
            }
            if (btnMobile) {
                btnMobile.dataset.action = 'auth:logout;close:mobile-menu';
                if (textMobile) textMobile.innerText = 'Salir';
            }
        } else {
            // Sin sesión: Mostrar "Ingresar / Registro"
            if (btnDesktop) {
                btnDesktop.innerText = 'Ingresar / Registro';
                btnDesktop.dataset.action = 'modal:login';
            }
            if (btnMobile) {
                btnMobile.dataset.action = 'modal:login;close:mobile-menu';
                if (textMobile) textMobile.innerText = 'Mi Cuenta MISO';
            }
        }
    }

    if (supabaseClient) {
        // Suscribirse a cambios de sesión (login, logout, token refresh)
        supabaseClient.auth.onAuthStateChange((event, session) => {
            console.log('[MISO] Cambio de sesión:', event);
            updateAuthUI(session);
        });
        // Verificación inicial del estado
        supabaseClient.auth.getSession().then(({ data: { session } }) => updateAuthUI(session));
    }

    // Inicializar navegación
    window.switchView('view-home');
    
    // Delegación de eventos para mejor rendimiento
    document.addEventListener('click', async function(e) {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        
        const action = target.dataset.action;
        const module = target.dataset.module;
        const formula = target.dataset.formula;
        
        if (action.startsWith('view:')) {
            const viewName = action.replace('view:', '').split(';')[0];
            window.switchView(viewName);
            
            
            if (action.includes('close:mobile-menu')) {
                window.toggleMobileMenu();
            }
        } else if (action.startsWith('quiz:')) {
            const quizAction = action.replace('quiz:', '');
            if (quizAction === 'start' && module) {
                console.log('Quiz start detectado, module:', module);
                window.abrirQuizMISO(module);
            } else if (quizAction === 'close') {
                window.cerrarQuizMISO();
            } else if (quizAction === 'verify') {
                window.verificarMISO();
            } else if (quizAction === 'next') {
                window.siguientePreguntaMISO();
            }
        } else if (action.startsWith('copy:') && formula) {
            window.copyFormula(formula);
        } else if (action.startsWith('toggle:')) {
            const toggleAction = action.replace('toggle:', '');
            if (toggleAction === 'mobile-menu') {
                window.toggleMobileMenu();
            }
        } else if (action === 'bcg:open') {
            if (window.innerWidth <= 768) {
                const cell = target;
                const reveal = cell.querySelector('.bcg-reveal');
                const title = reveal?.querySelector('.reveal-title')?.textContent || '';
                const text = reveal?.querySelector('.reveal-text')?.textContent || '';
                const subtitle = cell.querySelector('p')?.textContent || '';
                
                document.getElementById('bcg-modal-title').innerText = title;
                document.getElementById('bcg-modal-subtitle').innerText = subtitle;
                document.getElementById('bcg-modal-content').innerText = text;
                document.getElementById('bcg-modal').classList.remove('hidden');
            }
        } else if (action === 'bcg:close') {
            document.getElementById('bcg-modal').classList.add('hidden');
        } else if (action.includes('modal:login')) {
            document.getElementById('misoAuthModal').classList.remove('hidden');
            if (action.includes('close:mobile-menu')) window.toggleMobileMenu();
        } else if (action === 'modal:close-auth') {
            document.getElementById('misoAuthModal').classList.add('hidden');
        } else if (action.includes('auth:logout')) {
            if (supabaseClient) {
                await supabaseClient.auth.signOut();
                window.showMisoAlert('Sesión Cerrada', 'Has salido de tu cuenta correctamente.', 'info');
            }
            if (action.includes('close:mobile-menu')) window.toggleMobileMenu();
        }
    });

    // Lógica para alternar entre Login y Registro
    const toggleBtn = document.getElementById('toggleAuthMode');
    const regFields = document.getElementById('registerFields');
    const modalTitle = document.getElementById('authModalTitle');
    const submitBtn = document.getElementById('authSubmitBtn');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isLogin = regFields.classList.contains('hidden');
            regFields.classList.toggle('hidden');
            modalTitle.innerText = isLogin ? 'Crear cuenta en MISO' : 'Ingresar a MISO';
            submitBtn.innerText = isLogin ? 'Registrarse ahora' : 'Iniciar Sesión';
            toggleBtn.innerText = isLogin ? '¿Ya tienes cuenta? Ingresa aquí' : '¿No tienes cuenta? Regístrate aquí';
        });
    }

    // Manejo de Autenticación con Supabase (handleAuth)
    const authForm = document.getElementById('authForm');
    if (authForm && supabaseClient) {
        authForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('authSubmitBtn');
            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-password').value;
            const isRegistration = !document.getElementById('registerFields').classList.contains('hidden');

            submitBtn.disabled = true;
            submitBtn.innerText = isRegistration ? 'Registrando...' : 'Ingresando...';

            try {
                if (isRegistration) {
                    const nombre = document.getElementById('reg-nombre').value;
                    const ccNit = document.getElementById('reg-id').value;
                    const whatsapp = document.getElementById('reg-whatsapp').value;

                    // 1. Crear usuario en el sistema de autenticación
                    const { data: authData, error: authError } = await supabaseClient.auth.signUp({ email, password });
                    if (authError) throw authError;

                    // 2. Guardar datos adicionales en la tabla 'profiles' que creamos con SQL
                    if (authData.user) {
                        const { error: profileError } = await supabaseClient
                            .from('profiles')
                            .insert([{ 
                                id: authData.user.id, 
                                nombre_razon_social: nombre, 
                                cc_nit: ccNit, 
                                whatsapp: whatsapp, 
                                email: email 
                            }]);
                        if (profileError) throw profileError;
                        if (authData.session) updateAuthUI(authData.session);
                    }
                    window.showMisoAlert('¡Registro Exitoso!', 'Por favor revisa tu correo para confirmar tu cuenta.');
                } else {
                    const { data, error: loginError } = await supabaseClient.auth.signInWithPassword({ email, password });
                    if (loginError) throw loginError;
                    if (data?.session) updateAuthUI(data.session);
                    window.showMisoAlert('¡Bienvenido!', 'Ingreso exitoso. Hola de nuevo, Chef.', 'success');
                }
                document.getElementById('misoAuthModal').classList.add('hidden');
            } catch (err) {
                window.showMisoAlert('Error de Autenticación', err.message, 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = isRegistration ? 'Registrarse ahora' : 'Iniciar Sesión';
            }
        });
    }
    document.addEventListener('click', function(e) {
        const target = e.target.closest('[data-module]');
        if (!target) return;
        
        const moduleNum = parseInt(target.dataset.module, 10);
        if (!isNaN(moduleNum)) {
            window.showModule(moduleNum);
        }
    });
    
    const installBtn = document.getElementById('installAppBtn');
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`[MISO] Usuario decidió instalar: ${outcome}`);
            if (outcome === 'accepted') {
                installBtn.classList.add('hidden');
            }
            deferredPrompt = null;
        });
    }
    
    document.querySelectorAll('[data-action="quiz:start"]').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            var module = this.getAttribute('data-module');
            console.log('Quiz button click directo, module:', module);
            window.abrirQuizMISO(module);
        });
    });
    
    if (document.getElementById('view-costeo') && !document.getElementById('view-costeo').classList.contains('hidden')) {
        initCosteador();
    }
    
    window.addEventListener('hashchange', function() {
        if (window.location.hash === '#costeo' || document.querySelector('[data-action="view:costeo"]')?.classList.contains('active')) {
            setTimeout(initCosteador, 100);
        }
    });
}

// Check if DOM is already ready, otherwise wait for DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM is already ready (interactive or complete), run immediately
    initApp();
}

// ============================================
// SERVICE WORKER REGISTRATION - v4.0.0
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js?v=4.0.0')
            .then(function(registration) {
                console.log('[MISO] Service Worker registrado:', registration.scope);
            })
            .catch(function(error) {
                console.log('[MISO] Service Worker error:', error);
            });
    });
}

// ============================================
// COSTEADOR PROFESIONAL MISO
// ============================================

window.addInsumoFila = function(data = null) {
    const tbody = document.getElementById('insumos-body');
    const rowId = Date.now();
    const row = document.createElement('tr');
    row.className = 'border-b border-gray-100 hover:bg-gray-50 transition-colors';
    row.dataset.rowId = rowId;
    row.innerHTML = `
        <td class="py-3">
            <input type="text" class="insumo-nombre w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="Nombre del insumo" value="${data?.nombre || ''}">
        </td>
        <td class="py-3">
            <input type="number" class="insumo-cantidad w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="0" min="0" step="0.01" value="${data?.cantidad || ''}">
        </td>
        <td class="py-3">
            <select class="insumo-unidad w-full px-3 py-2 border border-gray-200 rounded-lg">
                <option value="g" ${data?.unidad === 'g' ? 'selected' : ''}>g</option>
                <option value="kg" ${data?.unidad === 'kg' ? 'selected' : ''}>kg</option>
                <option value="ml" ${data?.unidad === 'ml' ? 'selected' : ''}>ml</option>
                <option value="L" ${data?.unidad === 'L' ? 'selected' : ''}>L</option>
                <option value="und" ${data?.unidad === 'und' ? 'selected' : ''}>und</option>
            </select>
        </td>
        <td class="py-3">
            <input type="number" class="insumo-costo w-full px-3 py-2 border border-gray-200 rounded-lg" placeholder="$0" min="0" step="0.01" value="${data?.costoUnitario || ''}">
        </td>
        <td class="py-3">
            <span class="insumo-subtotal font-semibold text-gray-700">$0.00</span>
        </td>
        <td class="py-3">
            <button class="text-red-500 hover:text-red-700 p-1" onclick="removeInsumoFila(${rowId})">✕</button>
        </td>
    `;
    tbody.appendChild(row);
    row.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', calcularRentabilidad);
    });
    calcularRentabilidad();
    return row;
};

window.removeInsumoFila = function(rowId) {
    const row = document.querySelector('tr[data-row-id="' + rowId + '"]');
    if (row) row.remove();
    calcularRentabilidad();
};

function calcularRentabilidad() {
    let costoTotal = 0;
    
    document.querySelectorAll('#insumos-body tr').forEach(function(row) {
        const cantidad = parseFloat(row.querySelector('.insumo-cantidad')?.value) || 0;
        const costoUnitario = parseFloat(row.querySelector('.insumo-costo')?.value) || 0;
        
        const subtotal = cantidad * costoUnitario;
        if (row.querySelector('.insumo-subtotal')) {
            row.querySelector('.insumo-subtotal').textContent = formatCurrency(subtotal);
        }
        costoTotal += subtotal;
    });
    
    const margenError = parseFloat(document.getElementById('margen-error')?.value) || 0;
    const desiredMargin = parseFloat(document.getElementById('desired-margin')?.value) || 70;
    
    // Check if options are enabled
    const impuestoEnabled = document.getElementById('impuesto-enabled')?.checked ?? true;
    const utilidadEnabled = document.getElementById('utilidad-enabled')?.checked ?? true;
    
    const costoConError = costoTotal * (1 + margenError / 100);
    
    // Calculate base price based on margin only (without 8% tax)
    let precioBase;
    if (utilidadEnabled && desiredMargin > 0) {
        precioBase = costoConError / (1 - desiredMargin / 100);
    } else if (utilidadEnabled) {
        // If margin is 0 but enabled, use cost as base
        precioBase = costoConError;
    } else {
        // If utility disabled, use a default 30% margin
        precioBase = costoConError / 0.7;
    }
    
    // Calculate final price with or without impuesto
    let precioFinal;
    if (impuestoEnabled) {
        precioFinal = precioBase * 1.08;
    } else {
        precioFinal = precioBase;
    }
    
    const impuesto = precioFinal - precioBase;
    
    document.getElementById('cti-display').textContent = formatCurrency(costoTotal);
    document.getElementById('margen-error-display').textContent = '+' + formatCurrency(costoTotal * margenError / 100);
    document.getElementById('costo-tecnico-display').textContent = formatCurrency(costoConError);
    
    if (utilidadEnabled) {
        const utilidadValor = precioBase * desiredMargin / 100;
        document.getElementById('desired-margin-display').textContent = formatCurrency(utilidadValor) + ' (' + desiredMargin + '%)';
    } else {
        document.getElementById('desired-margin-display').textContent = 'Desactivado';
    }
    
    document.getElementById('precio-sin-impuesto-display').textContent = formatCurrency(precioBase);
    document.getElementById('impuesto-display').textContent = impuestoEnabled ? formatCurrency(impuesto) : '$0.00';
    document.getElementById('precio-final-input').value = precioFinal.toFixed(2);
}

function formatCurrency(value) {
    return '$' + value.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image: ' + src));
        img.src = src;
    });
}

window.guardarPDF = async function() {
    console.log('guardarPDF v4.0.0 - title test:', 'MISO - COSTEO PROFESIONAL');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const cfg = PLANTILLA_PRODUCTOS;

    try {
        const img = await loadImage(cfg.backgroundImage);
        doc.addImage(img, 'PNG', 0, 0, cfg.layout.pageWidth, cfg.layout.pageHeight);
    } catch (e) {
        console.warn('Plantilla PDF Products background no encontrada, omitiendo.');
    }

    const productName = document.getElementById('product-name')?.value || 'Receta MISO';
    const desiredMargin = parseFloat(document.getElementById('desired-margin')?.value) || 70;
    const margenError = parseFloat(document.getElementById('margen-error')?.value) || 0;

    let costoTotal = 0;
    let insumosData = [];
    document.querySelectorAll('#insumos-body tr').forEach(function(row) {
        const nombre = row.querySelector('.insumo-nombre')?.value;
        const cantidad = parseFloat(row.querySelector('.insumo-cantidad')?.value) || 0;
        const unidad = row.querySelector('.insumo-unidad')?.value;
        const costoUnitario = parseFloat(row.querySelector('.insumo-costo')?.value) || 0;
        if (nombre) {
            const subtotal = cantidad * costoUnitario;
            costoTotal += subtotal;
            insumosData.push({ nombre, cantidad, unidad, costoUnitario, subtotal });
        }
    });

    const costoMargenError = costoTotal * (margenError / 100);
    const costoTecnico = costoTotal + costoMargenError;
     const precioBase = costoTecnico / (1 - desiredMargin / 100);
    const impuesto = precioBase * 0.08;
    const precioFinal = precioBase + impuesto;
    const utilidad = precioBase * desiredMargin / 100;

    let y = cfg.layout.marginTop;

    try {
      doc.addImage('./assets/images/logo_miso.png', 'PNG', 85, 5, 40, 40);
      y += cfg.layout.afterLogo;
    } catch(e) {
      y += cfg.layout.afterLogoFallback;
    }

    doc.setFontSize(cfg.fonts.title);
    doc.setTextColor(...cfg.colors.indigo);
    doc.setFont('helvetica', 'bold');
    doc.text('MISO - COSTEO PROFESIONAL', 105, y, { align: 'center' });

    y += cfg.layout.titleSpacing;
    doc.setFontSize(cfg.fonts.label);
    doc.setTextColor(...cfg.colors.gris);
    doc.setFont('helvetica', 'normal');
    doc.text('Producto: ' + productName, cfg.layout.marginLeft, y);
    y += cfg.layout.lineSpacing;
    doc.text('Margen Deseado: ' + desiredMargin + '%', cfg.layout.marginLeft, y);
    y += cfg.layout.lineSpacing;
    doc.text('Margen de Error: ' + margenError + '%', cfg.layout.marginLeft, y);

    y += cfg.layout.afterHeaderBlock;
    doc.setDrawColor(...cfg.colors.indigo);
    doc.setLineWidth(0.5);
    doc.line(cfg.layout.marginLeft, y, cfg.layout.marginRight, y);

    y += cfg.layout.afterLine;
    doc.setFontSize(cfg.fonts.sectionTitle);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...cfg.colors.indigo);
    doc.text('TABLA DE INSUMOS', cfg.layout.marginLeft, y);

    y += 8;
    doc.setFillColor(243, 244, 246);
    doc.rect(cfg.layout.marginLeft, y - 5, 170, 8, 'F');
    doc.setFontSize(cfg.fonts.tableHeader);
    doc.setTextColor(...cfg.colors.gris);
    doc.setFont('helvetica', 'bold');
    cfg.table.columns.forEach(col => {
        doc.text(col.label, col.x, y);
    });

    y += cfg.layout.tableHeaderHeight;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(cfg.fonts.tableRow);
    insumosData.forEach(function(ins) {
        doc.text(ins.nombre.substring(0, 25), cfg.table.columns[0].x, y);
        doc.text(ins.cantidad.toString(), cfg.table.columns[1].x, y);
        doc.text(ins.unidad, cfg.table.columns[2].x, y);
        doc.text('$' + ins.costoUnitario.toFixed(2), cfg.table.columns[3].x, y);
        doc.text('$' + ins.subtotal.toFixed(2), cfg.table.columns[4].x, y);
        y += cfg.layout.tableRowHeight;
    });

    y += cfg.layout.afterTable;
    doc.setDrawColor(...cfg.colors.grisClaro);
    doc.line(cfg.layout.marginLeft, y, cfg.layout.marginRight, y);

    y += cfg.layout.afterLine;
    doc.setFontSize(cfg.fonts.sectionTitle);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...cfg.colors.indigo);
    doc.text('RESUMEN DE COSTOS', cfg.layout.marginLeft, y);

    y += 8;
    doc.setFontSize(cfg.fonts.summaryLabel);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cfg.colors.gris);
    doc.text('Costo Total Insumos:', cfg.layout.marginLeft, y);
    doc.text('$' + costoTotal.toFixed(2), 80, y);
    y += cfg.layout.betweenSummaryItems;
    doc.text('Margen de Error (' + margenError + '%):', cfg.layout.marginLeft, y);
    doc.text('+$' + costoMargenError.toFixed(2), 80, y);
    y += cfg.layout.betweenSummaryItems;
    doc.setFont('helvetica', 'bold');
    doc.text('Costo Técnico:', cfg.layout.marginLeft, y);
    doc.text('$' + costoTecnico.toFixed(2), 80, y);

    y += cfg.layout.afterCostSummary;
    doc.setDrawColor(...cfg.colors.grisClaro);
    doc.line(cfg.layout.marginLeft, y, cfg.layout.marginRight, y);

    y += cfg.layout.afterLine;
    doc.setFontSize(cfg.fonts.sectionTitle);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...cfg.colors.indigo);
    doc.text('RESUMEN DE RENTABILIDAD', cfg.layout.marginLeft, y);

    y += 8;
    doc.setFontSize(cfg.fonts.summaryLabel);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cfg.colors.gris);
    doc.text('Utilidad (' + desiredMargin + '%):', cfg.layout.marginLeft, y);
    doc.text('$' + utilidad.toFixed(2), 80, y);
    y += cfg.layout.betweenSummaryItems;
    doc.text('Precio sin Impoconsumo:', cfg.layout.marginLeft, y);
    doc.text('$' + precioBase.toFixed(2), 80, y);
    y += cfg.layout.betweenSummaryItems;
    doc.text('Impuesto (8%):', cfg.layout.marginLeft, y);
    doc.text('$' + impuesto.toFixed(2), 80, y);
    y += cfg.layout.beforeFinalPrice;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(cfg.fonts.finalPrice);
    doc.setTextColor(...cfg.colors.indigo);
    doc.text('PRECIO DE VENTA:', cfg.layout.marginLeft, y);
    doc.text('$' + precioFinal.toFixed(2), 80, y);

    doc.setFontSize(cfg.fonts.footer);
    doc.setTextColor(156, 163, 175);
    doc.setFont('helvetica', 'normal');
    doc.text('MISO - Management & Intelligence Systems Optimization | Powered by IRIS', 105, 285, { align: 'center' });
    doc.text('Generado: ' + new Date().toLocaleDateString('es-CO'), 105, 290, { align: 'center' });

    const fileName = productName.replace(/[^a-z0-9]/gi, '_') + '_MISO.pdf';
    doc.save(fileName);
};

window.guardarRecetaPDF = async function() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const cfg = PLANTILLA_INSUMOS;

    try {
        const img = await loadImage(cfg.backgroundImage);
        doc.addImage(img, 'PNG', 0, 0, cfg.layout.pageWidth, cfg.layout.pageHeight);
    } catch (e) {
        console.warn('Plantilla PDF Insumos background no encontrada, omitiendo.');
    }

    const recipeName = document.getElementById('recipe-name')?.value || 'Receta MISO';
    const recipeYield = parseFloat(document.getElementById('recipe-yield')?.value) || 1000;
    const recipeUnit = document.getElementById('recipe-unit')?.value || 'g';
    const portionSize = parseFloat(document.getElementById('recipe-portion-size')?.value) || 0;
    const porciones = portionSize > 0 ? Math.floor(recipeYield / portionSize) : 0;

    let costoTotal = 0;
    let insumosData = [];
    document.querySelectorAll('#recipe-insumos-body tr').forEach(function(row) {
        const nombre = row.querySelector('.recipe-insumo-nombre')?.value;
        const cantidad = parseFloat(row.querySelector('.recipe-insumo-cantidad')?.value) || 0;
        const unidad = row.querySelector('.recipe-insumo-unidad')?.value || 'g';
        const costoUnitario = parseFloat(row.querySelector('.recipe-insumo-costo')?.value) || 0;

        if (nombre) {
            let cantidadEnBase = cantidad;
            if (unidad === 'kg') cantidadEnBase = cantidad * 1000;
            if (unidad === 'L') cantidadEnBase = cantidad * 1000;

            const subtotal = cantidadEnBase * costoUnitario;
            costoTotal += subtotal;
            insumosData.push({ nombre, cantidad, unidad, costoUnitario, subtotal, cantidadEnBase });
        }
    });

    const costoUnitario = recipeYield > 0 ? costoTotal / recipeYield : 0;

    let y = cfg.layout.marginTop;

    try {
      doc.addImage('./assets/images/logo_miso.png', 'PNG', 85, 5, 40, 40);
      y += cfg.layout.afterLogo;
    } catch(e) {
      y += cfg.layout.afterLogoFallback;
    }

    y += 15;
    doc.setFontSize(cfg.fonts.title);
    doc.setTextColor(...cfg.colors.gris);
    doc.setFont('helvetica', 'normal');
    doc.text('Receta: ' + recipeName, cfg.layout.marginLeft, y);
    y += cfg.layout.lineSpacing;
    doc.text('Rendimiento: ' + recipeYield.toLocaleString() + ' ' + recipeUnit, cfg.layout.marginLeft, y);
    y += cfg.layout.lineSpacing;
    doc.text('Tamaño por porción: ' + portionSize + ' ' + recipeUnit, cfg.layout.marginLeft, y);
    y += cfg.layout.lineSpacing;
    doc.text('Porciones estimadas: ' + porciones, cfg.layout.marginLeft, y);

    y += cfg.layout.afterHeaderBlock;
    doc.setDrawColor(...cfg.colors.indigo);
    doc.setLineWidth(0.5);
    doc.line(cfg.layout.marginLeft, y, cfg.layout.marginRight, y);

    y += cfg.layout.afterLine;
    doc.setFontSize(cfg.fonts.sectionTitle);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...cfg.colors.indigo);
    doc.text('TABLA DE INSUMOS', cfg.layout.marginLeft, y);

    y += 8;
    doc.setFillColor(243, 244, 246);
    doc.rect(cfg.layout.marginLeft, y - 5, 170, 8, 'F');
    doc.setFontSize(cfg.fonts.tableHeader);
    doc.setTextColor(...cfg.colors.gris);
    doc.setFont('helvetica', 'bold');
    cfg.table.columns.forEach(col => {
        doc.text(col.label, col.x, y);
    });

    y += cfg.layout.tableHeaderHeight;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(cfg.fonts.tableRow);
    insumosData.forEach(function(ins) {
        doc.text(ins.nombre.substring(0, 25), cfg.table.columns[0].x, y);
        doc.text(ins.cantidad.toString(), cfg.table.columns[1].x, y);
        doc.text(ins.unidad, cfg.table.columns[2].x, y);
        doc.text('$' + ins.costoUnitario.toFixed(2), cfg.table.columns[3].x, y);
        doc.text('$' + ins.subtotal.toFixed(2), cfg.table.columns[4].x, y);
        y += cfg.layout.tableRowHeight;
    });

    y += cfg.layout.afterTable;
    doc.setDrawColor(...cfg.colors.grisClaro);
    doc.line(cfg.layout.marginLeft, y, cfg.layout.marginRight, y);

    y += cfg.layout.afterLine;
    doc.setFontSize(cfg.fonts.sectionTitle);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...cfg.colors.indigo);
    doc.text('RESUMEN DE COSTOS', cfg.layout.marginLeft, y);

    y += 8;
    doc.setFontSize(cfg.fonts.summaryLabel);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...cfg.colors.gris);
    doc.text('Costo Total Insumos:', cfg.layout.marginLeft, y);
    doc.text('$' + costoTotal.toFixed(2), 80, y);
    y += cfg.layout.betweenSummaryItems;
    doc.text('Rendimiento:', cfg.layout.marginLeft, y);
    doc.text(recipeYield.toLocaleString() + ' ' + recipeUnit, 80, y);
    y += cfg.layout.beforeFinalPrice;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(cfg.fonts.finalPrice);
    doc.setTextColor(...cfg.colors.indigo);
    doc.text('COSTO POR ' + recipeUnit.toUpperCase() + ':', cfg.layout.marginLeft, y);
    doc.text('$' + costoUnitario.toFixed(2), 80, y);

    if (porciones > 0) {
        y += cfg.layout.betweenSummaryItems;
        doc.setFontSize(cfg.fonts.summaryLabel);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...cfg.colors.gris);
        doc.text('Costo por porción:', cfg.layout.marginLeft, y);
        doc.text('$' + (costoUnitario * portionSize).toFixed(2), 80, y);
    }

    doc.setFontSize(cfg.fonts.footer);
    doc.setTextColor(156, 163, 175);
    doc.setFont('helvetica', 'normal');
    doc.text('MISO - Management & Intelligence Systems Optimization | Powered by IRIS', 105, 285, { align: 'center' });
    doc.text('Generado: ' + new Date().toLocaleDateString('es-CO'), 105, 290, { align: 'center' });

    const fileName = recipeName.replace(/[^a-z0-9]/gi, '_') + '_RECETA_MISO.pdf';
    doc.save(fileName);
};

// Tab switching for Costeo
window.switchCosteoTab = function(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(function(content) {
        content.classList.add('hidden');
    });
    
    // Remove active from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.classList.remove('text-indigo-600', 'border-b-2', 'border-indigo-600', 'active');
        btn.classList.add('text-gray-500');
    });
    
    // Show selected tab content
    document.getElementById('tab-content-' + tabName).classList.remove('hidden');
    
    // Add active to selected tab button
    var activeBtn = document.getElementById('tab-' + tabName);
    if (activeBtn) {
        activeBtn.classList.add('text-indigo-600', 'border-b-2', 'border-indigo-600', 'active');
        activeBtn.classList.remove('text-gray-500');
    }
};

// Calculate recipe/insumos elaborados cost
function calcularReceta() {
    let costoTotal = 0;
    let cantidadBase = 0;
    
    document.querySelectorAll('#recipe-insumos-body tr').forEach(function(row) {
        const cantidad = parseFloat(row.querySelector('.recipe-insumo-cantidad')?.value) || 0;
        const unidad = row.querySelector('.recipe-insumo-unidad')?.value || 'g';
        const costoUnitario = parseFloat(row.querySelector('.recipe-insumo-costo')?.value) || 0;
        
        // Convert to base unit
        let cantidadEnBase = cantidad;
        if (unidad === 'kg') cantidadEnBase = cantidad * 1000;
        if (unidad === 'L') cantidadEnBase = cantidad * 1000;
        
        const subtotal = cantidadEnBase * costoUnitario;
        if (row.querySelector('.recipe-insumo-subtotal')) {
            row.querySelector('.recipe-insumo-subtotal').textContent = formatCurrency(subtotal);
        }
        costoTotal += subtotal;
        cantidadBase += cantidadEnBase;
    });
    
    const yieldValue = parseFloat(document.getElementById('recipe-yield')?.value) || 1000;
    const costoUnitario = cantidadBase > 0 ? costoTotal / yieldValue : 0;
    
    document.getElementById('recipe-cti-display').textContent = formatCurrency(costoTotal);
    document.getElementById('recipe-costo-unitario-display').textContent = formatCurrency(costoUnitario);
    document.getElementById('recipe-yield-display').textContent = yieldValue.toLocaleString();
    
    // Calculate portions
    var portionSize = parseFloat(document.getElementById('recipe-portion-size')?.value) || 0;
    var porciones = 0;
    if (portionSize > 0 && yieldValue > 0) {
        porciones = Math.floor(yieldValue / portionSize);
        document.getElementById('recipe-porciones-display').textContent = porciones.toLocaleString();
    } else {
        document.getElementById('recipe-porciones-display').textContent = '-';
    }
}

// Add recipe insumo row
window.addRecetaInsumoFila = function() {
    var tbody = document.getElementById('recipe-insumos-body');
    if (!tbody) return;
    
    var tr = document.createElement('tr');
    tr.className = 'border-b border-gray-100';
    tr.innerHTML = 
        '<td><input type="text" class="recipe-insumo-nombre w-full px-2 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Nombre del insumo"></td>' +
        '<td><input type="number" class="recipe-insumo-cantidad w-full px-2 py-2 border border-gray-200 rounded-lg text-sm" placeholder="0" step="0.01"></td>' +
        '<td>' +
        '<select class="recipe-insumo-unidad w-full px-2 py-2 border border-gray-200 rounded-lg text-sm">' +
            '<option value="g">g</option>' +
            '<option value="kg">kg</option>' +
            '<option value="ml">ml</option>' +
            '<option value="L">L</option>' +
        '</select>' +
        '</td>' +
        '<td><input type="number" class="recipe-insumo-costo w-full px-2 py-2 border border-gray-200 rounded-lg text-sm" placeholder="$0" step="1"></td>' +
        '<td class="recipe-insumo-subtotal text-sm font-medium">$0.00</td>' +
        '<td><button onclick="this.closest(\'tr\').remove(); calcularReceta();" class="text-red-500 hover:text-red-700 px-2">&times;</button></td>';
    
    tbody.appendChild(tr);
    
    // Add event listeners
    tr.querySelectorAll('input').forEach(function(input) {
        input.addEventListener('input', calcularReceta);
        input.addEventListener('change', calcularReceta);
    });
};

// Init recipe listeners
function initReceta() {
    var tbody = document.getElementById('recipe-insumos-body');
    if (tbody && tbody.querySelectorAll('tr').length <= 1) {
        window.addRecetaInsumoFila();
    }
    
    var btnAdd = document.getElementById('btn-add-recipe-insumo');
    if (btnAdd) btnAdd.addEventListener('click', window.addRecetaInsumoFila);
    
    var yieldInput = document.getElementById('recipe-yield');
    if (yieldInput) {
        yieldInput.addEventListener('input', calcularReceta);
        yieldInput.addEventListener('change', calcularReceta);
    }
    
    var portionInput = document.getElementById('recipe-portion-size');
    if (portionInput) {
        portionInput.addEventListener('input', calcularReceta);
        portionInput.addEventListener('change', calcularReceta);
    }
    
    var unitInput = document.getElementById('recipe-unit');
    if (unitInput) unitInput.addEventListener('change', calcularReceta);
    
    var btnSaveRecipe = document.getElementById('btn-save-recipe');
    if (btnSaveRecipe) btnSaveRecipe.addEventListener('click', window.guardarRecetaPDF);
}

function initCosteador() {
    const tbody = document.getElementById('insumos-body');
    if (tbody && tbody.querySelectorAll('tr').length <= 1) {
        window.addInsumoFila();
    }
    
    const btnAdd = document.getElementById('btn-add-insumo');
    if (btnAdd) btnAdd.addEventListener('click', function() { window.addInsumoFila(); });
    
    const margenInput = document.getElementById('margen-error');
    const margenValue = document.getElementById('margen-error-value');
    if (margenInput && margenValue) {
        margenInput.addEventListener('input', function() {
            margenValue.textContent = this.value + '%';
            document.getElementById('margen-error-pct').textContent = this.value;
            calcularRentabilidad();
        });
    }
    
    const targetInput = document.getElementById('desired-margin');
    if (targetInput) targetInput.addEventListener('input', calcularRentabilidad);
    
    const btnExport = document.getElementById('btn-guardar');
    if (btnExport) btnExport.addEventListener('click', window.guardarPDF);

    const precioInput = document.getElementById('precio-final-input');
    if (precioInput) {
        precioInput.addEventListener('input', function() {
            calcularRentabilidadPorPrecio();
        });
    }

    initReceta();
}

function calcularRentabilidadPorPrecio() {
    let costoTotal = 0;
    document.querySelectorAll('#insumos-body tr').forEach(function(row) {
        const cantidad = parseFloat(row.querySelector('.insumo-cantidad')?.value) || 0;
        const costoUnitario = parseFloat(row.querySelector('.insumo-costo')?.value) || 0;
        costoTotal += cantidad * costoUnitario;
    });
    
    const margenError = parseFloat(document.getElementById('margen-error')?.value) || 0;
    const costoConError = costoTotal * (1 + margenError / 100);
    
    const precioFinal = parseFloat(document.getElementById('precio-final-input')?.value) || 0;
    const precioBase = precioFinal / 1.08;
    
    // Calculate margin from price: margin = (precioBase - costoTecnico) / precioBase * 100
    const utilidad = precioBase - costoConError;
    const margenReal = costoConError > 0 ? (utilidad / precioBase) * 100 : 0;
    
    const impuesto = precioFinal - precioBase;
    
    document.getElementById('cti-display').textContent = formatCurrency(costoTotal);
    document.getElementById('margen-error-display').textContent = '+' + formatCurrency(costoTotal * margenError / 100);
    document.getElementById('costo-tecnico-display').textContent = formatCurrency(costoConError);
    document.getElementById('desired-margin-display').textContent = formatCurrency(utilidad) + ' (' + margenReal.toFixed(1) + '%)';
    document.getElementById('precio-sin-impuesto-display').textContent = formatCurrency(precioBase);
    document.getElementById('impuesto-display').textContent = formatCurrency(impuesto);
}
