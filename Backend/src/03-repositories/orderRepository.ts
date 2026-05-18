// src/repositories/orderRepository.ts
import { supabase } from '../01-config/database.js'
import type { Order, OrderItem, CreateOrderDTO } from '../02-models/Order.js'

export const orderRepository = {

    // Crea una nueva orden en la base de datos utilizando los datos proporcionados en el DTO y el monto total calculado
    async createOrder(dto: Pick<CreateOrderDTO, 'customer_name' | 'customer_phone'>, total_amount: number): Promise<Order> {
        const { data, error } = await supabase
            .from('orders')
            .insert({
                customer_name: dto.customer_name,
                customer_phone: dto.customer_phone,
                total_amount,
            })
            .select()
            .single()

        if (error) throw new Error(`Error al crear orden: ${error.message}`)
        if (!data) throw new Error('No se pudo crear la orden')
        return data
    },

    // Crea los items de una orden en la base de datos utilizando el ID de la orden y un array de items con sus detalles
    async createOrderItems(order_id: number, items: { product_id: number; quantity: number; price_at_purchase: number }[]): Promise<OrderItem[]> {
        const rows = items.map(item => ({
            order_id,
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_purchase: item.price_at_purchase,
        }))

        const { data, error } = await supabase
            .from('order_items')
            .insert(rows)
            .select()

        if (error) throw new Error(`Error al crear items de la orden: ${error.message}`)
        if (!data) return []
        return data
    },

    
    async findById(id: number): Promise<Order | null> {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single()

        if (error && error.code !== 'PGRST116') {
            throw new Error(`Error al obtener orden ${id}: ${error.message}`)
        }
        if (!data) return null
        return data
    },
}