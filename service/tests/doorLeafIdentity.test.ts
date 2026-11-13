import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKitchenPartsList } from '../src/engine/kitchenManufacturing.js';
import type { CabinetType, ManufacturingConfig } from '../src/types/model.js';

const cabinet: CabinetType = {
  id: 'test-door-leaf-1', type: 'base', variant: '1_door',
  width: 60, height: 90, depth: 58, position: [0, 0, 0],
  rotation: 0, color: '#FFFFFF', hasDoors: true
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
    socleFinish: 'aluminum', walls: [], roomConfig: { vertices: [] }
  }
};

test('BOM asigna DOOR_LEAF solo a la puerta de 1_door', () => {
  const parts = generateKitchenPartsList([cabinet], config);
  const door = parts.find(p => p.moduleId === cabinet.id && p.name.startsWith('Puerta Frontal'));
  assert.ok(door, 'Debe existir la puerta frontal');
  assert.equal(door.qty, 1);
  assert.deepEqual(door.physicalUnits, [{ unit: 1, role: 'DOOR_LEAF' }]);

  const lateral = parts.find(p => p.moduleId === cabinet.id && p.physicalUnits?.some(u => u.role === 'STRUCTURAL_SIDE'));
  assert.ok(lateral, 'Deben existir laterales identificados');
  assert.deepEqual(lateral.physicalUnits, [
    { unit: 1, role: 'STRUCTURAL_SIDE', side: 'left' },
    { unit: 2, role: 'STRUCTURAL_SIDE', side: 'right' }
  ]);
  assert.equal(parts.length, 8);
  assert.equal(parts.reduce((sum, p) => sum + p.qty, 0), 9);
});
