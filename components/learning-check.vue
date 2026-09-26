<script setup lang="ts">
import { computed, ref } from "vue";
import { useNav } from "@slidev/client";
const props = defineProps<{
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}>();
const { isPrintMode } = useNav();
const selected = ref<number | null>(null);
const answered = computed(() => selected.value !== null);
</script>

<template>
  <section class="learning-check" @click.stop @keydown.stop>
    <fieldset>
      <legend>{{ question }}</legend>
      <p class="check-hint">
        Prediksi dahulu. Pilih jawaban untuk melihat alasan.
      </p>
      <div class="check-options">
        <button
          v-for="(option, index) in options"
          :key="option"
          type="button"
          :aria-pressed="selected === index"
          :disabled="isPrintMode"
          @click="selected = index"
        >
          <span aria-hidden="true">{{ String.fromCharCode(65 + index) }}.</span>
          {{ option }}
        </button>
      </div>
    </fieldset>
    <div
      class="check-feedback"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <template v-if="answered || isPrintMode">
        <strong>{{
          isPrintMode
            ? "Jawaban: " + options[answer]
            : selected === answer
              ? "Tepat."
              : "Belum tepat."
        }}</strong>
        {{ explanation }}
      </template>
      <span v-else>Siapkan alasan, bukan hanya pilihan huruf.</span>
    </div>
    <button
      v-if="answered && !isPrintMode"
      type="button"
      class="check-reset"
      @click="selected = null"
    >
      Ulangi prediksi
    </button>
  </section>
</template>

<style scoped>
.learning-check {
  background: #fffdf5;
  border: 2px solid #111;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 4px 4px 0 #111;
}
fieldset {
  border: 0;
  padding: 0;
  margin: 0;
  min-width: 0;
}
legend {
  font-size: 20px;
  font-weight: 700;
}
.check-hint {
  font-size: 14px;
}
.check-options {
  display: grid;
  gap: 8px;
}
button {
  text-align: left;
  border: 2px solid #111;
  padding: 10px 12px;
  border-radius: 6px;
  background: white;
  color: #111;
  font: inherit;
  cursor: pointer;
}
button[aria-pressed="true"] {
  background: #cdee2d;
  font-weight: 700;
}
button:focus-visible {
  outline: 3px solid #153ea0;
  outline-offset: 3px;
}
button:disabled {
  opacity: 1;
  cursor: default;
}
.check-feedback {
  min-height: 66px;
  margin-top: 14px;
  font-size: 15px;
}
.check-reset {
  font-size: 13px;
  padding: 5px 10px;
}
</style>
