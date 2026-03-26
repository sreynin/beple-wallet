const APP_LOGO_SRC = '/beple-logo.png'

type AppLogoProps = {
  size?: number
  className?: string
}

export function AppLogo({ size = 80, className = '' }: AppLogoProps) {
  return (
    <img
      src={APP_LOGO_SRC}
      alt=""
      width={size}
      height={size}
      className={`object-contain select-none ${className}`.trim()}
      draggable={false}
    />
  )
}
