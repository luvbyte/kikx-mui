const { protocol, hostname, port } = window.location;

// ----------------
export const muiPath = "storage://root/.config/mui";
export const defaultBackground = "images/bg.jpg";

export const VERSION = "0.4.3";
// ----------------

export const DEV = process.env.NODE_ENV !== "production";

export const apiUrl = DEV
  ? "http://localhost:8000"
  : `${protocol}//${hostname}${port ? `:${port}` : ""}`;

export const wsUrl = DEV
  ? "ws://localhost:8000"
  : `${protocol === "https:" ? "wss:" : "ws:"}//${hostname}${port ? `:${port}` : ""}`;

// ----------------

// Get url
export const getUrl = end => {
  let endUrl = end.startsWith("/") ? end : "/" + end;

  return apiUrl + endUrl;
};

export const getAppPublicUrl = (appName, name) => {
  return getUrl(`/public/app/${appName}/${name}`);
};

export const getAssetUrl = url => {
  if (url.startsWith("/")) {
    return apiUrl + url;
  } else if (url.startsWith("http")) {
    return url;
  }
  return DEV ? "/" + url : url;
};

export const getImageUrl = url => {
  return getAssetUrl(url);
};

export const getAudioUrl = url => {
  return getAssetUrl(url);
};

// ---------------- Animations
export const animateAnimations = [
  "backInDown",
  "backInLeft",
  "backInRight",
  "backInUp",
  "backOutDown",
  "backOutLeft",
  "backOutRight",
  "backOutUp",

  "bounce",
  "bounceIn",
  "bounceInDown",
  "bounceInLeft",
  "bounceInRight",
  "bounceInUp",
  "bounceOut",
  "bounceOutDown",
  "bounceOutLeft",
  "bounceOutRight",
  "bounceOutUp",

  "fadeIn",
  "fadeInBottomLeft",
  "fadeInBottomRight",
  "fadeInDown",
  "fadeInDownBig",
  "fadeInLeft",
  "fadeInLeftBig",
  "fadeInRight",
  "fadeInRightBig",
  "fadeInTopLeft",
  "fadeInTopRight",
  "fadeInUp",
  "fadeInUpBig",
  "fadeInUpSmall",
  "fadeInDownSmall",
  "fadeOut",
  "fadeOutBottomLeft",
  "fadeOutBottomRight",
  "fadeOutDown",
  "fadeOutDownBig",
  "fadeOutLeft",
  "fadeOutLeftBig",
  "fadeOutRight",
  "fadeOutRightBig",
  "fadeOutTopLeft",
  "fadeOutTopRight",
  "fadeOutUp",
  "fadeOutUpBig",
  "fadeOutUpSmall",
  "fadeOutDownSmall",

  "flash",

  "flip",
  "flipInX",
  "flipInY",
  "flipOutX",
  "flipOutY",

  "headShake",
  "heartBeat",

  "hinge",

  "jackInTheBox",

  "jello",

  "lightSpeedInRight",
  "lightSpeedInLeft",
  "lightSpeedOutRight",
  "lightSpeedOutLeft",

  "pulse",

  "rollIn",
  "rollOut",

  "rotateIn",
  "rotateInDownLeft",
  "rotateInDownRight",
  "rotateInUpLeft",
  "rotateInUpRight",
  "rotateOut",
  "rotateOutDownLeft",
  "rotateOutDownRight",
  "rotateOutUpLeft",
  "rotateOutUpRight",

  "rubberBand",

  "shake",
  "shakeX",
  "shakeY",

  "slideInDown",
  "slideInLeft",
  "slideInRight",
  "slideInUp",
  "slideOutDown",
  "slideOutLeft",
  "slideOutRight",
  "slideOutUp",

  "swing",

  "tada",

  "wobble",

  "zoomIn",
  "zoomInDown",
  "zoomInLeft",
  "zoomInRight",
  "zoomInUp",
  "zoomOut",
  "zoomOutDown",
  "zoomOutLeft",
  "zoomOutRight",
  "zoomOutUp"
];

export const isValidAnimation = name => {
  if (animateAnimations.includes(name)) {
    return true;
  }
  return false;
};

//
export const getAnimation = name => {
  if (!isValidAnimation(name)) {
    return "";
  }

  return `animate__${name}`;
};
