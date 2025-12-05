<script setup lang="ts">
import { ref, computed } from 'vue';
import { Item } from '../types';
import { Search, Plus, Check, Trash2 } from 'lucide-vue-next';
import MultiSelect from './MultiSelect.vue';
import ItemCard from './ItemCard.vue';

const props = defineProps<{
  items: Item[];
  selectedItems: Item[];
}>();

const emit = defineEmits<{
  (e: 'toggle-item', item: Item): void;
  (e: 'delete-custom', item: Item): void;
}>();

const searchQuery = ref('');
const filterType = ref<string[]>([]);
const filterRarity = ref<string[]>([]);
const filterSource = ref<string[]>([]);

const hoveredItem = ref<Item | null>(null);
const tooltipPos = ref({ x: 0, y: 0 });

const handleMouseMove = (e: MouseEvent) => {
  if (!hoveredItem.value) return;
  
  // Position tooltip to the right of the cursor
  const x = e.clientX + 20;
  const y = e.clientY + 20;
  
  // Check if it goes off screen (simple check)
  const maxX = window.innerWidth - 260; // ~2.5in + padding
  const maxY = window.innerHeight - 320; // ~3in + padding
  
  tooltipPos.value = {
    x: Math.min(x, maxX),
    y: Math.min(y, maxY)
  };
};

const uniqueRarities = computed(() => {
  const rarities = new Set(props.items.map(i => i.rarity).filter(Boolean));
  return Array.from(rarities).sort() as string[];
});

const uniqueSources = computed(() => {
  const sources = new Set(props.items.map(i => i.source).filter(Boolean));
  return Array.from(sources).sort() as string[];
});

const filteredItems = computed(() => {
  return props.items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    // Type Filter
    let matchesType = true;
    if (filterType.value.length > 0) {
      matchesType = false;
      if (filterType.value.includes('Custom') && item.source === 'Custom') matchesType = true;
      if (filterType.value.includes('Equipment') && item.type === 'Equipment') matchesType = true;
      if (filterType.value.includes('Magic Item') && item.type === 'Magic Item') matchesType = true;
    }

    // Rarity Filter
    let matchesRarity = true;
    if (filterRarity.value.length > 0) {
      matchesRarity = filterRarity.value.includes(item.rarity || '');
    }

    // Source Filter
    let matchesSource = true;
    if (filterSource.value.length > 0) {
      matchesSource = filterSource.value.includes(item.source || '');
    }
    
    return matchesSearch && matchesType && matchesRarity && matchesSource;
  });
});

const isSelected = (item: Item) => {
  return props.selectedItems.some(i => i.id === item.id);
};
</script>

<template>
  <div class="bg-white rounded-lg shadow p-4 h-full flex flex-col">
    <h2 class="text-xl font-bold mb-4 text-gray-800">Item Library</h2>
    
    <!-- Search & Filter -->
    <div class="flex flex-col gap-2 mb-4">
      <div class="relative w-full">
        <Search class="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search items..." 
          class="w-full pl-8 pr-2 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div class="flex gap-2">
        <div class="flex-1">
          <MultiSelect 
            v-model="filterType" 
            :options="['Equipment', 'Magic Item', 'Custom']" 
            placeholder="All Types" 
          />
        </div>
        <div class="flex-1">
          <MultiSelect 
            v-model="filterRarity" 
            :options="uniqueRarities" 
            placeholder="All Rarities" 
          />
        </div>
      </div>

      <div class="w-full">
        <MultiSelect 
          v-model="filterSource" 
          :options="uniqueSources" 
          placeholder="All Sources" 
        />
      </div>
    </div>

    <!-- List -->
    <div class="flex-1 overflow-y-auto space-y-2 pr-1" @mousemove="handleMouseMove" @mouseleave="hoveredItem = null">
      <div 
        v-for="item in filteredItems" 
        :key="item.id"
        class="flex items-center justify-between p-2 rounded border hover:bg-gray-50 transition-colors group"
        :class="{'border-blue-500 bg-blue-50': isSelected(item)}"
        @mouseenter="hoveredItem = item"
      >
        <div class="flex-1 cursor-pointer" @click="emit('toggle-item', item)">
          <div class="font-bold text-sm flex items-center gap-2">
            {{ item.name }}
            <span v-if="item.source === 'Custom'" class="text-[10px] bg-green-100 text-green-800 px-1 rounded border border-green-200">Custom</span>
          </div>
          <div class="text-xs text-gray-500">{{ item.type }} • {{ item.rarity || 'Common' }}</div>
        </div>
        
        <div class="flex items-center gap-2">
          <!-- Delete Custom Item Button -->
          <button 
            v-if="item.source === 'Custom'"
            @click.stop="emit('delete-custom', item)"
            class="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete Custom Item"
          >
            <Trash2 class="w-4 h-4" />
          </button>

          <div 
            @click="emit('toggle-item', item)"
            class="w-6 h-6 rounded-full flex items-center justify-center border cursor-pointer"
            :class="isSelected(item) ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 text-gray-300'"
          >
            <Check v-if="isSelected(item)" class="w-4 h-4" />
            <Plus v-else class="w-4 h-4" />
          </div>
        </div>
      </div>
      <div v-if="filteredItems.length === 0" class="text-center text-gray-500 py-4">
        No items found.
      </div>
    </div>

    <!-- Hover Preview Tooltip -->
    <div 
      v-if="hoveredItem"
      class="fixed z-50 pointer-events-none shadow-2xl rounded-lg overflow-hidden"
      :style="{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }"
    >
      <ItemCard :item="hoveredItem" />
    </div>
  </div>
</template>
