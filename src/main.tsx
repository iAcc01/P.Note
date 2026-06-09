import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { PlatformProvider } from '@/platform/context'
import { ServicesProvider, createServices } from '@/services'
import App from './App'
import './styles/global.css'

/**
 * 应用入口
 *
 * 架构层级（从外到内）：
 * 1. PlatformProvider — 平台感知（Web / Desktop）
 * 2. ServicesProvider — 数据服务层注入
 * 3. HashRouter       — 路由（使用 Hash 路由兼容 Electron file:// 协议）
 * 4. App              — 应用主体
 */
const services = createServices()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PlatformProvider>
      <ServicesProvider value={services}>
        <HashRouter>
          <App />
        </HashRouter>
      </ServicesProvider>
    </PlatformProvider>
  </React.StrictMode>
)
