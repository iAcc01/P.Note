import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Compass,
  Sparkles,
  TestTube,
  FolderOpen,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'
import { usePlatform } from '@/platform/context'
import { navItems, bottomNavItems } from '@/router'

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

/**
 * iconName → lucide 组件映射
 */
const iconMap: Record<string, React.FC<{ size: number; strokeWidth: number }>> = {
  'compass': Compass,
  'sparkles': Sparkles,
  'test-tube': TestTube,
  'folder-open': FolderOpen,
  'settings': Settings,
}

/* 文字淡入淡出的公共样式 */
const textFade = (collapsed: boolean): React.CSSProperties => ({
  opacity: collapsed ? 0 : 1,
  maxWidth: collapsed ? 0 : 160,
  transition: collapsed
    ? 'opacity 0.1s ease, max-width 0.2s ease'
    : 'opacity 0.25s ease 0.1s, max-width 0.2s ease',
  overflow: 'hidden',
  whiteSpace: 'nowrap' as const,
  pointerEvents: collapsed ? 'none' : 'auto',
})

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDesktop } = usePlatform()

  /* ── 通用 hover 回调 ── */
  const hoverHandlers = (skip?: boolean) => ({
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      if (!skip) e.currentTarget.style.background = 'var(--color-bg-hover)'
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      if (!skip) e.currentTarget.style.background = 'transparent'
    },
  })

  const renderNavButton = (item: { path: string; label: string; iconName: string }) => {
    const isActive = location.pathname === item.path
    const IconComp = iconMap[item.iconName]

    return (
      <button
        key={item.path}
        onClick={() => navigate(item.path)}
        style={{
          ...styles.navItem,
          ...(isActive ? styles.navItemActive : {}),
          ...(collapsed ? styles.navItemCollapsed : {}),
        }}
        {...hoverHandlers(isActive)}
        aria-label={item.label}
        aria-current={isActive ? 'page' : undefined}
        title={collapsed ? item.label : undefined}
      >
        <span style={styles.navIcon}>
          {IconComp && <IconComp size={18} strokeWidth={1.5} />}
        </span>
        <span style={{ ...styles.navLabel, ...textFade(collapsed) }}>
          {item.label}
        </span>
      </button>
    )
  }

  return (
    <aside
      style={{
        ...styles.sidebar,
        width: collapsed ? 68 : 240,
      }}
    >
      {/* Logo + 收起按钮 */}
      <div
        style={{
          ...styles.logoRow,
          padding: collapsed ? '0 20px' : '0 12px 0 28px',
          // 桌面端保留拖拽区域的高度给红绿灯
          ...(isDesktop ? {} : { height: 52 }),
        }}
        className={isDesktop ? 'drag-region' : undefined}
      >
        <span style={{ ...styles.logoText, ...textFade(collapsed) }}>P.Note</span>
        <button
          onClick={onToggleCollapse}
          style={styles.collapseBtn}
          className={isDesktop ? 'no-drag' : undefined}
          aria-label={collapsed ? '展开侧栏' : '收起侧栏'}
          {...hoverHandlers()}
        >
          {collapsed
            ? <PanelLeftOpen size={16} strokeWidth={1.5} color="var(--color-text-tertiary)" />
            : <PanelLeftClose size={16} strokeWidth={1.5} color="var(--color-text-tertiary)" />
          }
        </button>
      </div>

      {/* 导航菜单 */}
      <nav
        style={{
          ...styles.navList,
          ...(collapsed ? styles.navListCollapsed : {}),
        }}
      >
        {navItems.map(renderNavButton)}
      </nav>

      {/* 底部区域 */}
      <div
        style={{
          ...styles.bottomSection,
          ...(collapsed ? styles.bottomSectionCollapsed : {}),
        }}
      >
        {/* 设置 */}
        {bottomNavItems.map(renderNavButton)}

        {/* 用户信息 */}
        <div
          style={{
            ...styles.userSection,
            ...(collapsed ? styles.userSectionCollapsed : {}),
          }}
          {...hoverHandlers()}
          title={collapsed ? 'User Name' : undefined}
        >
          <div style={styles.avatar}>
            <span style={styles.avatarText}>J</span>
          </div>
          <span style={{ ...styles.userName, ...textFade(collapsed) }}>
            User Name
          </span>
        </div>
      </div>
    </aside>
  )
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    height: '100%',
    background: 'var(--color-bg-sidebar)',
    borderRight: '1px solid var(--color-border-light)',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    position: 'relative',
    userSelect: 'none',
    transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
  },
  logoRow: {
    height: 52,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    transition: 'padding 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  logoText: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--color-text-primary)',

  },
  collapseBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 'var(--radius-md)',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'background 0.15s ease, transform 0.2s ease',
  },
  navList: {
    display: 'flex',
    flexDirection: 'column',
    padding: '4px 12px',
    gap: 4,
    flex: 1,
    transition: 'padding 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  navListCollapsed: {
    padding: '4px 14px',
    alignItems: 'center',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '0 16px',
    height: 40,
    borderRadius: 'var(--radius-lg)',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-secondary)',
    transition: 'background 0.15s ease, width 0.25s cubic-bezier(0.4, 0, 0.2, 1), height 0.25s cubic-bezier(0.4, 0, 0.2, 1), padding 0.25s cubic-bezier(0.4, 0, 0.2, 1), gap 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.25s ease',
    textAlign: 'left' as const,
    width: '100%',
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  navItemActive: {
    background: 'var(--color-bg-active)',
  },
  navItemCollapsed: {
    width: 40,
    height: 40,
    padding: '0 0 0 6px',
    gap: 0,
    borderRadius: 'var(--radius-lg)',
  },
  navIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    flexShrink: 0,
    color: 'var(--color-text-secondary)',
    transition: 'transform 0.2s ease',
  },
  navLabel: {
    lineHeight: '20px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  bottomSection: {
    padding: '8px 12px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    transition: 'padding 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  bottomSectionCollapsed: {
    padding: '8px 14px 12px',
    alignItems: 'center',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '0 16px',
    height: 40,
    width: '100%',
    borderRadius: 'var(--radius-lg)',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    overflow: 'hidden',
    whiteSpace: 'nowrap' as const,
    transition: 'background 0.15s ease, width 0.25s cubic-bezier(0.4, 0, 0.2, 1), height 0.25s cubic-bezier(0.4, 0, 0.2, 1), padding 0.25s cubic-bezier(0.4, 0, 0.2, 1), gap 0.25s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.25s ease',
  },
  userSectionCollapsed: {
    width: 40,
    height: 40,
    padding: '0 0 0 6px',
    gap: 0,
    borderRadius: 'var(--radius-lg)',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'transform 0.2s ease',
  },
  avatarText: {
    color: 'var(--color-on-primary)',
    fontSize: 20,
    fontWeight: 500,
    fontFamily: 'var(--font-family-display)',
    lineHeight: '20px',
  },
  userName: {
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    lineHeight: '20px',
  },
}

export default Sidebar
