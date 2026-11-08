<template>
  <div class="donut-wrapper flex flex-center relative-position">
    <svg :width="size" :height="size" class="donut-svg">
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        stroke="#EAE8FF"
        :stroke-width="strokeWidth"
        fill="transparent"
      />
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke="color"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        fill="transparent"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        class="donut-progress"
      />
    </svg>
    <div class="absolute-center text-center">
      <div class="text-weight-bolder" :style="{ fontSize: `${size * 0.22}px`, color: '#211D3B' }">
        {{ score }}%
      </div>
      <div v-if="showLabel" class="text-caption text-grey-6 text-weight-medium" style="font-size: 11px;">
        match
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  score: { type: Number, default: 85 },
  size: { type: Number, default: 110 },
  strokeWidth: { type: Number, default: 10 },
  showLabel: { type: Boolean, default: true }
})

const radius = computed(() => (props.size - props.strokeWidth) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const strokeDashoffset = computed(() => {
  return circumference.value - (props.score / 100) * circumference.value
})

const color = computed(() => {
  if (props.score >= 85) return '#5B55D6'
  if (props.score >= 70) return '#665FE2'
  if (props.score >= 50) return '#8C85F4'
  return '#F59E0B'
})
</script>

<style scoped>
.donut-svg {
  transform: rotate(-90deg);
}
.donut-progress {
  transition: stroke-dashoffset 0.8s ease-in-out;
}
</style>
