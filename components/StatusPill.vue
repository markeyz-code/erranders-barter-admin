<template>
  <span class="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide" :class="cls">{{ label }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
const props = defineProps<{ status: string }>();
const label = computed(() => (props.status || '').replace(/_/g, ' '));
const cls = computed(() => {
  switch (props.status) {
    case 'resolved':
    case 'answered':
    case 'completed':
    case 'confirmed':
      return 'bg-emerald-50 text-emerald-700';
    case 'reviewing':
    case 'open':
    case 'pending':
      return 'bg-amber-50 text-amber-700';
    case 'dismissed':
    case 'closed':
      return 'bg-slate-100 text-slate-600';
    default:
      return 'bg-slate-100 text-slate-600';
  }
});
</script>
