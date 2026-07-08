export class ApiError extends Error {
  status: number
  body: string

  constructor(status: number, body: string) {
    super(`API ${status}: ${body}`)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }

  get isAuthError(): boolean {
    return this.status === 401
  }

  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500
  }

  get isServerError(): boolean {
    return this.status >= 500
  }

  get isRateLimited(): boolean {
    return this.status === 429
  }

  get isNotFound(): boolean {
    return this.status === 404
  }

  get isConflict(): boolean {
    return this.status === 409
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError
}

export function toApiError(err: unknown): ApiError {
  if (isApiError(err)) return err
  if (err instanceof TypeError && err.message === 'Failed to fetch') {
    return new ApiError(0, 'Network error — check your connection')
  }
  if (err instanceof Error) {
    return new ApiError(0, err.message)
  }
  return new ApiError(0, String(err))
}
