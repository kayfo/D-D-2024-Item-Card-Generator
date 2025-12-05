<script setup lang="ts">
import { computed } from 'vue';
import { Item } from '../types';
import { Sword, Sparkles, Scale, Coins } from 'lucide-vue-next';

const props = defineProps<{
  item: Item;
}>();

const headerColor = computed(() => {
  return props.item.type === 'Magic Item' ? 'bg-magic-header' : 'bg-equipment-header';
});

const icon = computed(() => {
  return props.item.type === 'Magic Item' ? Sparkles : Sword;
});
</script>

<template>
  <div class="item-card border-2 border-card-border bg-card-bg flex flex-col overflow-hidden relative shadow-md print:shadow-none">
    <!-- Header -->
    <div :class="[headerColor, 'text-white p-2 flex items-center justify-between h-10']">
      <h3 class="font-serif font-bold text-sm leading-tight truncate flex-1">{{ item.name }}</h3>
      <component :is="icon" class="w-4 h-4 ml-1 flex-shrink-0" />
    </div>

    <!-- Subheader -->
    <div class="bg-gray-200 px-2 py-1 text-[10px] font-bold uppercase tracking-wider border-b border-card-border flex justify-between items-center">
      <span>{{ item.type }}</span>
      <span v-if="item.rarity">{{ item.rarity }}</span>
    </div>

    <!-- Content -->
    <div class="p-2 flex-1 flex flex-col text-[10px] leading-snug font-serif">
      
      <!-- Stats Row -->
      <div class="flex flex-wrap gap-2 mb-2 text-gray-700 border-b border-gray-300 pb-1" v-if="item.cost || item.weight || item.properties">
        <div v-if="item.cost" class="flex items-center gap-1">
          <Coins class="w-3 h-3" /> {{ item.cost }}
        </div>
        <div v-if="item.weight" class="flex items-center gap-1">
          <Scale class="w-3 h-3" /> {{ item.weight }}
        </div>
      </div>

      <!-- Properties -->
      <div v-if="item.properties && item.properties.length" class="mb-2 italic text-gray-600">
        {{ item.properties.join(', ') }}
      </div>

      <!-- Mastery -->
      <div v-if="item.mastery" class="mb-2 border-l-2 border-gray-300 pl-2">
        <span class="font-bold text-gray-800">Mastery: {{ item.mastery.name }}.</span>
        <span class="text-gray-600"> {{ item.mastery.description }}</span>
      </div>

      <!-- Damage Mod -->
      <div v-if="item.damageMod" class="mb-2 text-gray-600 font-bold text-[9px]">
        Add {{ item.damageMod }} modifier to damage.
      </div>

      <!-- Description -->
      <div class="flex-1 overflow-hidden">
        <p class="whitespace-pre-wrap">{{ item.description }}</p>
      </div>
      
      <!-- Footer -->
      <div class="mt-auto pt-1 text-[8px] text-gray-400 text-center border-t border-gray-200">
        {{ item.source || 'SRD 2024' }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.item-card {
  width: 2.5in;
  height: 3in;
  box-sizing: border-box;
}
</style>
