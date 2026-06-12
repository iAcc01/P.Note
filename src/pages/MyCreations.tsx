import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutGrid,
  Pencil,
  Heart,
  Plus,
  Sparkles,
  ChevronDown,
} from 'lucide-react'
import PromptCardComponent from '@/components/PromptCard'
import { usePromptService } from '@/services'
import type { Prompt } from '@/types/prompt'

type TabKey = 'all' | 'created' | 'favorites'

interface Tab {
  key: TabKey
  label: string
  icon: React.ReactNode
}

const tabs: Tab[] = [
  {
    key: 'all',
    label: '全部',
    icon: <LayoutGrid size={16} strokeWidth={1.5} />,
  },
  {
    key: 'created',
    label: '我创建',
    icon: <Pencil size={16} strokeWidth={1.5} />,
  },
  {
    key: 'favorites',
    label: '收藏夹',
    icon: <Heart size={16} strokeWidth={1.5} />,
  },
]

/** 三个 tab 按钮 + gap 的最小展示宽度 */
const COLLAPSE_THRESHOLD = 480

const MyCreations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [hoveredOption, setHoveredOption] = useState<string | null>(null)
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const toolbarRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const promptService = usePromptService()

  /* 加载数据 */
  useEffect(() => {
    promptService.getAll().then(setPrompts)
  }, [promptService])

  /* 监听 toolbar 宽度，不足时折叠为 select */
  useEffect(() => {
    const el = toolbarRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCollapsed(entry.contentRect.width < COLLAPSE_THRESHOLD)
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /* 点击外部关闭下拉 */
  useEffect(() => {
    if (!dropdownOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  const filteredPrompts = prompts.filter((prompt) => {
    if (activeTab === 'all') return true
    if (activeTab === 'created') return prompt.source === 'created'
    if (activeTab === 'favorites') return prompt.source === 'favorited'
    return true
  })

  const getTabStyle = (tabKey: string, isActive: boolean): React.CSSProperties => {
    const isHovered = hoveredTab === tabKey && !isActive

    return {
      ...styles.tabBtn,
      background: isActive
        ? 'var(--color-primary)'
        : isHovered
          ? 'var(--color-bg-sidebar)'
          : 'var(--color-bg-card)',
      borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
      boxShadow: 'none',
    }
  }

  return (
    <div style={styles.container}>
      {/* 页面标题 */}
      <div style={styles.pageHeader}>
        <Sparkles size={28} strokeWidth={1.5} color="var(--color-text-primary)" />
        <h1 style={styles.pageTitle}>提示词</h1>
      </div>

      {/* Tab 栏 + 添加按钮 */}
      <div style={styles.toolbar} ref={toolbarRef}>
        {collapsed ? (
          /* ── 折叠态：自定义下拉 ── */
          <div style={styles.dropdownWrapper} ref={dropdownRef}>
            <button
              style={styles.dropdownTrigger}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={dropdownOpen}
              aria-label="切换分类"
            >
              <span style={{ ...styles.tabIcon, color: 'var(--color-text-primary)' }}>
                {tabs.find(t => t.key === activeTab)?.icon}
              </span>
              <span style={{ ...styles.tabLabel, color: 'var(--color-text-primary)', fontWeight: 500 }}>
                {tabs.find(t => t.key === activeTab)?.label}
              </span>
              <ChevronDown
                size={14}
                strokeWidth={1.5}
                color="var(--color-icon-secondary)"
                style={{ marginLeft: 2, transition: 'transform 0.2s ease', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>
            {dropdownOpen && (
              <div style={styles.dropdownMenu} role="listbox">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.key
                  const isHovered = hoveredOption === tab.key
                  return (
                    <div
                      key={tab.key}
                      role="option"
                      aria-selected={isActive}
                      style={{
                        ...styles.dropdownItem,
                        background: isActive ? 'var(--color-primary)' : isHovered ? 'var(--color-bg-muted)' : 'transparent',
                        fontWeight: isActive ? 600 : 400,
                      }}
                      onClick={() => {
                        setActiveTab(tab.key)
                        setDropdownOpen(false)
                      }}
                      onMouseEnter={() => setHoveredOption(tab.key)}
                      onMouseLeave={() => setHoveredOption(null)}
                    >
                      <span style={{
                        ...styles.tabIcon,
                        color: isActive ? 'var(--color-on-primary)' : 'var(--color-text-tertiary)',
                      }}>
                        {tab.icon}
                      </span>
                      <span style={{
                        color: isActive ? 'var(--color-on-primary)' : 'var(--color-text-secondary)',
                        fontSize: 14,
                        lineHeight: '20px',
                      }}>
                        {tab.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          /* ── 展开态：按钮组 ── */
          <div style={styles.tabGroup}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={getTabStyle(tab.key, isActive)}
                  onMouseEnter={() => setHoveredTab(tab.key)}
                  onMouseLeave={() => setHoveredTab(null)}
                  aria-selected={isActive}
                  role="tab"
                >
                  <span style={{
                    ...styles.tabIcon,
                    color: isActive ? 'var(--color-on-primary)' : 'var(--color-text-tertiary)',
                  }}>
                    {tab.icon}
                  </span>
                  <span style={{
                    ...styles.tabLabel,
                    color: isActive ? 'var(--color-on-primary)' : 'var(--color-text-tertiary)',
                    fontWeight: isActive ? 600 : 400,
                  }}>
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        <button
          style={styles.addBtn}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-primary-hover)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--color-primary)'
          }}
          onClick={() => navigate('/create')}
        >
          <Plus size={16} strokeWidth={2} color="var(--color-on-primary)" />
          <span style={styles.addBtnText}>添加提示词</span>
        </button>
      </div>

      {/* 卡片网格 */}
      <div style={styles.cardGrid}>
        {filteredPrompts.map((card) => (
          <PromptCardComponent
            key={card.id}
            card={card}
            onClick={() => navigate(`/prompt/${card.id}`)}
          />
        ))}
      </div>

      {/* 底部提示 */}
      <div style={styles.footer}>
        <span style={styles.footerText}>没有更多提示词了</span>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    width: '100%',
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 24,
    paddingTop: 8,
    overflow: 'hidden',
    minWidth: 0,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    lineHeight: '32px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    minWidth: 0,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tabGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 16px',
    border: '1px solid var(--color-border)',
    borderRadius: 20,
    background: 'var(--color-bg-card)',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    transition: 'all 0.15s ease',
    overflow: 'hidden',
    maxWidth: 200,
  },
  tabIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 14,
    lineHeight: '20px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 20px',
    border: 'none',
    borderRadius: 20,
    background: 'var(--color-primary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    transition: 'all 0.15s ease',
    overflow: 'hidden',
    maxWidth: 200,
    flexShrink: 0,
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--color-on-primary)',
    lineHeight: '20px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
  /* ── 折叠态自定义下拉 ── */
  dropdownWrapper: {
    position: 'relative' as const,
  },
  dropdownTrigger: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 16px',
    border: '1px solid var(--color-border)',
    borderRadius: 20,
    background: 'var(--color-bg-card)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    transition: 'all 0.15s ease',
  },
  dropdownMenu: {
    position: 'absolute' as const,
    top: 'calc(100% + 6px)',
    left: 0,
    minWidth: 140,
    background: 'var(--color-bg-elevated)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-md)',
    padding: 4,
    zIndex: 100,
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'background 0.12s ease',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 16,
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '32px 0',
  },
  footerText: {
    fontSize: 12,
    fontWeight: 400,
    color: 'var(--color-text-placeholder)',
    lineHeight: '18px',
  },
}

export default MyCreations
