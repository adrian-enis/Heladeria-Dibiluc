import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config() // Carga las variables de entorno desde el archivo .env

const supabaseKey = process.env.SUPABASE_ANON_KEY
const supabaseUrl = process.env.SUPABASE_URL

if (!supabaseUrl || !supabaseKey) { // Validación para asegurar que las variables de entorno necesarias están presentes
  throw new Error('Faltan variables de entorno: SUPABASE_URL o SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseKey)  