import { browser } from '$app/environment';

export interface ResizableOptions {
  /** Minimum width in pixels */
  minWidth?: number;
  /** Minimum height in pixels */
  minHeight?: number;
  /** Maximum width in pixels */
  maxWidth?: number;
  /** Maximum height in pixels */
  maxHeight?: number;
  /** Callback when resize starts */
  onResizeStart?: (event: MouseEvent, node: HTMLElement) => void;
  /** Callback when resize ends with new dimensions */
  onResizeEnd?: (event: MouseEvent, node: HTMLElement, newSize: { width: number; height: number }) => void;
  /** Disabled state */
  disabled?: boolean;
}

type ResizeDirection = 'se' | 'e' | 's' | 'sw' | 'w' | 'n' | 'ne' | 'nw';

export function resizable(node: HTMLElement, options: ResizableOptions = {}) {
  if (!browser) {
    return {
      destroy: () => {},
      update: () => {},
    };
  }

  let {
    minWidth = 200,
    minHeight = 150,
    maxWidth = Infinity,
    maxHeight = Infinity,
    onResizeStart,
    onResizeEnd,
    disabled = false
  } = options;

  let resizing = false;
  let currentDirection: ResizeDirection | null = null;
  let startX: number;
  let startY: number;
  let startWidth: number;
  let startHeight: number;
  let startLeft: number;
  let startTop: number;

  // Create resize handles
  const handles: Map<ResizeDirection, HTMLElement> = new Map();
  const directions: ResizeDirection[] = ['se', 'e', 's', 'sw', 'w', 'n', 'ne', 'nw'];

  function createHandles() {
    directions.forEach(dir => {
      const handle = document.createElement('div');
      handle.className = `resize-handle resize-${dir}`;
      handle.dataset.direction = dir;

      // Set cursor based on direction
      const cursorMap: Record<ResizeDirection, string> = {
        'n': 'ns-resize',
        's': 'ns-resize',
        'e': 'ew-resize',
        'w': 'ew-resize',
        'ne': 'nesw-resize',
        'sw': 'nesw-resize',
        'nw': 'nwse-resize',
        'se': 'nwse-resize'
      };

      handle.style.cssText = `
        position: absolute;
        z-index: 10;
        cursor: ${cursorMap[dir]};
      `;

      // Position handles
      if (dir === 'n') {
        handle.style.cssText += 'top: 0; left: 4px; right: 4px; height: 4px;';
      } else if (dir === 's') {
        handle.style.cssText += 'bottom: 0; left: 4px; right: 4px; height: 4px;';
      } else if (dir === 'e') {
        handle.style.cssText += 'right: 0; top: 4px; bottom: 4px; width: 4px;';
      } else if (dir === 'w') {
        handle.style.cssText += 'left: 0; top: 4px; bottom: 4px; width: 4px;';
      } else if (dir === 'ne') {
        handle.style.cssText += 'top: 0; right: 0; width: 8px; height: 8px;';
      } else if (dir === 'nw') {
        handle.style.cssText += 'top: 0; left: 0; width: 8px; height: 8px;';
      } else if (dir === 'se') {
        handle.style.cssText += 'bottom: 0; right: 0; width: 8px; height: 8px;';
      } else if (dir === 'sw') {
        handle.style.cssText += 'bottom: 0; left: 0; width: 8px; height: 8px;';
      }

      handle.addEventListener('mousedown', handleMouseDown);
      node.appendChild(handle);
      handles.set(dir, handle);
    });
  }

  function removeHandles() {
    handles.forEach(handle => {
      handle.removeEventListener('mousedown', handleMouseDown);
      handle.remove();
    });
    handles.clear();
  }

  function handleMouseDown(event: MouseEvent) {
    if (disabled) return;
    if (event.button !== 0) return; // Only left click

    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;
    currentDirection = (target.dataset.direction as ResizeDirection) || null;

    if (!currentDirection) return;

    resizing = true;
    startX = event.clientX;
    startY = event.clientY;

    const rect = node.getBoundingClientRect();
    startWidth = rect.width;
    startHeight = rect.height;
    startLeft = parseFloat(node.style.left) || 0;
    startTop = parseFloat(node.style.top) || 0;

    document.body.style.cursor = target.style.cursor;
    document.body.style.userSelect = 'none';

    if (onResizeStart) {
      onResizeStart(event, node);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(event: MouseEvent) {
    if (!resizing || !currentDirection) return;

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    let newWidth = startWidth;
    let newHeight = startHeight;
    let newLeft = startLeft;
    let newTop = startTop;

    // Calculate new dimensions based on resize direction
    if (currentDirection.includes('e')) {
      newWidth = Math.max(minWidth, Math.min(maxWidth, startWidth + deltaX));
    }
    if (currentDirection.includes('w')) {
      const widthDelta = startWidth - deltaX;
      newWidth = Math.max(minWidth, Math.min(maxWidth, widthDelta));
      newLeft = startLeft + (startWidth - newWidth);
    }
    if (currentDirection.includes('s')) {
      newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY));
    }
    if (currentDirection.includes('n')) {
      const heightDelta = startHeight - deltaY;
      newHeight = Math.max(minHeight, Math.min(maxHeight, heightDelta));
      newTop = startTop + (startHeight - newHeight);
    }

    // Apply new dimensions
    node.style.width = `${newWidth}px`;
    node.style.height = `${newHeight}px`;
    node.style.left = `${newLeft}px`;
    node.style.top = `${newTop}px`;

    node.dispatchEvent(new CustomEvent('resized', {
      detail: { width: newWidth, height: newHeight, left: newLeft, top: newTop }
    }));
  }

  function handleMouseUp(event: MouseEvent) {
    if (!resizing) return;

    resizing = false;
    currentDirection = null;

    document.body.style.cursor = '';
    document.body.style.userSelect = '';

    const rect = node.getBoundingClientRect();
    if (onResizeEnd) {
      onResizeEnd(event, node, { width: rect.width, height: rect.height });
    }

    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }

  // Initialize
  createHandles();

  return {
    destroy() {
      removeHandles();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    },
    update(newOptions: ResizableOptions) {
      minWidth = newOptions.minWidth ?? minWidth;
      minHeight = newOptions.minHeight ?? minHeight;
      maxWidth = newOptions.maxWidth ?? maxWidth;
      maxHeight = newOptions.maxHeight ?? maxHeight;
      onResizeStart = newOptions.onResizeStart ?? onResizeStart;
      onResizeEnd = newOptions.onResizeEnd ?? onResizeEnd;

      const wasDisabled = disabled;
      disabled = newOptions.disabled ?? disabled;

      if (wasDisabled !== disabled) {
        if (disabled) {
          handles.forEach(handle => handle.style.display = 'none');
        } else {
          handles.forEach(handle => handle.style.display = '');
        }
      }
    }
  };
}
