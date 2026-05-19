// src/middleware/errorHandler.ts
import type { Request, Response, NextFunction } from 'express' // Importamos los tipos necesarios de Express para definir la función de middleware de manejo de errores

export interface AppError extends Error {
  statusCode?: number
}

export const errorHandler = ( // Función de middleware para manejar errores en la aplicación
  error: AppError, // El error que se ha producido, con un tipo personalizado que extiende de Error e incluye un statusCode opcional
  _req: Request, // El objeto de solicitud de Express, que no se utiliza en esta función pero es necesario para la firma del middleware
  res: Response, // El objeto de respuesta de Express, que se utiliza para enviar la respuesta de error al cliente
  _next: NextFunction // El objeto de función next de Express, que no se utiliza en esta función pero es necesario para la firma del middleware
): void => { // La función no devuelve nada, ya que se encarga de enviar la respuesta de error al cliente
  const statusCode = error.statusCode ?? 500 // Si el error tiene un statusCode definido, lo usamos; de lo contrario, usamos 500 como código de estado por defecto para errores internos del servidor
  const message = error.message ?? 'Error interno del servidor' // Si el error tiene un mensaje definido, lo usamos; de lo contrario, usamos un mensaje genérico para errores internos del servidor

  console.error(`[${new Date().toISOString()}] ${statusCode} — ${message}`) // Imprime un mensaje de error en la consola con la fecha y hora actual, el código de estado y el mensaje del error

  res.status(statusCode).json({ error: message }) // Envía una respuesta JSON al cliente con el código de estado y el mensaje de error
}