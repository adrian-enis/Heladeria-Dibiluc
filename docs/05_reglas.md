# Reglas para asistentes IA - Heladería Dibuluc

## Introducción

Este documento define reglas de trabajo para herramientas de asistencia por IA (por ejemplo, Cursor) en el repositorio del MVP de la heladería. Su objetivo es mantener respuestas y cambios de código alineados con la documentación existente (`01_negocio.md` a `04_userStories.md`) y evitar divagación o ampliación no acordada del alcance.

---

## Alcance del producto

- **MVP acotado**: El sistema es web transaccional con catálogo, carrito, checkout y envío del pedido vía WhatsApp.
- **Fase 2 (excluida del MVP)**: Panel administrativo, historial de pedidos, filtros, exportación de reportes, banners dinámicos.
- **Sin expansión implícita**: No proponer módulos no descritos en la documentación (pagos en línea, autenticación de clientes, multi-tienda, apps nativas, etc.) salvo que el usuario lo solicite de forma explícita.
- **Fuente de verdad**: Ante dudas de requisitos, priorizar `01_negocio.md` y `04_userStories.md`. Si falta definición, formular **una** pregunta concreta en lugar de asumir.

---

## Stack y arquitectura

- **Frontend**: React.js, Vite, TypeScript, Tailwind CSS; estado global del carrito con Context API y persistencia con `localStorage`, según `02_arquitectura.md`.
- **Backend**: Node.js, Express, TypeScript; flujo Routes → Controllers → Services → Repositories, según `02_arquitectura.md`.
- **Base de datos**: PostgreSQL; acceso mediante patrón Repository, según `03_dataBase.md`.
- **Sin sustitución de stack**: No recomendar cambiar framework, bundler, gestor de estado u ORM por defecto; solo comparar alternativas si el usuario lo pide explícitamente.
- **Estructura de carpetas**: Nuevos archivos deben encajar en la estructura de `02_arquitectura.md`; no crear convenciones paralelas sin motivo.

---

## Datos y dominio

- **Esquema**: Tablas según `03_dataBase.md`: `products`, `orders`, `order_items`. No añadir tablas o columnas sin decisión explícita y actualización coordinada de la documentación.
- **Modelo de `orders`**: Solo `customer_name` y `customer_phone`. No incluir cédula, dirección u otros campos no definidos.
- **Histórico de precios**: Respetar `price_at_purchase` en `order_items` para no alterar el histórico al modificar precios en `products`.
- **Glosario**: Usar los términos de `01_negocio.md` (Sistema_Cliente, Carrito, Pedido, Producto, Checkout, WhatsApp_Corporativo) al hablar de comportamiento funcional.

---

## Implementación alineada con historias

- **Trazabilidad**: Al implementar una funcionalidad, relacionarla con la sección correspondiente de `04_userStories.md` y cumplir sus criterios de aceptación.
- **API REST**: Endpoints definidos en `02_arquitectura.md`:
  - `GET /api/products`
  - `POST /api/orders`
  - `PATCH /api/products/:id/stock`
  No inventar prefijos o rutas distintas sin acuerdo explícito.
- **Checkout y WhatsApp**: Formulario con Nombre y Teléfono; validaciones; mensaje preformateado y redirección con URL `wa.me`, según `04_userStories.md`.
- **UX**: Skeleton loaders, spinners, lazy loading de imágenes y feedback de errores según `04_userStories.md`; aplicar solo lo relevante a la tarea concreta.

---

## Estilo de respuesta

- **Prioridad**: Responder primero lo solicitado; ofrecer alternativas solo si aportan directamente al mismo objetivo o el usuario pide opciones.
- **Concisión**: Evitar tutoriales genéricos cuando la petición es operativa o localizada.
- **Idioma**: Responder en español salvo que el usuario indique otro idioma.
- **Documentación**: No crear ni modificar archivos en `docs/` salvo petición explícita del usuario.

---

## Resumen

Ceñirse al MVP documentado, al stack y carpetas de `02_arquitectura.md`, al modelo de `03_dataBase.md` (`products`, `orders`, `order_items`), al vocabulario de `01_negocio.md` y a los criterios de `04_userStories.md`, con respuestas directas y sin ampliar el alcance por iniciativa propia.