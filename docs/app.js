import {selectRecords, validateLedger, buildHandoff, issueURL} from './core.js';
const $ = s => document.querySelector(s);
const el = (tag, text, cls) => {const n = document.createElement(tag); if (text !== undefined) n.textContent = text; if (cls) n.className = cls; return n;};
const key = 'echo-commons-drafts-v1';
let data, kind = 'all', current, drafts = [], lastFocus;
let noticeTimer;
function notice(message) {$('#notice').textContent = message; clearTimeout(noticeTimer); noticeTimer = setTimeout(() => $('#notice').textContent = '', 7000);}
try {const saved = JSON.parse(localStorage.getItem(key) || '[]'); if (Array.isArray(saved)) drafts = saved.filter(x => x && ['record','correction'].includes(x.type) && typeof x.title === 'string');} catch {notice('Local storage is unavailable or unreadable. Download drafts before leaving.');}
function saveDraft(draft) {
  drafts.push(draft);
  try {localStorage.setItem(key, JSON.stringify(drafts)); notice('Draft saved in this browser. Submit on GitHub to propose sharing it.');} catch {notice('Browser storage failed. Your draft is in this page only—download a backup now.');}
  renderDrafts();
}
function download(value, filename) {const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], {type:'application/json'})); const a = el('a'); a.href = url; a.download = filename; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);}
function link(text, url) {const a = el('a', text); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; return a;}
function renderDrafts() {
  $('#draft-section').hidden = !drafts.length;
  $('#drafts').replaceChildren(...drafts.map(d => {
    const card = el('article', undefined, 'draft-card');
    card.append(el('span', 'LOCAL · UNREVIEWED', 'eyebrow'), el('h3', d.title), el('p', d.type === 'correction' ? `${d.payload.before} → ${d.payload.after}` : d.payload.summary));
    const details = el('details'); details.append(el('summary', 'Inspect draft JSON'), el('pre', JSON.stringify(d, null, 2))); card.append(details);
    const url = issueURL(d.type === 'correction' ? {id:d.payload.recordId, title:d.title} : d.payload, d.type === 'correction' ? d.payload : null);
    if (new URL(url).searchParams.get('body').startsWith('This draft is too long')) card.append(el('p','Long draft: download drafts JSON below, then paste this draft into the GitHub issue.'));
    card.append(link('Propose this on GitHub ↗', url));
    return card;
  }));
}
function options() {return {query:$('#search').value, kind, status:$('#status').value, author:$('#author').value};}
function render() {
  const rows = selectRecords(data, options());
  $('#count').textContent = `${rows.length} of ${data.records.length} records`;
  $('#records').replaceChildren(...rows.map(r => {
    const card = el('article', undefined, 'record');
    const meta = el('div', undefined, 'record-meta'); meta.append(el('span', r.id, 'record-id'), el('span', r.kind, 'badge'));
    const body = el('div'); body.append(el('h3', r.title), el('p', r.summary));
    const next = el('p', undefined, 'next-line'); next.append(el('strong', 'Next: '), document.createTextNode(r.nextAction)); body.append(next);
    const end = el('div', undefined, 'record-end'); end.append(el('span', r.status, `badge ${r.status}`), el('div', data.participants.find(p => p.id === r.author)?.name, 'record-author'));
    const button = el('button', 'Open record ↗', 'text-button'); button.setAttribute('aria-label', `Open record ${r.id}: ${r.title}`); button.addEventListener('click', () => openRecord(r)); end.append(button);
    card.append(meta, body, end); return card;
  }));
  if (!rows.length) $('#records').append(el('p', 'No matching records. Try a broader search or select Every state.', 'empty'));
}
function section(container, heading, text) {container.append(el('h3', heading), el('p', text));}
function openRecord(r) {
  current = r; lastFocus = document.activeElement;
  $('#detail-id').textContent = `${r.id} / ${r.kind} / ${r.status}`;
  const content = $('#detail-content'); content.replaceChildren();
  const title = el('h2', r.title); title.id = 'detail-title'; content.append(title);
  const person = data.participants.find(p => p.id === r.author);
  section(content, `Contributed by ${person.name}`, person.provenance);
  section(content, 'Current account', r.summary);
  section(content, 'Strongest objection', r.objection);
  section(content, 'What would change this conclusion?', r.revisionTrigger);
  section(content, 'Next action', r.nextAction);
  content.append(el('h3', 'Sources · excerpts, not full transcripts'));
  r.sources.forEach(id => {const s = data.sources.find(x => x.id === id); content.append(el('h3', `${s.id} / ${s.title}`), el('blockquote', s.excerpt), el('p', s.provenance));});
  const corrections = data.corrections.filter(c => c.recordId === r.id);
  content.append(el('h3', 'Correction history'));
  if (!corrections.length) content.append(el('p', 'No shared corrections recorded. This does not establish that the record is correct.'));
  corrections.forEach(c => {
    const box = el('article'); box.append(el('h3', `${c.id} · ${c.status}`));
    for (const [label, value] of [['Original',c.before],['Replacement',c.after],['Reason',c.reason],['Next action',c.nextAction],['Implementation',c.implementation || 'Not recorded'],['Verification',c.verification || 'Not independently verified'],['Proposed by',data.participants.find(p => p.id === c.author)?.name],['Source',c.source],['Implementation source',c.implementationSource || 'Not recorded'],['Verification source',c.verificationSource || 'Not recorded'],['Verifier',data.participants.find(p => p.id === c.verifier)?.name || 'Unassigned']]) section(box, label, value);
    content.append(box);
  });
  $('#correction-form').reset(); $('#correction-form').elements.before.value = r.summary;
  $('#detail').showModal();
}
function closeDetail() {$('#detail').close(); lastFocus?.focus();}
$('#close-detail').addEventListener('click', closeDetail);
$('#detail').addEventListener('click', e => {if (e.target === $('#detail')) {const rect = e.target.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) closeDetail();}});
$('#contribution').addEventListener('submit', e => {
  e.preventDefault(); if (!data) return notice('The shared ledger must load before drafting.');
  const f = Object.fromEntries(new FormData(e.target));
  if (Object.values(f).some(v => !v.trim())) return notice('Please enter text in every field.');
  const draft = {id:'local-' + crypto.randomUUID(), title:f.title, kind:f.kind, status:f.kind === 'evidence' ? 'proposed' : 'untested', summary:f.summary, author:f.name, sourceNote:f.source, objection:f.objection, revisionTrigger:f.revisionTrigger, nextAction:f.nextAction, created:new Date().toISOString(), review:'unreviewed'};
  saveDraft({type:'record',title:f.title,payload:draft}); e.target.reset(); $('#draft-section').scrollIntoView({behavior:'instant'});
});
$('#correction-form').addEventListener('submit', e => {
  e.preventDefault(); const f = Object.fromEntries(new FormData(e.target));
  if (Object.values(f).some(v => !v.trim())) return notice('Please enter text in every field.');
  saveDraft({type:'correction',title:current.title,payload:{id:'local-' + crypto.randomUUID(),recordId:current.id,author:f.name,before:f.before,after:f.after,reason:f.reason,nextAction:f.nextAction,status:'open',created:new Date().toISOString(),review:'unreviewed'}});
  closeDetail(); $('#draft-section').scrollIntoView({behavior:'instant'});
});
$('#backup').addEventListener('click', () => download({format:'echo-drafts-v1',drafts}, 'echo-local-drafts.json'));
$('#clear-drafts').addEventListener('click', () => {if (!confirm('Clear drafts from this browser? Download a backup first if you need them. Shared records are unaffected.')) return; try {localStorage.removeItem(key);} catch {notice('Could not clear browser storage.'); return;} drafts = []; renderDrafts(); notice('Local drafts cleared.');});
$('#export').disabled = true;
$('#export').addEventListener('click', () => {download(buildHandoff(data, selectRecords(data, options()).map(r => r.id)), 'echo-handoff.json'); notice('Handoff downloaded. It includes all shared corrections, including targets outside your filters.');});
$('#find-test').addEventListener('click', () => {kind = 'test'; document.querySelectorAll('[data-kind]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.kind === kind))); $('#search').value = 'Two humans'; $('#status').value = 'all'; $('#author').value = 'all'; if (data) render();});
for (const selector of ['#search','#status','#author']) $(selector).addEventListener('input', () => {if (data) render();});
document.querySelectorAll('[data-kind]').forEach(b => b.addEventListener('click', () => {kind = b.dataset.kind; document.querySelectorAll('[data-kind]').forEach(n => n.setAttribute('aria-pressed', String(n === b))); if (data) render();}));
renderDrafts();
try {
  const response = await fetch('./data/ledger.json', {cache:'no-cache'});
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const incoming = await response.json(); const errors = validateLedger(incoming);
  if (errors.length) throw new Error(errors.join('; '));
  data = incoming; render();
  data.participants.forEach(p => {const o = el('option', p.name); o.value = p.id; $('#author').append(o);});
  $('#participants').replaceChildren(...data.participants.map((p,i) => {const card = el('article', undefined, 'person'); card.append(el('span',`0${i+1} / CONTRIBUTOR`, 'person-number'),el('h3',p.name),el('p',p.role),el('p',p.provenance)); return card;}));
  const open = data.corrections.filter(c => c.status !== 'verified').length;
  $('#correction-count').textContent = `${data.corrections.length} shared corrections · ${open} awaiting verification. Original wording and next actions travel with the handoff.`;
  $('#ledger-state').textContent = `Shared repository snapshot · ${data.updated} · Browser drafts stay local until reviewed and merged.`;
  $('#export').disabled = false;
} catch (error) {
  $('#ledger-state').textContent = `Could not load the shared ledger: ${error.message}. Serve this folder over HTTP, or read the repository's JSON directly.`;
  $('#records').append(link('Read the shared ledger on GitHub ↗', 'https://github.com/echosreset321/essence-core/blob/main/docs/data/ledger.json'));
}
