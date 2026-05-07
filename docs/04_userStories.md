# User Stories - Heladería Dibuluc (MVP)

## 1. Product Catalog

**User Story**
Como cliente, quiero ver todos los helados disponibles con sus imágenes y precios, para decidir qué comprar.

### Criterios de aceptación
1. El Sistema_Cliente mostrará una lista de todos los productos disponibles.
2. Para cada producto, el Sistema_Cliente mostrará el nombre, precio y stock disponible.
3. Mientras el catálogo se está cargando, el Sistema_Cliente mostrará skeleton loaders.

---

## 2. Shopping Cart Management

**User Story**
Como cliente, quiero agregar y quitar productos del carrito, para construir mi pedido.

### Criterios de aceptación
1. Cuando un cliente seleccione un producto, el Sistema_Cliente agregará el producto al Carrito.
2. Cuando un cliente intente agregar un producto, el Sistema_Cliente verificará que la cantidad solicitada no exceda el stock disponible.
3. Si la cantidad solicitada excede el stock, el Sistema_Cliente mostrará un mensaje de error y evitará la adición.
4. El Sistema_Cliente permitirá incrementar, decrementar y eliminar productos del Carrito.
5. El Sistema_Cliente mostrará el total acumulado del Carrito en tiempo real.
6. Cuando se modifique el Carrito, el Sistema_Cliente aplicará micro‑interacciones visuales.

---

## 3. Cart Persistence

**User Story**
Como cliente, quiero que mi carrito se mantenga entre sesiones, para no perder los productos seleccionados.

### Criterios de aceptación
1. El Sistema_Cliente mantendrá el estado del Carrito entre recargas de página.
2. El Sistema_Cliente persistirá el Carrito en el navegador usando `localStorage`.
3. El Sistema_Cliente restaurará el contenido del Carrito al iniciar la sesión del cliente.

---

## 4. Checkout Data Capture

**User Story**
Como cliente, quiero ingresar mis datos de contacto, para completar mi pedido.

### Criterios de aceptación
1. Cuando un cliente inicie el Checkout, el Sistema_Cliente mostrará un formulario de captura de datos.
2. El Sistema_Cliente requerirá los campos: Nombre y Teléfono.
3. El Sistema_Cliente validará que todos los campos requeridos estén completos antes de proceder.
4. El Sistema_Cliente validará el formato del Teléfono.
5. Si algún campo es inválido, el Sistema_Cliente mostrará mensajes de error específicos.

---

## 5. Integration with WhatsApp

**User Story**
Como cliente, quiero enviar mi pedido por WhatsApp, para coordinar el pago y la entrega con el negocio.

### Criterios de aceptación
1. Cuando el cliente complete el formulario de Checkout, el Sistema_Cliente generará un mensaje preformateado con los detalles del pedido.
2. El Sistema_Cliente incluirá en el mensaje: lista de productos con cantidades, datos del cliente (Nombre y Teléfono) y monto total.
3. El Sistema_Cliente redirigirá automáticamente al WhatsApp_Corporativo con el mensaje preformateado usando el formato `wa.me`.

---

## 6. Performance and Response Times

**User Story**
Como cliente, quiero que la aplicación cargue rápidamente, para tener una experiencia fluida.

### Criterios de aceptación
1. El Sistema_Cliente cargará la página inicial en menos de 3 segundos en conexiones estándar.
2. Cuando se realice una petición a la API, el Sistema_Cliente mostrará feedback visual inmediato.
3. El Sistema_Cliente responderá a interacciones del usuario en menos de 200 milisegundos.
4. El Sistema_Cliente aplicará lazy loading a las imágenes de productos.

---

## 7. Visual Feedback and Transitions

**User Story**
Como usuario, quiero ver transiciones suaves y feedback visual, para tener una experiencia agradable.

### Criterios de aceptación
1. El Sistema_Cliente aplicará transiciones suaves al cambiar entre vistas.
2. Cuando se esté procesando una acción, el Sistema_Cliente mostrará spinners o indicadores de carga.
3. Cuando se complete una acción exitosamente, el Sistema_Cliente mostrará una confirmación visual.
4. Si ocurre un error, el Sistema_Cliente mostrará un mensaje de error claro y visible.

---
