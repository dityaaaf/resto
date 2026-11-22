import type { H3Event } from 'h3'

export function requireUuidParam(event: H3Event, name: string): string {
  const value = getRouterParam(event, name)
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

  if (!value || !uuidPattern.test(value)) {
    throw createError({ statusCode: 400, statusMessage: `Invalid ${name}` })
  }

  return value.toLowerCase()
}
