import React from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import MyCreations from '@/pages/MyCreations'
import PromptDetail from '@/pages/PromptDetail'
import SkillsMarket from '@/pages/SkillsMarket'
import SkillDetail from '@/pages/SkillDetail'

import PlaceholderPage from '@/pages/PlaceholderPage'

/**
 * 应用路由配置
 * 集中管理所有路由，方便 Web 和桌面端共享
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/my-creations" replace />,
  },
  {
    path: '/discover',
    element: <PlaceholderPage title="发现" icon="compass" />,
  },
  {
    path: '/my-creations',
    element: <MyCreations />,
  },
  {
    path: '/prompt/:id',
    element: <PromptDetail />,
  },
  {
    path: '/create',
    element: <PlaceholderPage title="添加提示词" icon="folder" />,
  },
  {
    path: '/skills',
    element: <SkillsMarket />,
  },
  {
    path: '/skills/:slug',
    element: <SkillDetail />,
  },
  {
    path: '/inspiration',
    element: <PlaceholderPage title="灵感广场" icon="folder" />,
  },
  {
    path: '/settings',
    element: <PlaceholderPage title="设置" icon="settings" />,
  },
]

/**
 * 导航菜单项类型
 */
export interface NavItem {
  path: string
  label: string
  iconName: string
  /** 是否在底部区域显示（如设置） */
  bottom?: boolean
}

/**
 * 侧边栏导航项配置
 */
export const navItems: NavItem[] = [
  { path: '/discover', label: '发现', iconName: 'compass' },
  { path: '/my-creations', label: '提示词', iconName: 'sparkles' },
  { path: '/skills', label: '技能', iconName: 'zap' },
  { path: '/inspiration', label: '灵感广场', iconName: 'folder-open' },
]

export const bottomNavItems: NavItem[] = [
  { path: '/settings', label: '设置', iconName: 'settings', bottom: true },
]
