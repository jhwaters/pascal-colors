
function linspace(start, stop, n) {
  const d = (stop - start) / (n-1);
  let result = [start];
  let v = start;
  while (result.length < n) {
    v += d;
    result.push(Math.round(v))
  }
  return result;
}

function hsl(h, s, v) {
  return new HSL(h, s, v);
}

class HSL {
  constructor(h, s, l) {
    this.h = h;
    this.s = s;
    this.l = l;
  }

  toString() {
    return `hsl(${this.h},${this.s}%,${this.l}%)`;
  }
}

function randint(a, b) {
  return a + Math.floor(Math.random() * (b - a));
}

function colorRange(n) {
  const hlo = randint(0, 360)
  const d = 360 / n
  const hhi = hlo + randint(100, 360) - randint(d/4, d)
  const hs = (Math.random() < 0.5) ? linspace(hlo, hhi, n) : linspace(hhi, hlo, n)
  const sd = randint(0,60)
  const slo = randint(30,95-sd)
  const ss = (Math.random() < 0.5) ? linspace(slo, slo+sd, n) : linspace(slo+sd, slo, n)
  const ld = randint(0,70)
  const llo = randint(15,90-ld)
  const ls = (Math.random() < 0.5) ? linspace(llo, llo+ld, n) : linspace(llo+ld, llo, n)
  let result = []
  for (let i = 0; i<n; i++) {
    result.push(hsl(hs[i] % 360, ss[i], ls[i]))
  }
  return result;
}

export { colorRange }