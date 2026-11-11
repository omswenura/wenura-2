const {test}=require('node:test');
const assert=require('node:assert/strict');
const {tasks,isAvailable,nextTask}=require('./public/workflow');
test('every task unlocks only after all previous checks',()=>{const checks={};for(const [id] of tasks){assert.equal(nextTask(checks)[0],id);assert.equal(isAvailable(id,checks),true);const i=tasks.findIndex(t=>t[0]===id);for(const later of tasks.slice(i+1))assert.equal(isAvailable(later[0],checks),false);checks[id]=true;}assert.equal(nextTask(checks),null);});
test('engineer testing requires completed sample review and approval',()=>{const checks=Object.fromEntries(tasks.slice(0,7).map(t=>[t[0],true]));assert.equal(isAvailable('wattage',checks),false);checks.approval=true;assert.equal(isAvailable('wattage',checks),true);checks.certificate=false;assert.equal(isAvailable('wattage',checks),false);});
