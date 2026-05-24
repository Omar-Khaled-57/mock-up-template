/**
 * DraggableTextOverlay — a freely-positionable, editable text box.
 *
 * Drag the handle bar to reposition; click inside the text to edit content.
 * Each box has its own colour, background toggle, and style preset stored
 * in the parent state so they persist independently.
 *
 * Options menu (gear icon):
 *  - Per-box colour picker
 *  - Background toggle
 *  - Imitate Title / Slogan style presets
 */
import { useCallback, useRef, useState, useEffect } from 'react';

export default function DraggableTextOverlay({
  color = '#ffffff',
  bgVisible = true,
  stylePreset = 'custom',
  fontSize = 28,
  onDelete,
  onUpdate,
}) {
  const elRef = useRef(null);
  const handleRef = useRef(null);
  const dragging = useRef(false);
  const startPointer = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(false);

  // Raise container z-index when menu is open so it renders above other boxes
  useEffect(() => {
    if (elRef.current) {
      elRef.current.style.zIndex = menuOpen ? '9998' : '30';
    }
  }, [menuOpen]);

  /** Initial positioning via callback ref (fires once on mount). */
  const initRef = useCallback((node) => {
    if (!node || elRef.current) return;
    elRef.current = node;
    const parent = node.parentElement;
    if (!parent) return;
    const pr = parent.getBoundingClientRect();

    const count = parent.querySelectorAll('.draggable-text-box').length;
    const stagger = 24;
    const cx = pr.width * 0.5 + (count - 1) * stagger;
    const cy = pr.height * 0.08 + (count - 1) * stagger;

    pos.current = {
      x: Math.min(cx, pr.width - 180),
      y: Math.min(cy, pr.height - 60),
    };
    node.style.left = pos.current.x + 'px';
    node.style.top = pos.current.y + 'px';
  }, []);

  /** Only the handle bar initiates drag — contentEditable is untouched. */
  const handleBarDown = useCallback((e) => {
    if (e.target.closest('.text-options-btn') || e.target.closest('.text-del-btn')) return;
    const el = elRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    dragging.current = true;
    startPointer.current = { x: e.clientX, y: e.clientY };
    startPos.current = { ...pos.current };
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!dragging.current) return;
    const el = elRef.current;
    const parent = el?.parentElement;
    if (!parent) return;

    const dx = e.clientX - startPointer.current.x;
    const dy = e.clientY - startPointer.current.y;
    let x = startPos.current.x + dx;
    let y = startPos.current.y + dy;

    const pr = parent.getBoundingClientRect();
    x = Math.max(-200, Math.min(x, pr.width - 40));
    y = Math.max(-200, Math.min(y, pr.height - 40));

    pos.current = { x, y };
    el.style.left = x + 'px';
    el.style.top = y + 'px';
  }, []);

  const handlePointerUp = useCallback((e) => {
    if (!dragging.current) return;
    dragging.current = false;
    try { elRef.current?.releasePointerCapture(e.pointerId); } catch {}
  }, []);

  /** Keyboard nudge: arrow keys move the box (1px, 10px with Shift). */
  useEffect(() => {
    if (!active) return;
    const el = elRef.current;
    if (!el) return;

    const onKeyDown = (e) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      if (document.activeElement?.getAttribute('contenteditable')) return;
      e.preventDefault();

      const step = e.shiftKey ? 10 : 1;
      const parent = el.parentElement;
      const pr = parent?.getBoundingClientRect();

      switch (e.key) {
        case 'ArrowUp':    pos.current.y = Math.max(-200, pos.current.y - step); break;
        case 'ArrowDown':  pos.current.y = Math.min((pr?.height || 600) - 40, pos.current.y + step); break;
        case 'ArrowLeft':  pos.current.x = Math.max(-200, pos.current.x - step); break;
        case 'ArrowRight': pos.current.x = Math.min((pr?.width || 800) - 40, pos.current.x + step); break;
      }

      el.style.left = pos.current.x + 'px';
      el.style.top = pos.current.y + 'px';
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active]);

  /** Close menu on outside click */
  const handleMenuPointerDown = useCallback((e) => {
    if (!e.target.closest('.text-options-menu') && !e.target.closest('.text-options-btn')) {
      setMenuOpen(false);
    }
  }, []);

  const toggleMenu = useCallback((e) => {
    e.stopPropagation();
    setMenuOpen(v => !v);
  }, []);

  /** Font styles based on preset (custom uses the per-box fontSize) */
  const fontStyles = stylePreset === 'title' ? {
    fontSize: 'clamp(18px, 3.2vw, 42px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.02em',
  } : stylePreset === 'slogan' ? {
    fontSize: 'clamp(9px, 1.3vw, 16px)', fontWeight: 400, lineHeight: 1.5, letterSpacing: 'normal',
  } : {
    fontSize: `${fontSize}px`, fontWeight: 700, lineHeight: 1.3, letterSpacing: 'normal',
  };

  return (
    <div
      ref={initRef}
      className="draggable-text-box absolute z-30 flex flex-col"
      style={{ touchAction: 'none' }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerDown={handleMenuPointerDown}
    >
      {/* Drag handle bar — focusable for arrow-key nudge */}
      <div
        ref={handleRef}
        tabIndex={0}
        className="h-[22px] rounded-t-[6px] flex items-center justify-between px-2 opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity select-none outline-none"
        style={{ background: 'rgba(255,255,255,0.08)', cursor: 'grab', touchAction: 'none' }}
        onPointerDown={handleBarDown}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
      >
        <svg width="14" height="4" viewBox="0 0 14 4" fill="rgba(255,255,255,0.3)">
          <circle cx="2" cy="2" r="1.5" />
          <circle cx="7" cy="2" r="1.5" />
          <circle cx="12" cy="2" r="1.5" />
        </svg>

        <div className="flex items-center gap-1">
          <button
            className="text-options-btn text-[11px] text-white/40 hover:text-white/80 leading-none px-1"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={toggleMenu}
            title="Text options"
          >
            &#9881;
          </button>
          <button
            className="text-del-btn text-[11px] text-white/40 hover:text-white/80 leading-none px-1"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onDelete}
            title="Delete text box"
          >
            &#10005;
          </button>
        </div>
      </div>

      {/* Options dropdown menu */}
      {menuOpen && (
        <div
          className="text-options-menu absolute top-[22px] right-0 z-[9999] flex flex-col gap-[2px] p-[4px] rounded-[6px] shadow-lg"
          style={{ background: '#1c1c26', border: '1px solid rgba(255,255,255,0.1)', minWidth: '150px' }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* Colour picker + hex input (per-box) */}
          <div className="flex items-center gap-2 px-2 py-[5px]">
            <label className="text-[10px] text-white/40">Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => onUpdate?.({ color: e.target.value })}
              className="w-[26px] h-[20px] border border-white/15 rounded-[4px] bg-transparent cursor-pointer p-[1px]"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => {
                const v = e.target.value;
                if (/^#[0-9a-fA-F]{6}$/.test(v)) onUpdate?.({ color: v });
              }}
              className="w-[66px] bg-transparent border border-white/10 rounded-[4px] px-1 py-[2px] text-[10px] text-white/60 font-mono outline-none focus:border-white/30"
            />
          </div>

          {/* Font size slider */}
          <div className="flex items-center gap-2 px-2 py-[5px]">
            <label className="text-[10px] text-white/40">Size</label>
            <input
              type="range"
              min="8"
              max="80"
              value={fontSize}
              onChange={(e) => onUpdate?.({ fontSize: Number(e.target.value) })}
              className="w-[60px] accent-[#7c2fd4] h-[14px]"
            />
            <span className="text-[10px] text-white/35 min-w-[22px]">{fontSize}px</span>
          </div>

          <div className="h-[1px] bg-white/5 mx-2" />

          {/* Background toggle */}
          <button
            className="flex items-center gap-2 px-2 py-[5px] rounded-[4px] text-[11px] text-left hover:bg-white/5 transition-colors"
            onClick={() => onUpdate?.({ bgVisible: !bgVisible })}
          >
            <span className={`w-[22px] h-[12px] rounded-full border transition-colors shrink-0 ${
              bgVisible ? 'bg-[#7c2fd4] border-[#7c2fd4]' : 'bg-[#2a2a3a] border-white/15'
            }`}>
              <span className={`block w-[8px] h-[8px] rounded-full bg-white mt-[1px] transition-transform ${
                bgVisible ? 'ml-[11px]' : 'ml-[1px]'
              }`} />
            </span>
            Background
          </button>

          <div className="h-[1px] bg-white/5 mx-2" />

          {/* Imitate Title */}
          <button
            className={`px-2 py-[5px] rounded-[4px] text-[11px] text-left transition-colors ${
              stylePreset === 'title' ? 'bg-white/10 text-white' : 'hover:bg-white/5'
            }`}
            onClick={() => onUpdate?.({ stylePreset: stylePreset === 'title' ? 'custom' : 'title' })}
          >
            Imitate Title
          </button>

          {/* Imitate Slogan */}
          <button
            className={`px-2 py-[5px] rounded-[4px] text-[11px] text-left transition-colors ${
              stylePreset === 'slogan' ? 'bg-white/10 text-white' : 'hover:bg-white/5'
            }`}
            onClick={() => onUpdate?.({ stylePreset: stylePreset === 'slogan' ? 'custom' : 'slogan' })}
          >
            Imitate Slogan
          </button>
        </div>
      )}

      {/* Editable text */}
      <div
        contentEditable
        suppressContentEditableWarning
        className={`outline-none px-3 py-2 rounded-[6px] break-words whitespace-pre-wrap select-text ${
          active ? 'ring-1 ring-white/15' : ''
        }`}
        style={{
          color,
          fontFamily: 'Inter, sans-serif',
          textShadow: '0 1px 4px rgba(0,0,0,0.4)',
          background: bgVisible ? 'rgba(0,0,0,0.2)' : 'transparent',
          minWidth: '120px',
          minHeight: '36px',
          cursor: 'text',
          touchAction: 'auto',
          userSelect: 'text',
          WebkitUserSelect: 'text',
          ...fontStyles,
        }}
      >
        Your text
      </div>
    </div>
  );
}
