import { useEffect, useState } from 'react'

// Utility to remove <script> and event handlers to avoid XSS, strip common white backgrounds,
// and optionally hide text elements. Also strips width/height attributes from <svg>.
function sanitizeAndOptionallyHideText(svgText, hideText) {
  if (!svgText) return ''
  // Remove scripts
  let sanitized = svgText.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
  // Remove on* attributes
  sanitized = sanitized.replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, '')
  sanitized = sanitized.replace(/\son[a-z]+\s*=\s*'[^']*'/gi, '')
  sanitized = sanitized.replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, '')

  // Remove common white backgrounds on the root <svg> or full-bleed rects
  sanitized = sanitized.replace(/(<svg[^>]*?)\sbackground\s*=\s*"?(?:#fff|#ffffff|white)"?/i, '$1')
  sanitized = sanitized.replace(/(<svg[^>]*?style=\s*"[^"]*?)background\s*:\s*(?:#fff|#ffffff|white)\s*;?/i, '$1')
  sanitized = sanitized.replace(/(<svg[^>]*?style=\s*'[^']*?)background\s*:\s*(?:#fff|#ffffff|white)\s*;?/i, '$1')

  // Remove a full-size white <rect> backgrounds (100% x 100%)
  sanitized = sanitized.replace(/<rect[^>]*\bwidth\s*=\s*"?100%"?[^>]*\bheight\s*=\s*"?100%"?[^>]*\bfill\s*=\s*"?(?:#fff|#ffffff|white|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\))"?[^>]*\/?>/gi, '')
  // Remove a white <rect> at origin with no stroke that often acts as background
  sanitized = sanitized.replace(/<rect[^>]*\bx\s*=\s*"?0"?[^>]*\by\s*=\s*"?0"?[^>]*\bfill\s*=\s*"?(?:#fff|#ffffff|white|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\))"?[^>]*\bstroke\s*=\s*"?none"?[^>]*\/?>/gi, '')

  // Remove width/height attributes from <svg> to allow CSS sizing
  sanitized = sanitized.replace(/(<svg[^>]*?)\s(width|height)\s*=\s*['"][^'"]*['"]/gi, '$1')

  if (hideText) {
    // Hide text elements
    sanitized = sanitized.replace(/<text[\s\S]*?<\/text>/gi, '')
    sanitized = sanitized.replace(/<tspan[\s\S]*?<\/tspan>/gi, '')
  }
  return sanitized
}

export default function SvgCard({ src, hideText, className = '', onClick, title }) {
  const [svgHtml, setSvgHtml] = useState('')

  useEffect(() => {
    if (!src) {
      setSvgHtml('')
      return
    }
    fetch(src)
      .then(res => res.text())
      .then(text => setSvgHtml(sanitizeAndOptionallyHideText(text, hideText)))
      .catch(() => setSvgHtml(''))
  }, [src, hideText])

  return (
    <div
      className={`svg-cropper ${className}`}
      onClick={onClick}
      title={title}
      tabIndex={0}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  )
}
