import { ref, computed, onMounted, onUnmounted } from "vue";

const width = ref(window.innerWidth);
const height = ref(window.innerHeight);
const isFullscreen = ref(!!document.fullscreenElement);

export function useScreen() {
  const updateSize = () => {
    width.value = window.innerWidth;
    height.value = window.innerHeight;
  };

  const updateFullscreen = () => {
    isFullscreen.value = !!document.fullscreenElement;
  };

  const isLandscape = computed(() => width.value > height.value);
  const isPortrait = computed(() => !isLandscape.value);

  const isMobile = computed(() => {
    return (
      window.matchMedia("(pointer: coarse)").matches ||
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
    );
  });

  async function enterFullscreen(element = document.documentElement) {
    if (!document.fullscreenElement) {
      await element.requestFullscreen();
    }
  }

  async function lockOrientation(orient) {
    await enterFullscreen();
    screen.orientation.lock(orient); // or "portrait"
  }

  async function rotateFullScreen() {
    await lockOrientation("landscape");
  }

  async function exitFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  }

  async function toggleFullscreen(element = document.documentElement) {
    if (document.fullscreenElement) {
      await exitFullscreen();
    } else {
      await enterFullscreen(element);
    }
  }

  const isWebView = computed(() => {
    const ua = navigator.userAgent || navigator.vendor || "";

    // Android WebView
    const androidWebView =
      /\bwv\b/.test(ua) || (/Android/.test(ua) && /Version\/[\d.]+/.test(ua));

    // iOS WebView (WKWebView / UIWebView)
    const iosWebView = /iPhone|iPad|iPod/.test(ua) && !/Safari/.test(ua);

    // Generic embedded browsers
    const embedded =
      /FBAN|FBAV|Instagram|Line|MicroMessenger|Telegram|Snapchat|TikTok/i.test(
        ua
      );

    return androidWebView || iosWebView || embedded;
  });

  const isBrowser = computed(() => !isWebView.value);

  onMounted(() => {
    updateSize();
    updateFullscreen();

    window.addEventListener("resize", updateSize);
    window.addEventListener("orientationchange", updateSize);
    document.addEventListener("fullscreenchange", updateFullscreen);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", updateSize);
    window.removeEventListener("orientationchange", updateSize);
    document.removeEventListener("fullscreenchange", updateFullscreen);
  });

  return {
    width,
    height,
    isLandscape,
    isPortrait,
    isMobile,
    isFullscreen,
    isWebView,
    isBrowser,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
    rotateFullScreen
  };
}
