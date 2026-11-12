// Shared by browser, server and tests. Unknown restrictions fail closed.
export const ELEMENT_IDS = ['sangue','energia','medo','morte','conhecimento'];
export function requiresUV(layer) { return layer?.kind === 'uv' || layer?.uv === true; }
export function canSeeLayer(layer, affinity='none') {
  if (!layer || typeof layer !== 'object') return false;
  const required=layer.affinity;
  return !required || required==='none' || (ELEMENT_IDS.includes(required) && required===affinity);
}
export function filterPages(pages, affinity) {
  return {
    backgrounds: pages?.backgrounds || {},
    front: (Array.isArray(pages?.front)?pages.front:[]).filter(l=>canSeeLayer(l,affinity)),
    back: (Array.isArray(pages?.back)?pages.back:[]).filter(l=>canSeeLayer(l,affinity)),
  };
}
export function resolveAssetPath(doc, seat, side, layerId) {
  if (!doc || doc.campaign_id!==seat.campaign_id || doc.holder_seat_id!==seat.id || !doc.is_published || !['front','back'].includes(side)) return null;
  let path;
  if (layerId!==undefined) {
    const layer=(Array.isArray(doc.pages?.[side])?doc.pages[side]:[]).find(l=>l.id===layerId);
    if (!layer || layer.kind!=='image' || !canSeeLayer(layer,seat.affinity)) return null;
    path=layer.assetPath;
  } else path=doc.pages?.backgrounds?.[side];
  return typeof path==='string' && path.startsWith(seat.campaign_id+'/') && /^[a-f0-9-]{36}\/[a-f0-9-]{36}\.(webp|png|jpg)$/i.test(path) ? path : null;
}
