<template>
  <ClientOnly>
    <Teleport to="body">
      <div
        v-if="open"
        class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
        @click.self="!busy && emit('cancel')"
      >
        <div class="bg-white rounded-2xl w-full max-w-md border border-slate-200 shadow-xl">
          <div class="p-5 sm:p-6">
            <div class="flex items-start gap-3">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                :class="tone === 'danger' ? 'bg-red-50' : 'bg-brand-50'"
              >
                <AlertTriangle v-if="tone === 'danger'" class="w-5 h-5 text-red-600" />
                <ShieldCheck v-else class="w-5 h-5 text-brand-600" />
              </div>
              <div class="min-w-0">
                <h3 class="text-lg font-bold text-slate-900">{{ title }}</h3>
                <p v-if="message" class="text-sm text-slate-500 mt-1 whitespace-pre-line">{{ message }}</p>
              </div>
            </div>

            <slot />

            <div v-if="showReason" class="mt-4">
              <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                {{ reasonLabel }}
                <span v-if="reasonRequired" class="text-red-500">*</span>
              </label>
              <textarea
                v-model="reason"
                rows="3"
                :placeholder="reasonPlaceholder"
                class="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none"
              ></textarea>
              <p v-if="reasonRequired && !reason.trim()" class="text-xs text-slate-400 mt-1">
                A reason is required.
              </p>
            </div>

            <div v-if="error" class="mt-4 bg-red-50 border border-red-100 text-red-700 rounded-xl p-3 text-sm flex items-start gap-2">
              <AlertCircle class="w-4 h-4 mt-0.5 shrink-0" />
              <span>{{ error }}</span>
            </div>

            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                class="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50"
                :disabled="busy"
                @click="emit('cancel')"
              >
                {{ cancelLabel }}
              </button>
              <button
                type="button"
                class="px-5 py-2 text-sm font-bold text-white rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                :class="tone === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-600 hover:bg-brand-700'"
                :disabled="!canConfirm"
                @click="confirm"
              >
                <Loader2 v-if="busy" class="w-4 h-4 animate-spin" />
                {{ busy ? busyLabel : confirmLabel }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { AlertCircle, AlertTriangle, Loader2, ShieldCheck } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    open: boolean;
    title: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    busyLabel?: string;
    busy?: boolean;
    tone?: 'danger' | 'primary';
    showReason?: boolean;
    reasonRequired?: boolean;
    reasonLabel?: string;
    reasonPlaceholder?: string;
    error?: string;
  }>(),
  {
    message: '',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    busyLabel: 'Working…',
    busy: false,
    tone: 'primary',
    showReason: false,
    reasonRequired: false,
    reasonLabel: 'Reason',
    reasonPlaceholder: 'Explain why this action is being taken…',
    error: '',
  }
);

const emit = defineEmits<{
  (event: 'confirm', reason: string): void;
  (event: 'cancel'): void;
}>();

const reason = ref('');

watch(
  () => props.open,
  (open) => {
    if (open) reason.value = '';
  }
);

const canConfirm = computed(
  () => !props.busy && (!props.reasonRequired || reason.value.trim().length > 0)
);

const confirm = () => {
  if (!canConfirm.value) return;
  emit('confirm', reason.value.trim());
};
</script>
