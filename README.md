# D&D 2024 Item Card Generator

A Vue 3 web application to generate printable cards for D&D 5e 2024 SRD equipment and magic items.

## Features

- **Unified Search**: Search and filter equipment and magic items.
- **Card Generation**: Automatically styled cards based on item type (Equipment vs Magic Item).
- **Print Layouts**:
  - **Grid**: Multiple cards per page (optimized for cutting).
  - **Single**: One card per page (centered).
- **Standard Size**: Cards are sized to 2.5" x 3".

## Project Setup

### Install Dependencies

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

## Data Source

Currently uses a local JSON file (`src/data/items.json`) as a placeholder for SRD data.
