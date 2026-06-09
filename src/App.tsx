import React, { useState } from 'react'
import { useRoutes } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import StatusBar from '@/components/StatusBar'
import { routes } from '@/router'

const App: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const routeElement = useRoutes(routes)

  return (
    <div style={styles.container}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
      />
      <div style={styles.mainArea}>
        <StatusBar />
        <div style={styles.content}>
          <div style={styles.contentInner}>
            {routeElement}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    background: 'var(--color-bg-page)',
  },
  mainArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
  },
  content: {
    flex: 1,
    overflow: 'auto',
    scrollbarGutter: 'stable' as const,
    padding: '0 max(80px, 5vw) 40px max(80px, 5vw)',
  },
  contentInner: {
    maxWidth: 1440,
    margin: '0 auto',
    width: '100%',
  },
}

export default App
