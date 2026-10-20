import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import assert from 'node:assert/strict';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const start=html.indexOf('const MUSIC_NOTES='),end=html.indexOf('function tineVibration',start);
const music=runInNewContext(`const TAU=2*Math.PI;${html.slice(start,end)};({MUSIC_NOTES,MUSIC_SCORE,MUSIC_PITCHES,MUSIC_STEP,createMusicState,musicGate,musicSlots,pitchZ})`);
const {MUSIC_SCORE:score,MUSIC_STEP:step}=music;
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
assert.equal(score.length,32);assert.equal(new Set(score.map(n=>n.midi)).size,music.MUSIC_PITCHES.length);
for(const n of score){near(n.angle,n.index*step);near(n.z,music.pitchZ(n.midi));assert.equal(music.MUSIC_PITCHES[n.tine],n.midi)}
const state=music.createMusicState();let notes=music.musicGate(state,step*4,0);
assert.deepEqual(Array.from(notes,n=>n.index),[1,2,3,4]);
for(const n of notes){const contactAngle=n.angle-n.cell*step;near(Math.sin(contactAngle),0);near(Math.cos(contactAngle),1)}
notes=music.musicGate(state,-step*4,1);assert.deepEqual(Array.from(notes,n=>n.index),[3,2,1,0]);near(state.travel,0);
for(let cycle=0;cycle<100;cycle++){const forward=music.musicGate(state,2*Math.PI,cycle*2+2),reverse=music.musicGate(state,-2*Math.PI,cycle*2+3);assert.equal(forward.length,32);assert.equal(reverse.length,32);assert.equal(forward.at(-1).index,0);assert.equal(reverse.at(-1).index,0)}near(state.travel,0);
assert.equal(music.musicGate(state,.01,999).length,0);assert.equal(music.musicGate(state,-.01,1000)[0].index,0);
const batch=music.musicGate(music.createMusicState(),4*step,1);const plan=music.musicSlots(batch,20,0);
assert.equal(plan.selected.length,4);assert.equal(plan.dropped,0);for(let i=1;i<4;i++)assert.ok(plan.selected[i].when-plan.selected[i-1].when>=.05999);
const fast=music.musicGate(music.createMusicState(),Math.PI*2,1),bounded=music.musicSlots(fast,30,0);
assert.ok(bounded.selected.length<=8);assert.equal(bounded.selected.length+bounded.dropped,32);assert.equal(bounded.selected[0].index,1);assert.equal(bounded.selected.at(-1).index,0);assert.ok(bounded.selected.at(-1).when<=30.42);
let next=0;for(let i=0;i<1000;i++){const now=100+i*.001,p=music.musicSlots(batch,now,next);next=p.nextTime;assert.ok(p.selected.length<=8);for(const n of p.selected)assert.ok(n.when<=now+.420001)}
const huge=music.musicGate(music.createMusicState(),1e6,0);assert.ok(huge.length<=128);
assert.doesNotMatch(html,/id="sound"|music\.enabled|k%8/);
console.log('PASS: one 32-note score, pin/contact/pitch correspondence, 100 forward/reverse cycles, four-note crossings, bounded 0.42s scheduling and 1,000 fast inputs.');
