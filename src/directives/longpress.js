export default {
  mounted(el, binding) {
    let pressTimer = null;
    let longPressTriggered = false;

    const getOptions = () => {
      if (typeof binding.value === "function") {
        return {
          handler: binding.value,
          duration: 600
        };
      }

      return {
        handler: binding.value.handler,
        duration: binding.value.duration || 600
      };
    };

    const start = e => {
      const { handler, duration } = getOptions();
      longPressTriggered = false;

      pressTimer = setTimeout(() => {
        handler(e);
        longPressTriggered = true;
      }, duration);
    };

    const cancel = () => {
      if (pressTimer !== null) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    const preventClick = e => {
      if (longPressTriggered) {
        e.preventDefault();
        e.stopImmediatePropagation();
        longPressTriggered = false;
      }
    };

    const preventContextMenu = e => {
      e.preventDefault();
    };

    // Mouse
    el.addEventListener("mousedown", start);
    el.addEventListener("mouseup", cancel);
    el.addEventListener("mouseleave", cancel);

    // Touch
    el.addEventListener("touchstart", start);
    el.addEventListener("touchend", cancel);
    el.addEventListener("touchcancel", cancel);

    // Prevent click after long press
    el.addEventListener("click", preventClick, true);

    // Prevent browser context menu
    el.addEventListener("contextmenu", preventContextMenu);
  }
};
