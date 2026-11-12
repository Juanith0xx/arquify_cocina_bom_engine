# BOM Engine — implementación aislada (experimental)

Este directorio fue creado a partir del archivo `bom_engine_fuentes_20261112.tar.gz`. No sustituye ni modifica el frontend de producción. **No desplegar en Railway aún.**

## Ejecución local

```bash
cd service
npm install
npm run check
npm test
npm start
curl -i http://localhost:3002/health
```

El servicio expone `POST /calculate` con `{ cabinets, config, includeHardware?: boolean }`. `config` contiene `general`, `kitchen` y opcionalmente `adminTextures` (catálogo resuelto para cada petición). Ver `tests/bom.test.ts` como ejemplo de payload.

Valores de medidas en el configurador: dimensiones de muebles y espesor de tablero en **centímetros**; los resultados de piezas se expresan en **milímetros**, conforme al motor original. No aplicar conversiones adicionales.

## Cambios efectuados

- El motor original `kitchenManufacturing.ts` se copió y sus lecturas a `useStore.getState()` y `useKitchenStore.getState()` se reemplazaron por parámetros `ManufacturingConfig` por solicitud.
- Funciones auxiliares de repisas, bisagras y elevaciones de estantes también reciben configuración explícita.
- Se copiaron íntegros los cálculos originales de zócalo y Gola; solo se ajustaron sus importaciones de tipos.
- Se extrajo únicamente la función geométrica `getClosestPointOnSegment` que el cálculo de zócalos requiere; se evitó traer 2.400 líneas de lógica de UI.
- La resolución de colores conserva su mapeo original y recibe catálogos de texturas en lugar de consultar Zustand.
- `Part`, tipos de muebles y manillas proceden de las fuentes; no se requiere Excel, PDF ni React en Node.

## Pendientes imprescindibles antes de producción

1. Ejecutar `npm run check` y `npm test` en Fedora, y corregir cualquier incompatibilidad detectada.
2. Comparar JSON de despiece y herrajes contra el configurador vigente en varios modelos reales (base, isla, esquinero, clóset, Gola, cocina con texturas de catálogo).
3. Comprobar la equivalencia de catálogo de texturas y valores por defecto; al no estar incluidos `src/store/index.ts`, `src/types/countertop.ts` y las configuraciones reales de usuario, **no se puede afirmar equivalencia completa** a partir del TAR suministrado.
4. Endurecer validación de entrada y geometría; asegurar límites de cargas y seguridad entre API Gateway y motor.
5. Desplegar primero como instancia de prueba, solo red privada. En producción establecer `SERVICE_TOKEN` en el microservicio y usar autenticación entre servicios. No exponer secretos al frontend.
6. Adaptar Backend Gateway para `BOM_ENGINE_URL` y hacer pruebas de integración; no es parte de este paquete.

`server.ts` devuelve un error HTTP 422 si detecta dimensiones no positivas en la salida; esto podría revelar configuraciones de fabricación previamente toleradas por la UI. Requiere prueba de equivalencia.
