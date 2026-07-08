import { authHandlers } from './auth'
import { patrimoineHandlers } from './patrimoine'
import { rentalHandlers } from './rental'
import { operationsHandlers } from './operations'
import { contactsHandlers } from './contacts'
import { suggestionsHandlers } from './suggestions'
import { managerHandlers } from './manager'

export const handlers = [
  ...authHandlers,
  ...patrimoineHandlers,
  ...rentalHandlers,
  ...operationsHandlers,
  ...contactsHandlers,
  ...suggestionsHandlers,
  ...managerHandlers,
]
