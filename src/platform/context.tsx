import React, { createContext, useContext, useMemo } from 'react'

export type Platform = 'web' | 'desktop'

interface PlatformContextValue {
  /** 当前运行平台 */
  platform: Platform
  /** 是否为桌面端 */
  isDesktop: boolean
  /** 是否为 Web 端 */
  isWeb: boolean
}

const PlatformContext = createContext<PlatformContextValue>({
  platform: 'web',
  isDesktop: false,
  isWeb: true,
})

/**
 * 检测当前是否运行在 Electron 环境中
 */
function detectPlatform(): Platform {
  if (
    typeof window !== 'undefined' &&
    typeof window.process === 'object' &&
    (window.process as NodeJS.Process)?.versions?.electron
  ) {
    return 'desktop'
  }
  // 也可以通过 userAgent 检测
  if (typeof navigator !== 'undefined' && navigator.userAgent.includes('Electron')) {
    return 'desktop'
  }
  return 'web'
}

export const PlatformProvider: React.FC<{
  platform?: Platform
  children: React.ReactNode
}> = ({ platform: forcePlatform, children }) => {
  const value = useMemo<PlatformContextValue>(() => {
    const platform = forcePlatform ?? detectPlatform()
    return {
      platform,
      isDesktop: platform === 'desktop',
      isWeb: platform === 'web',
    }
  }, [forcePlatform])

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  )
}

/**
 * 获取当前平台信息
 */
export function usePlatform(): PlatformContextValue {
  return useContext(PlatformContext)
}
