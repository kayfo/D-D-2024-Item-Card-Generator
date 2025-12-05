<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Item, PrintSettings } from './types';
import { fetchAllItems } from './services/api';
import ItemPicker from './components/ItemPicker.vue';
import PrintLayout from './components/PrintLayout.vue';
import CustomItemModal from './components/CustomItemModal.vue';
import { Printer, LayoutGrid, FileText, X, Loader2, Plus, Download, Upload, AlertTriangle, Copy } from 'lucide-vue-next';

const allItems = ref<Item[]>([]);
const customItems = ref<Item[]>([]);
const selectedItems = ref<Item[]>([]);
const isPrintMode = ref(false);
const isLoading = ref(true);
const showCustomModal = ref(false);
const printSettings = ref<PrintSettings>({
  layout: 'grid',
  paperSize: 'letter'
});

const combinedItems = computed(() => {
  return [...customItems.value, ...allItems.value];
});

onMounted(async () => {
  // Load custom items from local storage
  const savedCustomItems = localStorage.getItem('dnd-card-gen-custom-items');
  if (savedCustomItems) {
    try {
      customItems.value = JSON.parse(savedCustomItems);
    } catch (e) {
      console.error("Failed to parse custom items", e);
    }
  }

  try {
    const apiItems = await fetchAllItems();
    allItems.value = apiItems;
  } catch (e) {
    console.error("Failed to load items", e);
  } finally {
    isLoading.value = false;
  }
});

const saveCustomItem = (item: Item) => {
  customItems.value.push(item);
  localStorage.setItem('dnd-card-gen-custom-items', JSON.stringify(customItems.value));
};

const deleteCustomItem = (item: Item) => {
  if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
    customItems.value = customItems.value.filter(i => i.id !== item.id);
    localStorage.setItem('dnd-card-gen-custom-items', JSON.stringify(customItems.value));
    // Also remove from selected if present
    const selectedIndex = selectedItems.value.findIndex(i => i.id === item.id);
    if (selectedIndex !== -1) {
      selectedItems.value.splice(selectedIndex, 1);
    }
  }
};

const exportCustomItems = () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(customItems.value));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "dnd-custom-items.json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

const importCustomItems = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const items = JSON.parse(e.target?.result as string);
      if (Array.isArray(items)) {
        // Merge with existing, avoiding duplicates by ID
        const existingIds = new Set(customItems.value.map(i => i.id));
        const newItems = items.filter((i: Item) => !existingIds.has(i.id));
        customItems.value = [...customItems.value, ...newItems];
        localStorage.setItem('dnd-card-gen-custom-items', JSON.stringify(customItems.value));
        alert(`Imported ${newItems.length} items successfully.`);
      }
    } catch (err) {
      alert('Failed to import items. Invalid JSON file.');
    }
  };
  reader.readAsText(file);
  // Reset input
  (event.target as HTMLInputElement).value = '';
};

const toggleItem = (item: Item) => {
  const index = selectedItems.value.findIndex(i => i.id === item.id);
  if (index === -1) {
    // Clone the item so edits don't affect the library or other copies
    selectedItems.value.push(JSON.parse(JSON.stringify(item)));
  } else {
    selectedItems.value.splice(index, 1);
  }
};

const removeItem = (index: number) => {
  selectedItems.value.splice(index, 1);
};

const duplicateItem = (index: number) => {
  const item = selectedItems.value[index];
  // Clone the item
  selectedItems.value.splice(index + 1, 0, JSON.parse(JSON.stringify(item)));
};

const startPrint = () => {
  isPrintMode.value = true;
  setTimeout(() => {
    window.print();
  }, 500);
};

const exitPrintMode = () => {
  isPrintMode.value = false;
};
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- App Header (No Print) -->
    <header class="bg-slate-800 text-white p-4 shadow-md no-print flex justify-between items-center">
      <div class="flex items-center gap-2">
        <h1 class="text-xl font-bold">D&D 2024 Item Card Generator</h1>
      </div>
      <div class="flex gap-4">
        <button 
          v-if="!isPrintMode && selectedItems.length > 0"
          @click="startPrint"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
        >
          <Printer class="w-4 h-4" /> Print {{ selectedItems.length }} Cards
        </button>
        <button 
          v-if="isPrintMode"
          @click="exitPrintMode"
          class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
        >
          <X class="w-4 h-4" /> Exit Print Preview
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex overflow-hidden relative print:block print:overflow-visible print:h-auto">
      
      <!-- Editor View -->
      <div v-if="!isPrintMode" class="flex w-full h-full p-4 gap-4 no-print">
        <!-- Left: Item Picker -->
        <div class="w-1/3 min-w-[300px] h-full flex flex-col gap-4">
          
          <!-- Custom Item Actions -->
          <div class="bg-white p-3 rounded-lg shadow flex flex-col gap-2">
            <button 
              @click="showCustomModal = true"
              class="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors"
            >
              <Plus class="w-4 h-4" /> Create Custom Item
            </button>
            
            <div class="flex gap-2">
              <button 
                @click="exportCustomItems"
                class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded text-xs flex items-center justify-center gap-1 border"
                title="Export Custom Items"
              >
                <Download class="w-3 h-3" /> Export
              </button>
              <label class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-2 rounded text-xs flex items-center justify-center gap-1 border cursor-pointer">
                <Upload class="w-3 h-3" /> Import
                <input type="file" accept=".json" class="hidden" @change="importCustomItems" />
              </label>
            </div>

            <div class="text-[10px] text-amber-600 flex items-start gap-1 bg-amber-50 p-1 rounded border border-amber-100">
              <AlertTriangle class="w-3 h-3 flex-shrink-0 mt-0.5" />
              <span>Custom items are stored in your browser. Export them to save a backup.</span>
            </div>
          </div>

          <div v-if="isLoading" class="flex-1 flex items-center justify-center bg-white rounded-lg shadow">
            <div class="flex flex-col items-center gap-2 text-gray-500">
              <Loader2 class="w-8 h-8 animate-spin" />
              <span>Loading Library...</span>
            </div>
          </div>
          <ItemPicker 
            v-else
            :items="combinedItems" 
            :selected-items="selectedItems" 
            @toggle-item="toggleItem" 
            @delete-custom="deleteCustomItem"
          />
        </div>

        <!-- Right: Selected Preview -->
        <div class="flex-1 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-4 flex flex-col">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-bold text-gray-700">Selected Cards ({{ selectedItems.length }})</h2>
            
            <!-- Print Settings -->
            <div class="flex items-center gap-4 bg-white p-2 rounded border shadow-sm">
              <span class="text-sm font-bold text-gray-600">Layout:</span>
              <div class="flex gap-2">
                <button 
                  @click="printSettings.layout = 'grid'"
                  class="p-1 rounded border"
                  :class="printSettings.layout === 'grid' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-200 text-gray-500'"
                  title="Grid Layout (Multiple per page)"
                >
                  <LayoutGrid class="w-5 h-5" />
                </button>
                <button 
                  @click="printSettings.layout = 'single'"
                  class="p-1 rounded border"
                  :class="printSettings.layout === 'single' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-200 text-gray-500'"
                  title="Single Card (Centered)"
                >
                  <FileText class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div v-if="selectedItems.length === 0" class="flex-1 flex items-center justify-center text-gray-400">
            <div class="text-center">
              <p>Select items from the library to add them to your print queue.</p>
            </div>
          </div>

          <div v-else class="flex-1 overflow-y-auto grid grid-cols-[repeat(auto-fill,minmax(2.5in,1fr))] gap-4 content-start">
            <div v-for="(item, index) in selectedItems" :key="index" class="relative group">
              <div class="transform scale-90 origin-top-left">
                 <!-- Preview uses the actual print component but scaled down -->
                 <PrintLayout :items="[item]" :settings="{ layout: 'single', paperSize: 'letter' }" :editable="true" class="!min-h-0 !bg-transparent !p-0" />
              </div>
              <div class="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  @click="duplicateItem(index)"
                  class="bg-blue-500 text-white rounded-full p-1 shadow hover:bg-blue-600"
                  title="Duplicate"
                >
                  <Copy class="w-4 h-4" />
                </button>
                <button 
                  @click="removeItem(index)"
                  class="bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                  title="Remove"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Print View (Overlay) -->
      <div v-if="isPrintMode" class="absolute inset-0 bg-white z-50 overflow-auto print:overflow-visible print:static print:h-auto">
        <PrintLayout :items="selectedItems" :settings="printSettings" />
      </div>

      <!-- Custom Item Modal -->
      <CustomItemModal 
        v-if="showCustomModal" 
        @close="showCustomModal = false" 
        @save="saveCustomItem" 
      />

    </main>
  </div>
</template>

<style>
/* Global styles */
html, body, #app {
  height: 100%;
  margin: 0;
}
</style>
