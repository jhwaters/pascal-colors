import React, { Component } from 'react';
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
  const hhi = hlo + 4*n + randint(0, 360-4*n-5);
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
  while (rows.length < n) {
    rows.push(nextRow(rows[rows.length-1], mod));
  }
  return rows;
}

function calcViewBox(n, r){
  const y = 1.1 * r * 3/2 * (n + 2);
  const x = 1.1 * r * Math.sqrt(3) * (n / 2);
  return `-${x} 0 ${2*x} ${y}`;
}

function renderHexagon(n, k, color) {
  const center = calcCenter(n, k, 1);
  const pts = hexagonPoints(center.cx, center.cy, 1);
  const key = `hex${n}-${k}`;
  const style = {
    fill: color, 
    //"stroke-width": "0.05",
    //stroke: "#222",
  };
  return <polygon key={key} className="pascalHexagon" points={pts} style={style} />;
  //return <circle key={key} cx={center.cx} cy={center.cy} r=".86" style={style} />
}

function renderTriangle(rows, colors) {
  let hexs = [];
  for (const n in rows) {
    for (const k in rows[n]) {
      hexs.push({
        n: parseInt(n, 10),
        k: parseInt(k, 10),
        color: colors[rows[n][k]%colors.length], 
      })
    }
  }
  return (
    <svg key="pascalsColorTriangle" viewBox={calcViewBox(rows.length+1, 1)} >
      {hexs.map(h => renderHexagon(h.n, h.k, h.color))}
    </svg>
  )
}

class TriangleHandler extends Component {
  constructor(props) {
    super(props);
    const rows = props.rows || 32;
    const mod = props.mod || 2;
    this.state = {
      rows: rows,
      mod: mod,
      colors: colorRange(2),
      triangle: calcTriangle(rows, mod),
      emphasize: [],
    }
  }

  colors() {
    return this.state.colors;
    /*
    let result = [];
    for (const c in this.state.colors) {
      const col = this.state.colors[c]
      if (c in this.state.emphasize) {
        result.push(hsl(0, 100, 100));
      } else {
        result.push(hsl(col.h, col.s, col.l));
      }
    }
    return result;
    */
  }

  renderSliders() {
    let theprimes = [];
    for (const prime of [2, 3, 5, 7, 11, 13]) {
      if (this.state.mod % prime === 0) {
        theprimes.push(prime);
      }
    }
    return (
      <div id="primeSliders" >
        {theprimes.map(p => (
          <div key={`slider${p}`} >
            <button id={`primeButton${p}`} key={`primeButton${p}`}
              onClick={() => this.showMultiples(p)}>{p}</button>
          </div>
        ))}
      </div>
    )
  }

  update() {
    const r = parseInt(document.getElementById("rowInput").value, 10);
    const c = parseInt(document.getElementById("colorInput").value, 10);
    let newState = {rows: r, mod: c, emphasize: []};
    if (r === this.state.rows || c !== this.state.mod) {
      newState.colors = colorRange(c);
    }
    if (r !== this.state.rows || c !== this.state.mod) {
      newState.triangle = calcTriangle(r, c);
    }
    this.setState(newState);
  }

  showMultiples(p) {
    let result = [];
    for (let i=0; i<this.state.mod; i++) {
      if (i % p === 0) {
        result.push(i);
      }
    }
    this.setState({"emphasize": result});
  }

  render() {
    return (
      <div key="PascalsTriangleApp">
        <div key="pascalControls" className="pascalControls">
          <div className="inputBoxes">
            <div className="inputLabel">Rows</div>
            <div className="inputLabel">Colors</div>
            <input id="rowInput"
                   className="inputBox"
                   type="tel" 
                   min="1" 
                   max="101"
                   maxLength="3"
                   size="1"
                   defaultValue="32">
            </input>
            <input id="colorInput"
                   className="inputBox"
                   type="tel"
                   min="1" 
                   max="35"
                   maxLength="3"
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
