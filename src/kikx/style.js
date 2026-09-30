const appThemes = {
  dark: "bg-black text-white",
  light: "bg-white text-black",
  transparent: "bg-black/60 text-white",

  invisible: "bg-transparent text-white",

  default: "bg-black/60 text-white",

  // New themes
  dim: "bg-gray-900 text-gray-100",
  softDark: "bg-zinc-800 text-zinc-200",
  softLight: "bg-gray-100 text-gray-800",

  // Daisyui
  primary: "bg-primary text-primary-content",
  secondary: "bg-secondary text-secondary-content",
  success: "bg-success text-success-content",
  danger: "bg-error text-error-content",
  warning: "bg-warning text-warning-content",
  info: "bg-info text-info-content",

  gradientBlue: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white",
  gradientSunset: "bg-gradient-to-r from-orange-400 to-pink-500 text-white",
  gradientEmerald: "bg-gradient-to-r from-emerald-400 to-teal-600 text-white",

  borderedLight: "bg-white text-black border border-gray-200",
  borderedDark: "bg-gray-900 text-white border border-gray-700",

  elevatedLight: "bg-white text-black shadow-lg",
  elevatedDark: "bg-gray-800 text-white shadow-xl",

  muted: "bg-gray-200 text-gray-700",
  highContrast: "bg-black text-yellow-400"
};

// Check if theme exists
export const hasAppTheme = theme => Boolean(theme) && theme in appThemes;

// Theme apply to statusbar & navbar
export function getAppTheme(theme) {
  return appThemes[theme] || appThemes.default;
}

export function getParticleColors(color) {
  return (
    {
      white: "#ffffff",
      rainbow: [
        "#ff1744",
        "#ff9100",
        "#ffeb3b",
        "#00e676",
        "#00e5ff",
        "#2979ff",
        "#7c4dff",
        "#ff4081"
      ],
      fire: ["#ff1744", "#ff5722", "#ff9100", "#ffc107", "#ffeb3b"],
      ocean: ["#00e5ff", "#00b8d4", "#2979ff", "#3d5afe"],
      candy: ["#ff4081", "#e040fb", "#7c4dff", "#40c4ff", "#69f0ae"],
      neon: ["#ff00ff", "#9d00ff", "#00ffff", "#39ff14", "#ffff00"],
      gold: ["#fff8dc", "#ffd700", "#ffb300", "#ff9800"],
      ice: ["#ffffff", "#b3e5fc", "#40c4ff", "#00e5ff"],
      sunset: ["#ff1744", "#ff4081", "#ff9100", "#ffc107"],
      purple: ["#e040fb", "#9c27b0", "#7c4dff", "#651fff"],
      emerald: ["#b9f6ca", "#69f0ae", "#00e676", "#00c853"]
    }[color] || "#ffffff"
  );
}
