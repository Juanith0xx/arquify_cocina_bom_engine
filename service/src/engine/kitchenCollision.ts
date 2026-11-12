// Calcula la distancia euclidiana y el punto más cercano sobre un segmento [A, B]
export function getClosestPointOnSegment(
  px: number,
  pz: number,
  ax: number,
  az: number,
  bx: number,
  bz: number
): { point: [number, number]; t: number; dist: number } {
  const abX = bx - ax;
  const abZ = bz - az;
  const abLen2 = abX * abX + abZ * abZ;
  if (abLen2 === 0) {
    const d = Math.hypot(px - ax, pz - az);
    return { point: [ax, az], t: 0, dist: d };
  }
  const apX = px - ax;
  const apZ = pz - az;
  const t = Math.max(0, Math.min(1, (apX * abX + apZ * abZ) / abLen2));
  const cx = ax + t * abX;
  const cz = az + t * abZ;
  return { point: [cx, cz], t, dist: Math.hypot(px - cx, pz - cz) };
}

