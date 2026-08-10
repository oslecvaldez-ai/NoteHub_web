import {
  type PropsWithChildren,
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  NotificationContext,
  type NotificationVariant,
  type NotificationItem,
} from './notification-context'

export function NotificationProvider({ children }: PropsWithChildren): ReactElement {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const nextId = useRef(0)
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>())

  const dismiss = useCallback((id: number): void => {
    setNotifications((current) => current.filter((notification) => notification.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const notify = useCallback(
    (message: string, variant: NotificationVariant = 'info'): number => {
      const id = ++nextId.current
      setNotifications((current) => [...current, { id, message, variant }])
      const timer = setTimeout(() => dismiss(id), 3000)
      timers.current.set(id, timer)
      return id
    },
    [dismiss],
  )

  useEffect(() => {
    const activeTimers = timers.current
    return () => {
      activeTimers.forEach((timer) => clearTimeout(timer))
      activeTimers.clear()
    }
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, notify, dismiss }}>
      {children}
    </NotificationContext.Provider>
  )
}

