import { useEffect } from 'react'

function useTimeout (fn: () => void, delay: number) {
  useEffect(() => {
    const timer = setTimeout(() => {
      fn()
    }, delay)
    return () => {
      clearTimeout(timer)
    }
  }, [fn, delay])
}

function useInterval (fn: () => void, delay: number) {
  useEffect(() => {
    const timer = setInterval(() => {
      fn()
    }, delay)
    return () => {
      clearInterval(timer)
    }
  }, [fn, delay])
}

export {
  useTimeout,
  useInterval,
}
