import React, { useMemo, useState } from 'react'
import {
  Bot,
  Briefcase,
  Check,
  GraduationCap,
  HeartHandshake,
  PenLine,
  Plus,
  Sparkles,
  X,
} from 'lucide-react'

type CompanionCategory = 'all' | 'work' | 'creative' | 'study' | 'life'

interface Companion {
  id: string
  name: string
  role: string
  category: Exclude<CompanionCategory, 'all'>
  tone: string
  scenario: string
  skills: string[]
}

interface CompanionDraft {
  name: string
  role: string
  tone: string
  scenario: string
  skills: string
}

const categories: Array<{ key: CompanionCategory; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'work', label: '工作效率' },
  { key: 'creative', label: '写作创意' },
  { key: 'study', label: '学习研究' },
  { key: 'life', label: '生活陪伴' },
]

const categoryIconMap: Record<Exclude<CompanionCategory, 'all'>, React.ReactNode> = {
  work: <Briefcase size={18} strokeWidth={1.5} />,
  creative: <PenLine size={18} strokeWidth={1.5} />,
  study: <GraduationCap size={18} strokeWidth={1.5} />,
  life: <HeartHandshake size={18} strokeWidth={1.5} />,
}

const companionSeeds: Companion[] = [
  {
    id: 'product-sparring',
    name: '产品陪练',
    role: '把模糊想法拆成可落地方案',
    category: 'work',
    tone: '直接、结构化、会追问',
    scenario: '适合 PRD 梳理、需求评审、MVP 范围收敛。',
    skills: ['需求拆解', '优先级', '用户故事'],
  },
  {
    id: 'code-reviewer',
    name: '代码审阅员',
    role: '专注发现风险和边界条件',
    category: 'work',
    tone: '严谨、克制、证据优先',
    scenario: '适合提交前自查、重构方案评估、Bug 复盘。',
    skills: ['风险识别', '测试建议', '边界条件'],
  },
  {
    id: 'story-editor',
    name: '故事编辑',
    role: '帮你找到更有张力的表达',
    category: 'creative',
    tone: '敏锐、温和、重视节奏',
    scenario: '适合文章、短视频脚本、品牌故事和开头优化。',
    skills: ['叙事结构', '标题', '语气润色'],
  },
  {
    id: 'research-guide',
    name: '研究向导',
    role: '把复杂主题整理成学习路径',
    category: 'study',
    tone: '耐心、清晰、善于举例',
    scenario: '适合论文阅读、概念入门、资料框架搭建。',
    skills: ['知识地图', '提问清单', '资料整理'],
  },
  {
    id: 'daily-planner',
    name: '日程搭子',
    role: '把待办变成不压迫的行动安排',
    category: 'life',
    tone: '稳定、轻量、注重节奏',
    scenario: '适合每日计划、精力管理、复盘和习惯跟进。',
    skills: ['日程规划', '复盘', '节奏管理'],
  },
  {
    id: 'interview-coach',
    name: '面试教练',
    role: '模拟真实追问并打磨回答',
    category: 'work',
    tone: '专业、具体、反馈明确',
    scenario: '适合行为面试、作品集讲解、技术方案表达。',
    skills: ['模拟追问', '表达打磨', 'STAR'],
  },
]

const emptyDraft: CompanionDraft = {
  name: '',
  role: '',
  tone: '',
  scenario: '',
  skills: '',
}

const AICompanions: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CompanionCategory>('all')
  const [selectedId, setSelectedId] = useState(companionSeeds[0].id)
  const [customCompanions, setCustomCompanions] = useState<Companion[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const [draft, setDraft] = useState<CompanionDraft>(emptyDraft)

  const companions = useMemo(
    () => [...customCompanions, ...companionSeeds],
    [customCompanions],
  )

  const filteredCompanions = companions.filter((item) => {
    return activeCategory === 'all' || item.category === activeCategory
  })

  const canCreate = draft.name.trim() && draft.role.trim()

  const createCompanion = () => {
    if (!canCreate) return

    const skills = draft.skills
      .split(/[,，、\s]+/)
      .map((item) => item.trim())
      .filter(Boolean)

    const companion: Companion = {
      id: `custom-${Date.now()}`,
      name: draft.name.trim(),
      role: draft.role.trim(),
      category: 'life',
      tone: draft.tone.trim() || '按你的偏好灵活调整',
      scenario: draft.scenario.trim() || '适合你自定义的长期对话场景。',
      skills: skills.length ? skills.slice(0, 4) : ['自定义人设'],
    }

    setCustomCompanions((prev) => [companion, ...prev])
    setSelectedId(companion.id)
    setActiveCategory('all')
    setDraft(emptyDraft)
    setCreateOpen(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <div style={styles.titleGroup}>
          <div style={styles.titleIcon}>
            <Bot size={28} strokeWidth={1.5} color="var(--color-text-primary)" />
          </div>
          <h1 style={styles.pageTitle}>AI搭子</h1>
        </div>
        <button style={styles.createButton} onClick={() => setCreateOpen(true)}>
          <Plus size={16} strokeWidth={2} color="var(--color-on-primary)" />
          <span style={styles.createButtonText}>创建搭子</span>
        </button>
      </div>

      <div style={styles.categoryTabs} role="tablist" aria-label="AI搭子分类">
        {categories.map((category) => {
          const isActive = activeCategory === category.key
          return (
            <button
              key={category.key}
              role="tab"
              aria-selected={isActive}
              style={{
                ...styles.categoryTab,
                ...(isActive ? styles.categoryTabActive : {}),
              }}
              onClick={() => setActiveCategory(category.key)}
            >
              {category.label}
            </button>
          )
        })}
      </div>

      <section style={styles.cardGrid} aria-label="AI搭子列表">
        {filteredCompanions.map((item) => {
          const isSelected = selectedId === item.id
          return (
            <article
              key={item.id}
              style={{
                ...styles.companionCard,
                ...(isSelected ? styles.companionCardSelected : {}),
              }}
            >
              <button
                style={styles.cardButton}
                onClick={() => setSelectedId(item.id)}
                aria-label={`选择${item.name}`}
              >
                <div style={styles.cardTop}>
                  <div style={styles.avatar}>
                    {categoryIconMap[item.category]}
                  </div>
                  {isSelected && (
                    <span style={styles.selectedBadge}>
                      <Check size={13} strokeWidth={2} color="var(--color-on-primary)" />
                    </span>
                  )}
                </div>

                <div style={styles.cardBody}>
                  <h2 style={styles.cardTitle}>{item.name}</h2>
                  <p style={styles.cardRole}>{item.role}</p>
                  <p style={styles.cardMeta}>{item.tone}</p>
                  <p style={styles.cardScenario}>{item.scenario}</p>
                </div>

                <div style={styles.skillList}>
                  {item.skills.map((skill) => (
                    <span key={skill} style={styles.skillPill}>{skill}</span>
                  ))}
                </div>
              </button>
            </article>
          )
        })}
      </section>

      {createOpen && (
        <div style={styles.modalOverlay} role="presentation" onMouseDown={() => setCreateOpen(false)}>
          <div
            style={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-label="创建AI搭子"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>创建搭子人设</h2>
                <p style={styles.modalSubtitle}>先保存一个轻量角色，后续可以继续细化提示词。</p>
              </div>
              <button style={styles.iconButton} onClick={() => setCreateOpen(false)} aria-label="关闭">
                <X size={18} strokeWidth={1.5} color="var(--color-text-secondary)" />
              </button>
            </div>

            <div style={styles.formGrid}>
              <label style={styles.field}>
                <span style={styles.fieldLabel}>名称</span>
                <input
                  style={styles.input}
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="例如：论文陪读"
                />
              </label>
              <label style={styles.field}>
                <span style={styles.fieldLabel}>定位</span>
                <input
                  style={styles.input}
                  value={draft.role}
                  onChange={(e) => setDraft({ ...draft, role: e.target.value })}
                  placeholder="一句话说明它帮你做什么"
                />
              </label>
              <label style={styles.field}>
                <span style={styles.fieldLabel}>性格/语气</span>
                <input
                  style={styles.input}
                  value={draft.tone}
                  onChange={(e) => setDraft({ ...draft, tone: e.target.value })}
                  placeholder="例如：耐心、直接、像教练一样"
                />
              </label>
              <label style={styles.field}>
                <span style={styles.fieldLabel}>能力标签</span>
                <input
                  style={styles.input}
                  value={draft.skills}
                  onChange={(e) => setDraft({ ...draft, skills: e.target.value })}
                  placeholder="用逗号分隔，例如：提纲, 润色, 追问"
                />
              </label>
              <label style={{ ...styles.field, gridColumn: '1 / -1' }}>
                <span style={styles.fieldLabel}>使用场景</span>
                <textarea
                  style={styles.textarea}
                  value={draft.scenario}
                  onChange={(e) => setDraft({ ...draft, scenario: e.target.value })}
                  placeholder="描述你希望它在哪些任务里陪你协作"
                />
              </label>
            </div>

            <div style={styles.modalFooter}>
              <button style={styles.secondaryButton} onClick={() => setCreateOpen(false)}>取消</button>
              <button
                style={{
                  ...styles.submitButton,
                  opacity: canCreate ? 1 : 0.45,
                  cursor: canCreate ? 'pointer' : 'not-allowed',
                }}
                onClick={createCompanion}
                disabled={!canCreate}
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    width: '100%',
    minHeight: '100%',
  },
  pageHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 20,
    paddingTop: 8,
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
  },
  titleIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    flexShrink: 0,
  },
  pageTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 700,
    color: 'var(--color-text-primary)',
    lineHeight: '32px',
  },
  createButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 18px',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-primary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    flexShrink: 0,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: 500,
    color: 'var(--color-on-primary)',
    lineHeight: '20px',
  },
  categoryTabs: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    overflowX: 'auto',
    paddingBottom: 2,
  },
  categoryTab: {
    padding: '8px 14px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-bg-card)',
    color: 'var(--color-text-tertiary)',
    fontSize: 13,
    lineHeight: '18px',
    fontWeight: 500,
    fontFamily: 'var(--font-family)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    outline: 'none',
  },
  categoryTabActive: {
    background: 'var(--color-primary)',
    borderColor: 'var(--color-primary)',
    color: 'var(--color-on-primary)',
    boxShadow: 'none',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 16,
  },
  companionCard: {
    minHeight: 260,
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    background: 'var(--color-bg-card)',
    overflow: 'hidden',
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
  },
  companionCardSelected: {
    borderColor: 'var(--color-primary)',
    boxShadow: '0 0 0 3px rgba(23, 23, 23, 0.08)',
  },
  cardButton: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    minHeight: 260,
    padding: 18,
    border: 'none',
    background: 'transparent',
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderRadius: 'var(--radius-lg)',
    background: 'var(--color-bg-muted)',
    color: 'var(--color-text-primary)',
  },
  selectedBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: 'var(--color-primary)',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
    minWidth: 0,
  },
  cardTitle: {
    margin: 0,
    fontSize: 17,
    lineHeight: '24px',
    color: 'var(--color-text-primary)',
    fontWeight: 700,
  },
  cardRole: {
    margin: 0,
    fontSize: 13,
    lineHeight: '20px',
    color: 'var(--color-text-secondary)',
    fontWeight: 500,
  },
  cardMeta: {
    margin: 0,
    fontSize: 13,
    lineHeight: '20px',
    color: 'var(--color-text-tertiary)',
  },
  cardScenario: {
    margin: 0,
    fontSize: 13,
    lineHeight: '20px',
    color: 'var(--color-text-tertiary)',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  skillList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 'auto',
    paddingTop: 16,
  },
  skillPill: {
    padding: '3px 8px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-bg-muted)',
    color: 'var(--color-text-tertiary)',
    fontSize: 12,
    lineHeight: '17px',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    background: 'rgba(10, 10, 10, 0.24)',
  },
  modal: {
    width: 'min(640px, 100%)',
    borderRadius: 'var(--radius-xl)',
    border: '1px solid var(--color-border)',
    background: 'var(--color-bg-elevated)',
    boxShadow: 'var(--shadow-lg)',
    padding: 20,
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 20,
  },
  modalTitle: {
    margin: 0,
    fontSize: 18,
    lineHeight: '26px',
    fontWeight: 700,
    color: 'var(--color-text-primary)',
  },
  modalSubtitle: {
    margin: '3px 0 0',
    fontSize: 13,
    lineHeight: '20px',
    color: 'var(--color-text-tertiary)',
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    background: 'var(--color-bg-card)',
    cursor: 'pointer',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 14,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
  },
  fieldLabel: {
    fontSize: 12,
    lineHeight: '17px',
    color: 'var(--color-text-secondary)',
    fontWeight: 600,
  },
  input: {
    height: 40,
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '0 12px',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-family)',
    fontSize: 14,
    outline: 'none',
    background: 'var(--color-bg-card)',
  },
  textarea: {
    minHeight: 88,
    resize: 'vertical',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: '10px 12px',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-family)',
    fontSize: 14,
    lineHeight: '20px',
    outline: 'none',
    background: 'var(--color-bg-card)',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
  secondaryButton: {
    height: 38,
    padding: '0 16px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-bg-card)',
    color: 'var(--color-text-secondary)',
    cursor: 'pointer',
    fontFamily: 'var(--font-family)',
    fontSize: 14,
    fontWeight: 500,
  },
  submitButton: {
    height: 38,
    padding: '0 18px',
    border: 'none',
    borderRadius: 'var(--radius-full)',
    background: 'var(--color-primary)',
    color: 'var(--color-on-primary)',
    fontFamily: 'var(--font-family)',
    fontSize: 14,
    fontWeight: 600,
  },
}

export default AICompanions
