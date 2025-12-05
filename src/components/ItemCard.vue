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

const cleanedDescription = computed(() => {
  let desc = props.item.description
    .replace(/_+/g, '') // Remove underscores
    .replace(/\*\*/g, '') // Remove bold markers
    .replace(/\*/g, ''); // Remove italic markers

  // Common Abbreviations
  const replacements: Record<string, string> = {
    'Armor Class': 'AC',
    'Hit Points': 'HP',
    'Difficulty Class': 'DC',
    'Saving Throw': 'Save',
    'Constitution': 'Con',
    'Dexterity': 'Dex',
    'Strength': 'Str',
    'Intelligence': 'Int',
    'Wisdom': 'Wis',
    'Charisma': 'Cha',
    'feet': 'ft.',
    'radius': 'rad.',
    'minute': 'min.',
    'minutes': 'min.',
    'hour': 'hr.',
    'hours': 'hr.',
    'damage': 'dmg',
    'bonus action': 'bonus act.',
    'reaction': 'react.',
    'advantage': 'adv.',
    'disadvantage': 'disadv.',
    'Wondrous Item': 'Wondrous',
  };

  Object.entries(replacements).forEach(([key, value]) => {
     const regex = new RegExp(`\\b${key}\\b`, 'gi');
     desc = desc.replace(regex, value);
  });

  return desc;
});

const descriptionClass = computed(() => {
  const len = cleanedDescription.value.length;
  if (len > 800) return 'text-[7px] leading-tight';
  if (len > 500) return 'text-[8px] leading-tight';
  if (len > 300) return 'text-[9px] leading-tight';
  return 'text-[10px] leading-snug';
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
    <div class="bg-gray-200 px-2 py-1 text-[10px] font-bold uppercase tracking-wider border-b border-card-border flex flex-col gap-0.5">
      <div class="flex justify-between items-center w-full">
        <span>{{ item.type === 'Wondrous Item' ? 'Wondrous' : item.type }}</span>
        <span v-if="item.rarity">{{ item.rarity }}</span>
      </div>
      <div v-if="item.attunement" class="text-[9px] normal-case italic text-gray-600">
        Req. Attunement
      </div>
    </div>

    <!-- Content -->
    <div class="p-2 flex-1 flex flex-col font-serif" :class="descriptionClass">
      
      <!-- Stats Row -->
      <div class="flex flex-wrap gap-x-3 gap-y-1 mb-1 text-gray-700 border-b border-gray-300 pb-1 items-center" 
           v-if="item.cost || item.weight || (item.properties && item.properties.length)">
        <div v-if="item.cost" class="flex items-center gap-1 whitespace-nowrap">
          <Coins class="w-3 h-3" /> {{ item.cost }}
        </div>
        <div v-if="item.weight" class="flex items-center gap-1 whitespace-nowrap">
          <Scale class="w-3 h-3" /> {{ item.weight }}
        </div>
        <!-- Properties inline if possible -->
        <div v-if="item.properties && item.properties.length" class="italic text-gray-600">
          {{ item.properties.join(', ') }}
        </div>
      </div>

      <!-- Mastery -->
      <div v-if="item.mastery" class="mb-1 border-l-2 border-gray-300 pl-2">
        <span class="font-bold text-gray-800">Mastery: {{ item.mastery.name }}.</span>
        <span class="text-gray-600"> {{ item.mastery.description }}</span>
      </div>

      <!-- Damage Mod -->
      <div v-if="item.damageMod" class="mb-1 text-gray-600 font-bold">
        +{{ item.damageMod }} dmg mod.
      </div>

      <!-- Description -->
      <div class="flex-1 overflow-hidden">
        <p class="whitespace-pre-wrap">{{ cleanedDescription }}</p>
      </div>
      
      <!-- Footer -->
      <div class="mt-auto pt-0.5 text-[8px] text-gray-400 text-center border-t border-gray-200">
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
