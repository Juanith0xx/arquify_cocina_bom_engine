import type { KitchenHandleConfig } from './handle.js';

// Tipos industriales tomados del proyecto fuente, sin dependencias a Zustand/React.
export interface WallType {
  id: string;
  start: [number, number];
  end: [number, number];
  thickness: number;
  height: number;
  isInterior?: boolean;
  index?: number;
}

export interface ArchitecturalElement {
  id: string;
  wallId?: string;
  offset?: number;
  type: 'door' | 'window' | 'pillar';
  name: string;
  width: number;
  height: number;
  depth?: number; // thickness / depth for pillars
  length?: number; // length for pillars / walls
  elevation: number; // height from floor (0 for doors/pillars, e.g. 90 for windows)
  position: [number, number, number]; // [x, y, z]
  rotation: number;
  isOpen?: boolean;
  hingeSide?: 'left' | 'right';
}

export interface CoverPanelConfig {
  enabled: boolean;
  material?: 'melamina' | 'hpl';
  color?: string;
  thickness?: number;
  extendToFloor?: boolean;
  depth?: number; // Profundidad personalizada (ej. cubrir voladizo de isla)
}

export interface CabinetType {
  id: string;
  type: 'base' | 'wall' | 'tall' | 'island' | 'decoration' | 'closet';
  variant?: string;
  width: number;
  height: number;
  depth: number;
  position: [number, number, number];
  rotation: number;
  color: string;
  structureColor?: string;
  doorColor?: string;
  drawerFrontColor?: string;
  drawerInnerColor?: string;
  shelfColor?: string;
  backColor?: string;
  socleColor?: string;
  structureMaterial?: 'melamina' | 'hpl';
  doorMaterial?: 'melamina' | 'hpl';
  drawerFrontMaterial?: 'melamina' | 'hpl';
  drawerInnerMaterial?: 'melamina' | 'hpl';
  shelfMaterial?: 'melamina' | 'hpl';
  backMaterial?: 'melamina' | 'hpl' | 'durolac';
  backThickness?: number;
  drawerBottomMaterial?: 'melamina' | 'durolac';
  drawerBottomThickness?: number;
  socleMaterial?: 'melamina' | 'hpl';
  grainDirection?: 'vertical' | 'horizontal';
  grainElements?: Record<string, 'vertical' | 'horizontal'>;
  hplBalancer?: boolean;
  isOpen?: boolean;
  openElements?: Record<string, boolean>;
  shelvesCount?: number;
  shelvesCountLower?: number;
  shelvesCountUpper?: number;
  drawersCount?: number;
  hasHanger?: boolean;
  hasDoors?: boolean;
  innerDrawers?: boolean;
  handleConfig?: KitchenHandleConfig;
  leftCoverPanel?: CoverPanelConfig;
  rightCoverPanel?: CoverPanelConfig;
  closetSocleHeight?: number;
  closetSocleColorMode?: 'structure' | 'doors';
  blindWidth?: number; // cm (ancho independiente de la zona ciega del esquinero, por defecto 65cm)
}


export interface Part {
  moduleId: string;
  moduleIndex: number;
  name: string;
  qty: number;
  length: number;
  width: number;
  thickness: number;
  material: string;
  edgeL1: boolean;
  edgeL2: boolean;
  edgeW1: boolean;
  edgeW2: boolean;
  notes?: string;
  grainDirection?: 'vertical' | 'horizontal';
  isHpl?: boolean;
  materialCategory?: 'doors' | 'structure' | 'backs' | 'cover';
}


export type GolaSystem = 'none' | 'aluminum' | 'black';
export interface TextureDescriptor {
  id?: string;
  url?: string;
  previewUrl?: string;
  name?: string;
  brand?: string;
  providerName?: string;
}
export interface GeneralManufacturingConfig {
  thickness: number; // cm
  drawerHardware: 'Provelcar' | 'Hafele';
  drawerAssemblyType: string;
  assemblyType: string;
  drawerInnerMaterial?: 'melamina' | 'hpl';
  structureColor: string;
  doorColor: string;
  edgeBandingThicknessCabinets: number;
  edgeBandingThicknessFronts: number;
  customTextures: TextureDescriptor[];
}
export interface KitchenManufacturingConfig {
  socleHeight: number; // cm
  golaSystem: GolaSystem;
  showSocle: boolean;
  socleFinish: 'aluminum' | 'black';
  walls: WallType[];
  roomConfig: { vertices?: { x: number; y: number }[] };
  drawerHardware?: 'Provelcar' | 'Hafele';
  handleConfig?: KitchenHandleConfig;
  countertopConfig?: {
    enabled?: boolean;
    selectedProductId?: string | null;
    regruesoCm?: number;
    baseRegruesoCm?: number;
    islandRegruesoCm?: number;
  };
  qstoneCatalog?: {
    id: string;
    name?: string;
    thicknessCm?: number;
    [key: string]: unknown;
  }[];
}
export interface ManufacturingConfig {
  general: GeneralManufacturingConfig;
  kitchen: KitchenManufacturingConfig;
  // Catálogo de texturas ya resuelto por el backend para esta solicitud.
  adminTextures?: TextureDescriptor[];
}
