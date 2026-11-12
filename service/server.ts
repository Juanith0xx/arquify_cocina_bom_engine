import express from 'express';
import { timingSafeEqual } from 'node:crypto';
import { generateKitchenPartsList, generateKitchenHardwareList } from './src/engine/kitchenManufacturing.js';
import type { CabinetType, ManufacturingConfig } from './src/types/model.js';

const app = express();
const port = Number(process.env.PORT || 3002);
const token = process.env.SERVICE_TOKEN;

if (process.env.NODE_ENV === 'production' && !token) {
  throw new Error('SERVICE_TOKEN obligatorio en producción.');
}

app.disable('x-powered-by');
app.use(express.json({ limit: '2mb' }));
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'arquify-bom-engine' }));

app.post('/calculate', (req, res) => {
  if (token) {
    const actual = req.get('authorization') || '';
    const expected = `Bearer ${token}`;
    const a = Buffer.from(actual);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      res.status(401).json({ success: false, error: 'No autorizado' });
      return;
    }
  }
  const { cabinets, config, includeHardware = true } = req.body ?? {} as {
    cabinets?: CabinetType[]; config?: ManufacturingConfig; includeHardware?: boolean;
  };

  if (!Array.isArray(cabinets) || cabinets.length === 0 || cabinets.length > 200) {
    res.status(400).json({ success: false, error: 'cabinets debe contener entre 1 y 200 módulos.' });
    return;
  }
  if (!config || !config.general || !config.kitchen || typeof includeHardware !== 'boolean') {
    res.status(400).json({ success: false, error: 'Configuración de fabricación incompleta.' });
    return;
  }
  const g = config.general;
  const k = config.kitchen;
  const isPositiveFinite = (v: unknown) => typeof v === 'number' && Number.isFinite(v) && v > 0;
  if (!isPositiveFinite(g.thickness) || !isPositiveFinite(g.edgeBandingThicknessCabinets)
      || !isPositiveFinite(g.edgeBandingThicknessFronts) || !isPositiveFinite(k.socleHeight)
      || typeof g.structureColor !== 'string' || !g.structureColor.trim()
      || typeof g.doorColor !== 'string' || !g.doorColor.trim()
      || !['Provelcar','Hafele'].includes(g.drawerHardware)
      || typeof g.assemblyType !== 'string' || typeof g.drawerAssemblyType !== 'string'
      || !Array.isArray(g.customTextures) || !Array.isArray(k.walls)
      || !k.roomConfig || !Array.isArray(k.roomConfig.vertices)
      || !['none','aluminum','black'].includes(k.golaSystem)
      || !['aluminum','black'].includes(k.socleFinish)
      || typeof k.showSocle !== 'boolean'
      || (config.adminTextures !== undefined && !Array.isArray(config.adminTextures))) {
    res.status(400).json({ success: false, error: 'Config general/kitchen inválida o incompleta.' });
    return;
  }
  const ids = new Set<string>();
  for (const cab of cabinets) {
    if (!cab || typeof cab.id !== 'string' || !cab.id.trim() || ids.has(cab.id)
        || !['base','wall','tall','island','decoration','closet'].includes(cab.type)
        || ![cab.width,cab.height,cab.depth].every(isPositiveFinite)
        || !Array.isArray(cab.position) || cab.position.length !== 3
        || !cab.position.every((v: unknown) => typeof v === 'number' && Number.isFinite(v))
        || typeof cab.rotation !== 'number' || !Number.isFinite(cab.rotation)
        || typeof cab.color !== 'string') {
      res.status(400).json({ success: false, error: 'Módulo inválido o ID duplicado.', moduleId: cab?.id ?? null });
      return;
    }
    ids.add(cab.id);
  }
  try {
    // Ninguna consulta a Zustand: la configuración pertenece solo a esta petición.
    const parts = generateKitchenPartsList(cabinets, config);
    const hardware = includeHardware ? generateKitchenHardwareList(cabinets, config) : undefined;
    if (parts.some(p => !Number.isFinite(p.length) || !Number.isFinite(p.width) || p.length <= 0 || p.width <= 0 || !Number.isFinite(p.qty) || p.qty <= 0)) {
      res.status(422).json({ success: false, error: 'El motor produjo dimensiones o cantidades inválidas.' });
      return;
    }
    res.json({ success: true, totalParts: parts.length, parts, ...(includeHardware ? { hardware } : {}) });
  } catch (err) {
    console.error('BOM calculation error', err);
    res.status(500).json({ success: false, error: 'Error interno calculando el despiece.' });
  }
});
app.listen(port, '0.0.0.0', () => console.log(`BOM Engine escuchando en puerto ${port}`));
