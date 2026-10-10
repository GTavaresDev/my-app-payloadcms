import React from 'react'

export function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
      <svg
        width="44"
        height="51"
        viewBox="0 0 137 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: 'var(--theme-elevation-1000, #ffffff)', flexShrink: 0 }}
      >
        <path
          d="M68.014 23.9998C22.8236 23.9998 0 33.0476 0 80C0 126.952 22.8236 136 68.014 136C113.204 136 136.028 126.952 136.028 80C136.028 33.0476 113.204 23.9998 68.014 23.9998ZM68.014 104.031C29.8308 104.031 12.3451 98.217 12.3451 68.0254C12.3451 37.8338 29.8308 31.9998 68.014 31.9998C106.197 31.9998 123.683 37.8142 123.683 68.0058C123.683 98.1973 106.197 104.012 68.014 104.012V104.031Z"
          fill="currentColor"
        />
        <path
          d="M12.0025 24.0001C18.6421 24.0001 24.0049 18.6171 24.0049 12C24.0049 5.383 18.6209 0 12.0025 0C5.38409 0 0 5.383 0 12C0 18.6171 5.38409 24.0001 12.0025 24.0001Z"
          fill="currentColor"
        />
        <path
          d="M52.8243 60.0809C57.0543 60.8885 60.6892 57.2544 59.8814 53.0253C59.4351 50.6875 57.522 48.7536 55.1625 48.3073C50.9325 47.4997 47.2977 51.1338 48.1054 55.363C48.5518 57.7007 50.4649 59.6346 52.8243 60.0809Z"
          fill="currentColor"
        />
        <path
          d="M80.8299 59.9154C85.06 60.723 88.6948 57.0889 87.8871 52.8597C87.4407 50.522 85.5276 48.5881 83.1681 48.1418C78.9381 47.3342 75.3033 50.9683 76.111 55.1975C76.5574 57.5352 78.4705 59.4691 80.8299 59.9154Z"
          fill="currentColor"
        />
        <path
          d="M108.976 67.2828C98.02 78.1505 83.467 84.1108 68.0152 84.1108C52.562 84.1107 37.9854 78.1258 27.0547 67.2828L32.5988 61.6956C42.0481 71.069 54.6288 76.241 68.0152 76.241C81.4029 76.241 93.9591 71.092 103.432 61.6956L108.976 67.2828Z"
          fill="currentColor"
        />
        <path
          d="M106.658 160C111.198 160 113.746 154.837 110.684 151.659C103.946 144.643 91.1878 144 68.0137 144C44.8396 144 32.1021 144.643 25.343 151.659C22.2819 154.837 24.8294 160 29.3697 160H106.658Z"
          fill="currentColor"
        />
      </svg>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span
          style={{
            fontSize: '1.85rem',
            fontWeight: '700',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            color: 'var(--theme-elevation-1000, #ffffff)',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          Sacflow
        </span>
        <span
          style={{
            fontSize: '1rem',
            fontWeight: '500',
            color: 'var(--theme-elevation-500, #94a3b8)',
            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          CMS
        </span>
      </div>
    </div>
  )
}
