
function divideOut({n, primelist={}}, p) {
  if (n % p === 0) {
    primelist[p] = 0;
    while (n % p === 0) {
      n = n / p;
      primelist[p] += 1;
    }
  }
  return { n: n, primelist: primelist };
}

function primeFactors(n) {
  let f = {n: n, primelist: {}};
  f = divideOut(f, 2);
  if (f.n === 1) return f.primelist;
  f = divideOut(f, 3);
  if (f.n === 1) return f.primelist;
  let p = 5;
  while (p <= f.n) {
    f = divideOut(f, p)
    if (f.n === 1) return f.primelist;
    p += 2;
    f = divideOut(f, p)
    if (f.n === 1) return f.primelist;
    p += 4;
  }
  return f.primelist;
}

export { primeFactors }