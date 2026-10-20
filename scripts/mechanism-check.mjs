import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import assert from 'node:assert/strict';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const section=(a,b)=>html.slice(html.indexOf(a),html.indexOf(b,html.indexOf(a)));
const code=`const TAU=Math.PI*2,D=Math.PI/180;let phase=0;
${section('const lanes=[','const targets=')}
${section('const neutral=','function limb(')}
${section('const laneNames=','function makePlate(')}
${html.match(/function busAngle[^\n]+/)[0]}
${html.match(/function drivenAngle[^\n]+/)[0]}
${html.match(/function turn\(delta\)[^\n]+/)[0]}
const updateReadout=()=>{},requestRender=()=>{},crankMusic=d=>notes.push(d);const notes=[];
({lanes,turn,lanePose,combinedPose,jumpState,liftAt,busAngle,drivenAngle,notes,getPhase:()=>phase})`;
const m=runInNewContext(code);
const near=(a,b,t=1e-10)=>assert.ok(Math.abs(a-b)<t,`${a} ≠ ${b}`);
for(const l of m.lanes)l.engaged=true;
m.turn(Math.PI*2);
for(let i=0;i<5;i++)near(m.lanes[i].angle,i===4?Math.PI*2:-Math.PI*2*12/m.lanes[i].teeth);
assert.equal(m.notes.length,1);near(m.notes[0],Math.PI);
const before=m.lanes.map(l=>l.angle);m.lanes[1].engaged=false;m.lanes[3].engaged=false;
m.turn(.73);near(m.lanes[1].angle,before[1]);near(m.lanes[3].angle,before[3]);assert.notEqual(m.lanes[0].angle,before[0]);assert.notEqual(m.lanes[2].angle,before[2]);assert.equal(m.notes.length,1);
const hold=m.lanes[1].angle;m.lanes[1].engaged=true;near(m.lanes[1].angle,hold);m.turn(.3);near(m.lanes[1].angle,hold-.1);
for(const l of m.lanes)l.engaged=true;const start=m.lanes.map(l=>l.angle);for(let i=0;i<500;i++)m.turn(.037);for(let i=0;i<500;i++)m.turn(-.037);m.lanes.forEach((l,i)=>near(l.angle,start[i],1e-11));
// Tooth phase at every external mesh: opposite angular direction and half-tooth stagger.
for(let n=0;n<50;n++){m.turn(.19);for(let j=0;j<6;j++)near(Math.cos(24*(m.busAngle(j)+m.busAngle(j+1))),-1);for(let i=0;i<4;i++)near(12*m.busAngle(i*2)+m.lanes[i].teeth*m.drivenAngle(i),Math.PI);near(Math.cos(24*(m.busAngle(3)+m.getPhase())),-1);}
for(let i=0;i<5;i++){near(m.liftAt(i,0),m.liftAt(i,2*Math.PI));for(let j=0;j<1000;j++){const a=j*Math.PI*2/1000,v=m.liftAt(i,a);assert.ok(v>=0&&v<=1.000001);}}
for(const l of m.lanes)l.engaged=false;const pose=JSON.stringify(m.combinedPose()),angles=m.lanes.map(l=>l.angle);m.turn(17.2);assert.equal(JSON.stringify(m.combinedPose()),pose);m.lanes.forEach((l,i)=>near(l.angle,angles[i]));
near(m.jumpState(0).height,0);near(m.jumpState(Math.PI).height,.82);near(m.jumpState(Math.PI*2).height,0);
console.log('PASS: 5 clutch ratios/directions, mesh tooth phase, hold/re-engage continuity, 1,000-input reversal, 5,000 cam samples, disengaged audio gating.');
