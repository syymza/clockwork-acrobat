import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const start=source.indexOf('function recessPixels('),end=source.indexOf('function makeEngraving(',start);
const make=runInNewContext(source.slice(start,end)+';recessPixels');
const w=40,h=40,pixels=new Uint8ClampedArray(w*h*4);
for(let y=5;y<35;y++)for(let x=5;x<35;x++)pixels[(y*w+x)*4+3]=255;
const map=make(pixels,w,h),height=(x,y)=>map[(y*w+x)*4]/255;
assert.equal(height(0,0),0);assert.equal(height(20,20),1);
assert.ok(height(7,20)>height(5,20));assert.ok(height(32,20)>height(34,20));
// H=-depth*height: inward wall normals are +gradient(height).
const gradient=(x,y)=>[height(x+1,y)-height(x-1,y),height(x,y+1)-height(x,y-1)];
const left=gradient(7,20),right=gradient(32,20),top=gradient(20,7),bottom=gradient(20,32);
assert.ok(left[0]>0&&right[0]<0&&top[1]>0&&bottom[1]<0);
// UV v points down the label; a top-left world light shades the top/left
// interior walls, and illuminates bottom/right walls (opposite an emboss).
const lightOnWall=([u,v])=>-3*u-9*v;
assert.ok(lightOnWall(left)<lightOnWall(right));assert.ok(lightOnWall(top)<lightOnWall(bottom));
for(let y=14;y<26;y++)for(let x=14;x<26;x++)pixels[(y*w+x)*4+3]=0;
const ring=make(pixels,w,h);assert.equal(ring[(20*w+20)*4],0);assert.ok(ring[(20*w+12)*4]>ring[(20*w+13)*4]);
for(let i=0;i<w*h;i++){assert.equal(ring[i*4+3],pixels[i*4+3]);assert.ok(ring[i*4]>=0&&ring[i*4]<=255)}
assert.doesNotMatch(source,/paint\(2\.2/);assert.match(source,/n=normalize\(n\+tangent\*depth\*du/);
console.log('PASS: recessed glyph profile, counter holes, preserved coverage, inward wall normals and correct top-left illumination polarity.');
