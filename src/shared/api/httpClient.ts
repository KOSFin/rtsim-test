import { API_CONFIG } from '../config/api'

type RequestConfig = Omit<RequestInit, 'body'> & {
  body?: unknown
}

type ErrorBody = {
  message?: string
}

export class HttpError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.details = details
  }
}

function buildUrl(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path
  }

  return `${API_CONFIG.baseUrl}${path}`
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const hasContent = response.status !== 204 && response.status !== 205

  if (!hasContent) {
    return null
  }

  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

export async function request<TResponse>(
  path: string,
  config: RequestConfig = {},
): Promise<TResponse> {
  const { body, headers, ...init } = config
  const response = await fetch(buildUrl(path), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const responseBody = await parseResponseBody(response)

  if (!response.ok) {
    const message =
      typeof responseBody === 'object' && responseBody
        ? ((responseBody as ErrorBody).message ?? 'Ошибка запроса')
        : 'Ошибка запроса'

    throw new HttpError(message, response.status, responseBody)
  }

  return responseBody as TResponse
}

export function post<TResponse, TBody>(path: string, body: TBody) {
  return request<TResponse>(path, {
    method: 'POST',
    body,
  })
}
