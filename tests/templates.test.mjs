import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {templates,newPages,templateCategories} from '../src/data/templates.js';

const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');

test('library retains at least 35 original templates and diverse categories',()=>{
  assert.ok(templates.length>=35);
  assert.equal(new Set(templates.map(t=>t.id)).size,templates.length);
  assert.ok(templateCategories.length>=12);
  assert.equal(templateCategories[0],'Todos');
});

test('each template has a valid id, description, paper stock and layers',()=>{
  for (const template of templates) {
    assert.match(template.id,/^[a-z][a-z0-9-]*$/);
    assert.ok(template.name.trim().length>=5,template.id);
    assert.ok(template.description.trim().length>=12,template.id);
    assert.ok(css.includes('.sheet-'+template.paper),template.id+' missing paper style');
    assert.ok(Array.isArray(template.layers),template.id);
    assert.ok(Array.isArray(template.backLayers),template.id);
    assert.ok(Array.isArray(template.secrets),template.id);
    assert.ok(template.id==='blank'||template.backLayers.length>0,template.id+' missing back');
    for(const layer of [...template.layers,...template.backLayers,...template.secrets]){
      assert.equal(typeof layer.text,'string');
      assert.ok(layer.text.trim().length>0,template.id+' has empty text');
      assert.ok(layer.x>=0&&layer.x<=96,template.id+' invalid x');
      assert.ok(layer.y>=0&&layer.y<=94,template.id+' invalid y');
      assert.ok(layer.width>=5&&layer.width<=100,template.id+' invalid width');
      assert.ok(layer.fontSize>=10&&layer.fontSize<=44,template.id+' invalid font size');
    }
    for(const secret of template.secrets) assert.equal(secret.kind,'uv',template.id);
  }
});

test('creating independent documents never modifies the library',()=>{
  const template=templates.find(t=>t.id==='letter');
  const pagesA=newPages(template);
  const pagesB=newPages(template);
  assert.ok(pagesA.front.some(l=>l.kind==='uv'));
  assert.ok(pagesA.back.length>0);
  assert.notEqual(pagesA.front[0].id,pagesB.front[0].id);
  pagesA.front[0].text='edited';
  assert.notEqual(pagesB.front[0].text,'edited');
  assert.notEqual(template.layers[0].text,'edited');
});

test('blank paper does not hide an unexpected UV message',()=>{
  const pages=newPages(templates.find(t=>t.id==='blank'));
  assert.deepEqual(pages,{front:[],back:[]});
});

test('layer IDs are distinct within a new document',()=>{
  for(const template of templates){
    const pages=newPages(template);
    const ids=[...pages.front,...pages.back].map(l=>l.id);
    assert.equal(new Set(ids).size,ids.length,template.id);
  }
});
