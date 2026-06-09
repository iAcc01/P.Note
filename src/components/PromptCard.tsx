import React from 'react'
import {
  Heart,
  Copy,
  Ellipsis,
} from 'lucide-react'
import type { Prompt } from '@/types/prompt'

interface PromptCardComponentProps {
  card: Prompt
  onClick?: () => void
  onFavorite?: (card: Prompt) => void
  onCopy?: (card: Prompt) => void
  onMore?: (card: Prompt) => void
}

const PromptCardComponent: React.FC<PromptCardComponentProps> = ({
  card,
  onClick,
  onFavorite,
  onCopy,
  onMore,
}) => {
  return (
    <div
      className="prompt-card"
      onClick={onClick}
      role="article"
      tabIndex={0}
      aria-label={`提示词: ${card.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      {/* 标题 */}
      <h3 style={styles.title}>{card.title}</h3>

      {/* 描述 */}
      <p style={styles.description}>{card.description}</p>

      {/* 标签 */}
      <div style={styles.tags}>
        {card.tags.map((tag, index) => (
          <span key={index} className="prompt-card-tag">
            #{tag}
          </span>
        ))}
      </div>

      {/* hover 操作按钮组 — absolute 定位右上角 */}
      <div className="prompt-card-actions">
        <button
          className="prompt-card-action-btn"
          onClick={(e) => { e.stopPropagation(); onFavorite?.(card) }}
          aria-label="收藏"
          title="收藏"
        >
          <Heart size={16} strokeWidth={1.5} />
        </button>
        <button
          className="prompt-card-action-btn"
          onClick={(e) => { e.stopPropagation(); onCopy?.(card) }}
          aria-label="复制"
          title="复制"
        >
          <Copy size={16} strokeWidth={1.5} />
        </button>
        <button
          className="prompt-card-action-btn"
          onClick={(e) => { e.stopPropagation(); onMore?.(card) }}
          aria-label="更多操作"
          title="更多"
        >
          <Ellipsis size={16} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  title: {
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    lineHeight: '24px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    flex: 1,
    minWidth: 0,
    margin: 0,
  },
  description: {
    fontSize: 13,
    fontWeight: 400,
    color: 'var(--color-text-tertiary)',
    lineHeight: '19.5px',

    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    wordBreak: 'break-all',
    margin: 0,
  },
  tags: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap' as const,
    marginTop: 'auto',
  },
}

export default PromptCardComponent
