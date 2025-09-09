import { useEffect, useMemo, useState } from 'react'

// Utility to remove <script> and event handlers to avoid XSS, strip common white backgrounds,
// and optionally hide text elements
function sanitizeAndOptionallyHideText(svgText, hideText) {
  if (!svgText) return ''
  // Remove scripts
  let sanitized = svgText.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
  // Remove on* attributes
  sanitized = sanitized.replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, '')
  sanitized = sanitized.replace(/\son[a-z]+\s*=\s*'[^']*'/gi, '')
  sanitized = sanitized.replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, '')

  // Remove common white backgrounds on the root <svg> or full-bleed rects
  // 1) background or style background set to white on root svg
  sanitized = sanitized.replace(/(<svg[^>]*?)\sbackground\s*=\s*"?(?:#fff|#ffffff|white)"?/i, '$1')
  sanitized = sanitized.replace(/(<svg[^>]*?style=\s*"[^"]*?)background\s*:\s*(?:#fff|#ffffff|white)\s*;?/i, '$1')
  sanitized = sanitized.replace(/(<svg[^>]*?style=\s*'[^']*?)background\s*:\s*(?:#fff|#ffffff|white)\s*;?/i, '$1')

  // 2) Remove a full-size white <rect> backgrounds (100% x 100%)
  sanitized = sanitized.replace(/<rect[^>]*\bwidth\s*=\s*"?100%"?[^>]*\bheight\s*=\s*"?100%"?[^>]*\bfill\s*=\s*"?(?:#fff|#ffffff|white|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\))"?[^>]*\/?>/gi, '')
  // 3) Remove a white <rect> at origin with no stroke that often acts as background
  sanitized = sanitized.replace(/<rect[^>]*\bx\s*=\s*"?0"?[^>]*\by\s*=\s*"?0"?[^>]*\bfill\s*=\s*"?(?:#fff|#ffffff|white|rgb\(\s*255\s*,\s*255\s*,\s*255\s*\))"?[^>]*\bstroke\s*=\s*"?none"?[^>]*\/?>/gi, '')

  if (hideText) {
    // Hide <text> elements by adding style display:none
    sanitized = sanitized.replace(/<text(\s|>)/gi, () => `<text style="display:none" `)
  }
  return sanitized
}

export default function SvgCard({ src, hideText, className, onClick, title }) {
  const [raw, setRaw] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    setError('')
    setRaw('')
    fetch(src)
      .then(r => {
        if (!r.ok) throw new Error(`Failed to load ${src}`)
        return r.text()
      })
      .then(text => {
        if (isMounted) setRaw(text)
      })
      .catch(e => {
        if (isMounted) setError(e.message)
      })
    return () => { isMounted = false }
  }, [src])

  const html = useMemo(() => sanitizeAndOptionallyHideText(raw, hideText), [raw, hideText])

  if (error) return <div className={className}>Failed to load: {title || src}</div>

  return (
    <div className={className} onClick={onClick} role="button" tabIndex={0}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}


