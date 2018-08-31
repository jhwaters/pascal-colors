import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


/*
 * Colors
 */

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
  const hlo = randint(0, 360);
  const hhi = hlo + 4*n + randint(0, 360-4*n);
  const hs = (Math.random() < 0.5) ? linspace(hlo, hhi, n) : linspace(hhi, hlo, n);
  const slo = randint(30, 50);
  const shi = randint(50, 100);
  const ss = (Math.random() < 0.5) ? linspace(slo, shi, n) : linspace(shi, slo, n);
  const llo = randint(20, 50);
  const lhi = randint(50, 95);
  const ls = (Math.random() < 0.5) ? linspace(llo, lhi, n) : linspace(lhi, llo, n);
  let result = [];
  for (let i = 0; i<n; i++) {
    result.push(hsl(hs[i] % 360, ss[i], ls[i]));
  }
  return result;
}


/*
 * Triangle
 */

function calcCenter(n, k, r) {
  return {
    cx: r * Math.sqrt(3) * (k - n/2),
    cy: r * 3/2 * (n + 1),
  }
}

function hexagonPoints(cx, cy, r) {
  const points = [
    {x: cx, y: cy+r},
    {x: cx + r * Math.cos(Math.PI/6), y: cy + r * Math.sin(Math.PI/6)},
    {x: cx + r * Math.cos(Math.PI/6), y: cy - r * Math.sin(Math.PI/6)},
    {x: cx, y: cy-r},
    {x: cx - r * Math.cos(Math.PI/6), y: cy - r * Math.sin(Math.PI/6)},
    {x: cx - r * Math.cos(Math.PI/6), y: cy + r * Math.sin(Math.PI/6)},
  ];
  return points.map(pt => `${pt.x},${pt.y}`).join(" ");
}

function nextRow(lastRow, mod) {
  let row = [1];
  for (let k=1; k<lastRow.length; k++) {
    const nextval = mod == null ? lastRow[k-1] + lastRow[k] : (lastRow[k-1] + lastRow[k]) % mod;
    row.push(nextval);
  }
  row.push(1);
  return row;
}

function calcTriangle(n, mod) {
  let rows = [[1]];
  while (rows.length < n+1) {
    rows.push(nextRow(rows[rows.length-1], mod));
  }
  return rows;
}

function calcViewBox(n, r){
  const y = 1.1 * r * 3/2 * (n + 2);
  const x = 1.1 * r * Math.sqrt(3) * (n / 2);
  return `-${x} 0 ${2*x} ${y}`;
}

function renderTriangle(rows, colors) {
  let hexs = [];
  for (const n in rows) {
    for (const k in rows[n]) {
      const center = calcCenter(parseInt(n, 10), parseInt(k, 10), 1);
      hexs.push({
        pts: hexagonPoints(center.cx, center.cy, 1), 
        style: {fill: colors[rows[n][k]%colors.length]}, 
        key: `hex${n}-${k}`,
      })
    }
  }
  return (
    <svg key="pascalsColorTriangle" viewBox={calcViewBox(rows.length+1, 1)} >
      {hexs.map(h => <polygon key={h.key} points={h.pts} style={h.style} />)}
    </svg>
  )
}

class TriangleHandler extends Component {
  constructor(props) {
    super(props);
    const rows = props.rows || 20;
    const mod = props.mod || 2;
    this.state = {
      rows: rows,
      mod: mod,
      colors: [
        hsl(200, 80, 60),
        hsl(140, 60, 60),
        hsl(60, 80, 50),
        hsl(30, 80, 65),
        hsl(0, 50, 60),
        hsl(330, 60, 60),
        hsl(280, 40, 40),
        hsl(250, 0, 10),
      ],
      triangle: calcTriangle(rows, mod),
    }
  }

  colors() {
    return this.state.colors;
  }

  renderColorPicker() {
    let cols = [];
    for (let k=0; k<this.state.mod; k++) {
      cols.push({mod: k, color: this.state.colors[k]});
    }
    return(
      <div className="colorPicker">
        {cols.map(c => (
          <div>
            {`Color ${c.mod}:`}
            Hue: <input id={`color${c.mod}-hue`}></input> 
            Saturation: <input id={`color${c.mod}-sat`}></input> 
            Lightness: <input id={`color${c.mod}-lig`}></input> 
          </div>
        ))}
      </div>
    )
  }

  update() {
    const r = parseInt(document.getElementById("rowInput").value, 10);
    const c = parseInt(document.getElementById("colorInput").value, 10);
    const newColors = colorRange(c);
    const newTriangle = calcTriangle(r, c);
    this.setState({
      rows: r, 
      mod: c, 
      triangle: newTriangle,
      colors: newColors,
    });
  }

  render() {
    return (
      <div key="PascalsTriangleApp">
        <div key="pascalControls" className="pascalControls">
          <div className="inputBoxes">
            <div className="inputLabel">Last Row</div>
            <div className="inputLabel">Colors</div>
            <input id="rowInput"
                   className="inputBox"
                   type="number" 
                   min="1" 
                   max="100"
                   size="1"
                   defaultValue="20">
            </input>
            <input id="colorInput"
                   className="inputBox"
                   type="number"
                   min="1" 
                   max="35"
                   size="1"
                   defaultValue="2">
            </input>
            <button key="updateButton" 
                  id="updateButton" 
                  onClick={() => this.update()}>
              Update
            </button>
          </div>
        </div>
        <div key="triangleContainer">
          {renderTriangle(this.state.triangle, this.colors())}
        </div>
      </div>
    )
  }
}

/*
 * App
 */

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <strong>Pascal's Triangle (colored by remainders)</strong>
        </header>
        <TriangleHandler />
      </div>
    );
  }
}

export default App;
