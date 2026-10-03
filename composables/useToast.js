export const useToast = () => {
  // Use a global state for toasts so it can be accessed anywhere
  const toasts = useState('global_toasts', () => [])
  
  const showToast = (title, message, type = 'info', duration = 5000, action = null) => {
    // only run on client
    if (typeof window === 'undefined') return
    
    const id = Date.now() + Math.floor(Math.random() * 1000)
    const newToast = { id, title, message, type, duration, action }
    
    toasts.value.push(newToast)
    
    const timeoutId = window.setTimeout(() => {
      removeToast(id)
    }, duration)
    
    newToast.timeoutId = timeoutId
    return id
  }

  const removeToast = (id) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index !== -1) {
      if (toasts.value[index].timeoutId) {
        clearTimeout(toasts.value[index].timeoutId)
      }
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,
    showToast,
    removeToast
  }
}
