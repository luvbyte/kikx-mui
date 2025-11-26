import { onBeforeUnmount } from 'vue';

const supportsPointer = typeof window !== 'undefined' && !!window.PointerEvent;

export default {
  mounted(el, binding) {
    const opts = binding.value || {};
    const onStart = typeof opts.onStart === 'function' ? opts.onStart : () => {};
    const onMove = typeof opts.onMove === 'function' ? opts.onMove : () => {};
    const onEnd = typeof opts.onEnd === 'function' ? opts.onEnd : () => {};
    const axis = opts.axis || 'both';
    const clamp = opts.clamp || null;

    let active = false;
    let startX = 0, startY = 0;
    let lastX = 0, lastY = 0;
    let pointerId = null;

    function clampPos(x, y) {
      if (!clamp) return { x, y };
      if (typeof clamp.minX === 'number') x = Math.max(x, clamp.minX);
      if (typeof clamp.maxX === 'number') x = Math.min(x, clamp.maxX);
      if (typeof clamp.minY === 'number') y = Math.max(y, clamp.minY);
      if (typeof clamp.maxY === 'number') y = Math.min(y, clamp.maxY);
      return { x, y };
    }

    function start(clientX, clientY, id = null, event = null) {
      active = true;
      pointerId = id;
      startX = clientX;
      startY = clientY;
      lastX = 0;
      lastY = 0;
      onStart({ clientX, clientY, event });
      // Prevent scrolling on touch (only while dragging)
      if (event && event.cancelable) event.preventDefault();
    }

    function move(clientX, clientY, event = null) {
      if (!active) return;
      const dx = clientX - startX;
      const dy = clientY - startY;
      let nx = dx, ny = dy;
      if (axis === 'x') ny = 0;
      if (axis === 'y') nx = 0;
      const clamped = clampPos(nx, ny);
      lastX = clamped.x;
      lastY = clamped.y;
      onMove({ dx: lastX, dy: lastY, clientX, clientY, event });
      if (event && event.cancelable) event.preventDefault();
    }

    function end(event = null) {
      if (!active) return;
      active = false;
      pointerId = null;
      onEnd({ dx: lastX, dy: lastY, event });
    }

    // Pointer events (preferred)
    function onPointerDown(e) {
      // only left mouse button or any pointer type for touch/stylus
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      el.setPointerCapture?.(e.pointerId);
      start(e.clientX, e.clientY, e.pointerId, e);
      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp, { passive: false });
      window.addEventListener('pointercancel', onPointerUp, { passive: false });
    }
    function onPointerMove(e) {
      if (!active || pointerId !== e.pointerId) return;
      move(e.clientX, e.clientY, e);
    }
    function onPointerUp(e) {
      if (pointerId !== null && e.pointerId !== pointerId) {
        // different pointer - ignore
      }
      try { el.releasePointerCapture?.(e.pointerId); } catch {}
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      end(e);
    }

    // Fallback: touch + mouse
    function onTouchStart(e) {
      if (e.touches.length > 1) return; // ignore multi-touch
      const t = e.touches[0];
      start(t.clientX, t.clientY, null, e);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd, { passive: false });
      window.addEventListener('touchcancel', onTouchEnd, { passive: false });
    }
    function onTouchMove(e) {
      if (!active) return;
      const t = e.touches[0];
      move(t.clientX, t.clientY, e);
    }
    function onTouchEnd(e) {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      end(e);
    }

    function onMouseDown(e) {
      if (e.button !== 0) return;
      start(e.clientX, e.clientY, null, e);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    function onMouseMove(e) {
      if (!active) return;
      move(e.clientX, e.clientY, e);
    }
    function onMouseUp(e) {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      end(e);
    }

    // Add listeners
    if (supportsPointer) {
      el.addEventListener('pointerdown', onPointerDown, { passive: false });
    } else {
      el.addEventListener('touchstart', onTouchStart, { passive: false });
      el.addEventListener('mousedown', onMouseDown);
    }

    // attach cleanup handler to element
    el.__vDraggable = {
      cleanup() {
        if (supportsPointer) {
          el.removeEventListener('pointerdown', onPointerDown);
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);
        } else {
          el.removeEventListener('touchstart', onTouchStart);
          el.removeEventListener('mousedown', onMouseDown);
          window.removeEventListener('touchmove', onTouchMove);
          window.removeEventListener('touchend', onTouchEnd);
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        }
      }
    };

    // ensure cleanup when directive is unmounted by Vue
    onBeforeUnmount(() => {
      el.__vDraggable?.cleanup?.();
      delete el.__vDraggable;
    });
  },

  unmounted(el) {
    el.__vDraggable?.cleanup?.();
    delete el.__vDraggable;
  }
};