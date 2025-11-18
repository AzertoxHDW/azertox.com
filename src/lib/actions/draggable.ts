import { browser } from '$app/environment'; // For client-side checks

export interface DraggableOptions {
  /** CSS selector for the drag handle within the node. If not provided, the entire node is draggable. */
  handleSelector?: string;
  /** Initial position of the draggable node. Defaults to its current offset. */
  initialPosition?: { x: number; y: number };
  /** Callback function when dragging starts. */
  onDragStart?: (event: MouseEvent, node: HTMLElement) => void;
  /** Callback function when dragging ends. Provides the new position. */
  onDragEnd?: (event: MouseEvent, node: HTMLElement, newPosition: { x: number; y: number }) => void;
  /** Optional: CSS selector string for a boundary element, or the HTMLElement itself. */
  bounds?: string | HTMLElement;
  /** Set to true to only allow dragging on the X axis */
  axis?: 'x' | 'y' | 'both';
}

export function draggable(node: HTMLElement, options: DraggableOptions = {}) {
  if (!browser) {
    // Do not run on server
    return {
      destroy: () => {},
      update: () => {},
    };
  }

  let { initialPosition, handleSelector, onDragStart, onDragEnd, bounds, axis = 'both' } = options;

  let currentX: number;
  let currentY: number;
  let dragging = false;
  let offsetX: number; // Mouse offset inside the draggable element
  let offsetY: number;

  // --- Initialization ---
  // Ensure the node is positioned to allow dragging
  const computedStyle = getComputedStyle(node);
  if (computedStyle.position === 'static') {
    node.style.position = 'relative'; // Or 'absolute' if parent is set up for it
  }

  // Set initial position
  if (initialPosition) {
    currentX = initialPosition.x;
    currentY = initialPosition.y;
  } else {
    // Use offsetLeft/Top if they are relative to a positioned parent.
    // If parent is static, offsetLeft/Top might be relative to body/viewport.
    // For more robust initial positioning without explicit initialPosition,
    // consider getBoundingClientRect() relative to a known positioned ancestor.
    currentX = node.offsetLeft;
    currentY = node.offsetTop;
  }
  node.style.left = `${currentX}px`;
  node.style.top = `${currentY}px`;

  const handleNode = handleSelector ? (node.querySelector(handleSelector) as HTMLElement) || node : node;
  if (handleSelector && !node.querySelector(handleSelector)) {
    console.warn(`[Draggable Action] Handle selector "${handleSelector}" not found. Node itself will be draggable.`);
  }
  handleNode.style.cursor = 'grab';


  // --- Boundary Logic ---
  function getBoundaryRect(): DOMRect | null {
    if (!bounds) return null;
    const boundaryElement = typeof bounds === 'string' ? document.querySelector(bounds) : bounds;
    return boundaryElement ? boundaryElement.getBoundingClientRect() : null;
  }

  // --- Event Handlers ---
  function handleMouseDown(event: MouseEvent) {
    // Prevent dragging if event target is an interactive element like input or button within the handle
    const target = event.target as HTMLElement;
    if (target.closest('input, textarea, button, select, a[href]')) {
      return;
    }
    // Only allow left mouse button drag
    if (event.button !== 0) {
        return;
    }

    event.preventDefault(); // Prevent default actions like text selection
    event.stopPropagation(); // Stop event from bubbling up, e.g., if window is inside another draggable

    dragging = true;
    
    // Calculate offset from mouse position to the top-left of the *node* being dragged
    const nodeRect = node.getBoundingClientRect();
    offsetX = event.clientX - nodeRect.left;
    offsetY = event.clientY - nodeRect.top;

    handleNode.style.cursor = 'grabbing';
    node.style.userSelect = 'none'; // Prevent text selection while dragging
    
    if (onDragStart) {
      onDragStart(event, node);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }

  function handleMouseMove(event: MouseEvent) {
    if (!dragging) return;
    event.preventDefault();

    // Calculate new proposed position relative to the viewport
    let newX = event.clientX - offsetX;
    let newY = event.clientY - offsetY;

    // Adjust for parent's offset if the node is positioned relative to a specific parent
    // This assumes the parent for node.style.left/top is the viewport or a static parent.
    // If node.offsetParent is something else, calculations for boundary checks need to be relative to that.
    const parentRect = node.offsetParent ? node.offsetParent.getBoundingClientRect() : { top: 0, left: 0 };
    newX -= parentRect.left;
    newY -= parentRect.top;


    const boundaryRect = getBoundaryRect();
    if (boundaryRect) {
      // Boundary rect is viewport-relative. Node's newX/newY are relative to its offsetParent.
      // To compare, we need to convert node's intended position to viewport coordinates.
      const nodeWidth = node.offsetWidth;
      const nodeHeight = node.offsetHeight;

      const nodeViewportX = newX + parentRect.left;
      const nodeViewportY = newY + parentRect.top;

      let constrainedViewportX = nodeViewportX;
      let constrainedViewportY = nodeViewportY;
      
      if (axis === 'x' || axis === 'both') {
        constrainedViewportX = Math.max(boundaryRect.left, Math.min(nodeViewportX, boundaryRect.right - nodeWidth));
      }
      if (axis === 'y' || axis === 'both') {
        constrainedViewportY = Math.max(boundaryRect.top, Math.min(nodeViewportY, boundaryRect.bottom - nodeHeight));
      }
      
      // Convert back to offsetParent relative coordinates
      newX = constrainedViewportX - parentRect.left;
      newY = constrainedViewportY - parentRect.top;

    } else {
      // Simple viewport boundaries if no specific boundary element is set
      const nodeWidth = node.offsetWidth;
      const nodeHeight = node.offsetHeight;
      // newX and newY are already relative to offsetParent. If offsetParent is body, this is fine.
      // If offsetParent is something else, window.innerWidth/Height isn't the direct boundary.
      // This simplified boundary assumes offsetParent fills viewport or is body.
      if (axis === 'x' || axis === 'both') {
        newX = Math.max(0, Math.min(newX, (node.offsetParent?.clientWidth || window.innerWidth) - nodeWidth));
      }
      if (axis === 'y' || axis === 'both') {
        newY = Math.max(0, Math.min(newY, (node.offsetParent?.clientHeight || window.innerHeight) - nodeHeight));
      }
    }

    if (axis === 'x') {
        currentY = parseFloat(node.style.top) || 0; // Keep Y fixed
        currentX = newX;
    } else if (axis === 'y') {
        currentX = parseFloat(node.style.left) || 0; // Keep X fixed
        currentY = newY;
    } else { // 'both'
        currentX = newX;
        currentY = newY;
    }


    node.style.left = `${currentX}px`;
    node.style.top = `${currentY}px`;

    node.dispatchEvent(new CustomEvent('dragged', { detail: { x: currentX, y: currentY } }));
  }

  function handleMouseUp(event: MouseEvent) {
    if (!dragging) return;
    dragging = false;
    handleNode.style.cursor = 'grab';
    node.style.userSelect = ''; // Re-enable text selection
    
    if (onDragEnd) {
      onDragEnd(event, node, { x: currentX, y: currentY });
    }

    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }

  // --- Attach Event Listeners ---
  handleNode.addEventListener('mousedown', handleMouseDown);

  // --- Svelte Action Lifecycle ---
  return {
    destroy() {
      handleNode.removeEventListener('mousedown', handleMouseDown);
      // Clean up global listeners if they were somehow left active
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    },
    update(newOptions: DraggableOptions) {
      // Update options like bounds, axis, or callbacks if they change
      axis = newOptions.axis ?? axis;
      bounds = newOptions.bounds ?? bounds;
      onDragStart = newOptions.onDragStart ?? onDragStart;
      onDragEnd = newOptions.onDragEnd ?? onDragEnd;
      
      // Note: Changing handleSelector or initialPosition dynamically after mount
      // would require more complex logic to re-initialize parts of the action.
      // For simplicity, this update focuses on callbacks and behavior flags.
      if (newOptions.handleSelector && newOptions.handleSelector !== handleSelector) {
          handleNode.removeEventListener('mousedown', handleMouseDown);
          handleNode.style.cursor = ''; // Reset old handle
          handleSelector = newOptions.handleSelector;
          const newHandleNode = handleSelector ? (node.querySelector(handleSelector) as HTMLElement) || node : node;
          newHandleNode.style.cursor = 'grab';
          newHandleNode.addEventListener('mousedown', handleMouseDown);
          // Update local `handleNode` reference if it changes
      }
    }
  };
}
