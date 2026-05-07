# Visión General

Sistema web full‑stack que permite a los clientes:

- Explorar productos
- Gestionar un carrito de compras
- Crear pedidos y enviarlos vía WhatsApp

Este sistema está diseñado como un MVP funcional, con una arquitectura simple, clara y mantenible. Funcionalidades como panel administrativo y reportes quedan definidas para una fase 2.

---

# Stack Tecnológico

## Frontend

- **Framework**: React.js 19.2.4
- **Build Tool**: Vite 6.x
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Gestión de Estado**: Context API + `localStorage`

## Backend

- **Runtime**: Node.js
- **Framework**: Express
- **Lenguaje**: TypeScript
- **Arquitectura**: MVC simplificado

## Base de Datos

- **Motor**: PostgreSQL
- **Acceso a Datos**: Repository pattern

---

# Arquitectura

## Arquitectura General del Sistema

```text
CLIENTE (React)
│
├── Pages
├── Components
├── Context (Cart)
└── Services (API calls)
│
▼
SERVIDOR (Express)
│
├── Routes
├── Controllers
├── Services
├── Repositories
└── Database (PostgreSQL)
```

---

# Arquitectura del Frontend

## Estructura de carpetas

```text
src/
├── components/        # UI reutilizable
├── pages/             # Vistas principales
│   ├── Home           # Catálogo de productos (vista principal)
│   ├── Cart
│   └── Checkout
├── context/           # Estado global (carrito)
├── hooks/             # Custom hooks (carrito, productos)
├── services/          # Llamadas a API
├── types/             # Interfaces TypeScript (Product, CartItem, Order)
└── app.tsx
```

## Gestión de Estado

- Context API → carrito
- `localStorage` → persistencia del carrito
- `useState` → estado local de componentes

---

# Arquitectura del Backend

## Estructura de carpetas

```text
src/
├── routes/            # Endpoints
│   ├── productRoutes.ts
│   ├── orderRoutes.ts
│   └── index.ts
├── controllers/       # Manejo HTTP
├── services/          # Lógica de negocio
├── repositories/      # Acceso a datos
├── models/            # Tipos/entidades
├── middleware/        # Manejo de errores centralizado
├── config/            # DB config
└── app.ts
```

## Flujo de una solicitud

```text
Request
→ Route
→ Controller
→ Service
→ Repository
→ Database
→ Response
```

## Capas de la Arquitectura Backend

- **Routes Layer**
  - Define endpoints REST
  - `GET  /api/products`
  - `POST /api/orders`
  - `PATCH /api/products/:id/stock`

- **Controllers Layer**
  - Reciben request
  - Validan datos
  - Llaman services
  - Devuelven response

- **Services Layer**
  - Lógica de negocio
  - Crean pedido y descuentan stock en una sola operación
  - Generan link `wa.me` con resumen del pedido

- **Repositories Layer**
  - Ejecutan queries
  - Acceden a PostgreSQL

- **Middleware Layer**
  - Manejo de errores centralizado
  - Validación de requests

## Modelo de Dominio

- **Producto**: `id`, `nombre`, `precio`, `stock`
- **Pedido**: `id`, `total`, `fecha`, `cliente_nombre`, `cliente_telefono`
- **OrderItem**: `id`, `pedido_id`, `producto_id`, `cantidad`, `precio_unitario`

## Flujo de Checkout

```text
Cliente confirma pedido
→ POST /api/orders (crea pedido + descuenta stock)
→ Backend responde con resumen
→ Frontend genera link wa.me con detalle del pedido
→ Cliente envía mensaje a WhatsApp de la empresa
```