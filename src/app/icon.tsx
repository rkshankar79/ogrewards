import { ImageResponse } from 'next/og'

export const size = { width: 512, height: 512 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 512,
          height: 512,
          background: '#080808',
          borderRadius: 96,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <div
          style={{
            width: 320,
            height: 320,
            background: '#00d084',
            borderRadius: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 200,
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
