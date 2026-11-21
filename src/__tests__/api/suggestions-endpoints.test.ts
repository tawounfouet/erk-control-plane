import { describe, expect, it } from 'vitest'
import * as api from '@/lib/api/suggestions'

describe('suggestions API coverage', () => {
  it('covers suggestion creation, queues and workflow', async () => {
    expect((await api.listSuggestions()).count).toBe(3)
    expect((await api.getSuggestion('s-001')).titre).toContain('fontaines')
    await expect(api.createSuggestion({ titre: 'Nouvelle idée', description: 'Description', categorie: 'other', anonyme: true })).resolves.toMatchObject({ id: 's-new' })
    await expect(api.updateSuggestion('s-001', { titre: 'Titre ajusté' })).resolves.toMatchObject({ titre: 'Titre ajusté' })
    expect((await api.getMySuggestions()).count).toBe(1)
    await expect(api.getPendingSuggestions()).resolves.toHaveLength(1)
    await expect(api.getUnderReviewSuggestions()).resolves.toHaveLength(1)
    await expect(api.getImplementedSuggestions()).resolves.toHaveLength(1)
    await expect(api.changeSuggestionStatus('s-001', 'in_progress')).resolves.toMatchObject({ status: 'in_progress' })
    await expect(api.assignSuggestion('s-001', 'u-staff')).resolves.toMatchObject({ assigned_to: 'u-staff' })
    await expect(api.addSuggestionResponse('s-001', 'Merci')).resolves.toMatchObject({ id: 'sr-new' })
    await expect(api.addSuggestionComment('s-001', 'À étudier')).resolves.toMatchObject({ id: 'sc-new' })
    expect((await api.getSuggestionStatistics()).total).toBe(3)
    await expect(api.deleteSuggestion('s-001')).resolves.toBeUndefined()
  })

  it('covers response, comment and attachment resources', async () => {
    expect((await api.listSuggestionResponses()).count).toBe(1)
    await expect(api.createSuggestionResponse({ suggestion: 's-001', response_text: 'Réponse' } as never)).resolves.toMatchObject({ id: 'sr-new' })
    await expect(api.updateSuggestionResponse('sr-001', { response_text: 'Réponse corrigée' })).resolves.toMatchObject({ response_text: 'Réponse corrigée' })
    await expect(api.resendSuggestionResponseEmail('sr-001')).resolves.toMatchObject({ success: true })
    await expect(api.deleteSuggestionResponse('sr-001')).resolves.toBeUndefined()
    expect((await api.listSuggestionComments()).count).toBe(1)
    await expect(api.createSuggestionComment({ suggestion: 's-001', comment: 'Note' } as never)).resolves.toMatchObject({ id: 'sc-new' })
    await expect(api.deleteSuggestionComment('sc-001')).resolves.toBeUndefined()
    expect((await api.listSuggestionAttachments()).count).toBe(1)
    await expect(api.createSuggestionAttachment({ suggestion: 's-001', title: 'Plan', file: new File(['pdf'], 'plan.pdf') })).resolves.toMatchObject({ id: 'sa-new' })
    await expect(api.deleteSuggestionAttachment('sa-001')).resolves.toBeUndefined()
  })
})
