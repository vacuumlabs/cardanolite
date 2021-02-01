import {ScreenSize} from '../../types'
import {useState, useEffect} from 'preact/hooks'

const useViewport = (): ScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>(undefined)

  const handleScreenResize = () => {
    if (window.innerWidth <= 767) {
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
