const vibrations = {
  short(duration = 80) {
    return [duration];
  },
  double(duration = 80, gap = 60) {
    return [duration, gap, duration];
  },
  triple(duration = 80, gap = 60) {
    return [duration, gap, duration, gap, duration];
  },
  long(duration = 400) {
    return [duration];
  },
  heartbeat(short = 70, long = 180, gap = 50) {
    return [short, gap, short, gap * 2, long];
  },
  sos() {
    return [
      80, 80, 80, 80, 80, 240, 240, 80, 240, 80, 240, 240, 80, 80, 80, 80, 80
    ];
  },
  jutsu() {
    return [
      1000, 70, 120, 80, 170, 70, 120, 80, 70, 120, 70, 120, 70, 70, 70, 120,
      70, 70, 90, 200, 200
    ];
  },
  soft() {
    return [120];
  },
  crisp() {
    return [70];
  }
};

// Vibrate pattern
export function vibrate(pattern, ...args) {
  if (!navigator.vibrate) return false;

  if (!pattern) {
    navigator.vibrate(0);
    return true;
  }

  const sequence = vibrations[pattern]?.(...args) ?? vibrations.short();

  return navigator.vibrate(sequence);
}

// UI Haptic Feeback
export function haptic(type = "soft") {
  switch (type) {
    case "off":
      return;

    case "soft":
      return vibrate("soft");

    case "crisp":
      return vibrate("crisp");

    default:
      return vibrate("short");
  }
}
