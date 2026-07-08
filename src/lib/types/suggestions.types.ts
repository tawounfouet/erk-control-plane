export type SuggestionCategory =
  | 'common_spaces'
  | 'services_equipment'
  | 'activities_events'
  | 'security_comfort'
  | 'communication'
  | 'environment_sustainability'
  | 'other'

export type SuggestionStatus =
  | 'submitted'
  | 'under_review'
  | 'in_progress'
  | 'implemented'
  | 'rejected'

export interface SuggestionListItem {
  id: string
  titre: string
  categorie: SuggestionCategory
  status: SuggestionStatus
  anonyme: boolean
  author_display: string
  assigned_to: string | null
  assigned_to_name: string | null
  response_count: number
  comment_count: number
  created_at: string
  reviewed_at: string | null
  implemented_at: string | null
}

export interface SuggestionResponse {
  id: string
  suggestion: string
  response_text: string
  is_official: boolean
  responder: string
  responder_name: string
  email_sent: boolean
  email_sent_at: string | null
  created_at: string
}

export interface SuggestionComment {
  id: string
  suggestion: string
  author: string
  author_name: string
  comment: string
  is_internal: boolean
  created_at: string
}

export type FileType = 'image' | 'document' | 'video' | 'other'

export interface SuggestionAttachment {
  id: string
  title: string
  description: string
  file: string
  file_url: string
  file_type: FileType
  created_at: string
}

export interface SuggestionDetail extends SuggestionListItem {
  description: string
  nom: string
  email: string
  telephone: string
  rappel: boolean
  author: string | null
  contact_email: string
  is_active: boolean
  updated_at: string
  responses: SuggestionResponse[]
  comments: SuggestionComment[]
  attachments: SuggestionAttachment[]
}

export interface SuggestionCreatePayload {
  titre: string
  description: string
  categorie: SuggestionCategory
  anonyme: boolean
  nom?: string
  email?: string
  telephone?: string
  rappel?: boolean
}

export interface SuggestionStatistics {
  total: number
  by_status: Record<SuggestionStatus, number>
  by_category: Array<{
    categorie: SuggestionCategory
    total: number
    submitted: number
    under_review: number
    in_progress: number
    implemented: number
    rejected: number
  }>
  anonymous: number
  with_responses: number
  without_responses: number
  recent_30_days: number
}
