  [heladeria-dibuluc-docs.md](https://github.com/user-attachments/files/28236941/heladeria-dibuluc-docs.md)
# Heladería Dibuluc — Documentación Técnica

> Stack: React · Node.js · Express · TypeScript · Supabase (PostgreSQL)
> Metodología: Spec-Driven Development (AI-First)

---

## 📐 Arquitectura del Sistema & Metodología

Este sistema fue diseñado y construido bajo un enfoque moderno de ingeniería de software, priorizando la separación de responsabilidades, la mantenibilidad y el desacoplamiento entre capas.

### 🤖 Spec-Driven Development (AI-First)

El desarrollo de este MVP no se realizó escribiendo código reactivo sin estructura. Se implementó **Spec-Driven Development (SDD)** como metodología central:

1. **Especificación antes que código** — Se redactaron specs técnicas de negocio, modelos de datos, user stories y reglas del sistema antes de escribir la primera línea de código. Estos documentos actuaron como fuente de verdad durante todo el desarrollo.
2. **Desarrollo por capas** — Cada capa fue construida en orden estricto — config → models → repositories → services → controllers → routes → middleware — garantizando que cada pieza dependiera solo de lo que ya existía y estaba probado.
3. **IA como par de programación** — Se utilizó IA generativa como acelerador, no como reemplazo del criterio técnico. Cada decisión de arquitectura fue razonada y validada antes de implementarse.

### 🏗️ Decisiones de Arquitectura

- **Separación estricta de capas** — Frontend y backend se comunican únicamente a través de una API REST. Los repositories nunca llaman a los services, los controllers nunca tocan la base de datos.
- **Repository Pattern** — Acceso a datos centralizado. Queries directas con el cliente de Supabase — sin ORM — para mayor control y legibilidad en un MVP.
- **Snapshot de precios** — Cada `OrderItem` guarda `price_at_purchase` — el precio al momento del pedido — preservando el histórico aunque el producto cambie de precio después.
- **Gestión de estado predictible** — El carrito se centraliza en Context API con persistencia en `localStorage`. El estado global solo vive donde se necesita.
- **Validación en dos capas** — El middleware valida el shape del request (campos requeridos, tipos). El service valida las reglas de negocio (stock suficiente, producto existe). Responsabilidades claras y no duplicadas.

### 🔀 Flujo de una solicitud

```text
Request HTTP
    └── Route           (conecta endpoint con controller)
         └── Middleware     (valida shape del request)
              └── Controller    (maneja req/res)
                   └── Service       (lógica de negocio)
                        └── Repository    (queries a Supabase)
                             └── PostgreSQL
```

### 📁 Estructura del Proyecto

```text
HELADERIA-DIBILUC/
├── Backend/
│   └── src/
│       ├── 01-config/          # Cliente Supabase + validación .env
│       ├── 02-models/          # Interfaces TypeScript (Product, Order, OrderItem)
│       ├── 03-repositories/    # Queries directas a PostgreSQL
│       ├── 04-services/        # Lógica de negocio y orquestación
│       ├── 05-controllers/     # Manejo de request/response HTTP
│       ├── 06-routes/          # Definición de endpoints REST
│       ├── 07-middleware/      # Validación de requests y manejo de errores
│       └── app.ts              # Entrada del servidor Express
│
├── Frontend/
│   └── src/
│       ├── types/              # Interfaces TypeScript compartidas
│       ├── services/           # Llamadas a la API REST
│       ├── context/            # CartContext + localStorage
│       ├── hooks/              # useProducts, useCheckout
│       ├── components/         # ProductCard, CartItemRow, SkeletonCard
│       ├── pages/              # Home, Cart, Checkout
│       └── App.tsx             # Routing con React Router
│
└── docs/                       # Especificaciones técnicas del proyecto
```

### 🔗 Endpoints de la API

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/products` | Listado de productos del catálogo |
| `POST` | `/api/orders` | Crea pedido + descuenta stock |
| `PATCH` | `/api/products/:id/stock` | Actualiza stock de un producto |
| `GET` | `/api/health` | Health check del servidor |

### 📦 Flujo de Checkout

```text
Cliente agrega productos al carrito
→ Carrito persiste en localStorage
→ Cliente completa nombre y teléfono
→ Frontend llama POST /api/orders
→ Backend valida stock, crea orden y descuenta inventario
→ Frontend genera link wa.me con resumen del pedido
→ Cliente envía el pedido al WhatsApp de la empresa
```

---

## 1. Configuración

### .env

Define las variables de entorno necesarias para que el servidor arranque y se conecte a Supabase.

- `PORT` — puerto donde corre el servidor (3000 por defecto)
- `SUPABASE_URL` — URL del proyecto en Supabase
- `SUPABASE_ANON_KEY` — clave pública anon para autenticar las queries

> ⚠️ Nunca subir el `.env` a control de versiones. Agregar al `.gitignore`.

---

### src/01-config/database.ts

Inicializa el cliente de Supabase que usan todos los repositories.

- Lee `SUPABASE_URL` y `SUPABASE_ANON_KEY` desde las variables de entorno
- Si alguna falta, lanza un error inmediato antes de levantar la app — falla rápido y con mensaje claro
- Exporta `supabase`, el cliente que se importa en cada repository

---

### app.ts

Punto de entrada del servidor. Configura Express y lo levanta.

- Carga las variables de entorno con `dotenv.config()`
- Habilita CORS para que el frontend pueda hacer requests
- Habilita `express.json()` para parsear el body de los requests
- Expone `GET /api/health` — endpoint para verificar que el servidor está vivo
- Registra el `errorHandler` al final de todo — captura errores no manejados
- Escucha en el puerto definido en `.env`

---

## 2. Modelos / Types

Los modelos definen la forma de los datos. Son la fuente de verdad para todas las capas. No contienen lógica — solo tipos TypeScript.

### src/02-models/Product.ts

Representa un helado en el catálogo.

- `id` — identificador único
- `name` — nombre del producto
- `description` — descripción opcional, puede ser null
- `price` — precio actual
- `stock` — unidades disponibles
- `image_url` — URL de la imagen, puede ser null

---

### src/02-models/Order.ts

Contiene tres tipos relacionados al flujo de pedido.

**Order** — la cabecera del pedido

- `id`, `customer_name`, `customer_phone` — datos del cliente
- `total_amount` — monto total calculado al momento del pedido
- `order_date` — fecha de creación, generada automáticamente por Supabase con `now()`

**OrderItem** — cada producto dentro del pedido

- `order_id` — referencia a la orden padre
- `product_id` — referencia al producto
- `quantity` — cantidad pedida
- `price_at_purchase` — precio capturado en el momento del pedido, no cambia aunque el producto se actualice después

**CreateOrderDTO** — lo que llega desde el frontend al crear un pedido

- `customer_name` y `customer_phone` — datos del cliente
- `items[]` — arreglo con `product_id` y `quantity` por cada producto seleccionado

---

## 3. Repositories

Responsabilidad única: acceso a datos. Solo contienen queries a Supabase y manejo de errores de base de datos. Ninguna lógica de negocio aquí.

### src/03-repositories/productRepository.ts

**`findAll()`**

- Consulta todos los productos de la tabla `products`
- Los ordena alfabéticamente por nombre
- Si no hay datos retorna un arreglo vacío en lugar de null

**`findById(id)`**

- Busca un producto por su ID usando `.single()`
- Si Supabase retorna el código `PGRST116` (ninguna fila encontrada), devuelve `null` sin lanzar error — es un resultado esperado, no un fallo
- Si hay otro tipo de error, lanza excepción con el mensaje de Supabase

**`updateStock(id, newStock)`**

- Escribe el nuevo valor de stock en la base de datos
- Recibe el número final ya calculado — no hace cálculos, solo persiste
- Si falla la operación, lanza excepción

---

### src/03-repositories/orderRepository.ts

**`createOrder(dto, total_amount)`**

- Inserta una nueva fila en la tabla `orders` con los datos del cliente y el total
- El total llega ya calculado desde el service — el repository no lo calcula
- Si la inserción falla o no retorna datos, lanza excepción

**`createOrderItems(order_id, items[])`**

- Inserta todos los items del pedido en la tabla `order_items` en una sola operación
- Cada item incluye `price_at_purchase` como snapshot del precio en ese momento
- Si no hay datos retorna arreglo vacío

**`findById(id)`**

- Busca una orden por ID
- Retorna `null` si no existe (mismo patrón PGRST116 que en productRepository)

---

## 4. Services

Responsabilidad única: lógica de negocio y orquestación. Los services llaman a los repositories — nunca al cliente de Supabase directamente.

### src/04-services/ProductService.ts

**`getAll()`**

- Delega directamente a `productRepository.findAll()`
- Sin lógica adicional por ahora — el punto de extensión está aquí si se necesita filtrar o transformar

**`decrementStock(id, quantity)`**

- Busca el producto por ID — si no existe, lanza error
- Valida que la cantidad a decrementar sea mayor a 0
- Valida que el stock disponible sea suficiente para la cantidad pedida
- Si pasa todas las validaciones, llama a `productRepository.updateStock()` con el nuevo valor calculado

---

### src/04-services/OrderService.ts

**`createOrder(dto)`**

Orquesta la creación completa de un pedido en 6 pasos:

1. Valida que el carrito no esté vacío — el pedido debe tener al menos un producto
2. Enriquece cada item — verifica que el producto exista y captura `price_at_purchase` con el precio actual
3. Calcula el `total_amount` multiplicando precio por cantidad de cada item y sumando
4. Crea la orden en BD con los datos del cliente y el total calculado
5. Crea los `order_items` vinculados al ID de la orden recién creada
6. Descuenta el stock de cada producto llamando a `productService.decrementStock()`

> Los pasos 4, 5 y 6 son secuenciales pero no atómicos. Para producción esto se resuelve con una función RPC en Supabase — está fuera del alcance del MVP.

---

## 5. Controllers

Responsabilidad única: manejar request/response HTTP. Reciben el request validado por el middleware, llaman al service y devuelven la respuesta con el status code correcto.

### src/05-controllers/ProductController.ts

**`getAll(_req, res)`**

- Llama a `productService.getAll()`
- Responde con `200` y el arreglo de productos
- En caso de error responde con `500`

**`updateStock(req, res)`**

- Extrae `id` de los params y `quantity` del body
- Llama a `productService.decrementStock()`
- Responde con `204` (sin contenido) si fue exitoso
- Mapea errores a status codes: `404` si no existe, `409` si stock insuficiente, `500` para otros

### src/05-controllers/OrderController.ts

**`createOrder(req, res)`**

- Extrae `customer_name`, `customer_phone` e `items` del body
- Llama a `orderService.createOrder()`
- Responde con `201` y el objeto `{ order, orderItems }`
- Mapea errores a status codes: `404` no encontrado, `409` stock insuficiente, `500` otros

---

## 6. Routes

Conectan los endpoints con sus controllers y middlewares de validación.

### src/06-routes/productRoutes.ts

- `GET /` → `validateStock` no aplica → `productController.getAll`
- `PATCH /:id/stock` → `validateStock` → `productController.updateStock`

### src/06-routes/orderRoutes.ts

- `POST /` → `validateOrder` → `orderController.createOrder`

### src/06-routes/index.ts

- Monta `productRoutes` en `/products`
- Monta `orderRoutes` en `/orders`
- `app.ts` monta este router en `/api`

---

## 7. Middleware

### src/07-middleware/validateOrder.ts

Valida el shape del request antes de llegar al controller:

- `customer_name` — requerido, debe ser string no vacío
- `customer_phone` — requerido, debe ser string no vacío
- `items` — debe ser arreglo con al menos un elemento
- Cada item debe tener `product_id` (number) y `quantity` (number > 0)

### src/07-middleware/validateStock.ts

- `id` en params — debe ser número válido mayor a 0
- `quantity` en body — debe ser número mayor a 0

### src/07-middleware/errorHandler.ts

- Captura errores no manejados que lleguen con `next(error)`
- Loguea el error con timestamp
- Responde con el `statusCode` del error o `500` por defecto

---

## 8. Frontend

### src/types/index.ts

Tres interfaces que replican los modelos del backend:

- `Product` — igual al modelo del backend
- `CartItem` — lleva el `Product` completo adentro (no solo el id) para mostrar nombre y precio en el carrito
- `Order` — DTO que se envía al backend, solo con los campos que `POST /api/orders` espera

### src/services/

- `productService.getAll()` — llama `GET /api/products`, retorna `Product[]`
- `orderService.create(order)` — llama `POST /api/orders`, lanza error si la respuesta no es ok

### src/context/CartContext.tsx

Estado global del carrito con persistencia en `localStorage`:

- Se inicializa leyendo `localStorage` — el carrito sobrevive recargas de página
- Sincroniza `localStorage` en cada cambio via `useEffect`
- `addItem` — agrega producto o incrementa cantidad, respeta el stock máximo
- `removeItem` — elimina un producto del carrito
- `updateQuantity` — actualiza cantidad, elimina si llega a 0
- `clearCart` — vacía el carrito completo
- `total` — calculado como suma de `precio × cantidad` de cada item
- Exporta `useCart()` — hook que expone el contexto con validación de uso correcto

### src/hooks/useProducts.ts

- Hace fetch de productos al montar el componente
- Maneja tres estados: `loading`, `error`, `products`
- Usa flag `cancelled` para evitar actualizar estado en componentes desmontados

### src/hooks/useCheckout.ts

Orquesta el flujo completo de checkout:

1. Arma el DTO con los items del carrito
2. Llama a `orderService.create()`
3. Genera el mensaje de WhatsApp con el detalle del pedido
4. Limpia el carrito
5. Abre el link `wa.me` al número de la empresa

### src/components/

- `ProductCard` — muestra imagen, nombre, precio y controles de cantidad. Alterna entre botón "Agregar" y controles −/+ según si el producto está en el carrito. Fallback con emoji si la imagen falla
- `CartItemRow` — fila del carrito con imagen, nombre, controles de cantidad y subtotal
- `SkeletonCard` — placeholder animado con efecto shimmer mientras cargan los productos

### src/pages/

- `Home` — carga productos con `useProducts`, muestra skeletons durante el loading, pill del carrito en el header si hay items
- `Cart` — lista items con `CartItemRow`, muestra resumen con total, botón para continuar al checkout. Empty state si el carrito está vacío
- `Checkout` — muestra resumen del pedido, formulario de nombre y teléfono con validación, botón de confirmar por WhatsApp. Llama a `useCheckout.submitOrder()`

---

## 9. Decisiones de diseño

- **Sin ORM** — queries directas con el cliente de Supabase. Menos abstracción, más control y legibilidad para un MVP
- **`price_at_purchase`** — se guarda el precio al momento del pedido para preservar el histórico aunque el precio cambie después
- **`updateStock` recibe el valor final** — el repository solo escribe. El service calcula el nuevo stock y lo pasa listo. Responsabilidades claras
- **`PGRST116` → `null`** — el código de "no rows found" de Supabase se convierte en `null` en lugar de lanzar excepción. Comportamiento más predecible
- **`useCart` en el mismo archivo que `CartContext`** — es un wrapper de una línea, no justifica archivo separado
- **`useCheckout` separado** — tiene lógica real: arma DTO, llama API, genera mensaje, limpia carrito, abre WhatsApp
- **RLS deshabilitado en MVP** — no hay datos sensibles de usuarios autenticados. Se habilita en Fase 2 con autenticación real
- **Sin auth de clientes** — fuera del alcance del MVP. El pedido solo requiere nombre y teléfono
- **Sin pagos en línea** — el checkout genera un link `wa.me` al WhatsApp corporativo. Fase 2
