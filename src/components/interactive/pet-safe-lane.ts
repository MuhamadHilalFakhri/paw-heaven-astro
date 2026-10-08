export type PetLane = { left: number; right: number };

export function findPetLane(node: HTMLElement, x: number): PetLane | undefined {
  const width = node.offsetWidth;
  const band = node.getBoundingClientRect();
  let lanes: PetLane[] = [{ left: 4, right: window.innerWidth - width - 4 }];
  const controls = document.querySelectorAll('.site-shell h1, .site-shell h2, .site-shell h3, .site-shell p, .site-shell img, .site-shell a, .site-shell button, .site-shell input, .site-shell textarea, .site-shell [data-slot="carousel"]');
  for (const control of controls) {
    const rect = control.getBoundingClientRect();
    if (!rect.width || !rect.height || rect.bottom < band.top - 6 || rect.top > band.bottom + 6) continue;
    const left = rect.left - width + 5;
    const right = rect.right - 5;
    lanes = lanes.flatMap(lane => {
      if (right < lane.left || left > lane.right) return [lane];
      const result: PetLane[] = [];
      if (left > lane.left) result.push({ left: lane.left, right: Math.min(left, lane.right) });
      if (right < lane.right) result.push({ left: Math.max(right, lane.left), right: lane.right });
      return result;
    });
  }
  return lanes.filter(lane => lane.right >= lane.left).sort((a, b) => {
    const distance = (lane: PetLane) => Math.abs(x - Math.max(lane.left, Math.min(x, lane.right)));
    return distance(a) - distance(b);
  })[0];
}
