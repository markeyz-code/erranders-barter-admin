

// src/composables/core/useCustomToast.ts
import { useToast } from '~/composables/useToast'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastOptions {
  title: string
  message: string
  toastType?: ToastType
  type?: ToastType
  duration?: number
  action?: () => void
}

export const useCustomToast = () => {
  const { showToast: nativeShowToast } = useToast()
  
  const showToast = (options: ToastOptions) => {
    const { title, message, toastType, type, duration = 5000, action } = options
    const actualType = (toastType || type || 'info') as ToastType
    
    return nativeShowToast(title, message, actualType, duration, action)
  }
  
  return {
    showToast
  }
}