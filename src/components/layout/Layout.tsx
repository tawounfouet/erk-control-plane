import { AppSidebar } from './AppSidebar'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-6 space-y-6">
          {children}
        </div>
      </main>
    </div>
  )
}
