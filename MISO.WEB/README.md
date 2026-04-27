# MISO - Management & Intelligence Systems Optimization 🍳📉

**MISO** es una herramienta inteligente de ingeniería de rentabilidad gastronómica diseñada para transformar la gestión financiera de restaurantes. Potenciada por el motor **IRIS** (*Insightful Restaurant Intelligence System*), la aplicación permite a chefs y empresarios dominar sus costos, optimizar márgenes y educarse en finanzas operativas.

## ✨ Características Principales

- **Costeador Profesional:** Cálculo técnico de insumos, elaborados (sub-recetas) y productos finales con soporte para el 8% de Impoconsumo en Colombia.
- **Módulos de Aprendizaje:** Sistema de entrenamiento interactivo con más de 100 preguntas especializadas en gestión de cocina.
- **Matriz BCG:** Análisis estratégico de menú para clasificar platos en categorías *Estrella, Vaca, Enigma y Perro*.
- **Offline-First (PWA):** Instalable en dispositivos móviles y funcional sin conexión a internet gracias a Service Workers e IndexedDB.
- **Exportación a PDF:** Generación de fichas técnicas profesionales con diseño personalizado.

## 🚀 Tecnologías Utilizadas

- **Frontend:** HTML5, Tailwind CSS (estética minimalista estilo Apple).
- **Persistencia Local:** [Dexie.js](https://dexie.org/) (IndexedDB) para almacenamiento persistente en el navegador.
- **Backend & Auth:** [Supabase](https://supabase.com/) (Autenticación nativa y perfiles de usuario).
- **Generación de Documentos:** [jsPDF](https://parall.ax/products/jspdf).
- **Motor de Cálculos:** MisoEngine (Lógica de negocio propia en JS).

## 🛠️ Configuración de la Base de Datos (Supabase)

Para que el sistema de registro funcione correctamente, se requiere una tabla `profiles` vinculada a la tabla `auth.users` de Supabase.

```sql
create table public.profiles (
  id uuid references auth.users not null primary key,
  nombre_razon_social text,
  cc_nit text,
  whatsapp text,
  email text,
  updated_at timestamp with time zone default now()
);

-- Habilitar RLS
alter table public.profiles enable row level security;

-- Políticas de seguridad
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can view their own profile." on public.profiles for select using (auth.uid() = id);
```

## 📦 Instalación

1. Clona este repositorio.
2. Configura tus credenciales de Supabase en `src/legacy/app.js`:
   ```javascript
   const SUPABASE_URL = 'TU_URL';
   const SUPABASE_ANON_KEY = 'TU_KEY_ANONIMA';
   ```
3. Abre `index.html` en un servidor local (Live Server recomendado).

## 🧠 Filosofía IRIS

> *"La inteligencia es el ingrediente que nunca puede faltar."*

MISO traduce la complejidad algorítmica de IRIS en una interfaz simple y poderosa, permitiendo que el éxito de un restaurante deje de ser un misterio y se convierta en una ciencia exacta.

---
© 2026 MISO - A Greenhole Insightful Joint Holdings project.