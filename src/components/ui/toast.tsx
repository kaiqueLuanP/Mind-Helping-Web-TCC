import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'warning'
  onClose: () => void
  id: string
}

export function Toast({ message, type, onClose, id }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose()
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose()
    }, 300) // Duração da animação de saída
  }

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500'
  }[type]

  return (
    <div
      className={`
        ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg 
        flex items-center justify-between gap-3 min-w-[300px] max-w-[500px]
        transition-all duration-300 ease-in-out
        ${isExiting 
          ? 'animate-toast-out' 
          : 'animate-toast-in'
        }
      `}
      style={{
        animation: isExiting 
          ? 'toastOut 0.3s ease-in-out forwards' 
          : 'toastIn 0.3s ease-in-out'
      }}
    >
      <span className="flex-1 break-words">{message}</span>
      <button 
        onClick={handleClose} 
        className="hover:opacity-80 transition-opacity flex-shrink-0"
        aria-label="Fechar notificação"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// Container para os toasts com limite
export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @keyframes toastIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes toastOut {
          from {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          to {
            transform: translateX(100%) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <div className="pointer-events-auto flex flex-col gap-2">
          {children}
        </div>
      </div>
    </>
  )
}

// Hook personalizado para gerenciar toasts com limite
import { useState as useStateHook, useCallback } from 'react'

export interface ToastData {
  id: string
  message: string
  type: 'success' | 'error' | 'warning'
}

const MAX_TOASTS = 2 // Limite de toasts visíveis

export function useToast() {
  const [toasts, setToasts] = useStateHook<ToastData[]>([])

  const addToast = useCallback((message: string, type: ToastData['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9)
    
    setToasts((prev) => {
      const newToasts = [...prev, { id, message, type }]
      // Mantém apenas os últimos MAX_TOASTS
      return newToasts.slice(-MAX_TOASTS)
    })

    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback((message: string) => addToast(message, 'success'), [addToast])
  const error = useCallback((message: string) => addToast(message, 'error'), [addToast])
  const warning = useCallback((message: string) => addToast(message, 'warning'), [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning
  }
}