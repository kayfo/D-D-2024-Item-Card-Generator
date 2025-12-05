<script setup lang="ts">
import { ref, computed } from 'vue';
import { Item } from '../types';
import { X, Plus } from 'lucide-vue-next';
import { MASTERIES } from '../data/masteries';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save', item: Item): void;
}>();

const newItem = ref<Partial<Item>>({
  type: 'Equipment',
  rarity: 'Common',
  source: 'Custom',
  properties: []
});

const selectedProperty = ref('');
const rangeNormal = ref('');
const rangeLong = ref('');
const reachValue = ref('');
const versatileDamage = ref('');
const customPropertyText = ref('');
const masteryName = ref('');

const WEAPON_PROPERTIES = [
  'Ammunition',
  'Finesse',
  'Heavy',
  'Light',
  'Loading',
  'Range',
  'Reach',
  'Special',
  'Thrown',
  'Two-Handed',
  'Versatile',
  'Other'
];

const masteriesList = computed(() => Object.values(MASTERIES));

const addProperty = () => {
  if (!selectedProperty.value) return;

  let propString = selectedProperty.value;

  if (['Ammunition', 'Thrown', 'Range'].includes(selectedProperty.value)) {
    if (rangeNormal.value && rangeLong.value) {
      propString += ` (range ${rangeNormal.value}/${rangeLong.value})`;
    } else if (rangeNormal.value) {
      propString += ` (range ${rangeNormal.value})`;
    }
  } else if (selectedProperty.value === 'Reach') {
    if (reachValue.value) {
      propString += ` (${reachValue.value} ft)`;
    }
  } else if (selectedProperty.value === 'Versatile') {
    if (versatileDamage.value) {
      propString += ` (${versatileDamage.value})`;
    }
  } else if (selectedProperty.value === 'Other') {
    if (customPropertyText.value.trim()) {
      propString = customPropertyText.value.trim();
    } else {
      return; // Don't add empty custom property
    }
  }

  if (!newItem.value.properties) newItem.value.properties = [];
  newItem.value.properties.push(propString);
  
  // Reset inputs
  selectedProperty.value = '';
  rangeNormal.value = '';
  rangeLong.value = '';
  reachValue.value = '';
  versatileDamage.value = '';
  customPropertyText.value = '';
};

const removeProperty = (index: number) => {
  if (newItem.value.properties) {
    newItem.value.properties.splice(index, 1);
  }
};

const save = () => {
  if (!newItem.value.name || !newItem.value.description) return;

  const item: Item = {
    id: `custom-${Date.now()}`,
    name: newItem.value.name,
    type: newItem.value.type as 'Equipment' | 'Magic Item',
    rarity: newItem.value.rarity,
    description: newItem.value.description,
    properties: newItem.value.properties,
    cost: newItem.value.cost,
    weight: newItem.value.weight,
    attunement: newItem.value.attunement,
    source: 'Custom',
    damageMod: newItem.value.damageMod
  };

  if (masteryName.value) {
    const mastery = MASTERIES[masteryName.value];
    if (mastery) {
      item.mastery = mastery;
    }
  }

  emit('save', item);
  emit('close');
};
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-xl font-bold">Create Custom Item</h2>
        <button @click="emit('close')" class="text-gray-500 hover:text-gray-700">
          <X class="w-6 h-6" />
        </button>
      </div>

      <!-- Body -->
      <div class="p-6 overflow-y-auto flex-1 space-y-4">
        
        <!-- Basic Info -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input v-model="newItem.name" type="text" class="w-full border rounded p-2" placeholder="Item Name" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select v-model="newItem.type" class="w-full border rounded p-2">
              <option value="Equipment">Equipment</option>
              <option value="Magic Item">Magic Item</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Rarity</label>
            <select v-model="newItem.rarity" class="w-full border rounded p-2">
              <option value="Common">Common</option>
              <option value="Uncommon">Uncommon</option>
              <option value="Rare">Rare</option>
              <option value="Very Rare">Very Rare</option>
              <option value="Legendary">Legendary</option>
              <option value="Artifact">Artifact</option>
            </select>
          </div>
          <div class="flex items-center pt-6">
            <label class="flex items-center gap-2 cursor-pointer">
              <input v-model="newItem.attunement" type="checkbox" class="w-4 h-4" />
              <span class="text-sm font-medium text-gray-700">Requires Attunement</span>
            </label>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cost</label>
            <input v-model="newItem.cost" type="text" class="w-full border rounded p-2" placeholder="e.g. 50 gp" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Weight</label>
            <input v-model="newItem.weight" type="text" class="w-full border rounded p-2" placeholder="e.g. 2 lb" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Damage Mod</label>
            <input v-model="newItem.damageMod" type="text" class="w-full border rounded p-2" placeholder="e.g. STR" />
          </div>
        </div>

        <!-- Mastery (Only for Equipment usually, but available for all) -->
        <div v-if="newItem.type === 'Equipment'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Weapon Mastery</label>
          <select v-model="masteryName" class="w-full border rounded p-2">
            <option value="">None</option>
            <option v-for="m in masteriesList" :key="m.name" :value="m.name">{{ m.name }}</option>
          </select>
          <p v-if="masteryName" class="text-xs text-gray-500 mt-1">
            {{ MASTERIES[masteryName].description }}
          </p>
        </div>

        <!-- Properties -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Properties</label>
          <div class="flex flex-col gap-2 mb-2 bg-gray-50 p-3 rounded border">
            <div class="flex gap-2">
              <select v-model="selectedProperty" class="flex-1 border rounded p-2">
                <option value="" disabled>Select a property...</option>
                <option v-for="prop in WEAPON_PROPERTIES" :key="prop" :value="prop">{{ prop }}</option>
              </select>
              <button 
                @click="addProperty" 
                class="bg-blue-600 text-white hover:bg-blue-700 px-4 rounded flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!selectedProperty"
              >
                <Plus class="w-4 h-4" /> Add
              </button>
            </div>

            <!-- Dynamic Inputs based on selection -->
            <div v-if="['Ammunition', 'Thrown', 'Range'].includes(selectedProperty)" class="flex gap-2 items-center animate-in fade-in slide-in-from-top-1">
              <span class="text-sm text-gray-600">Range:</span>
              <input v-model="rangeNormal" type="text" placeholder="Normal (ft)" class="w-24 border rounded p-1 text-sm" />
              <span class="text-gray-400">/</span>
              <input v-model="rangeLong" type="text" placeholder="Long (ft)" class="w-24 border rounded p-1 text-sm" />
            </div>

            <div v-if="selectedProperty === 'Reach'" class="flex gap-2 items-center animate-in fade-in slide-in-from-top-1">
              <span class="text-sm text-gray-600">Reach:</span>
              <input v-model="reachValue" type="text" placeholder="e.g. 10" class="w-24 border rounded p-1 text-sm" />
              <span class="text-sm text-gray-600">ft</span>
            </div>

            <div v-if="selectedProperty === 'Versatile'" class="flex gap-2 items-center animate-in fade-in slide-in-from-top-1">
              <span class="text-sm text-gray-600">Damage:</span>
              <input v-model="versatileDamage" type="text" placeholder="e.g. 1d10" class="w-32 border rounded p-1 text-sm" />
            </div>

            <div v-if="selectedProperty === 'Other'" class="flex gap-2 items-center animate-in fade-in slide-in-from-top-1 w-full">
              <input v-model="customPropertyText" type="text" placeholder="Enter custom property..." class="flex-1 border rounded p-1 text-sm" />
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(prop, index) in newItem.properties" 
              :key="index"
              class="bg-gray-100 px-2 py-1 rounded text-sm flex items-center gap-1 border border-gray-200"
            >
              {{ prop }}
              <button @click="removeProperty(index)" class="text-gray-400 hover:text-red-500">
                <X class="w-3 h-3" />
              </button>
            </span>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea 
            v-model="newItem.description" 
            rows="6" 
            class="w-full border rounded p-2"
            placeholder="Item description..."
          ></textarea>
        </div>

      </div>

      <!-- Footer -->
      <div class="p-4 border-t bg-gray-50 flex justify-end gap-2 rounded-b-lg">
        <button @click="emit('close')" class="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
        <button 
          @click="save" 
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!newItem.name || !newItem.description"
        >
          Create Item
        </button>
      </div>
    </div>
  </div>
</template>
