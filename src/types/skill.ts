/**
 * 技能核心类型与工具
 */

/** 技能 */
export interface Skill {
  id: string
  /** clawhub slug，用于详情页与外链 */
  slug?: string
  title: string
  description: string
  /** 作者 / 发布者 */
  author?: string
  /** 作者头像 URL */
  authorImage?: string
  /** 图标配色预设索引（ICON_PRESETS） */
  presetIndex: number
  /** 图标文字；不填则取标题首字 */
  iconText?: string
  /** 评分 / 收藏数（clawhub stars） */
  rating: number
  /** 下载量 */
  downloads: number
  /** 最新版本号 */
  version?: string
  /** 许可证 */
  license?: string
  /** 更新日志 */
  changelog?: string
  /** 更新时间（ms 时间戳） */
  updatedAt: number
  /** 标签 */
  tags?: string[]
  /** 是否需要配置 API Key */
  needApiKey?: boolean
  isNew?: boolean
  isHot?: boolean
}

/** 图标配色预设 */
export const ICON_PRESETS: { bg: string; color: string }[] = [
  { bg: '#EFF6FF', color: '#2563EB' }, // 蓝
  { bg: '#F0FDF4', color: '#16A34A' }, // 绿
  { bg: '#FFF7ED', color: '#EA580C' }, // 橙
  { bg: '#FAF5FF', color: '#9333EA' }, // 紫
  { bg: '#FDF2F8', color: '#DB2777' }, // 粉
  { bg: '#F0FDFA', color: '#0D9488' }, // 青
  { bg: '#FEFCE8', color: '#CA8A04' }, // 琥珀
  { bg: '#F5F5F5', color: '#171717' }, // 黑
]

/** 取名称的首个汉字或字母作为图标文字 */
export const deriveIconText = (name: string): string => {
  const m = name.match(/[\u4e00-\u9fa5a-zA-Z]/)
  if (!m) return name.trim().charAt(0) || 'S'
  return /[a-z]/.test(m[0]) ? m[0].toUpperCase() : m[0]
}

/** 数字格式化（万 / k） */
export const formatCount = (n: number): string => {
  if (n >= 10000) return (n / 10000).toFixed(1).replace(/\.0$/, '') + ' 万'
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return String(n)
}

/** 相对时间：x 时/天/周/月/年前更新 */
export const timeAgo = (ts: number): string => {
  if (!ts) return ''
  const diff = Date.now() - ts
  if (diff < 0) return '刚刚'
  const min = Math.floor(diff / 60000)
  const hour = Math.floor(diff / 3600000)
  const day = Math.floor(diff / 86400000)
  const week = Math.floor(day / 7)
  const month = Math.floor(day / 30)
  const year = Math.floor(day / 365)
  if (year >= 1) return `${year} 年前`
  if (month >= 1) return `${month} 个月前`
  if (week >= 1) return `${week} 周前`
  if (day >= 1) return `${day} 天前`
  if (hour >= 1) return `${hour} 小时前`
  if (min >= 1) return `${min} 分钟前`
  return '刚刚'
}

/** clawhub 详情页外链 */
export const clawhubUrl = (slug?: string): string =>
  slug ? `https://clawhub.ai/skills/${slug}` : ''

/** clawhub skill zip 下载直链 */
export const clawhubDownloadUrl = (slug?: string): string =>
  slug ? `https://clawhub.ai/api/v1/download?slug=${encodeURIComponent(slug)}` : ''
