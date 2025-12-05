<script setup lang="ts">
import { Item, PrintSettings } from '../types';
import ItemCard from './ItemCard.vue';

defineProps<{
  items: Item[];
  settings: PrintSettings;
}>();
</script>

<template>
  <div class="print-layout w-full bg-white min-h-screen">
    <!-- Grid Layout -->
    <div v-if="settings.layout === 'grid'" class="grid-container p-4 print:p-0">
      <div v-for="(item, index) in items" :key="index" class="print-item-wrapper border border-dashed border-gray-300 print:border-none">
        <ItemCard :item="item" />
      </div>
    </div>

    <!-- Single Layout -->
    <div v-else class="single-container flex flex-col items-center gap-8 p-8 print:block print:p-0">
      <div v-for="(item, index) in items" :key="index" class="page-break-wrapper flex items-center justify-center print:h-screen print:w-screen">
        <ItemCard :item="item" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 2.5in);
  justify-content: center;
  gap: 0;
  width: 100%;
}

.print-item-wrapper {
  /* Add cut lines or spacing if needed */
  break-inside: avoid;
  page-break-inside: avoid;
}

@media print {
  .print-layout {
    background: white;
  }
  
  .page-break-wrapper {
    page-break-after: always;
    break-after: page;
  }
  
  .page-break-wrapper:last-child {
    page-break-after: avoid;
    break-after: avoid;
  }
}
</style>
