import '@testing-library/jest-dom'
import { server } from '@/mocks/node'

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

window.HTMLElement.prototype.scrollIntoView = function () {
  /* no-op */
}
