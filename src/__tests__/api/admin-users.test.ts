import { describe, expect, it } from 'vitest'
import { activateUser, getUser, resetUserPassword } from '@/lib/api/admin'

describe('admin user control plane API', () => {
  it('loads the complete administrative and tenant profile', async () => {
    const user = await getUser('u-004')

    expect(user.gender_display).toBe('Homme')
    expect(user.education_level_display).toContain('Licence')
    expect(user.effective_permissions).toContain('rental.view_tenant')
    expect(user.tenant_profile?.active_unit?.identifier).toBe('H-203')
    expect(user.tenant_profile?.documents[0].document_type).toBe('ID_CARD')
  })

  it('uses dedicated account actions and accepts neutral password reset', async () => {
    const suspended = await activateUser('u-004', false)
    expect(suspended.is_active).toBe(false)

    const activated = await activateUser('u-004', true)
    expect(activated.is_active).toBe(true)
    await expect(resetUserPassword(activated.email)).resolves.toBeUndefined()
  })
})
