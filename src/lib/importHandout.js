/** Browser-only importer. Original PDF/image pixels are kept as a private image backdrop;
 * the master can add, edit and move normal/UV text layers independently on both sides.
 * Plain text files are imported directly into editable text layers.
 */
export const IMPORT_TYPES=['image/png','image/jpeg','image/webp','application/pdf','text/plain','text/markdown'];
export const INPUT_ACCEPT='.png,.jpg,.jpeg,.webp,.pdf,.txt,.md';
const MAX_BYTES=15*1024*1024;

export function validateImport(file) {
  if(!file || !file.name) throw new Error('Selecione um arquivo.');
  if(file.size>MAX_BYTES)throw new Error('O arquivo pode ter no máximo 15 MB.');
  const ext=String(file.name).split('.').pop().toLowerCase();
  const kind=ext==='pdf'?'pdf':['txt','md'].includes(ext)?'text':['png','jpg','jpeg','webp'].includes(ext)?'image':null;
  if(!kind)throw new Error('Formato não aceito. Use PDF, PNG, JPG, WEBP, TXT ou MD.');
  const allowedByKind={
    image:['image/png','image/jpeg','image/webp'],
    pdf:['application/pdf'],
    text:['text/plain','text/markdown','application/octet-stream']
  };
  if(file.type && !allowedByKind[kind].includes(file.type)) {
    throw new Error('O tipo do arquivo não corresponde ao formato permitido.');
  }
  return kind;
}

function toBlob(canvas) {
  return new Promise((resolve,reject)=>{
    canvas.toBlob(blob=>{
      if(!blob)return reject(new Error('Não foi possível processar esta página.'));
      resolve(blob);
    },'image/webp',.86);
  });
}
function sizeToFit(width,height) {
  const scale=Math.min(1,1500/width,2200/height);
  return {width:Math.max(1,Math.round(width*scale)),height:Math.max(1,Math.round(height*scale))};
}
async function processImage(file) {
  const url=URL.createObjectURL(file);
  try{
    const image=await new Promise((resolve,reject)=>{
      const img=new Image();
      img.onload=()=>resolve(img);
      img.onerror=()=>reject(new Error('Não foi possível abrir esta imagem.'));
      img.src=url;
    });
    const dims=sizeToFit(image.naturalWidth,image.naturalHeight);
    const canvas=document.createElement('canvas');
    canvas.width=dims.width;canvas.height=dims.height;
    const ctx=canvas.getContext('2d',{alpha:false});
    if(!ctx)throw new Error('Canvas indisponível neste navegador.');
    ctx.fillStyle='#f0e6cf';ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(image,0,0,canvas.width,canvas.height);
    return await toBlob(canvas);
  } finally {URL.revokeObjectURL(url);}
}
async function processPdf(file) {
  const pdfjs=await import('pdfjs-dist');
  const workerUrl=await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
  pdfjs.GlobalWorkerOptions.workerSrc=workerUrl.default;
  const data=new Uint8Array(await file.arrayBuffer());
  const task=pdfjs.getDocument({data,isEvalSupported:false});
  let pdf;
  try{
    pdf=await task.promise;
    const images={};
    const extracted={};
    for(let i=1;i<=Math.min(2,pdf.numPages);i++){
      const page=await pdf.getPage(i);
      const base=page.getViewport({scale:1});
      const scale=Math.min(2,1500/base.width,2200/base.height);
      const viewport=page.getViewport({scale});
      const canvas=document.createElement('canvas');
      canvas.width=Math.round(viewport.width);canvas.height=Math.round(viewport.height);
      const ctx=canvas.getContext('2d',{alpha:false});
      ctx.fillStyle='#f0e6cf';ctx.fillRect(0,0,canvas.width,canvas.height);
      await page.render({canvasContext:ctx,viewport}).promise;
      images[i===1?'front':'back']=await toBlob(canvas);
      try{
        const content=await page.getTextContent();
        extracted[i===1?'front':'back']=content.items
          .filter(item=>typeof item.str==='string').map(item=>item.str).join(' ').trim();
      } catch {extracted[i===1?'front':'back']='';}
    }
    return {kind:'pdf',images,extracted,
      notice:pdf.numPages>2?'Este PDF tem '+pdf.numPages+' páginas. Importamos as duas primeiras como frente e verso.':''};
  }catch(error){
    throw new Error('Não foi possível ler o PDF. Verifique se ele está íntegro e sem senha. '+(error?.message||''));
  }finally{if(pdf)await pdf.destroy();else await task.destroy();}
}
function importText(contents,side) {
  const normalized=contents.replace(/\r\n?/g,'\n').trim();
  if(!normalized)throw new Error('O arquivo de texto está vazio.');
  if(normalized.length>5000)throw new Error('Texto muito longo para duas páginas. Divida-o em arquivos menores (até 5.000 caracteres).');
  const chunks=normalized.length>2500?[normalized.slice(0,2500),normalized.slice(2500)]:[normalized];
  const texts={};
  const first=side==='back'?'back':'front';
  texts[first]=chunks[0];
  if(chunks.length>1)texts[first==='front'?'back':'front']=chunks[1];
  return {kind:'text',texts,images:{},extracted:{}};
}

/** Import returns side-> Blob or side-> editable text. Nothing is uploaded automatically. */
export async function prepareImport(file,side='front') {
  const kind=validateImport(file);
  if(kind==='text')return importText(await file.text(),side);
  if(kind==='pdf')return processPdf(file);
  return {kind:'image',images:{[side]:await processImage(file)},extracted:{}};
}
export function uploadExtension(blob) {
  return blob.type==='image/webp'?'webp':blob.type==='image/jpeg'?'jpg':'png';
}
