import { useMediaFiles, useDeleteMediaFile } from '@/hooks/useAdmin'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Trash2, FileImage } from 'lucide-react'

export function MediaFilesPage() {
  const { data, isLoading } = useMediaFiles()
  const deleteMedia = useDeleteMediaFile()
  const files = data?.results || []

  return (
    <div className="space-y-6">
      <PageHeader title="Fichiers médias" description="Gestion des fichiers uploadés" />
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map((file) => (
            <Card key={file.id} className="group relative overflow-hidden">
              <CardContent className="p-0">
                <div className="flex h-32 items-center justify-center bg-muted">
                  <FileImage className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{file.file_name}</p>
                  <p className="text-xs text-muted-foreground">{file.app_name}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {(file.file_size / 1024).toFixed(1)} KB
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => deleteMedia.mutate(file.id)}
                      disabled={deleteMedia.isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
