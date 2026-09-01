# Espacio ERA — Sitio Web, Reservas y Gestión Administrativa

Prototipo web para Espacio ERA, un centro deportivo de Villa Elisa que integra en una única experiencia el sitio institucional, la presentación de disciplinas y canchas, un flujo de reservas, contenidos públicos, tienda informativa y un panel administrativo completo.

El proyecto fue desarrollado inicialmente como un **prototipo frontend de alta fidelidad**, con el objetivo de validar arquitectura de información, experiencia de usuario, diseño responsive, navegación y flujos operativos antes de incorporar la infraestructura productiva.

---

## Descripción

La plataforma está pensada para centralizar las principales necesidades digitales del centro deportivo.

Desde el sitio público, una persona puede:

- conocer el club;
- explorar las disciplinas disponibles;
- consultar categorías, edades y horarios;
- conocer profesores responsables;
- contactar directamente a profesores por WhatsApp;
- consultar las canchas;
- seleccionar fechas y horarios;
- recorrer un flujo completo de reserva;
- leer noticias;
- consultar productos del club;
- explorar la galería;
- revisar preguntas frecuentes;
- acceder a información de contacto.

Desde el panel administrativo, el club puede gestionar visualmente:

- reservas;
- calendario;
- canchas;
- bloqueos de horarios;
- disciplinas;
- categorías deportivas;
- profesores;
- noticias;
- productos;
- galería;
- preguntas frecuentes;
- contenido institucional;
- usuarios;
- historial;
- configuración general.

> **Importante:** la versión actual funciona como prototipo frontend. Los datos, pagos, autenticación y operaciones administrativas se encuentran simulados mediante mocks y estado local. El panel administrativo no posee seguridad real, sus rutas pueden abrirse directamente y no deben utilizarse con datos sensibles ni en producción.

---

# Funcionalidades

## Sitio público

### Inicio

La página principal funciona como punto central de descubrimiento del club.

Incluye:

- Hero principal.
- CTA prioritario para reservar.
- Presentación institucional.
- Disciplinas destacadas.
- Canchas destacadas.
- Servicios e instalaciones.
- Últimas noticias.
- Productos destacados.
- Galería.
- Preguntas frecuentes.
- Información de contacto.
- Redes sociales.
- Acceso flotante a WhatsApp.

---

## Club

Sección institucional destinada a presentar:

- historia;
- identidad;
- instalaciones;
- servicios;
- imágenes;
- información general de la institución.

Ruta:

```text
/club
```

---

# Disciplinas

La sección de Disciplinas funciona como un catálogo de las actividades deportivas ofrecidas por el centro deportivo.

Actualmente incluye:

- Fútbol.
- Hockey.
- Vóley.

Ruta principal:

```text
/disciplinas
```

Detalle:

```text
/disciplinas/[slug]
```

Cada disciplina puede incluir:

- nombre;
- descripción;
- imágenes;
- categorías;
- edades;
- horarios;
- lugar de entrenamiento;
- requisitos;
- profesores responsables;
- responsables generales;
- contacto directo.

---

## Categorías deportivas

Cada disciplina puede tener múltiples categorías.

Ejemplo:

```text
Fútbol
├── Sub-11
├── Sub-13
├── Sub-15
├── Sub-17
└── Primera
```

Cada categoría puede definir independientemente:

- rango de edad;
- descripción;
- lugar;
- horarios;
- profesores;
- estado activo/inactivo;
- orden de presentación.

---

## Profesores

Los profesores están modelados como entidades independientes de las disciplinas.

Esto permite relaciones como:

```text
Juan Pérez
├── Fútbol Sub-15
├── Fútbol Sub-17
└── Hockey Primera
```

Un profesor puede estar asociado a:

- una disciplina;
- varias disciplinas;
- una categoría;
- múltiples categorías;
- una coordinación general.

La información del profesor puede incluir:

- nombre;
- fotografía;
- biografía breve;
- teléfono / WhatsApp;
- email;
- estado.

---

## Contacto directo con profesores

Desde una disciplina, el visitante puede contactar directamente al profesor responsable.

El sistema genera automáticamente mensajes contextualizados.

Ejemplo:

```text
Hola, quería consultar por la disciplina de Hockey del club.
```

O, cuando existe una categoría específica:

```text
Hola, quería consultar por Hockey Sub-15 del club.
```

El enlace utiliza el teléfono asociado al profesor y genera automáticamente la URL correspondiente de WhatsApp.

---

# Canchas

Listado de espacios deportivos disponibles.

Ruta:

```text
/canchas
```

Detalle:

```text
/canchas/[slug]
```

Cada cancha puede mostrar:

- fotografías;
- nombre;
- tipo;
- superficie;
- características;
- servicios;
- duración del turno;
- precio;
- estado;
- fecha;
- horarios disponibles.

Estados contemplados:

```text
Activa
Inactiva
En mantenimiento
```

---

# Reservas

El módulo de reservas representa uno de los flujos centrales del sitio.

Ruta:

```text
/reservas
```

El proceso está organizado como un wizard:

```text
Cancha
↓
Fecha
↓
Horario
↓
Retención temporal
↓
Datos del cliente
↓
Resumen
↓
Pago simulado
↓
Verificación
↓
Confirmación
```

Incluye:

- selección de cancha;
- selección de fecha;
- horarios disponibles;
- retención visual del turno;
- formulario de datos;
- resumen;
- total;
- seña;
- saldo pendiente;
- simulación de redirección a Mercado Pago;
- simulación de verificación de pago;
- código de reserva;
- contacto por WhatsApp.

Actualmente el pago es únicamente una simulación frontend.

---

# Noticias

Ruta:

```text
/noticias
```

Detalle:

```text
/noticias/[slug]
```

Permite mostrar:

- noticias publicadas;
- categorías;
- portada;
- resumen;
- contenido;
- fecha;
- noticias destacadas;
- artículos relacionados.

Los borradores administrativos no se muestran públicamente.

---

# Tienda

Ruta:

```text
/tienda
```

Detalle:

```text
/tienda/[slug]
```

La tienda funciona actualmente como un catálogo informativo.

Incluye:

- productos;
- imágenes;
- categoría;
- descripción;
- precio;
- variantes;
- disponibilidad;
- destacados;
- contacto por WhatsApp.

No existe carrito ni checkout.

El objetivo actual es dirigir las consultas comerciales a WhatsApp.

---

# Galería

Ruta:

```text
/galeria
```

Permite visualizar fotografías del club organizadas por categoría.

Los elementos pueden manejar:

- título;
- descripción;
- categoría;
- destacado;
- visibilidad;
- orden.

---

# Preguntas frecuentes

Ruta:

```text
/preguntas-frecuentes
```

Incluye:

- búsqueda;
- categorías;
- acordeones;
- preguntas destacadas;
- visibilidad;
- orden.

---

# Contacto

Ruta:

```text
/contacto
```

Centraliza:

- teléfono;
- WhatsApp;
- email;
- dirección;
- horarios;
- redes sociales;
- ubicación;
- formulario visual de contacto.

---

# Panel administrativo

El proyecto incluye un panel administrativo responsive.

Acceso:

```text
/admin/login
```

Dashboard:

```text
/admin
```

> La autenticación actual es únicamente visual/simulada. El formulario no valida credenciales reales y las rutas administrativas no están protegidas.

---

# Dashboard

El Dashboard concentra información operativa como:

- reservas del día;
- próximas reservas;
- turnos;
- pagos pendientes;
- señas;
- saldos;
- alertas;
- acciones rápidas.

---

# Administración de reservas

Rutas:

```text
/admin/reservas
/admin/reservas/calendario
/admin/reservas/[id]
/admin/reservas/nueva
/admin/reservas/recurrentes
```

Incluye:

- listado;
- búsqueda;
- filtros;
- estados;
- estados de pago;
- calendario;
- vista diaria/semanal;
- reservas manuales;
- reservas recurrentes;
- detalle;
- registro visual de pagos;
- contacto con el cliente.

---

# Administración de canchas

Rutas:

```text
/admin/canchas
/admin/canchas/[id]
```

Permite administrar:

- información general;
- imágenes;
- tipo;
- superficie;
- servicios;
- características;
- precio;
- duración;
- horarios semanales;
- estado;
- orden;
- bloqueos de fechas y horarios.

---

# Administración de disciplinas

Rutas:

```text
/admin/disciplinas
/admin/disciplinas/[id]
```

Permite administrar:

- nombre;
- descripción;
- imágenes;
- ubicación;
- requisitos;
- categorías;
- edades;
- horarios;
- profesores;
- responsables generales;
- visibilidad;
- destacados;
- orden.

---

# Administración de profesores

Rutas:

```text
/admin/profesores
/admin/profesores/[id]
```

Permite gestionar:

- nombre;
- fotografía;
- teléfono;
- WhatsApp;
- email;
- biografía;
- estado.

Las asignaciones se derivan de las disciplinas y categorías.

No se duplican relaciones dentro de la entidad Profesor.

---

# CMS administrativo

## Noticias

```text
/admin/noticias
```

Permite:

- crear;
- editar;
- publicar;
- guardar borradores;
- categorizar;
- destacar;
- editar portada;
- gestionar contenido.

---

## Productos

```text
/admin/productos
```

Permite administrar:

- nombre;
- descripción;
- precio;
- categoría;
- imágenes;
- variantes;
- disponibilidad;
- visibilidad;
- destacado.

---

## Galería

```text
/admin/galeria
```

Permite:

- administrar imágenes;
- categorizar;
- destacar;
- mostrar/ocultar;
- ordenar.

---

## FAQs

```text
/admin/faqs
```

Permite:

- crear;
- editar;
- categorizar;
- destacar;
- mostrar/ocultar;
- ordenar.

---

## Contenido institucional

```text
/admin/contenido
```

Centraliza contenido editable de:

```text
Inicio
Club
```

Incluyendo:

- Hero;
- presentación;
- historia;
- imágenes;
- canchas destacadas;
- productos destacados.

---

# Usuarios

Ruta:

```text
/admin/usuarios
```

Permite simular la administración de:

- administradores;
- empleados;
- roles;
- estado activo/inactivo.

No existe RBAC real en esta versión.

---

# Historial

Ruta:

```text
/admin/historial
```

Representa un registro visual de acciones administrativas.

Ejemplos:

```text
Administrador actualizó una cancha.

Empleado registró el saldo de una reserva.

Administrador publicó una noticia.

Administrador modificó una disciplina.
```

Actualmente utiliza datos mock.

---

# Configuración

## Reservas

```text
/admin/configuracion/reservas
```

Incluye parámetros como:

- porcentaje de seña;
- tiempo de retención;
- duración estándar;
- anticipación mínima;
- anticipación máxima.

---

## Contacto

```text
/admin/configuracion/contacto
```

Centraliza:

- teléfono;
- WhatsApp;
- email;
- dirección;
- horarios;
- redes;
- ubicación.

---

## General

```text
/admin/configuracion/general
```

Centraliza datos generales de identidad del club.

---

# Arquitectura de datos

Algunas de las principales entidades utilizadas por el prototipo son:

```text
Court
Reservation
Product
Post
GalleryItem
Faq
AdminUser
AuditLogEntry

Discipline
DisciplineCategory
DisciplineSchedule
Teacher
```

---

## Relación Disciplinas ↔ Profesores

La relación está diseñada evitando duplicar información.

Conceptualmente:

```text
Discipline
│
├── responsibleTeacherIds[]
│
└── categories[]
    │
    └── teacherIds[]
```

Mientras que:

```text
Teacher
```

mantiene únicamente su propia información.

Esto permite cambiar:

```text
nombre
teléfono
foto
email
bio
```

de un profesor sin modificar todas las disciplinas donde participa.

---

# Stack

El prototipo está construido sobre:

```text
Next.js
App Router
TypeScript
Tailwind CSS
shadcn/ui
Lucide Icons
React
Motion
```

---

# Principios de UI

El sitio sigue dos enfoques visuales complementarios.

## Public

```text
mobile-first
visual
deportivo
institucional
editorial
```

La experiencia pública prioriza:

- fotografía;
- claridad;
- descubrimiento;
- conversión;
- CTA de reserva;
- contacto.

## Admin

```text
desktop-first
operativo
compacto
estructurado
```

El panel prioriza:

- información;
- filtros;
- formularios;
- estados;
- acciones;
- eficiencia.

---

# Responsive Design

El proyecto está diseñado para funcionar desde dispositivos móviles hasta escritorio.

Breakpoints de referencia utilizados durante QA:

```text
320px
375px
430px
768px
1024px
1280px
1440px+
```

Las tablas administrativas utilizan representaciones alternativas tipo cards/listas en dispositivos pequeños cuando corresponde.

---

# Accesibilidad

Durante el desarrollo se contemplan criterios como:

- jerarquía correcta de headings;
- navegación por teclado;
- focus visible;
- labels asociados;
- mensajes de error accesibles;
- estados que no dependan únicamente del color;
- botones con nombres accesibles;
- diálogos con manejo correcto del focus;
- imágenes con textos alternativos apropiados;
- soporte para `prefers-reduced-motion` cuando existe animación.

---

# Estructura de rutas

## Público

```text
/
├── club
├── disciplinas
│   └── [slug]
├── canchas
│   └── [slug]
├── reservas
├── noticias
│   └── [slug]
├── tienda
│   └── [slug]
├── galeria
├── preguntas-frecuentes
└── contacto
```

## Administración

```text
/admin
├── login
├── reservas
│   ├── calendario
│   ├── nueva
│   ├── recurrentes
│   └── [id]
├── canchas
│   └── [id]
├── disciplinas
│   └── [id]
├── profesores
│   └── [id]
├── noticias
├── productos
├── galeria
├── faqs
├── contenido
├── usuarios
├── historial
└── configuracion
    ├── reservas
    ├── contacto
    └── general
```

---

# Instalación

Clonar el repositorio:

```bash
git clone https://github.com/EstebanT1112/era-club-deportivo.git
cd era-club-deportivo
```

Instalar las dependencias:

```bash
npm install
```

Ejecutar el entorno de desarrollo:

```bash
npm run dev
```

Abrir:

```text
http://localhost:3000
```

---

# Scripts

Los scripts disponibles son:

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run start
```

---

# Datos mock

La aplicación utiliza datos locales para representar:

- canchas;
- reservas;
- disponibilidad;
- disciplinas;
- categorías;
- horarios;
- profesores;
- productos;
- noticias;
- galería;
- preguntas frecuentes;
- usuarios;
- historial;
- configuración.

Las operaciones CRUD son simuladas en frontend.

Dependiendo del módulo, los cambios pueden mantenerse únicamente durante la sesión actual y perderse al recargar la página.

---

# Limitaciones actuales

Esta versión debe considerarse un:

> **Prototipo frontend funcional y navegable.**

Todavía no incluye:

- base de datos real;
- autenticación real;
- persistencia;
- autorización por roles;
- Supabase;
- almacenamiento de archivos;
- Mercado Pago real;
- webhooks;
- bloqueo concurrente de reservas;
- emails;
- notificaciones push;
- inscripción online a disciplinas;
- cupos deportivos;
- gestión de cuotas;
- portal de profesores;
- sistema de asistencia.

Estas características forman parte de una posible evolución productiva y no deben considerarse errores de la versión actual.

---

# Evolución futura

La arquitectura prevista para una futura versión productiva contempla potencialmente:

```text
Frontend
Next.js + TypeScript

Backend
Next.js Server / API

Database
Supabase PostgreSQL

Authentication
Supabase Auth

Storage
Supabase Storage

Payments
Mercado Pago Checkout Pro

Deployment
Vercel
```

---

## Reservas productivas

Una implementación real debería incorporar:

- disponibilidad calculada en servidor;
- bloqueo temporal de turnos;
- expiración automática;
- restricciones de concurrencia;
- constraints de base de datos;
- transacciones;
- verificación de pagos;
- webhooks firmados;
- idempotencia.

---

## Disciplinas productivas

El módulo puede evolucionar hacia:

- inscripción online;
- cupos por categoría;
- cuotas;
- notificaciones;
- cambios de horarios;
- documentación;
- asistencia;
- portal de profesores;
- múltiples responsables;
- temporadas deportivas.

La separación actual entre:

```text
Discipline
DisciplineCategory
Teacher
```

permite incorporar estas funciones sin rediseñar desde cero el dominio.

---

# Estado del proyecto

Actualmente el proyecto cubre:

```text
✓ Sitio institucional
✓ Canchas
✓ Reservas frontend
✓ Disciplinas
✓ Categorías deportivas
✓ Profesores
✓ Noticias
✓ Tienda
✓ Galería
✓ FAQs
✓ Contacto
✓ Panel administrativo
✓ Configuración
✓ Responsive
✓ Experiencia mobile
```

Las integraciones productivas permanecen fuera del alcance de esta versión.

---

# Objetivo del prototipo

El objetivo principal es validar:

```text
arquitectura de información
experiencia de usuario
identidad visual
navegación
responsive
flujos de reserva
gestión administrativa
modelo de disciplinas y profesores
```

antes de avanzar hacia infraestructura y lógica de negocio productiva.

---

# Licencia

Definir la licencia correspondiente antes de distribuir o reutilizar el proyecto públicamente.

```text
Todos los derechos reservados.
```

---

# Autoría

Proyecto desarrollado como prototipo web integral para la digitalización de la experiencia pública y operativa de un club deportivo.
