/**
 * Repositorio de `apps` usando Drizzle ORM (sin 'as' assertions).
 *
 * - Se usan anotaciones de tipo explícitas en las variables que reciben
 *   resultados de las consultas.
 * - Se maneja `unknown` en captura de errores y se extraen mensajes de forma segura.
 *
 * Requisitos:
 * - `src/db/drizzleClient.ts` debe exportar `db` (instancia de Drizzle).
 * - `src/db/tables.ts` debe exportar `apps`, `SoketiApp` y `NewSoketiApp`.
 */

import db from './drizzleClient'
import { apps, SoketiApp, NewSoketiApp } from './tables'
import { eq } from 'drizzle-orm'

/**
 * Extrae un mensaje legible desde un error de tipo unknown.
 */
function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  try {
    return String(err)
  } catch {
    return 'Unknown error'
  }
}

export class SoketiAppRepository {
  /**
   * Inserta una nueva app en la tabla `apps`.
   * Retorna la fila insertada como `SoketiApp`.
   *
   * Nota: MySQL/MariaDB pueden no soportar `RETURNING`, por lo que se realiza
   * un INSERT seguido de un SELECT para recuperar la fila.
   */
  static async createApp(appData: NewSoketiApp): Promise<SoketiApp> {
    const idForMsg: string = appData.id

    try {
      // Ejecutar el INSERT; no dependemos del valor devuelto por la inserción.
      await db.insert(apps).values(appData)
    } catch (err: unknown) {
      throw new Error(`Error inserting Soketi app (id=${idForMsg}): ${extractErrorMessage(err)}`)
    }

    try {
      // Realizar SELECT que devuelve un array de filas; tomar la primera.
      const rows: SoketiApp[] = await db.select().from(apps).where(eq(apps.id, appData.id))
      if (rows.length === 0) {
        throw new Error('No se pudo recuperar la app insertada después del INSERT')
      }
      return rows[0]
    } catch (err: unknown) {
      throw new Error(`Error fetching Soketi app after insert (id=${idForMsg}): ${extractErrorMessage(err)}`)
    }
  }

  /**
   * Busca una app por su id.
   * Retorna `SoketiApp` o `null` si no existe.
   */
  static async findById(id: string): Promise<SoketiApp | null> {
    try {
      const rows: SoketiApp[] = await db.select().from(apps).where(eq(apps.id, id))
      return rows.length > 0 ? rows[0] : null
    } catch (err: unknown) {
      throw new Error(`Error querying Soketi app by id=${id}: ${extractErrorMessage(err)}`)
    }
  }

  /**
   * Verifica si existe una app con el id dado.
   */
  static async idExists(id: string): Promise<boolean> {
    try {
      const rows: { id: string }[] = await db.select({ id: apps.id }).from(apps).where(eq(apps.id, id))
      return rows.length > 0
    } catch (err: unknown) {
      throw new Error(`Error checking existence of Soketi app id=${id}: ${extractErrorMessage(err)}`)
    }
  }
}

// Re-exportar tipos para compatibilidad con el proyecto.
export type { SoketiApp, NewSoketiApp }
