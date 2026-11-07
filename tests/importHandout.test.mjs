import test from 'node:test';
import assert from 'node:assert/strict';
import {validateImport,uploadExtension,INPUT_ACCEPT} from '../src/lib/importHandout.js';

test('importer only accepts documents and image formats',()=>{
  const valid=[
    ['pista.png','image/png'],['carta.jpeg','image/jpeg'],['jornal.webp','image/webp'],
    ['laudo.pdf','application/pdf'],['diario.txt','text/plain'],['observacoes.md','text/markdown']
  ];
  for(const [name,type] of valid){
    assert.doesNotThrow(()=>validateImport({name,size:100,type}),name);
    assert.ok(INPUT_ACCEPT.includes('.'+name.split('.').pop()));
  }
  assert.throws(()=>validateImport({name:'virus.exe',size:100,type:'application/x-msdownload'}),/Formato não aceito/);
  assert.throws(()=>validateImport({name:'foto.png',size:20000000,type:'image/png'}),/15 MB/);
  assert.throws(()=>validateImport({name:'foto.png',size:100,type:'application/pdf'}),/não corresponde/);
});

test('uploaded pages get an extension matching their raster blob type',()=>{
  assert.equal(uploadExtension({type:'image/webp'}),'webp');
  assert.equal(uploadExtension({type:'image/png'}),'png');
  assert.equal(uploadExtension({type:'image/jpeg'}),'jpg');
});

test('private Storage contract stays path-only in pages JSON',()=>{
  const doc={front:[],back:[],backgrounds:{front:'00000000-0000-4000-8000-000000000000/00000000-0000-4000-8000-000000000001.webp'}};
  assert.ok(!JSON.stringify(doc).includes('supabase.co/storage/v1/object/public/'));
  assert.ok(!JSON.stringify(doc).includes('service_role'));
});
