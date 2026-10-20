import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import assert from 'node:assert/strict';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const section=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));
const activate=html.match(/^function activate\(id\)[^\n]+/m)[0];
function setup(navigator){
 const events=[],status={};
 class Context{constructor(){this.state='suspended';this.destination={};events.push('create')}createGain(){return {gain:{value:0},connect(){}}}resume(){events.push('resume');this.state='running';return Promise.resolve()}suspend(){events.push('suspend');this.state='suspended';return Promise.resolve()}}
 const sandbox={navigator,document:{hidden:false},window:{AudioContext:Context},inspectLane(){},syncControls(){},measureFit(){},requestRender(){},$:()=>status};
 const code=`${section('const lanes=[','const targets=')}\n${html.match(/^function createMusicState\(\)[^\n]+/m)[0]}\n${section('const music={','function crankMusic(delta)')}\n${activate}\n({lanes,music,activate,unlockMusic,pauseMusic})`;
 return {...runInNewContext(code,sandbox),events,status};
}
const flush=async()=>{await Promise.resolve();await Promise.resolve()};
let route=[];
const supported=setup({get audioSession(){route.push('get');return {set type(value){route.push(value)}}}});
supported.unlockMusic();supported.activate('lane-0');assert.deepEqual(route,[]);assert.deepEqual(supported.events,[]);assert.equal(supported.music.context,null);
supported.activate('lane-3');await flush();assert.deepEqual(route,['get','playback']);assert.deepEqual(supported.events,['create','resume']);assert.equal(supported.music.context.state,'running');
// Share a single timeline to prove the request happens before resume.
const timeline=[];const ordered=setup({audioSession:{set type(v){timeline.push(v)}}});
const nativePush=ordered.events.push.bind(ordered.events);ordered.events.push=(event)=>{timeline.push(event);return nativePush(event)};
ordered.activate('lane-3');await flush();assert.ok(timeline.indexOf('playback')<timeline.indexOf('resume'));
let stopped=0;ordered.music.voices.add({stop(){stopped++}});ordered.activate('lane-3');await flush();assert.equal(stopped,1);assert.equal(ordered.music.voices.size,0);assert.equal(ordered.music.context.state,'suspended');assert.equal(ordered.music.allowed,false);
ordered.activate('lane-3');await flush();assert.equal(timeline.filter(x=>x==='playback').length,2);assert.equal(ordered.music.context.state,'running');
ordered.unlockMusic();await flush();assert.equal(timeline.filter(x=>x==='playback').length,2,'ordinary crank unlock must not request another playback session');
for(const navigator of [undefined,{}, {audioSession:null},Object.defineProperty({},'audioSession',{get(){throw Error('unavailable')}}),{audioSession:{set type(_){throw Error('restricted')}}}]){
 const app=setup(navigator);app.activate('lane-3');await flush();assert.equal(app.music.context.state,'running');app.activate('lane-3');await flush();assert.equal(app.music.context.state,'suspended');assert.equal(app.music.voices.size,0);
}
console.log('PASS: opt-in-only playback request, before-resume ordering, re-enable, no reroute on crank unlock, missing API, throwing getter/setter and off suspension.');
