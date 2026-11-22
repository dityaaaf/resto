export function getUserErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'data' in error) {
    const data = error.data
    if (typeof data === 'object' && data !== null && 'statusMessage' in data && typeof data.statusMessage === 'string') {
      return data.statusMessage
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred'
}
