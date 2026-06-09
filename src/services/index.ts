import React, { createContext, useContext } from 'react'
import type { IPromptService } from './promptService'
import { MockPromptService } from './promptService'

/**
 * 所有服务的聚合接口
 * 将来扩展新服务（如 UserService、TagService）只需在此添加
 */
export interface Services {
  promptService: IPromptService
}

/**
 * 创建默认服务实例（当前为 Mock，将来根据平台切换）
 */
export function createServices(): Services {
  return {
    promptService: new MockPromptService(),
  }
}

const ServicesContext = createContext<Services | null>(null)

export const ServicesProvider = ServicesContext.Provider

/**
 * 获取服务实例
 */
export function useServices(): Services {
  const services = useContext(ServicesContext)
  if (!services) {
    throw new Error('useServices must be used within a ServicesProvider')
  }
  return services
}

/**
 * 便捷 hook：直接获取 promptService
 */
export function usePromptService(): IPromptService {
  return useServices().promptService
}
