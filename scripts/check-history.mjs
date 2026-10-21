import {execFileSync} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {checkHistory} from '../docs/history.js';
if (!process.env.LEDGER_BASE) throw new Error('LEDGER_BASE commit required');
let previous;
try {previous = JSON.parse(execFileSync('git',['show',`${process.env.LEDGER_BASE}:docs/data/ledger.json`],{encoding:'utf8',stdio:['ignore','pipe','pipe']}));}
catch (error) {
  // The first addition has no ledger at its base. Do not hide parse or Git failures.
  const paths = execFileSync('git',['ls-tree','--name-only',process.env.LEDGER_BASE,'docs/data/ledger.json'],{encoding:'utf8'});
  if (paths.trim()) throw error;
  console.log('First shared ledger: no prior history to compare.'); process.exit(0);
}
const current = JSON.parse(await readFile('docs/data/ledger.json','utf8'));
const errors = checkHistory(previous,current);
if (errors.length) {console.error(errors.join('\n')); process.exit(1);}
console.log('Existing origins and correction claims preserved.');
