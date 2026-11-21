import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { assignOperation, bulkUploadOperationAttachments, cancelOperation, completeOperation, createOperationComment, getAttachmentsByOperation, getUnreadOperationNotifications, markAllOperationNotificationsRead, markOperationNotificationRead, startOperation, uploadOperationAttachment } from '@/lib/api/operations'
import { queryKeys } from '@/lib/query-client'

export function useOperationAttachments(id: string) {
  return useQuery({ queryKey: [...queryKeys.operations.detail(id), 'attachments'], queryFn: () => getAttachmentsByOperation(id), enabled: !!id })
}

export function useUnreadOperationNotifications() {
  return useQuery({ queryKey: [...queryKeys.operations.all, 'notifications', 'unread'], queryFn: getUnreadOperationNotifications })
}

export function useOperationMutations(id: string) {
  const client = useQueryClient()
  const refresh = () => { client.invalidateQueries({ queryKey: queryKeys.operations.detail(id) }); client.invalidateQueries({ queryKey: queryKeys.operations.all }) }
  return {
    assign: useMutation({ mutationFn: ({ assignedTo, supervisor }: { assignedTo: string; supervisor?: string }) => assignOperation(id, assignedTo, supervisor), onSuccess: refresh }),
    start: useMutation({ mutationFn: () => startOperation(id), onSuccess: refresh }),
    complete: useMutation({ mutationFn: ({ notes, duration }: { notes?: string; duration?: string }) => completeOperation(id, notes, duration), onSuccess: refresh }),
    cancel: useMutation({ mutationFn: (reason: string) => cancelOperation(id, reason), onSuccess: refresh }),
    comment: useMutation({ mutationFn: ({ content, isInternal }: { content: string; isInternal: boolean }) => createOperationComment({ operation: id, content, is_internal: isInternal }), onSuccess: refresh }),
    upload: useMutation({ mutationFn: ({ file, type }: { file: File; type: string }) => uploadOperationAttachment(id, file, { attachment_type: type }), onSuccess: refresh }),
    bulkUpload: useMutation({ mutationFn: (files: File[]) => bulkUploadOperationAttachments(id, files), onSuccess: refresh }),
  }
}

export function useNotificationMutations() {
  const client = useQueryClient()
  const refresh = () => client.invalidateQueries({ queryKey: [...queryKeys.operations.all, 'notifications'] })
  return {
    markRead: useMutation({ mutationFn: markOperationNotificationRead, onSuccess: refresh }),
    markAllRead: useMutation({ mutationFn: markAllOperationNotificationsRead, onSuccess: refresh }),
  }
}
