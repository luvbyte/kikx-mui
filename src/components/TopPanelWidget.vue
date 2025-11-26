<template>
  <div class="w-full h-full flex justify-center items-center">
    <div class="clock">
      <svg viewBox="0 0 200 200">
        <!-- Outer border -->
        <circle
          cx="100"
          cy="100"
          r="95"
          stroke="#ddd"
          stroke-width="4"
          fill="none"
        />

        <!-- Hour ticks -->
        <g>
          <template v-for="n in 12" :key="n">
            <line
              x1="100"
              y1="20"
              x2="100"
              y2="35"
              :transform="`rotate(${(n-1)*30} 100 100)`"
              stroke="#e5e5e5"
              stroke-width="3"
              stroke-linecap="round"
            />
          </template>
        </g>

        <!-- Hour hand -->
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="55"
          :transform="`rotate(${hourAngle} 100 100)`"
          stroke="#f1f1f1"
          stroke-width="5"
          stroke-linecap="round"
        />

        <!-- Minute hand -->
        <line
          x1="100"
          y1="100"
          x2="100"
          y2="40"
          :transform="`rotate(${minuteAngle} 100 100)`"
          stroke="#d8d8d8"
          stroke-width="4"
          stroke-linecap="round"
        />

        <!-- Second hand -->
        <line
          x1="100"
          y1="105"
          x2="100"
          y2="30"
          :transform="`rotate(${secondAngle} 100 100)`"
          stroke="#ff4b4b"
          stroke-width="2"
          stroke-linecap="round"
        />

        <!-- Center dot -->
        <circle cx="100" cy="100" r="4" fill="#ff4b4b" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const hourAngle = ref(0)
const minuteAngle = ref(0)
const secondAngle = ref(0)

let rafId = null

function animate() {
  const d = new Date()
  const ms = d.getMilliseconds()
  const s = d.getSeconds() + ms / 1000
  const m = d.getMinutes() + s / 60
  const h = (d.getHours() % 12) + m / 60

  hourAngle.value = h * 30
  minuteAngle.value = m * 6
  secondAngle.value = s * 6

  rafId = requestAnimationFrame(animate)
}

onMounted(() => animate())
onBeforeUnmount(() => cancelAnimationFrame(rafId))
</script>

<style scoped>
.clock {
  width: min(85vmin, 300px);
  height: min(85vmin, 300px);
  background: transparent;
}

svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>