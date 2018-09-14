import React from 'react';

function nextRow(row, n, modulus) {
  const len = n % 2 === 0 ? (n / 2) : (n - 1) / 2
  let newRow = new Array(len)
  for (let j=0; j<len; j++) {
    if (j in row) {
      newRow[j] = ((j-1 in row ? row[j-1] : 1) + (row[j])) % modulus
    } else {
      newRow[j] = (2 * (j-1 in row ? row[j-1] : 1)) % modulus
    }
  }
  return newRow
}

function fullRow(row, n) {
  let vals = [1];
  if (n === 0) {
    return vals;
  }
  const even = (n % 2 === 0)
  const l = even ? n / 2 : (n-1) / 2
  let i = 0;
  while (i < l) {
    vals.push(row[i]);
    i += 1;
  }
  if (even) {
    i -= 1
  }
  while (i > 0) {
    i -= 1
    vals.push(row[i])
  }
  vals.push(1)
  return vals
}

function addRow(rows, modulus) {
  const newRow = nextRow(rows[rows.length-1], rows.length, modulus);
  rows.push(newRow);
}

function removeRow(rows) {
  rows.splice(-1)
}

function pascalsTriangle(n, modulus) {
  let rows = [[], []];
  while (rows.length < n) {
    addRow(rows, modulus)
  }
  return rows;
}

function roundTo(n, d) {
  return Math.round(n * Math.pow(10, d)) / Math.pow(10,d)
}

const scale = 10;

// shifts from center to make regular hexagon
const regHex = {
  x: scale * Math.cos(Math.PI/6),
  y: scale * Math.sin(Math.PI/6),
}

function hexCenterX(r,k) {
  return 2 * regHex.x * (k - r/2)
}

function hexCenterY(r) {
  return 1.5 * r * scale;
}

function hexPoints(r, k, round=4) {
  const cx = hexCenterX(r, k)
  const cy = 0
  //rows will be put at correct height using translate transformation
  const x0 = roundTo(cx - regHex.x, round)
  const x1 = roundTo(cx + regHex.x, round)
  const y0 = roundTo(cy - scale, round)
  const y1 = roundTo(cy - regHex.y, round)
  const y2 = roundTo(cy + regHex.y, round)
  const y3 = roundTo(cy + scale, round)
  return `${cx},${y0} ${x1},${y1} ${x1},${y2} ${cx},${y3} ${x0},${y2} ${x0},${y1}`
}

function renderNode(r, k, c, round=4) {
  return (
    <polygon 
      key={`hex${r}-${k}`} 
      className={c} 
      points={hexPoints(r,k,round)}
    />
  )
}

function renderRow(row, n, round=4) {
  const cy = hexCenterY(n)
  const vals = fullRow(row, n)
  return (
    <g key={`row${n}`} transform={`translate(0,${roundTo(cy,round)})`}>
      {vals.map((c,k) => renderNode(n,k,`m${c}`,round))}
    </g>
  )
}

function renderTriangle(rows) {
  const l = rows.length;
  const x = roundTo(hexCenterX(l+2, 0), 4)
  const y = roundTo(hexCenterY(l+2), 4)
  const ystart = roundTo(-4 * regHex.y, 4)
  const viewBox = `${x} ${ystart} ${-2*x} ${y}`
  return (
    <svg key="PascalSVG" className="PascalSVG" viewBox={viewBox}>
      {rows.map((row,i) => renderRow(row,i,4))}
    </svg>
  )
}

export { addRow, removeRow, pascalsTriangle, renderTriangle }

