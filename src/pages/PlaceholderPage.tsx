import React from 'react'
import {
  Compass,
  TestTube,
  FolderOpen,
  Settings,
  Construction,
} from 'lucide-react'

interface PlaceholderPageProps {
  title: string
  icon: 'compass' | 'test-tube' | 'folder' | 'settings'
}

const iconMap: Record<string, React.ReactNode> = {
  'compass': <Compass size={48} strokeWidth={1} color="var(--color-icon-disabled)" />,
  'test-tube': <TestTube size={48} strokeWidth={1} color="var(--color-icon-disabled)" />,
  'folder': <FolderOpen size={48} strokeWidth={1} color="var(--color-icon-disabled)" />,
  'settings': <Settings size={48} strokeWidth={1} color="var(--color-icon-disabled)" />,
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, icon }) => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.iconWrapper}>
          {iconMap[icon] || <Construction size={48} strokeWidth={1} color="var(--color-icon-disabled)" />}
        </div>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.subtitle}>功能规划中，敬请期待</p>
        <div style={styles.badge}>
          <Construction size={14} color="var(--color-text-tertiary)" />
          <span style={styles.badgeText}>Coming Soon</span>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    minHeight: 400,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 'var(--radius-xl)',
    background: 'var(--color-bg-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    maxWidth: 300,
  },
  subtitle: {
    fontSize: 14,
    color: 'var(--color-text-tertiary)',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-bg-muted)',
    marginTop: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--color-text-tertiary)',
  },
}

export default PlaceholderPage
