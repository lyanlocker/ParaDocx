import React from 'react';
import {
  ArtDefs, DeskSurface, Grain, SurfaceNoise, Vignette, KeyLight, useArtIds
} from './craftedCore.jsx';
import {Notebook, Computer} from './craftedObjA.jsx';
import {Bottle, Polaroid, Cassette} from './craftedObjB.jsx';
import {Microfiche, Tarot, Badge} from './craftedObjC.jsx';

/**
 * Artefatos físicos do ParaDocx.
 * Cada modelo é um objeto real desenhado em vetor: material, luz de cena,
 * sombra projetada sobre a mesa e desgaste. O verso é o objeto virado.
 */

export const craftedTemplateIds = {
  notebook: 'notebook',
  computer: 'computer',
  bottle: 'bottle',
  polaroid: 'polaroid',
  cassette: 'cassette',
  microfiche: 'microfiche',
  tarot: 'tarot',
  badge: 'badge'
};

const builders = {
  notebook: Notebook,
  computer: Computer,
  bottle: Bottle,
  polaroid: Polaroid,
  cassette: Cassette,
  microfiche: Microfiche,
  tarot: Tarot,
  badge: Badge
};

/** Cena de fundo de cada objeto. */
const scenes = {
  notebook: {tone: 'wood', grain: 0.16, noise: 0.14},
  computer: {tone: 'wood', grain: 0.13, noise: 0.08},
  bottle: {tone: 'wood', grain: 0.15, noise: 0.1},
  polaroid: {tone: 'wood', grain: 0.16, noise: 0.1},
  cassette: {tone: 'felt', grain: 0.15, noise: 0.12},
  microfiche: {tone: 'metal', grain: 0.13, noise: 0.08},
  tarot: {tone: 'felt', grain: 0.14, noise: 0.12},
  badge: {tone: 'felt', grain: 0.15, noise: 0.1}
};

export default function CraftedArt({templateId = 'notebook', side = 'front'}) {
  const ids = useArtIds();
  const Builder = builders[craftedTemplateIds[templateId]];
  if (!Builder) return null;
  const scene = scenes[craftedTemplateIds[templateId]] || scenes.notebook;
  return (
    <svg className={'handout-art crafted-art crafted-' + templateId} viewBox="0 0 800 1132"
      preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <ArtDefs ids={ids}/>
      <DeskSurface ids={ids} tone={scene.tone}/>
      <SurfaceNoise ids={ids} opacity={scene.noise}/>
      <Builder ids={ids} side={side}/>
      <KeyLight ids={ids}/>
      <Grain ids={ids} opacity={scene.grain}/>
      <Vignette ids={ids}/>
    </svg>
  );
}
