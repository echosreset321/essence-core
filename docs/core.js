export const kinds = ['concept', 'proposal', 'test', 'evidence'];
export const states = ['proposed', 'untested', 'in-progress', 'observed', 'disputed', 'corrected'];
export const correctionStates = ['open', 'implemented', 'verified'];
const nonempty = x => typeof x === 'string' && x.trim().length > 0;
export function validateLedger(data) {
  const errors = [];
  if (data?.version !== 1) errors.push('Unsupported ledger version');
  for (const key of ['records', 'corrections', 'participants', 'sources']) if (!Array.isArray(data?.[key])) errors.push(`Missing ${key} array`);
  if (errors.length) return errors;
  const ids = new Set();
  for (const row of [...data.participants, ...data.sources, ...data.records, ...data.corrections]) {
    if (!nonempty(row.id) || ids.has(row.id)) errors.push(`Missing or duplicate ID: ${row.id}`);
    ids.add(row.id);
  }
  const people = new Set(data.participants.map(x => x.id));
  const sources = new Set(data.sources.map(x => x.id));
  const records = new Set(data.records.map(x => x.id));
  for (const p of data.participants) if (!nonempty(p.name) || !nonempty(p.provenance)) errors.push(`Participant provenance required: ${p.id}`);
  for (const s of data.sources) if (!nonempty(s.title) || !nonempty(s.excerpt) || !nonempty(s.provenance)) errors.push(`Source details required: ${s.id}`);
  for (const r of data.records) {
    for (const key of ['title', 'summary', 'objection', 'nextAction', 'revisionTrigger', 'created']) if (!nonempty(r[key])) errors.push(`${r.id}: ${key} required`);
    if (!kinds.includes(r.kind) || !states.includes(r.status)) errors.push(`${r.id}: invalid kind/status`);
    if (!people.has(r.author)) errors.push(`${r.id}: unknown author`);
    if (!Array.isArray(r.sources) || !r.sources.length || r.sources.some(s => !sources.has(s))) errors.push(`${r.id}: source reference required`);
    if (r.status === 'corrected' && !data.corrections.some(c => c.recordId === r.id && c.status === 'verified')) errors.push(`${r.id}: corrected requires verified correction`);
  }
  for (const c of data.corrections) {
    for (const key of ['before', 'after', 'reason', 'nextAction', 'created']) if (!nonempty(c[key])) errors.push(`${c.id}: ${key} required`);
    if (!records.has(c.recordId) || !people.has(c.author) || !sources.has(c.source)) errors.push(`${c.id}: invalid reference`);
    if (!correctionStates.includes(c.status)) errors.push(`${c.id}: invalid correction status`);
    if (c.status !== 'open' && (!nonempty(c.implementation) || !sources.has(c.implementationSource))) errors.push(`${c.id}: implementation and source required`);
    if (c.status === 'verified' && (!nonempty(c.verification) || !sources.has(c.verificationSource) || !people.has(c.verifier) || c.verifier === c.author)) errors.push(`${c.id}: independent verification and source required`);
  }
  return errors;
}
export function selectRecords(data, {query = '', kind = 'all', status = 'all', author = 'all'} = {}) {
  const q = query.trim().toLowerCase();
  return data.records.filter(r => (kind === 'all' || r.kind === kind) && (status === 'all' || r.status === status) && (author === 'all' || r.author === author) && (!q || JSON.stringify([r, data.corrections.filter(c => c.recordId === r.id), data.sources.filter(s => r.sources.includes(s.id)), data.participants.find(p => p.id === r.author)]).toLowerCase().includes(q)));
}
export function buildHandoff(data, recordIds = data.records.map(r => r.id)) {
  // Corrections are always carried forward, even when a filtered view hides the target.
  const keep = new Set([...recordIds, ...data.corrections.map(c => c.recordId)]);
  return {format: 'echo-handoff-v1', exportedAt: new Date().toISOString(), instructions: 'Check corrections before acting. Open means unresolved; implemented means claimed change; verified requires independent evidence. Do not repeat superseded wording as current. Local drafts are unreviewed.', ledger: {...data, records: data.records.filter(r => keep.has(r.id))}};
}
export function issueURL(record, correction = null) {
  const title = correction ? `[Correction] ${record.id}: ${record.title}` : `[Contribution] ${record.title}`;
  const body = correction ? `Target: ${record.id}\n\n${JSON.stringify(correction, null, 2)}\n\nPlease preserve the original and link implementation and independent verification before marking corrected.` : `Unreviewed contribution draft. Please preserve attribution.\n\n${JSON.stringify(record, null, 2)}\n\nA maintainer must review and add this to docs/data/ledger.json. Filing an issue does not change the shared ledger.`;
  const base = 'https://github.com/echosreset321/essence-core/issues/new?';
  const url = base + new URLSearchParams({title, body});
  return url.length <= 7000 ? url : base + new URLSearchParams({title,body:'This draft is too long for a reliable link. Download drafts JSON from the local workbench, then paste the relevant draft here. Preserve its author, source, objection, and next action. This is an unreviewed proposal; it does not change the shared ledger.'});
}
