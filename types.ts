import { Color } from 'three';

export enum ParticleType {
  Leaf = 'LEAF',
  LeafCube = 'LEAF_CUBE', // New type for box-shaped leaves
  Ornament = 'ORNAMENT',
  Light = 'LIGHT',
  StarLight = 'STAR_LIGHT', // New type for star-shaped lights
}

export enum LightTheme {
  Classic = 'CLASSIC', // Cyan, Pink, Orange, White
  Warm = 'WARM',       // Red, Gold, Orange
  Cool = 'COOL',       // Blue, Cyan, Purple
  Rainbow = 'RAINBOW', // Full spectrum
  Custom = 'CUSTOM',   // Single custom color
}

export interface ParticleData {
  id: number;
  type: ParticleType;
  positionTree: [number, number, number];
  positionRandom: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
  color: Color;
  emissiveIntensity?: number;
}