import { Item } from '../types';
import { weapons as localWeapons } from '../data/weapons';

const BASE_URL = 'https://api.open5e.com/v1';

interface Open5eArmor {
  slug: string;
  name: string;
  category: string;
  cost: string;
  ac_string: string;
  strength_requirement: number | null;
  stealth_disadvantage: boolean;
  weight: string;
  document__title: string;
}

interface Open5eMagicItem {
  slug: string;
  name: string;
  type: string;
  desc: string;
  rarity: string;
  requires_attunement: string;
  document__title: string;
}

export async function fetchAllItems(): Promise<Item[]> {
  const [armor, magicItems] = await Promise.all([
    fetchArmor(),
    fetchMagicItems()
  ]);

  return [...localWeapons, ...armor, ...magicItems];
}

// Removed fetchWeapons as we are using local data for 2024 accuracy

async function fetchArmor(): Promise<Item[]> {
  try {
    const response = await fetch(`${BASE_URL}/armor/?limit=500`);
    const data = await response.json();
    return data.results.map((a: Open5eArmor) => ({
      id: a.slug,
      name: a.name,
      type: 'Equipment',
      rarity: 'Common',
      description: `${a.category}. AC: ${a.ac_string}.${a.stealth_disadvantage ? ' Stealth Disadvantage.' : ''}${a.strength_requirement ? ` Str Req: ${a.strength_requirement}` : ''}`,
      cost: a.cost,
      weight: a.weight,
      source: a.document__title
    }));
  } catch (error) {
    console.error('Error fetching armor:', error);
    return [];
  }
}

async function fetchMagicItems(): Promise<Item[]> {
  try {
    // Fetch a larger number of items to ensure we get everything
    const response = await fetch(`${BASE_URL}/magicitems/?limit=5000`);
    const data = await response.json();
    return data.results.map((m: Open5eMagicItem) => ({
      id: m.slug,
      name: m.name,
      type: 'Magic Item',
      rarity: m.rarity,
      description: m.desc,
      attunement: !!m.requires_attunement,
      source: m.document__title
    }));
  } catch (error) {
    console.error('Error fetching magic items:', error);
    return [];
  }
}
