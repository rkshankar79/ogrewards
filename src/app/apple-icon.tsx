import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: '#080808',
          borderRadius: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <div
          style={{
            width: 110,
            height: 110,
            background: '#00d084',
            borderRadius: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 72,
            fontWeight: 900,
            color: '#080808',
            fontFamily: 'sans-serif',
          }}>
          O
        </div>
      </div>
    ),
    { ...size }
  )
}
