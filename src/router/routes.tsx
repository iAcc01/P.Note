import React from 'react'
import { Navigate, type RouteObject } from 'react-router-dom'
import MyCreations from '@/pages/MyCreations'
import PromptDetail from '@/pages/PromptDetail'
import SkillsMarket from '@/pages/SkillsMarket'
import SkillDetail from '@/pages/SkillDetail'
import AICompanions from '@/pages/AICompanions'
import PlaceholderPage from '@/pages/PlaceholderPage'

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
    element: <AICompanions />,
  },
  {
    path: '/settings',
    element: <PlaceholderPage title="设置" icon="settings" />,
  },
]

export interface NavItem {
  path: string
  label: string
  iconName: string
  bottom?: boolean
}

export const navItems: NavItem[] = [
  { path: '/discover', label: '发现', iconName: 'compass' },
  { path: '/my-creations', label: '提示词', iconName: 'sparkles' },
  { path: '/skills', label: '技能', iconName: 'zap' },
  { path: '/inspiration', label: 'AI搭子', iconName: 'bot' },
]

export const bottomNavItems: NavItem[] = [
  { path: '/settings', label: '设置', iconName: 'settings', bottom: true },
]
