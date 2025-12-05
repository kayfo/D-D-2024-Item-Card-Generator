import { Item } from '../types';
import { getWeaponMastery } from './masteries';

const createWeapon = (
  name: string,
  cost: string,
  damage: string,
  weight: string,
  properties: string[],
  category: 'Simple Melee' | 'Simple Ranged' | 'Martial Melee' | 'Martial Ranged'
): Item => {
  const mastery = getWeaponMastery(name);
  const isFinesse = properties.some(p => p.includes('Finesse'));
  const isRanged = category.includes('Ranged');
  const isThrown = properties.some(p => p.includes('Thrown'));
  
  let damageMod = 'STR';
  if (isFinesse) {
    damageMod = 'STR or DEX';
  } else if (isRanged && !isThrown) {
    damageMod = 'DEX';
  }

  return {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    type: 'Equipment',
    rarity: 'Common',
    description: `${category} Weapon. Damage: ${damage}.`,
    properties,
    cost,
    weight,
    source: 'SRD 2024',
    mastery,
    damageMod
  };
};

export const weapons: Item[] = [
  // Simple Melee
  createWeapon("Club", "1 sp", "1d4 Bludgeoning", "2 lb", ["Light"], "Simple Melee"),
  createWeapon("Dagger", "2 gp", "1d4 Piercing", "1 lb", ["Finesse", "Light", "Thrown (range 20/60)"], "Simple Melee"),
  createWeapon("Greatclub", "2 sp", "1d8 Bludgeoning", "10 lb", ["Two-Handed"], "Simple Melee"),
  createWeapon("Handaxe", "5 gp", "1d6 Slashing", "2 lb", ["Light", "Thrown (range 20/60)"], "Simple Melee"),
  createWeapon("Javelin", "5 sp", "1d6 Piercing", "2 lb", ["Thrown (range 30/120)"], "Simple Melee"),
  createWeapon("Light Hammer", "2 gp", "1d4 Bludgeoning", "2 lb", ["Light", "Thrown (range 20/60)"], "Simple Melee"),
  createWeapon("Mace", "5 gp", "1d6 Bludgeoning", "4 lb", [], "Simple Melee"),
  createWeapon("Quarterstaff", "2 sp", "1d6 Bludgeoning", "4 lb", ["Versatile (1d8)"], "Simple Melee"),
  createWeapon("Sickle", "1 gp", "1d4 Slashing", "2 lb", ["Light"], "Simple Melee"),
  createWeapon("Spear", "1 gp", "1d6 Piercing", "3 lb", ["Thrown (range 20/60)", "Versatile (1d8)"], "Simple Melee"),

  // Simple Ranged
  createWeapon("Light Crossbow", "25 gp", "1d8 Piercing", "5 lb", ["Ammunition (range 80/320)", "Loading", "Two-Handed"], "Simple Ranged"),
  createWeapon("Dart", "5 cp", "1d4 Piercing", "1/4 lb", ["Finesse", "Thrown (range 20/60)"], "Simple Ranged"),
  createWeapon("Shortbow", "25 gp", "1d6 Piercing", "2 lb", ["Ammunition (range 80/320)", "Two-Handed"], "Simple Ranged"),
  createWeapon("Sling", "1 sp", "1d4 Bludgeoning", "-", ["Ammunition (range 30/120)"], "Simple Ranged"),

  // Martial Melee
  createWeapon("Battleaxe", "10 gp", "1d8 Slashing", "4 lb", ["Versatile (1d10)"], "Martial Melee"),
  createWeapon("Flail", "10 gp", "1d8 Bludgeoning", "2 lb", [], "Martial Melee"),
  createWeapon("Glaive", "20 gp", "1d10 Slashing", "6 lb", ["Heavy", "Reach", "Two-Handed"], "Martial Melee"),
  createWeapon("Greataxe", "30 gp", "1d12 Slashing", "7 lb", ["Heavy", "Two-Handed"], "Martial Melee"),
  createWeapon("Greatsword", "50 gp", "2d6 Slashing", "6 lb", ["Heavy", "Two-Handed"], "Martial Melee"),
  createWeapon("Halberd", "20 gp", "1d10 Slashing", "6 lb", ["Heavy", "Reach", "Two-Handed"], "Martial Melee"),
  createWeapon("Lance", "10 gp", "1d12 Piercing", "6 lb", ["Reach", "Special"], "Martial Melee"),
  createWeapon("Longsword", "15 gp", "1d8 Slashing", "3 lb", ["Versatile (1d10)"], "Martial Melee"),
  createWeapon("Maul", "10 gp", "2d6 Bludgeoning", "10 lb", ["Heavy", "Two-Handed"], "Martial Melee"),
  createWeapon("Morningstar", "15 gp", "1d8 Piercing", "4 lb", [], "Martial Melee"),
  createWeapon("Pike", "5 gp", "1d10 Piercing", "18 lb", ["Heavy", "Reach", "Two-Handed"], "Martial Melee"),
  createWeapon("Rapier", "25 gp", "1d8 Piercing", "2 lb", ["Finesse"], "Martial Melee"),
  createWeapon("Scimitar", "25 gp", "1d6 Slashing", "3 lb", ["Finesse", "Light"], "Martial Melee"),
  createWeapon("Shortsword", "10 gp", "1d6 Piercing", "2 lb", ["Finesse", "Light"], "Martial Melee"),
  createWeapon("Trident", "5 gp", "1d8 Piercing", "4 lb", ["Thrown (range 20/60)", "Versatile (1d10)"], "Martial Melee"),
  createWeapon("War Pick", "5 gp", "1d8 Piercing", "2 lb", [], "Martial Melee"),
  createWeapon("Warhammer", "15 gp", "1d8 Bludgeoning", "2 lb", ["Versatile (1d10)"], "Martial Melee"),
  createWeapon("Whip", "2 gp", "1d4 Slashing", "3 lb", ["Finesse", "Reach"], "Martial Melee"),

  // Martial Ranged
  createWeapon("Blowgun", "10 gp", "1 Piercing", "1 lb", ["Ammunition (range 25/100)", "Loading"], "Martial Ranged"),
  createWeapon("Hand Crossbow", "75 gp", "1d6 Piercing", "3 lb", ["Ammunition (range 30/120)", "Light", "Loading"], "Martial Ranged"),
  createWeapon("Heavy Crossbow", "50 gp", "1d10 Piercing", "18 lb", ["Ammunition (range 100/400)", "Heavy", "Loading", "Two-Handed"], "Martial Ranged"),
  createWeapon("Longbow", "50 gp", "1d8 Piercing", "2 lb", ["Ammunition (range 150/600)", "Heavy", "Two-Handed"], "Martial Ranged"),
  createWeapon("Musket", "500 gp", "1d12 Piercing", "10 lb", ["Ammunition (range 40/120)", "Loading", "Two-Handed"], "Martial Ranged"),
  createWeapon("Pistol", "250 gp", "1d10 Piercing", "3 lb", ["Ammunition (range 30/90)", "Loading"], "Martial Ranged"),
];
