export interface Mastery {
  name: string;
  description: string;
}

export const MASTERIES: Record<string, Mastery> = {
  Cleave: {
    name: "Cleave",
    description: "If you hit a creature with a melee attack, you can make an attack roll with the weapon against a second creature within 5 feet of the first that is also within your reach. On a hit, the second creature takes the weapon's damage, but don't add your ability modifier to it unless that modifier is negative. You can make this extra attack only once per turn."
  },
  Graze: {
    name: "Graze",
    description: "If your attack roll misses a creature, you can deal damage to that creature equal to the ability modifier you used for the attack roll. This damage is the same type as the weapon's damage."
  },
  Nick: {
    name: "Nick",
    description: "When you make the extra attack of the Light property, you can make it as part of the Attack action instead of as a Bonus Action. You can make this extra attack only once per turn."
  },
  Push: {
    name: "Push",
    description: "If you hit a creature with an attack roll, you can push the creature up to 10 feet straight away from you if it is Large or smaller."
  },
  Sap: {
    name: "Sap",
    description: "If you hit a creature with an attack roll, that creature has Disadvantage on its next attack roll before the start of your next turn."
  },
  Slow: {
    name: "Slow",
    description: "If you hit a creature with an attack roll and deal damage, you can reduce its Speed by 10 feet until the start of your next turn. If you hit the creature more than once, this Speed reduction doesn't stack."
  },
  Topple: {
    name: "Topple",
    description: "If you hit a creature with an attack roll, you can force it to make a Constitution saving throw (DC 8 + your Proficiency Bonus + the ability modifier used for the attack roll). On a failed save, the creature has the Prone condition."
  },
  Vex: {
    name: "Vex",
    description: "If you hit a creature with an attack roll and deal damage, you have Advantage on your next attack roll against that creature before the end of your next turn."
  }
};

export const WEAPON_MASTERIES: Record<string, string> = {
  "Battleaxe": "Topple",
  "Club": "Slow",
  "Dagger": "Nick",
  "Flail": "Sap",
  "Glaive": "Graze",
  "Greataxe": "Cleave",
  "Greatsword": "Graze",
  "Halberd": "Cleave",
  "Handaxe": "Vex",
  "Javelin": "Slow",
  "Light Hammer": "Nick",
  "Longsword": "Sap",
  "Maul": "Topple",
  "Morningstar": "Sap",
  "Pike": "Push",
  "Quarterstaff": "Topple",
  "Rapier": "Vex",
  "Scimitar": "Nick",
  "Shortsword": "Vex",
  "Sickle": "Nick",
  "Spear": "Sap",
  "Trident": "Topple",
  "War Pick": "Sap",
  "Warhammer": "Push",
  "Whip": "Slow",
  "Blowgun": "Vex",
  "Hand Crossbow": "Vex",
  "Heavy Crossbow": "Push",
  "Light Crossbow": "Slow",
  "Dart": "Vex",
  "Longbow": "Slow",
  "Shortbow": "Vex",
  "Sling": "Slow",
  "Musket": "Slow",
  "Pistol": "Vex",
  "Greatclub": "Push",
  "Lance": "Topple",
  "Mace": "Sap"
};

export function getWeaponMastery(weaponName: string): Mastery | undefined {
  // Handle case sensitivity and potential variations
  const normalizedName = Object.keys(WEAPON_MASTERIES).find(
    key => key.toLowerCase() === weaponName.toLowerCase()
  );
  
  if (normalizedName) {
    const masteryName = WEAPON_MASTERIES[normalizedName];
    return MASTERIES[masteryName];
  }
  return undefined;
}
