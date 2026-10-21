import {readFile} from 'node:fs/promises';
import {validateLedger} from '../docs/core.js';
const ledger = JSON.parse(await readFile(new URL('../docs/data/ledger.json', import.meta.url)));
const errors = validateLedger(ledger);
if (errors.length) {console.error(errors.join('\n')); process.exit(1);}
console.log(`Validated ${ledger.records.length} records, ${ledger.corrections.length} corrections, and all source/author references.`);
