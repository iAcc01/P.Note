import React, { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Star,
  Download,
  Calendar,
  Tag,
  ExternalLink,
  Copy,
  Check,
  KeyRound,
  FileText,
} from 'lucide-react'
import type { Skill } from '@/types/skill'
import { ICON_PRESETS, deriveIconText, formatCount, timeAgo, clawhubUrl, clawhubDownloadUrl } from '@/types/skill'
import { clawhubSkills } from '@/data/clawhubSkills'

const SkillDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null)

  const skill: Skill | undefined = clawhubSkills.find(
    (s) => s.slug === slug || s.id === slug,
  )

  const installCmd = skill ? `clawhub install ${skill.slug || skill.id}` : ''
  const downloadUrl = clawhubDownloadUrl(skill?.slug || skill?.id)

  /* 直接触发 zip 包下载 */
  const handleDownload = useCallback(() => {
    if (!downloadUrl || !skill) return
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = `${skill.slug || skill.id}.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [downloadUrl, skill])

  const handleCopy = useCallback(async () => {
    if (!installCmd) return
    try {
      await navigator.clipboard.writeText(installCmd)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = installCmd
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [installCmd])

  /* ── Not Found ── */
  if (!skill) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyWrapper}>
          <h2 style={styles.emptyTitle}>技能不存在</h2>
          <p style={styles.emptySubtitle}>可能已下架或链接无效</p>
          <button
            style={{
              ...styles.backBtnPrimary,
              background: hoveredBtn === 'back-empty' ? 'var(--color-primary-hover)' : 'var(--color-primary)',
            }}
            onMouseEnter={() => setHoveredBtn('back-empty')}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => navigate('/skills')}
          >
            <ArrowLeft size={16} strokeWidth={2} color="var(--color-on-primary)" />
            <span>返回技能</span>
          </button>
        </div>
      </div>
    )
  }

  const preset = ICON_PRESETS[skill.presetIndex] ?? ICON_PRESETS[0]
  const detailUrl = clawhubUrl(skill.slug)

  return (
    <div style={styles.container}>
      {/* 顶部导航 */}
      <div style={styles.topBar}>
        <button
          style={{
            ...styles.backBtn,
            background: hoveredBtn === 'back' ? 'var(--color-bg-hover)' : 'transparent',
          }}
          onMouseEnter={() => setHoveredBtn('back')}
          onMouseLeave={() => setHoveredBtn(null)}
          onClick={() => navigate(-1)}
          aria-label="返回"
        >
          <ArrowLeft size={18} strokeWidth={1.5} color="var(--color-text-secondary)" />
          <span style={styles.backText}>返回</span>
        </button>
      </div>

      {/* 头部信息 */}
      <div style={styles.header}>
        <div style={{ ...styles.icon, background: preset.bg, color: preset.color }}>
          {skill.iconText || deriveIconText(skill.title)}
        </div>
        <div style={styles.headerInfo}>
          <div style={styles.titleLine}>
            <h1 style={styles.title}>{skill.title}</h1>
            {skill.needApiKey && (
              <span style={styles.apiKeyBadge}>
                <KeyRound size={12} strokeWidth={2} />
                需API Key
              </span>
            )}
          </div>
          <div style={styles.metaLine}>
            {skill.author && <span style={styles.author}>by {skill.author}</span>}
            {skill.version && <span style={styles.version}>v{skill.version}</span>}
            {skill.license && <span style={styles.license}>{skill.license}</span>}
          </div>
          <div style={styles.statRow}>
            <span style={styles.stat}>
              <Star size={14} strokeWidth={1.5} />
              {formatCount(skill.rating)} 收藏
            </span>
            <span style={styles.stat}>
              <Download size={14} strokeWidth={1.5} />
              {formatCount(skill.downloads)} 下载
            </span>
            {skill.updatedAt > 0 && (
              <span style={styles.stat}>
                <Calendar size={14} strokeWidth={1.5} />
                {timeAgo(skill.updatedAt)}更新
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 下载入口 */}
      <div style={styles.actions}>
        <button
          type="button"
          onClick={handleDownload}
          style={{
            ...styles.downloadBtn,
            background: hoveredBtn === 'dl' ? 'var(--color-primary-hover)' : 'var(--color-primary)',
            pointerEvents: downloadUrl ? 'auto' : 'none',
            opacity: downloadUrl ? 1 : 0.5,
          }}
          onMouseEnter={() => setHoveredBtn('dl')}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          <Download size={16} strokeWidth={2} color="var(--color-on-primary)" />
          <span>下载 zip 包</span>
        </button>
        {detailUrl && (
          <a
            href={detailUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...styles.linkBtn,
              background: hoveredBtn === 'src' ? 'var(--color-bg-hover)' : 'var(--color-bg-card)',
            }}
            onMouseEnter={() => setHoveredBtn('src')}
            onMouseLeave={() => setHoveredBtn(null)}
          >
            <ExternalLink size={16} strokeWidth={1.5} color="var(--color-text-secondary)" />
            <span style={styles.linkBtnText}>在 ClawHub 查看</span>
          </a>
        )}
      </div>

      {/* 安装命令 */}
      <div style={styles.cmdBlock}>
        <code style={styles.cmdText}>{installCmd}</code>
        <button
          style={{
            ...styles.copyBtn,
            background: copied ? 'var(--color-success-bg)' : hoveredBtn === 'copy' ? 'var(--color-bg-active)' : 'var(--color-bg-card)',
            borderColor: copied ? 'var(--color-success-border)' : 'var(--color-border)',
          }}
          onMouseEnter={() => setHoveredBtn('copy')}
          onMouseLeave={() => setHoveredBtn(null)}
          onClick={handleCopy}
          aria-label="复制安装命令"
        >
          {copied ? (
            <>
              <Check size={14} strokeWidth={2} color="var(--color-success)" />
              <span style={{ ...styles.copyText, color: 'var(--color-success)' }}>已复制</span>
            </>
          ) : (
            <>
              <Copy size={14} strokeWidth={1.5} color="var(--color-text-secondary)" />
              <span style={styles.copyText}>复制</span>
            </>
          )}
        </button>
      </div>

      {/* 标签 */}
      {skill.tags && skill.tags.length > 0 && (
        <div style={styles.tagsRow}>
          <Tag size={14} strokeWidth={1.5} color="var(--color-text-tertiary)" />
          {skill.tags.map((tag, i) => (
            <span key={i} className="prompt-card-tag">#{tag}</span>
          ))}
        </div>
      )}

      <div style={styles.divider} />

      {/* 描述 */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>简介</h2>
        <p style={styles.descText}>{skill.description}</p>
      </section>

      {/* 更新日志 */}
      {skill.changelog && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <FileText size={16} strokeWidth={1.5} color="var(--color-text-secondary)" />
            更新日志{skill.version ? `（v${skill.version}）` : ''}
          </h2>
          <div style={styles.changelogBlock}>
            <pre style={styles.changelogPre}>{skill.changelog}</pre>
          </div>
        </section>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: 800,
    paddingTop: 8,
  },
  /* Not Found */
  emptyWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    minHeight: 400,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: 'var(--color-text-primary)',
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'var(--color-text-tertiary)',
  },
  backBtnPrimary: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 20px',
    border: 'none',
    borderRadius: 20,
    background: 'var(--color-primary)',
    color: 'var(--color-on-primary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    fontSize: 14,
    fontWeight: 500,
    marginTop: 8,
    transition: 'background 0.15s ease',
  },
  /* 顶部导航 */
  topBar: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 24,
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    background: 'transparent',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    transition: 'background 0.15s ease',
  },
  backText: {
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    lineHeight: '20px',
  },
  /* 头部 */
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 'var(--radius-lg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    fontWeight: 600,
    flexShrink: 0,
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  titleLine: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    lineHeight: '32px',
    margin: 0,
    wordBreak: 'break-word',
  },
  apiKeyBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
    fontSize: 12,
    fontWeight: 500,
    color: '#B45309',
    background: '#FFFBEB',
    border: '1px solid #FDE68A',
    padding: '2px 10px',
    borderRadius: 'var(--radius-full)',
    lineHeight: '18px',
    whiteSpace: 'nowrap',
  },
  metaLine: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  author: {
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
  },
  version: {
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--color-text-tertiary)',
    background: 'var(--color-bg-muted)',
    padding: '2px 8px',
    borderRadius: 'var(--radius-sm)',
  },
  license: {
    fontSize: 12,
    fontWeight: 400,
    color: 'var(--color-text-tertiary)',
  },
  statRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
    marginTop: 2,
  },
  stat: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 13,
    fontWeight: 400,
    color: 'var(--color-text-tertiary)',
    lineHeight: '18px',
  },
  /* 操作区 */
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginTop: 24,
    flexWrap: 'wrap',
  },
  downloadBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 24px',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-primary)',
    color: 'var(--color-on-primary)',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: 'var(--font-family)',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  },
  linkBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 18px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-bg-card)',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  },
  linkBtnText: {
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
  },
  /* 安装命令 */
  cmdBlock: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
    padding: '12px 16px',
    background: 'var(--color-bg-sidebar)',
    border: '1px solid var(--color-border-light)',
    borderRadius: 'var(--radius-md)',
  },
  cmdText: {
    fontSize: 13,
    fontFamily: 'var(--font-family-mono)',
    color: 'var(--color-text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  copyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-bg-card)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    flexShrink: 0,
    transition: 'background 0.15s ease, border-color 0.15s ease',
  },
  copyText: {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    lineHeight: '20px',
  },
  /* 标签 */
  tagsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 16,
  },
  divider: {
    height: 1,
    background: 'var(--color-border)',
    margin: '24px 0',
  },
  /* 区块 */
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 24,
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    lineHeight: '24px',
    margin: 0,
  },
  descText: {
    fontSize: 14,
    fontWeight: 400,
    color: 'var(--color-text-secondary)',
    lineHeight: '22px',
    margin: 0,
    wordBreak: 'break-word',
  },
  changelogBlock: {
    background: 'var(--color-bg-sidebar)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border-light)',
    padding: 20,
    overflow: 'auto',
  },
  changelogPre: {
    fontSize: 13,
    fontWeight: 400,
    color: 'var(--color-text-secondary)',
    lineHeight: '22px',
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontFamily: 'var(--font-family)',
  },
}

export default SkillDetail
