export function checkHistory(previous,current) {
  const errors = [];
  for (const table of ['sources','participants','records','corrections']) {
    for (const old of previous[table]) {
      const next = current[table].find(x => x.id === old.id);
      if (!next) {errors.push(`Cannot remove ${table} ${old.id}; append a correction instead`); continue;}
      const fixed = table === 'corrections' ? ['recordId','author','source','before','after','reason','created'] : table === 'records' ? ['author','created','sources'] : Object.keys(old);
      for (const field of fixed) if (JSON.stringify(next[field]) !== JSON.stringify(old[field])) errors.push(`Preserve ${old.id}.${field}; append a sourced correction`);
      if (table === 'corrections') {
        const rank = ['open','implemented','verified'];
        if (rank.indexOf(next.status) < rank.indexOf(old.status)) errors.push(`${old.id}: cannot move correction backwards`);
        for (const field of ['implementation','implementationSource','verification','verificationSource','verifier']) if (old[field] && old[field] !== next[field]) errors.push(`Preserve ${old.id}.${field}; append a new correction`);
      }
      if (table === 'records' && next.summary !== old.summary && !current.corrections.some(c => c.recordId === old.id && c.status === 'verified' && c.before === old.summary && c.after === next.summary)) errors.push(`${old.id}: changed summary requires a verified correction matching before and after`);
    }
  }
  return errors;
}
