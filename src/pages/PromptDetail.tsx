import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Copy,
  Heart,
  Pencil,
  Trash2,
  Check,
  Clock,
  Calendar,
} from 'lucide-react'
import { usePromptService } from '@/services'
import type { Prompt } from '@/types/prompt'

const PromptDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const promptService = usePromptService()

  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    promptService.getById(id).then((data) => {
      setPrompt(data)
      setLoading(false)
    })
  }, [id, promptService])

  const handleCopy = useCallback(async () => {
    if (!prompt) return
    try {
      await navigator.clipboard.writeText(prompt.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const textarea = document.createElement('textarea')
      textarea.value = prompt.content
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [prompt])

  const handleDelete = useCallback(async () => {
    if (!prompt) return
    await promptService.delete(prompt.id)
    navigate(-1)
  }, [prompt, promptService, navigate])

  const handleToggleFavorite = useCallback(async () => {
    if (!prompt) return
    const updated = await promptService.toggleFavorite(prompt.id)
    setPrompt(updated)
  }, [prompt, promptService])

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const formatRelativeTime = (dateStr: string) => {
    const now = new Date()
    const d = new Date(dateStr)
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return '今天'
    if (days === 1) return '昨天'
    if (days < 7) return `${days} 天前`
    if (days < 30) return `${Math.floor(days / 7)} 周前`
    return formatDate(dateStr)
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingWrapper}>
          <div style={styles.loadingText}>加载中...</div>
        </div>
      </div>
    )
  }

  /* ── Not Found ── */
  if (!prompt) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyWrapper}>
          <h2 style={styles.emptyTitle}>提示词不存在</h2>
          <p style={styles.emptySubtitle}>可能已被删除或链接无效</p>
          <button
            style={{
              ...styles.backBtnPrimary,
              background: hoveredBtn === 'back-empty'
                ? 'var(--color-primary-hover)'
                : 'var(--color-primary)',
            }}
            onMouseEnter={() => setHoveredBtn('back-empty')}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} strokeWidth={2} />
            <span>返回</span>
          </button>
        </div>
      </div>
    )
  }

  const isFavorited = prompt.source === 'favorited'

  return (
    <div style={styles.container}>
      {/* ── 顶部导航栏 ── */}
      <div style={styles.topBar}>
        <button
          style={{
            ...styles.backBtn,
            background: hoveredBtn === 'back'
              ? 'var(--color-bg-hover)'
              : 'transparent',
          }}
          onMouseEnter={() => setHoveredBtn('back')}
          onMouseLeave={() => setHoveredBtn(null)}
          onClick={() => navigate(-1)}
          aria-label="返回"
        >
          <ArrowLeft size={18} strokeWidth={1.5} color="var(--color-text-secondary)" />
          <span style={styles.backText}>返回</span>
        </button>

        <div style={styles.topActions}>
          {/* 收藏 */}
          <button
            style={{
              ...styles.actionBtn,
              background: hoveredBtn === 'fav'
                ? 'var(--color-bg-hover)'
                : 'transparent',
            }}
            onMouseEnter={() => setHoveredBtn('fav')}
            onMouseLeave={() => setHoveredBtn(null)}
            onClick={handleToggleFavorite}
            aria-label={isFavorited ? '取消收藏' : '收藏'}
            title={isFavorited ? '取消收藏' : '收藏'}
          >
            <Heart
              size={18}
              strokeWidth={isFavorited ? 0 : 1.5}
              fill={isFavorited ? '#ef4444' : 'none'}
              color={isFavorited ? '#ef4444' : 'var(--color-text-tertiary)'}
            />
          </button>

          {/* 编辑 */}
          {prompt.source === 'created' && (
            <button
              style={{
                ...styles.actionBtn,
                background: hoveredBtn === 'edit'
                  ? 'var(--color-bg-hover)'
                  : 'transparent',
              }}
              onMouseEnter={() => setHoveredBtn('edit')}
              onMouseLeave={() => setHoveredBtn(null)}
              aria-label="编辑"
              title="编辑"
            >
              <Pencil size={18} strokeWidth={1.5} color="var(--color-text-tertiary)" />
            </button>
          )}

          {/* 删除 */}
          {prompt.source === 'created' && (
            <button
              style={{
                ...styles.actionBtn,
                background: hoveredBtn === 'delete'
                  ? 'var(--color-danger-bg)'
                  : 'transparent',
              }}
              onMouseEnter={() => setHoveredBtn('delete')}
              onMouseLeave={() => setHoveredBtn(null)}
              onClick={handleDelete}
              aria-label="删除"
              title="删除"
            >
              <Trash2
                size={18}
                strokeWidth={1.5}
                color={hoveredBtn === 'delete' ? 'var(--color-danger)' : 'var(--color-text-tertiary)'}
              />
            </button>
          )}
        </div>
      </div>

      {/* ── 详情主体 ── */}
      <div style={styles.detailBody}>
        {/* 头部信息 */}
        <div style={styles.header}>
          <h1 style={styles.title}>{prompt.title}</h1>
          <p style={styles.description}>{prompt.description}</p>

          {/* 标签 */}
          <div style={styles.tags}>
            {prompt.tags.map((tag, idx) => (
              <span key={idx} className="prompt-card-tag">
                #{tag}
              </span>
            ))}
          </div>

          {/* 元信息 */}
          <div style={styles.metaRow}>
            <div style={styles.metaItem}>
              <Calendar size={14} strokeWidth={1.5} color="var(--color-text-placeholder)" />
              <span style={styles.metaText}>创建于 {formatDate(prompt.createdAt)}</span>
            </div>
            <div style={styles.metaDivider} />
            <div style={styles.metaItem}>
              <Clock size={14} strokeWidth={1.5} color="var(--color-text-placeholder)" />
              <span style={styles.metaText}>更新于 {formatRelativeTime(prompt.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* 分隔线 */}
        <div style={styles.divider} />

        {/* 提示词内容 */}
        <div style={styles.contentSection}>
          <div style={styles.contentHeader}>
            <h2 style={styles.contentTitle}>提示词内容</h2>
            <button
              style={{
                ...styles.copyBtn,
                background: copied
                  ? 'var(--color-success-bg)'
                  : hoveredBtn === 'copy'
                    ? 'var(--color-bg-active)'
                    : 'var(--color-bg-muted)',
                borderColor: copied
                  ? 'var(--color-success-border)'
                  : 'var(--color-border)',
              }}
              onMouseEnter={() => setHoveredBtn('copy')}
              onMouseLeave={() => setHoveredBtn(null)}
              onClick={handleCopy}
              aria-label="复制提示词"
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

          <div style={styles.contentBlock}>
            <pre style={styles.contentPre}>{prompt.content}</pre>
          </div>
        </div>
      </div>
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

  /* ── Loading / Empty ── */
  loadingWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  loadingText: {
    fontSize: 14,
    color: 'var(--color-text-tertiary)',
  },
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

  /* ── 顶部导航 ── */
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  topActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    border: 'none',
    borderRadius: 'var(--radius-md)',
    background: 'transparent',
    cursor: 'pointer',
    padding: 0,
    transition: 'background 0.15s ease',
  },

  /* ── 详情主体 ── */
  detailBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },

  /* ── 头部信息 ── */
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    lineHeight: '32px',
    margin: 0,
    wordBreak: 'break-word',
  },
  description: {
    fontSize: 14,
    fontWeight: 400,
    color: 'var(--color-text-secondary)',
    lineHeight: '21px',

    margin: 0,
    wordBreak: 'break-word',
  },
  tags: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap' as const,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    fontWeight: 400,
    color: 'var(--color-text-placeholder)',
    lineHeight: '20px',
  },
  metaDivider: {
    width: 1,
    height: 12,
    background: 'var(--color-border)',
  },

  /* ── 分隔线 ── */
  divider: {
    height: 1,
    background: 'var(--color-border)',
    margin: '24px 0',
  },

  /* ── 内容区 ── */
  contentSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    lineHeight: '24px',
    margin: 0,
  },
  copyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-bg-muted)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    transition: 'background 0.15s ease, border-color 0.15s ease',
  },
  copyText: {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--color-text-secondary)',
    lineHeight: '20px',
  },

  /* ── 提示词内容块 ── */
  contentBlock: {
    background: 'var(--color-bg-sidebar)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--color-border-light)',
    padding: 24,
    overflow: 'auto',
  },
  contentPre: {
    fontSize: 14,
    fontWeight: 400,
    color: 'var(--color-text-primary)',
    lineHeight: '24px',
    margin: 0,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontFamily: 'var(--font-family)',
  },
}

export default PromptDetail
