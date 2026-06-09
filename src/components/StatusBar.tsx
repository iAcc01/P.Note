import React, { useState } from 'react'
import { usePlatform } from '@/platform/context'
import { Sparkles, MessageSquareWarning, Monitor, ChevronDown } from 'lucide-react'

/**
 * 顶部状态栏
 * - 桌面端：显示「新版本」「问题反馈」，带 drag-region
 * - Web 端：显示「下载桌面端」胶囊按钮
 */
const StatusBar: React.FC = () => {
  const { isDesktop } = usePlatform()
  const [hovered, setHovered] = useState(false)

  if (isDesktop) {
    return (
      <div style={styles.container} className="drag-region">
        <div style={styles.actions} className="no-drag">
          <button style={styles.versionBadge}>
            <Sparkles size={12} color="var(--color-success)" />
            <span style={styles.versionText}>新版本</span>
          </button>
          <button style={styles.feedbackBtn}>
            <MessageSquareWarning size={12} color="var(--color-icon-default)" strokeWidth={1.5} />
            <span style={styles.feedbackText}>问题反馈</span>
          </button>
        </div>
      </div>
    )
  }

  // Web 端：下载桌面端按钮
  return (
    <div style={styles.container}>
      <button
        style={{
          ...styles.downloadBtn,
          background: hovered ? 'var(--color-bg-active)' : 'var(--color-bg-muted)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
          // TODO: 替换为实际的桌面端下载链接
          window.open('https://promptnote.app/download', '_blank')
        }}
        aria-label="下载桌面端应用"
      >
        <Monitor size={14} strokeWidth={1.5} color="var(--color-text-primary)" />
        <span style={styles.downloadText}>下载桌面端</span>
        <ChevronDown size={13} strokeWidth={1.5} color="var(--color-text-tertiary)" />
      </button>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 56,
    padding: '0 20px',
    flexShrink: 0,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  versionBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 10px',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    background: 'var(--color-success-bg)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
  },
  versionText: {
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--color-success)',
    lineHeight: '20px',
  },
  feedbackBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 10px',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    background: 'var(--color-bg-sidebar)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
  },
  feedbackText: {
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    lineHeight: '20px',
  },
  /* ── Web 端下载按钮 ── */
  downloadBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 16px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-bg-muted)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    transition: 'background 0.15s ease, border-color 0.15s ease',
  },
  downloadText: {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--color-text-primary)',
    lineHeight: '20px',
    whiteSpace: 'nowrap' as const,
  },
}

export default StatusBar
