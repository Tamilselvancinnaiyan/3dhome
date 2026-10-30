import {writeFile} from 'node:fs/promises';
import {rooms,areaSummary,dimensionText,outline,porch,stair,dimension,bounds} from '../model-plan.mjs?v=timber-sidelight-9';
export async function writeReport(){
 const s=areaSummary(),n=x=>x.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});
 const report=`# Revised house — geometry measurement summary

Scale: 1 model unit = 1 foot. Exterior walls 9 inches; internal partitions 4.5 inches. Pooja remains 4 × 5 ft; utility is enlarged from 4.5 × 9.5 ft to 4.5 × 11.5 ft as requested. All other clear room dimensions are retained. Living and dining are non-overlapping measurement zones within the open hall; the console occupies the front apron beyond the living measurement rectangle. No alcove is counted as master-bedroom floor.

## Clear room measurements

| Room | Clear finished-face dimensions | Area (sq ft) |
|---|---|---:|
${rooms.map(q=>`| ${q.name} | ${dimensionText(q.r)} | ${n(s.roomAreas[q.id])} |`).join('\n')}
| **Room subtotal** | | **${n(s.clear)}** |
| Covered sit-out | ${dimensionText(porch.r)} | ${n(s.porch)} |
| **Rooms plus sit-out (not built-up)** | | **${n(s.clear+s.porch)}** |

Arithmetic correction to the brief: its nine specified room dimensions sum to **806.25**, rather than 906.25 sq ft. Adding the 100 sq ft sit-out gives **906.25**, rather than 1,006.25 sq ft. The subsequent request to recover the Bedroom 2–pooja gap increases utility by 9 sq ft, giving a revised room subtotal of 815.25 sq ft and rooms-plus-sit-out subtotal of 915.25 sq ft.

## Actual footprint accounting

| Component | Area (sq ft) |
|---|---:|
| Clear room zones | ${n(s.clear)} |
| Additional circulation / open hall apron / door thresholds | ${n(s.circulation)} |
| Exterior wall footprint, net | ${n(s.external)} |
| Internal partition footprint, net | ${n(s.partition)} |
| **Main-house built-up area** | **${n(s.main)}** |
| Covered sit-out | ${n(s.porch)} |
| External staircase and connecting landing | ${n(s.stairs)} |
| House + sit-out + staircase | ${n(s.combinedWithoutSteps)} |
| Separate entrance steps | ${n(s.steps)} |
| **Combined ground footprint including entrance steps** | **${n(s.combined)}** |

Main-house area is the geometric union of these non-overlapping footprint rectangles (x0, z0, x1, z1 in feet):

${outline.map(r=>`- (${r.x0}, ${r.z0}, ${r.x1}, ${r.z1}): ${n((r.x1-r.x0)*(r.z1-r.z0))} sq ft`).join('\n')}

Overall bounding extents: ${dimensionText(bounds(outline))}; the rectangular outline itself gives the built-up area. Wall intersections are counted once. Door thresholds are clear floor, not masonry. Slabs and roofs are not added as separate floor areas. The main house exceeds 1,000 sq ft by **${n(s.main-1000)} sq ft**. No claim of fitting within 1,000 sq ft is made, and no room was silently reduced.

## Revised arrangement and access

- Bedroom 2 remains rear left, common bathroom opens to the bedroom lobby, master remains rear right, and attached bathroom is accessed exclusively through master.
- Pooja has moved 2 ft rearward to share the existing Bedroom 2 south partition, eliminating the empty strip. Its divider and west window, altar, plant and camera move with it. Utility expands 2 ft rearward to the new divider and gains a 4.5 × 1.5 ft laundry storage counter. The main footprint remains unchanged.
- Pooja is on the left exterior side of dining with a direct 3 ft doorless opening. Altar, decorative plant, room light, labels and room camera move with it. The six-seat dining set leaves 2.75 ft on the west side and preserves the bedroom approach.
- Utility is on the left of kitchen, with its only entrance through kitchen. Washer, basin/counter and tap are relocated, and a west exterior window provides ventilation. The utility front-wall window is removed and the opening is filled with the matching 9-inch exterior wall. The fridge is at the front-right exterior-wall corner, with the sink on the west counter, clear of both the half-height opening and utility approach; the entire utility door sweep is clear.
- Old right-side pooja/utility walls and furniture are removed. Living extends into that side. Sofa back is 0.05 ft from the master partition, facing the front-wall TV; both actual rendered bounds and plan footprints agree. Main-door swing clears the TV console.
- Kitchen–dining wall is 3.25 ft high with a 0.12 ft finished sill: 3.37 ft overall, open above. Its separate 3 ft doorless passage is at the west/left end (x=5.625–8.625), clear of the dining chairs, sink and fridge. Hob is on the front exterior-wall counter. The kitchen working route and utility entrance pass the sampled 2.5 ft route test.
- The outer shell is now a straight 35.625 × 29.75 ft rectangle, matching the reference arrangement. The area below the shorter attached bathroom is used for master wardrobe access (5.375 × 4.625 = 24.859375 sq ft); it is included in additional circulation, not in the 156 sq ft master-bedroom target. This resolves the packing difference between a 13 ft-deep bedroom and an 8 ft-deep bathroom beside it. No extra alcove partition is added. The stair landing meets the straight east roof edge directly. Attached-bathroom ventilation is at the rear, beyond the external stair flight.
- Sit-out floor, canopy, ceiling trim, pillars, lights and approach steps now follow its exact 20 × 5 ft rectangle around the repositioned main door (centre x=18.55 ft). Sit-out chairs and corner pots are removed, leaving the covered space empty. Front staircase access is independent and clear of the sit-out.
- Existing warm exterior paint, charcoal fascia, wood-look detail, stone accents, palettes and viewer controls are retained. Slabs, roof surface, parapets and terrace guards follow the revised footprint edges. Both beds are turned across the room as pictured, and living uses a round coffee table. Bedroom 2 and pooja west-side windows, and the attached bathroom stair-side window, are removed and filled with matching walls. Rear bedroom/bathroom openings and utility side ventilation remain. The reference-style main entrance has a solid timber leaf with carved rosettes, border detailing and a long handle. A separate narrow fixed glazed sidelight with horizontal slats is on its right, allowing views outside while the timber door is closed. The door size and swing are retained; the sidelight is a new exterior-wall opening at x=20.45–21.55 ft. The six-seat dining set retains a 2.75 ft west approach and a 2.71 ft rear passage, while its east side opens into the larger hall.

## Verification and remaining limits

Automated checks cover all target dimensions, non-overlapping room zones and wall solids, wall thickness, wall containment within slabs, exact area reconciliation, separate structure footprints, full sampled door sweeps, kitchen counters in collision inventory, 2.5 ft routes to every room, actual rendered furniture transforms, canopy/pillar connections, stair projection, viewer modes and optional panels. Run \`npm run build\` for checks and the static \`dist/\` model.

Visual checks include top view, cutaway, kitchen–dining detail, walkthrough and front/rear/left/right exterior views. Earlier screenshots are in \`screenshots/\`; those preceding the utility-gap revision do not show the latest pooja/utility divider.

Retained stair flight: ${dimensionText(stair.flight)}, ${stair.risers} risers, ${stair.going} ft going. Connecting landing: ${dimensionText(stair.landing)}. Its **3 ft travel depth is less than the 3.5 ft gross flight width**; this retained design limitation is flagged in the audit. Guard infill, final structural support, appliance-door operation, ventilation free area and construction details still need detailed design. The sampled routes assume fully open doors and do not certify accessibility or construction compliance.

The supplied revised layout image is saved as revised-plan-reference.png and is available in the viewer reference dialog alongside the existing exterior design board. It is an arrangement reference, not a scale drawing; no pixels were traced. Its incorrect area subtotals are explicitly corrected above. The written instruction to retain the TV on the front wall takes precedence over the reference image’s right-wall TV.
`;
 await writeFile(new URL('../CORRECTED-PLAN-REPORT.md',import.meta.url),report);return report;
}
