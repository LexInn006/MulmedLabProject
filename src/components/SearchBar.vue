<script setup lang="ts">
import { Search } from 'lucide-vue-next'

defineProps<{
  modelValue: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="search-wrapper">
    <Search :size="18" class="search-icon" />
    <input 
      type="text" 
      class="search-input" 
      placeholder="What do you want to listen to?" 
      :value="modelValue" 
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" 
    />
  </div>
</template>

<style scoped>
.search-wrapper {
  position: relative;
  width: 100%;
  max-width: 360px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-subdued);
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 40px;
  border-radius: var(--radius-full);
  border: none;
  background-color: var(--bg-elevated);
  color: var(--text-primary);
  font-size: 0.95rem;
  outline: none;
  transition: background-color 0.2s, box-shadow 0.2s;
  font-family: var(--font-family);
}

.search-input::placeholder {
  color: var(--text-subdued);
}

.search-input:focus {
  background-color: var(--bg-highlight);
  box-shadow: 0 0 0 1px var(--text-secondary);
}
</style>
