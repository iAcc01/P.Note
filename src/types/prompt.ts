/**
 * PromptNote 核心数据类型
 */

/** 提示词中的变量定义 */
export interface PromptVariable {
  /** 变量名（如 "场景"） */
  name: string
  /** 变量默认值 */
  defaultValue: string
}

export interface Prompt {
  id: string
  title: string
  description: string
  /** 提示词完整内容（可在详情页查看/复制） */
  content: string
  tags: string[]
  icon: string
  /** 变量列表 — 从 content 中 {变量名} 自动解析或手动添加 */
  variables: PromptVariable[]
  source: 'created' | 'favorited'
  /** 创建时间（ISO 字符串） */
  createdAt: string
  /** 更新时间（ISO 字符串） */
  updatedAt: string
  selected?: boolean
}

export interface CreatePromptDTO {
  title: string
  description: string
  content: string
  tags: string[]
  icon: string
  variables: PromptVariable[]
}

export interface UpdatePromptDTO {
  title?: string
  description?: string
  content?: string
  tags?: string[]
  icon?: string
  variables?: PromptVariable[]
}
