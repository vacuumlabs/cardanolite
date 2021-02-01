import {ScreenSize} from '../../types'
import {useState, useEffect} from 'preact/hooks'

// we could export this and use it in other places, in that case
// we should optimalize it with context
// https://blog.logrocket.com/developing-responsive-layouts-with-react-hooks/
const useViewport = (): ScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>(undefined)

  const handleScreenResize = () => {
    if (window.innerWidth < 768) {
      setScreenSize(ScreenSize.MOBILE)
    } else if (window.innerWidth <= 1024) {
      setScreenSize(ScreenSize.TABLET)
    } else {
      setScreenSize(ScreenSize.DESKTOP)
    }
  }

  useEffect(() => {
    handleScreenResize()
    window.addEventListener('resize', handleScreenResize)

    return () => window.removeEventListener('resize', handleScreenResize)
  }, [])

  return screenSize
}

export default useViewport
