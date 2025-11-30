/**
 * Cliente Drizzle para MariaDB usando mysql2/promise pool.
 *
 * Lee la configuración desde variables de entorno:
 * - DB_HOST (default: '127.0.0.1')
 * - DB_PORT (default: '3306')
 * - DB_USER (default: 'root')
 * - DB_PASSWORD (default: '')
 * - DB_NAME (default: 'soketi')
 *
 * Exporta:
 * - `db` : instancia de Drizzle (drizzle-orm) ligada al pool de mysql2
 * - `pool`: el pool de conexiones mysql2 (opcional, útil para operaciones específicas)
 *
 * Nota: Asegúrate de instalar las dependencias:
 *   bun add drizzle-orm mysql2
 *
 * Si tu entorno Bun presenta incompatibilidades con `mysql2`, podemos ajustar el driver.
 */

import { createPool, Pool } from 'mysql2/promise'
import { drizzle } from 'drizzle-orm/mysql2'

const {
  DB_HOST = '127.0.0.1',
  DB_PORT = '3306',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_NAME = 'soketi',
  DB_CONNECTION_LIMIT = '10'
} = process.env

// Crear pool de conexiones mysql2 (promise) usando el export nombrado `createPool`
const pool: Pool = createPool({
  host: DB_HOST,
  port: Number(DB_PORT) || 3306,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  // Opciones de pool
  waitForConnections: true,
  connectionLimit: Number(DB_CONNECTION_LIMIT) || 10,
  // Opciones adicionales que pueden ser útiles:
  // queueLimit: 0,
  // connectTimeout: 10000,
})

// Crear instancia Drizzle ligada al pool
export const db = drizzle(pool)

// Export por defecto para compatibilidad con imports anteriores
export default db

// Exportar pool por si se necesita para tareas específicas (migraciones, healthchecks, etc.)
export { pool }
