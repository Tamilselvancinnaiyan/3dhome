import {writeFile} from 'node:fs/promises';
import {designValidation} from '../design-validation.mjs';
export async function writeAudit(){
 const a=designValidation();
 const text=`# Revised house geometry audit

Scale 1 unit = 1 foot. PASS applies only to the stated measured criterion. See [measurement summary](CORRECTED-PLAN-REPORT.md) for footprint accounting, layout changes and limitations.

## Access routes

${a.routes.map(r=>`- ${r.id}: ${r.reachable?'PASS':'FAIL'} — 2.5 ft square envelope on 0.25 ft grid, doors open.`).join('\n')}

## Audit register

| Check | Status | Geometry evidence | Criterion / limitation |
|---|---|---|---|
${a.checks.map(c=>`| ${c.title} | ${c.status} | ${c.existing} | ${c.criterion} |`).join('\n')}

## Area data

\`\`\`json
${JSON.stringify(a.areas,null,2)}
\`\`\`

The stair landing retains its 3 ft depth, flagged against the 3.5 ft flight width. No claim of structural, statutory, daylight or accessibility certification is made. The revised main-house footprint is larger than 1,000 sq ft. Original room targets summed to 806.25 sq ft. The requested utility extension adds 9 sq ft, bringing revised clear rooms to 815.25 sq ft.
`;
 await writeFile(new URL('../DESIGN-AUDIT.md',import.meta.url),text);
}
