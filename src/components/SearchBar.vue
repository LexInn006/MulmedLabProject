<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>

<template>
  <div class="search-wrap">
    <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
    <input
      class="search-input"
      type="text"
      placeholder="Search songs, artists..."
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style scoped>
.search-wrap {
  position: relative;
  max-width: 340px; width: 100%;
}
.search-icon {
  position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
  color: var(--text-subdued); pointer-events: none;
}
.search-input {
  width: 100%; padding: 9px 14px 9px 38px;
  background: var(--bg-elevated); border: 1px solid rgba(255,255,255,0.07);
  border-radius: var(--radius-full); color: var(--text-primary);
  font-size: 0.87rem; font-family: var(--font-family);
  outline: none; transition: all var(--transition);
}
.search-input::placeholder { color: var(--text-subdued); }
.search-input:focus {
  border-color: var(--accent); background: var(--bg-highlight);
  box-shadow: 0 0 0 3px var(--accent-glow);
}
</style>
