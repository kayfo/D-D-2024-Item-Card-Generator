export interface Item {
  id: string;
  name: string;
  type: 'Equipment' | 'Magic Item';
  originalType?: string;
  rarity?: string;
  description: string;
  properties?: string[];
  cost?: string;
  weight?: string;
  attunement?: boolean;
  source?: string;
  mastery?: {
    name: string;
    description: string;
  };
  damageMod?: string;
}

export interface PrintSettings {
  layout: 'single' | 'grid';
  paperSize: 'letter' | 'a4';
}
