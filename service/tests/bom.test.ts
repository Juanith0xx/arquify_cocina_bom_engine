import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKitchenPartsList, generateKitchenHardwareList, getDefaultShelvesCount } from '../src/engine/kitchenManufacturing.js';
import type { CabinetType, ManufacturingConfig } from '../src/types/model.js';

const cabinet: CabinetType = {
  id: 'mueble-1', type: 'base', variant: '1_door', width: 60, height: 90,
  depth: 58, position: [0,0,0], rotation: 0, color: '#FFFFFF'
};
const config: ManufacturingConfig = {
  general: {
    thickness: 1.8, drawerHardware: 'Provelcar', drawerAssemblyType: 'spax',
    assemblyType: 'spax', structureColor: '#FFFFFF', doorColor: '#FFFFFF',
    edgeBandingThicknessCabinets: 0.45, edgeBandingThicknessFronts: 2,
    customTextures: []
  },
  kitchen: {
    socleHeight: 10, golaSystem: 'none', showSocle: false,
    socleFinish: 'aluminum', walls: [], roomConfig: { vertices: [] },
  }
};

test('genera piezas de fabricación con geometría finita', () => {
  const parts = generateKitchenPartsList([cabinet], config);
  assert.ok(parts.length > 0);
  for (const p of parts) {
    assert.ok(p.length > 0 && Number.isFinite(p.length));
    assert.ok(p.width > 0 && Number.isFinite(p.width));
  }
});

test('no mezcla configuraciones entre solicitudes consecutivas', () => {
  const a = generateKitchenPartsList([cabinet], config);
  const b = generateKitchenPartsList([cabinet], {
    ...config, general: { ...config.general, thickness: 1.5 },
    kitchen: { ...config.kitchen, socleHeight: 15 }
  });
  const c = generateKitchenPartsList([cabinet], config);
  assert.notDeepEqual(a,b);
  assert.deepEqual(a,c);
});

test('herraje y repisas utilizan la configuración explícita', () => {
  assert.ok(Array.isArray(generateKitchenHardwareList([cabinet], config)));
  assert.equal(typeof getDefaultShelvesCount(cabinet, config.kitchen), 'number');
});
