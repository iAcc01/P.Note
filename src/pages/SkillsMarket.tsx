import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, TrendingUp, Clock, ChevronDown, Star, Download, KeyRound, Plus, X, Upload, FileArchive, Search } from 'lucide-react'
import JSZip from 'jszip'
import type { Skill } from '@/types/skill'
import { ICON_PRESETS, deriveIconText, formatCount, timeAgo } from '@/types/skill'
import { clawhubSkills } from '@/data/clawhubSkills'

export type { Skill } from '@/types/skill'

/* ── 排序 / Tab ──────────────────────────────────────────────── */
type TabKey = 'all' | 'hot' | 'newest'

interface Tab {
  key: TabKey
  label: string
  icon: React.ReactNode
}

const tabs: Tab[] = [
  { key: 'all', label: '全部', icon: <Zap size={16} strokeWidth={1.5} /> },
  { key: 'hot', label: '热门', icon: <TrendingUp size={16} strokeWidth={1.5} /> },
  { key: 'newest', label: '最新', icon: <Clock size={16} strokeWidth={1.5} /> },
]

const COLLAPSE_THRESHOLD = 480

/* ── 发布表单数据 ─────────────────────────────────────────────── */
interface PublishForm {
  name: string
  description: string
  presetIndex: number
  tags: string
  needApiKey: boolean
}

const emptyForm: PublishForm = {
  name: '',
  description: '',
  presetIndex: 0,
  tags: '',
  needApiKey: false,
}

/* 从 SKILL.md / README 的 YAML frontmatter 中解析 description */
const parseFrontmatterDesc = (text: string): string => {
  const fm = text.match(/^---\s*\n([\s\S]*?)\n---/)
  if (!fm) return ''
  const m = fm[1].match(/^description:\s*(.+)$/m)
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : ''
}

/* 取 Markdown 正文首段（去掉标题行）作为兜底描述 */
const firstParagraph = (text: string): string => {
  const body = text.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '')
  for (const line of body.split('\n')) {
    const t = line.trim()
    if (t && !t.startsWith('#')) return t.replace(/[*_`>#]/g, '').trim()
  }
  return ''
}

/**
 * 从 skill zip 包中读取描述
 * 优先级：skill.json / manifest.json 的 description 字段
 *        → SKILL.md / README.md 的 frontmatter description
 *        → Markdown 正文首段
 */
const extractDescriptionFromZip = async (file: File): Promise<string> => {
  try {
    const zip = await JSZip.loadAsync(file)
    const entries = Object.keys(zip.files)
    const find = (re: RegExp) => entries.find((n) => re.test(n.split('/').pop() || ''))

    /* 1) JSON 清单 */
    const jsonName = find(/^(skill|manifest|package)\.json$/i)
    if (jsonName) {
      try {
        const json = JSON.parse(await zip.files[jsonName].async('string'))
        if (typeof json.description === 'string' && json.description.trim()) {
          return json.description.trim()
        }
      } catch { /* ignore JSON 解析失败 */ }
    }

    /* 2) Markdown 文档 */
    const mdName = find(/^(skill|readme)\.md$/i)
    if (mdName) {
      const md = await zip.files[mdName].async('string')
      return parseFrontmatterDesc(md) || firstParagraph(md)
    }
    return ''
  } catch {
    return ''
  }
}

/* ═══════════════════════════════════════════════════════════════ */
const SkillsMarket: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<TabKey>('all')
  const [query, setQuery] = useState('')
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [hoveredOption, setHoveredOption] = useState<string | null>(null)

  /* 技能列表（可通过发布新增） */
  const [skills, setSkills] = useState<Skill[]>(clawhubSkills)

  /* 发布弹窗 */
  const [publishOpen, setPublishOpen] = useState(false)
  const [form, setForm] = useState<PublishForm>(emptyForm)
  const [addBtnHover, setAddBtnHover] = useState(false)

  /* 上传文件 */
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [extractedDesc, setExtractedDesc] = useState('')
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const toolbarRef = React.useRef<HTMLDivElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  /* 响应式折叠 */
  React.useEffect(() => {
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

  React.useEffect(() => {
    if (!dropdownOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [dropdownOpen])

  /* ESC 关闭弹窗 */
  React.useEffect(() => {
    if (!publishOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePublish()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishOpen])

  const openPublish = () => {
    setForm(emptyForm)
    setFile(null)
    setFileError('')
    setExtractedDesc('')
    setPublishOpen(true)
  }

  const closePublish = () => setPublishOpen(false)

  /* 校验并设置文件：仅 zip，最大 100MB */
  const MAX_SIZE = 100 * 1024 * 1024
  const handleFiles = async (files: FileList | null) => {
    setFileError('')
    const f = files?.[0]
    if (!f) return
    const isZip = /\.zip$/i.test(f.name) || f.type === 'application/zip' || f.type === 'application/x-zip-compressed'
    if (!isZip) {
      setFileError('仅支持 .zip 格式文件')
      return
    }
    if (f.size > MAX_SIZE) {
      setFileError('文件大小不能超过 100MB')
      return
    }
    setFile(f)
    /* 解析 zip 内描述，供描述为空时兜底 */
    const desc = await extractDescriptionFromZip(f)
    setExtractedDesc(desc)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB'
    if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return bytes + ' B'
  }

  const canSubmit = file !== null && form.name.trim() !== ''

  const handlePublish = () => {
    if (!canSubmit || !file) return
    const title = form.name.trim()
    /* 描述为空时，使用从 zip 文件中解析出的描述 */
    const description = form.description.trim() || extractedDesc.trim() || '暂无描述'
    const newSkill: Skill = {
      id: `user-${Date.now()}`,
      slug: `user-${Date.now()}`,
      title,
      description,
      author: '我',
      presetIndex: form.presetIndex,
      rating: 0,
      downloads: 0,
      version: '1.0.0',
      updatedAt: Date.now(),
      tags: form.tags.split(/[,，|]/).map(t => t.trim()).filter(Boolean),
      needApiKey: form.needApiKey,
      isNew: true,
    }
    setSkills(prev => [newSkill, ...prev])
    setPublishOpen(false)
  }

  /* 关键词搜索 + 排序 */
  const kw = query.trim().toLowerCase()
  const filteredSkills = skills
    .filter((s) => {
      if (!kw) return true
      return (
        s.title.toLowerCase().includes(kw) ||
        s.description.toLowerCase().includes(kw) ||
        (s.author || '').toLowerCase().includes(kw) ||
        (s.tags || []).some((t) => t.toLowerCase().includes(kw))
      )
    })
    .sort((a, b) => {
      if (activeTab === 'hot') return b.downloads - a.downloads
      if (activeTab === 'newest') return b.updatedAt - a.updatedAt
      return 0
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
        <Zap size={28} strokeWidth={1.5} color="var(--color-text-primary)" />
        <h1 style={styles.pageTitle}>技能</h1>
      </div>

      {/* 搜索栏 */}
      <div style={styles.searchBar}>
        <Search size={16} strokeWidth={1.5} color="var(--color-text-tertiary)" />
        <input
          style={styles.searchInput}
          placeholder="搜索技能名称、描述、作者或标签"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="搜索技能"
        />
        {query && (
          <button style={styles.searchClear} onClick={() => setQuery('')} aria-label="清空搜索">
            <X size={15} strokeWidth={1.5} color="var(--color-text-tertiary)" />
          </button>
        )}
      </div>

      {/* Tab 栏 */}
      <div style={styles.toolbar} ref={toolbarRef}>
        {collapsed ? (
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
                      onClick={() => { setActiveTab(tab.key); setDropdownOpen(false) }}
                      onMouseEnter={() => setHoveredOption(tab.key)}
                      onMouseLeave={() => setHoveredOption(null)}
                    >
                      <span style={{ ...styles.tabIcon, color: isActive ? 'var(--color-on-primary)' : 'var(--color-text-tertiary)' }}>
                        {tab.icon}
                      </span>
                      <span style={{ color: isActive ? 'var(--color-on-primary)' : 'var(--color-text-secondary)', fontSize: 14, lineHeight: '20px' }}>
                        {tab.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
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
                  <span style={{ ...styles.tabIcon, color: isActive ? 'var(--color-on-primary)' : 'var(--color-text-tertiary)' }}>
                    {tab.icon}
                  </span>
                  <span style={{ ...styles.tabLabel, color: isActive ? 'var(--color-on-primary)' : 'var(--color-text-tertiary)', fontWeight: isActive ? 600 : 400 }}>
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* 发布 skill 按钮 */}
        <button
          style={{
            ...styles.publishBtn,
            background: addBtnHover ? 'var(--color-primary-hover)' : 'var(--color-primary)',
          }}
          onMouseEnter={() => setAddBtnHover(true)}
          onMouseLeave={() => setAddBtnHover(false)}
          onClick={openPublish}
        >
          <Plus size={16} strokeWidth={2} color="var(--color-on-primary)" />
          <span style={styles.publishBtnText}>发布 skill</span>
        </button>
      </div>

      {/* 卡片网格 */}
      <div style={styles.cardGrid}>
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="skill-card"
            style={styles.card}
            role="article"
            tabIndex={0}
            onClick={() => navigate(`/skills/${skill.slug || skill.id}`)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/skills/${skill.slug || skill.id}`) }
            }}
          >
            {/* 需 API Key 徽章 — 始终固定右上角 */}
            {skill.needApiKey && (
              <span style={styles.apiKeyBadge}>
                <KeyRound size={11} strokeWidth={2} />
                需API Key
              </span>
            )}
            {/* 顶部：图标 + 名称 + 作者/更新时间 */}
            <div style={styles.cardTop}>
              <div style={{ ...styles.cardIcon, background: ICON_PRESETS[skill.presetIndex]?.bg, color: ICON_PRESETS[skill.presetIndex]?.color }}>
                {skill.iconText || deriveIconText(skill.title)}
              </div>
              <div style={styles.cardTitleArea}>
                <div style={{ ...styles.titleRow, paddingRight: skill.needApiKey ? 84 : 0 }}>
                  <h3 style={styles.cardTitle}>{skill.title}</h3>
                </div>
                {/* 作者 · 更新时间 */}
                <div style={styles.subMeta}>
                  {skill.author && <span style={styles.author}>{skill.author}</span>}
                  {skill.author && skill.updatedAt > 0 && <span style={styles.dot}>·</span>}
                  {skill.updatedAt > 0 && <span style={styles.updatedAt}>{timeAgo(skill.updatedAt)}更新</span>}
                </div>
              </div>
            </div>

            {/* 描述 */}
            <p style={styles.cardDesc}>{skill.description}</p>

            {/* 底部：标签（左） + 收藏/下载（右） */}
            <div style={styles.cardFooter}>
              <div style={styles.tags}>
                {(skill.tags || []).map((tag, i) => (
                  <span key={i} className="prompt-card-tag">#{tag}</span>
                ))}
              </div>
              <div style={styles.stats}>
                <span style={styles.statItem}>
                  <Star size={13} strokeWidth={1.5} />
                  {formatCount(skill.rating)}
                </span>
                <span style={styles.statItem}>
                  <Download size={13} strokeWidth={1.5} />
                  {formatCount(skill.downloads)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 无结果 */}
      {filteredSkills.length === 0 && (
        <div style={styles.empty}>
          <span style={styles.emptyText}>未找到匹配 “{query}” 的技能</span>
        </div>
      )}

      {/* 底部提示 */}
      {filteredSkills.length > 0 && (
        <div style={styles.footer}>
          <span style={styles.footerText}>共 {filteredSkills.length} 个技能</span>
        </div>
      )}

      {/* ── 发布 skill 弹窗 ── */}
      {publishOpen && (
        <div
          style={styles.overlay}
          onClick={closePublish}
          role="dialog"
          aria-modal="true"
          aria-label="发布 skill"
        >
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            {/* 弹窗头部 */}
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>发布 skill</h2>
              <button style={styles.closeBtn} onClick={closePublish} aria-label="关闭">
                <X size={18} strokeWidth={1.5} color="var(--color-text-tertiary)" />
              </button>
            </div>

            {/* 表单主体 */}
            <div style={styles.modalBody}>
              {/* 图标 + 名称 */}
              <div style={styles.formRow}>
                <label style={styles.formLabel}>名称 <span style={styles.required}>*</span></label>
                <div style={styles.iconConfigRow}>
                  <div
                    style={{
                      ...styles.iconPreview,
                      background: ICON_PRESETS[form.presetIndex].bg,
                      color: ICON_PRESETS[form.presetIndex].color,
                    }}
                  >
                    {deriveIconText(form.name)}
                  </div>
                  <div style={styles.iconConfigRight}>
                    <input
                      style={styles.input}
                      placeholder="给你的 skill 起个名字"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <div style={styles.swatchRow}>
                      {ICON_PRESETS.map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setForm({ ...form, presetIndex: i })}
                          aria-label={`配色 ${i + 1}`}
                          style={{
                            ...styles.swatch,
                            background: p.bg,
                            borderColor: form.presetIndex === i ? p.color : 'transparent',
                          }}
                        >
                          <span style={{ ...styles.swatchDot, background: p.color }} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 上传 skill 文件 */}
              <div style={styles.formRow}>
                <label style={styles.formLabel}>skill 文件 <span style={styles.required}>*</span></label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".zip,application/zip,application/x-zip-compressed"
                  style={{ display: 'none' }}
                  onChange={(e) => handleFiles(e.target.files)}
                />
                {file ? (
                  /* 已选文件 */
                  <div style={styles.fileSelected}>
                    <div style={styles.fileIcon}>
                      <FileArchive size={20} strokeWidth={1.5} color="var(--color-text-secondary)" />
                    </div>
                    <div style={styles.fileInfo}>
                      <span style={styles.fileName}>{file.name}</span>
                      <span style={styles.fileSize}>{formatFileSize(file.size)}</span>
                    </div>
                    <button
                      type="button"
                      style={styles.fileRemove}
                      onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                      aria-label="移除文件"
                    >
                      <X size={16} strokeWidth={1.5} color="var(--color-text-tertiary)" />
                    </button>
                  </div>
                ) : (
                  /* 拖拽 / 点击上传区 */
                  <div
                    style={{
                      ...styles.dropzone,
                      borderColor: dragOver ? 'var(--color-primary)' : 'var(--color-border)',
                      background: dragOver ? 'var(--color-bg-muted)' : 'var(--color-bg-card)',
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click() } }}
                  >
                    <Upload size={24} strokeWidth={1.5} color="var(--color-text-tertiary)" />
                    <span style={styles.dropzoneText}>
                      点击或拖拽文件到此处上传
                    </span>
                    <span style={styles.dropzoneHint}>支持 .zip 格式，最大 100MB</span>
                  </div>
                )}
                {fileError && <span style={styles.fileErrorText}>{fileError}</span>}
              </div>

              {/* 描述 */}
              <div style={styles.formRow}>
                <label style={styles.formLabel}>描述 <span style={styles.optional}>（选填）</span></label>
                <textarea
                  style={styles.textarea}
                  placeholder={extractedDesc ? '留空将自动使用 skill 文件中的描述' : '简要描述这个 skill 的能力与适用场景'}
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                {extractedDesc && !form.description.trim() && (
                  <span style={styles.descHint}>
                    已从文件读取描述：{extractedDesc.length > 60 ? extractedDesc.slice(0, 60) + '…' : extractedDesc}
                  </span>
                )}
              </div>

              {/* 标签 */}
              <div style={styles.formRow}>
                <label style={styles.formLabel}>标签</label>
                <input
                  style={styles.input}
                  placeholder="用逗号分隔，如：搜索, 研究, quant"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />
              </div>

              {/* 需配置 API Key */}
              <label style={styles.checkboxRow}>
                <input
                  type="checkbox"
                  style={styles.checkbox}
                  checked={form.needApiKey}
                  onChange={(e) => setForm({ ...form, needApiKey: e.target.checked })}
                />
                <span style={styles.checkboxLabel}>该 skill 需要配置 API Key</span>
              </label>
            </div>

            {/* 弹窗底部 */}
            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={closePublish}>取消</button>
              <button
                style={{
                  ...styles.submitBtn,
                  background: canSubmit ? 'var(--color-primary)' : 'var(--color-bg-active)',
                  color: canSubmit ? 'var(--color-on-primary)' : 'var(--color-text-placeholder)',
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                }}
                onClick={handlePublish}
                disabled={!canSubmit}
              >
                发布
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
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
    whiteSpace: 'nowrap',
    minWidth: 0,
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    height: 44,
    padding: '0 14px',
    marginBottom: 16,
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    background: 'var(--color-bg-card)',
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: 14,
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-primary)',
  },
  searchClear: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    background: 'transparent',
    cursor: 'pointer',
    padding: 0,
    flexShrink: 0,
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
  tabIcon: { display: 'flex', alignItems: 'center' },
  tabLabel: {
    fontSize: 14,
    lineHeight: '20px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  publishBtn: {
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
    flexShrink: 0,
    marginLeft: 12,
  },
  publishBtnText: {
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--color-on-primary)',
    lineHeight: '20px',
    whiteSpace: 'nowrap',
  },
  dropdownWrapper: { position: 'relative' },
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
    position: 'absolute',
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
  /* ── 卡片 ────────────────────────────────────── */
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: 16,
  },
  card: {
    position: 'relative',
    padding: 20,
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    minHeight: 168,
    overflow: 'hidden',
    transition: 'box-shadow 0.25s ease, border-color 0.25s ease, background 0.3s ease',
    cursor: 'pointer',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 17,
    fontWeight: 600,
    flexShrink: 0,
  },
  cardTitleArea: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    lineHeight: '22px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    margin: 0,
    flex: '0 1 auto',
    minWidth: 0,
  },
  subMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    minWidth: 0,
  },
  author: {
    fontSize: 12,
    fontWeight: 400,
    color: 'var(--color-text-tertiary)',
    lineHeight: '16px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 140,
    flexShrink: 0,
  },
  dot: {
    fontSize: 12,
    color: 'var(--color-text-placeholder)',
    flexShrink: 0,
  },
  updatedAt: {
    fontSize: 12,
    fontWeight: 400,
    color: 'var(--color-text-placeholder)',
    lineHeight: '16px',
    whiteSpace: 'nowrap',
  },
  apiKeyBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
    fontSize: 11,
    fontWeight: 500,
    color: '#B45309',
    background: '#FFFBEB',
    border: '1px solid #FDE68A',
    padding: '2px 8px',
    borderRadius: 'var(--radius-full)',
    lineHeight: '16px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    zIndex: 1,
  },
  metaRow: {
    display: 'none',
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 'auto',
    minWidth: 0,
  },
  tags: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    overflow: 'hidden',
    minWidth: 0,
    flex: 1,
  },
  metaDivider: {
    width: 1,
    height: 12,
    background: 'var(--color-border)',
    flexShrink: 0,
  },
  stats: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
  },
  statItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    fontWeight: 400,
    color: 'var(--color-text-tertiary)',
    lineHeight: '16px',
  },
  cardDesc: {
    fontSize: 13,
    fontWeight: 400,
    color: 'var(--color-text-tertiary)',
    lineHeight: '20px',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    margin: 0,
  },
  /* ── 底部 ────────────────────────────────────── */
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
  empty: {
    display: 'flex',
    justifyContent: 'center',
    padding: '60px 0',
  },
  emptyText: {
    fontSize: 14,
    color: 'var(--color-text-tertiary)',
  },
  /* ── 发布弹窗 ────────────────────────────────── */
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '88vh',
    background: 'var(--color-bg-elevated)',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-lg)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 20px',
    borderBottom: '1px solid var(--color-border-light)',
    flexShrink: 0,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    margin: 0,
    lineHeight: '24px',
  },
  closeBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    border: 'none',
    borderRadius: 'var(--radius-md)',
    background: 'transparent',
    cursor: 'pointer',
    padding: 0,
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    padding: 20,
    overflowY: 'auto',
  },
  formRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    lineHeight: '18px',
  },
  required: {
    color: 'var(--color-danger)',
  },
  optional: {
    fontSize: 12,
    fontWeight: 400,
    color: 'var(--color-text-placeholder)',
  },
  descHint: {
    fontSize: 12,
    fontWeight: 400,
    color: 'var(--color-success)',
    lineHeight: '18px',
  },
  /* ── 文件上传 ────────────────────────────────── */
  dropzone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '28px 20px',
    border: '1.5px dashed var(--color-border)',
    borderRadius: 'var(--radius-md)',
    background: 'var(--color-bg-card)',
    cursor: 'pointer',
    transition: 'border-color 0.15s ease, background 0.15s ease',
    textAlign: 'center',
  },
  dropzoneText: {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    lineHeight: '20px',
  },
  dropzoneHint: {
    fontSize: 12,
    fontWeight: 400,
    color: 'var(--color-text-placeholder)',
    lineHeight: '18px',
  },
  fileSelected: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    background: 'var(--color-bg-muted)',
  },
  fileIcon: {
    width: 36,
    height: 36,
    borderRadius: 'var(--radius-sm)',
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  fileInfo: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  fileName: {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--color-text-primary)',
    lineHeight: '18px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  fileSize: {
    fontSize: 12,
    fontWeight: 400,
    color: 'var(--color-text-tertiary)',
    lineHeight: '16px',
  },
  fileRemove: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    background: 'transparent',
    cursor: 'pointer',
    padding: 0,
    flexShrink: 0,
  },
  fileErrorText: {
    fontSize: 12,
    fontWeight: 400,
    color: 'var(--color-danger)',
    lineHeight: '18px',
  },
  input: {
    width: '100%',
    height: 40,
    padding: '0 12px',
    fontSize: 14,
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-primary)',
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    outline: 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    fontSize: 14,
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-primary)',
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    outline: 'none',
    resize: 'vertical',
    lineHeight: '20px',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
  },
  iconConfigRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
  },
  iconPreview: {
    width: 56,
    height: 56,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    fontWeight: 600,
    flexShrink: 0,
  },
  iconConfigRight: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  swatchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 'var(--radius-sm)',
    border: '2px solid transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    transition: 'border-color 0.15s ease',
  },
  swatchDot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
  },
  checkbox: {
    width: 16,
    height: 16,
    accentColor: 'var(--color-primary)',
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: 14,
    color: 'var(--color-text-secondary)',
    lineHeight: '20px',
  },
  modalFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    padding: '16px 20px',
    borderTop: '1px solid var(--color-border-light)',
    flexShrink: 0,
  },
  cancelBtn: {
    padding: '9px 18px',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: 'var(--font-family)',
    color: 'var(--color-text-secondary)',
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-full)',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  },
  submitBtn: {
    padding: '9px 22px',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: 'var(--font-family)',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    transition: 'background 0.15s ease',
  },
}

export default SkillsMarket
