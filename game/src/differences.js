// differences.js — the 21 differences: 7 per scene, 3 scenes.
// Each difference names the spot on the RIGHT panel where the change lives,
// the radius a click must land inside, and a fair hint line.
// kinds: missing | extra | color | moved | count
export const DIFFERENCES = {
  noodle: [
    { id: 'n1', x: 150, y: 296, r: 26, kind: 'missing', label: 'Chilli jar vanished', hint: 'Look at the jars on the counter.' },
    { id: 'n2', x: 280, y: 92, r: 30, kind: 'color', label: 'Awning stripe changed colour', hint: 'The stall awning is not the same shade.' },
    { id: 'n3', x: 428, y: 318, r: 24, kind: 'extra', label: 'An extra bowl appeared', hint: 'Count the bowls on the right side of the counter.' },
    { id: 'n4', x: 140, y: 118, r: 24, kind: 'moved', label: 'The hanging lamp moved', hint: 'A lamp hangs somewhere it should not.' },
    { id: 'n5', x: 352, y: 62, r: 18, kind: 'count', label: 'A festoon bulb is missing', hint: 'Count the little lights strung across the top.' },
    { id: 'n6', x: 470, y: 112, r: 22, kind: 'missing', label: 'The star on the sign is gone', hint: 'Something is missing from the wooden sign.' },
    { id: 'n7', x: 486, y: 348, r: 26, kind: 'color', label: 'The cat’s collar changed colour', hint: 'The cat on the crate is wearing something different.' },
  ],
  toys: [
    { id: 't1', x: 122, y: 92, r: 24, kind: 'missing', label: 'Kite tail ribbon missing', hint: 'The red kite lost part of its tail.' },
    { id: 't2', x: 432, y: 102, r: 24, kind: 'extra', label: 'An extra balloon floated in', hint: 'Count the balloons above the stall.' },
    { id: 't3', x: 252, y: 302, r: 26, kind: 'color', label: 'The toy drum changed colour', hint: 'One toy on the table is a different colour.' },
    { id: 't4', x: 352, y: 202, r: 24, kind: 'count', label: 'Pinwheel lost a blade', hint: 'The pinwheel does not spin the same way.' },
    { id: 't5', x: 222, y: 332, r: 26, kind: 'moved', label: 'The teddy bear shuffled over', hint: 'A soft toy is not where it was sitting.' },
    { id: 't6', x: 502, y: 72, r: 22, kind: 'missing', label: 'The little flag is gone', hint: 'Look at the top of the stall pole.' },
    { id: 't7', x: 300, y: 82, r: 28, kind: 'color', label: 'Roof stripe changed colour', hint: 'The striped roof has a different stripe.' },
  ],
  books: [
    { id: 'b1', x: 142, y: 302, r: 24, kind: 'missing', label: 'The desk candle is gone', hint: 'Something that gave light on the desk is missing.' },
    { id: 'b2', x: 402, y: 142, r: 22, kind: 'extra', label: 'An extra book on the shelf', hint: 'Count the books on the middle shelf.' },
    { id: 'b3', x: 280, y: 372, r: 30, kind: 'color', label: 'The rug changed colour', hint: 'The rug under the chair is a different shade.' },
    { id: 'b4', x: 202, y: 252, r: 24, kind: 'count', label: 'A book is missing from the stack', hint: 'The pile of books on the floor is shorter.' },
    { id: 'b5', x: 470, y: 132, r: 24, kind: 'moved', label: 'The wall clock slid down', hint: 'The clock is not hanging where it was.' },
    { id: 'b6', x: 352, y: 322, r: 24, kind: 'missing', label: 'The cat’s tail vanished', hint: 'The sleeping cat looks a little shorter.' },
    { id: 'b7', x: 92, y: 82, r: 24, kind: 'color', label: 'The moon changed colour', hint: 'Look out of the window at the moon.' },
  ],
};

export function diffsFor(sceneId) {
  return DIFFERENCES[sceneId] || [];
}

export function totalDifferences() {
  return Object.values(DIFFERENCES).reduce((n, list) => n + list.length, 0);
}

// Pure hit test: is point (x, y) inside an unfound difference of this scene?
export function hitTest(sceneId, x, y, foundIds) {
  for (const d of diffsFor(sceneId)) {
    if (foundIds.has(d.id)) continue;
    const dx = x - d.x;
    const dy = y - d.y;
    if (dx * dx + dy * dy <= d.r * d.r) return d;
  }
  return null;
}
