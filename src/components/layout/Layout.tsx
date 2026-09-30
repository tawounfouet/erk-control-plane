import { Outlet } from 'react-router-dom'
import { AppSidebar } from './AppSidebar'

export function Layout() {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-6 space-y-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
