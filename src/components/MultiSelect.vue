<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ChevronDown } from 'lucide-vue-next';

const props = defineProps<{
  options: string[];
  modelValue: string[];
  placeholder: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();

const isOpen = ref(false);
const container = ref<HTMLElement | null>(null);

const displayValue = computed(() => {
  if (props.modelValue.length === 0) return props.placeholder;
  if (props.modelValue.length === 1) return props.modelValue[0];
  if (props.modelValue.length === props.options.length) return 'All Selected';
  return `${props.modelValue.length} selected`;
});

const toggle = (option: string) => {
  const newValue = [...props.modelValue];
  const index = newValue.indexOf(option);
  if (index === -1) {
    newValue.push(option);
  } else {
    newValue.splice(index, 1);
  }
  emit('update:modelValue', newValue);
};

const handleClickOutside = (event: MouseEvent) => {
  if (container.value && !container.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="relative" ref="container">
    <button 
      @click="isOpen = !isOpen" 
      class="w-full border rounded px-2 py-2 text-sm text-left flex justify-between items-center bg-white hover:border-gray-400 transition-colors"
      :class="{'border-blue-500 ring-1 ring-blue-500': isOpen}"
    >
      <span class="truncate text-gray-700" :class="{'text-gray-400': modelValue.length === 0}">
        {{ displayValue }}
      </span>
      <ChevronDown class="w-4 h-4 text-gray-500" />
    </button>
    
    <div v-if="isOpen" class="absolute z-20 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-auto p-1 flex flex-col gap-0.5">
      <div 
        v-for="option in options" 
        :key="option" 
        class="flex items-center gap-2 p-2 hover:bg-blue-50 cursor-pointer rounded transition-colors"
        @click="toggle(option)"
      >
        <div class="w-4 h-4 border rounded flex items-center justify-center bg-white" :class="{'bg-blue-500 border-blue-500': modelValue.includes(option)}">
          <svg v-if="modelValue.includes(option)" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span class="text-sm text-gray-700">{{ option }}</span>
      </div>
      <div v-if="options.length === 0" class="p-2 text-sm text-gray-400 text-center">
        No options
      </div>
    </div>
  </div>
</template>
