/**
 * EditableText — inline contentEditable element with placeholder support.
 * Used for the scene title and slogan.
 *
 * Uses a ref + onInput to avoid dangerouslySetInnerHTML,
 * which destroys cursor position on every keystroke.
 */
import { useRef, useCallback } from 'react';

export default function EditableText({
  as: Tag = 'div',
  className = '',
  style = {},
  placeholder = '',
  initial = '',
  fontSize = 'clamp(18px, 3.2vw, 42px)',
}) {
  const elRef = useRef(null);
  const initiated = useRef(false);

  const initRef = useCallback((node) => {
    if (!node || initiated.current) return;
    initiated.current = true;
    elRef.current = node;
    node.innerHTML = initial;
  }, [initial]);

  const handleBlur = useCallback((e) => {
    const text = e.target.innerText.trim();
    if (!text) {
      e.target.innerHTML = '';
    }
  }, []);

  return (
    <Tag
      ref={initRef}
      className={className}
      contentEditable
      suppressContentEditableWarning
      data-placeholder={placeholder}
      style={{ ...style, fontSize }}
      onBlur={handleBlur}
    />
  );
}
