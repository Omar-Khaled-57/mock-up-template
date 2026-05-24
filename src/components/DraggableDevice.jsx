/**
 * DraggableDevice — makes any child element draggable within its parent.
 *
 * - Uses Pointer Events (setPointerCapture) for smooth, lag-free drag.
 * - Starts in CSS-layout mode (defaultStyle with % positions).
 * - On first pointer-down, snaps to pixel coordinates and switches to
 *   direct DOM manipulation (no React re-render during drag) for performance.
 * - Clamps movement within parent bounds (or allows overflow when enabled).
 * - Skips drag initiation when the target is the upload placeholder,
 *   so file-picker clicks work normally.
 */
import { useCallback, useRef, useState } from 'react';

export default function DraggableDevice({ children, className = '', defaultStyle = {}, overflow = false }) {
  const elRef = useRef(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const size = useRef({ w: 0, h: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const overflowRef = useRef(overflow);
  const [pixelMode, setPixelMode] = useState(false);

  // Keep ref in sync so event callbacks always read the latest value
  overflowRef.current = overflow;

  /** Convert the element from %-layout (defaultStyle) to pixel-positioned. */
  const snapToPixels = useCallback(() => {
    const el = elRef.current;
    const parent = el?.parentElement;
    if (!parent) return;
    const pr = parent.getBoundingClientRect();
    const er = el.getBoundingClientRect();
    pos.current = { x: er.left - pr.left, y: er.top - pr.top };
    el.style.left = pos.current.x + 'px';
    el.style.top = pos.current.y + 'px';
    el.style.bottom = 'auto';
    el.style.right = 'auto';
    setPixelMode(true);
  }, []);

  const handlePointerDown = useCallback((e) => {
    const el = elRef.current;
    if (!el) return;

    // Don't initiate drag when clicking inside the upload placeholder
    if (e.target.closest('.upload-placeholder')) return;

    el.setPointerCapture(e.pointerId);
    dragging.current = true;

    const rect = el.getBoundingClientRect();
    offset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    size.current = { w: rect.width, h: rect.height };

    if (!pixelMode) snapToPixels();
  }, [pixelMode, snapToPixels]);

  const handlePointerMove = useCallback((e) => {
    if (!dragging.current) return;
    const el = elRef.current;
    const parent = el?.parentElement;
    if (!parent) return;

    const pr = parent.getBoundingClientRect();
    let x = e.clientX - pr.left - offset.current.x;
    let y = e.clientY - pr.top - offset.current.y;

    // Read overflow from ref to avoid stale closure on the prop
    const isOverflow = overflowRef.current;

    // Clamp to parent bounds (overflow mode allows partial cut-off)
    if (isOverflow) {
      x = Math.max(-size.current.w * 0.6, Math.min(x, pr.width - size.current.w * 0.4));
      y = Math.max(-size.current.h * 0.6, Math.min(y, pr.height - size.current.h * 0.4));
    } else {
      x = Math.max(0, Math.min(x, pr.width - size.current.w));
      y = Math.max(0, Math.min(y, pr.height - size.current.h));
    }

    pos.current = { x, y };
    el.style.left = x + 'px';
    el.style.top = y + 'px';
  }, []);

  const handlePointerUp = useCallback((e) => {
    if (!dragging.current) return;
    dragging.current = false;
    try { elRef.current?.releasePointerCapture(e.pointerId); } catch {}
  }, []);

  return (
    <div
      ref={elRef}
      className={className}
      style={{ ...defaultStyle, touchAction: 'none', cursor: 'grab' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {children}
    </div>
  );
}
