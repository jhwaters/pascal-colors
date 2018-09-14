import React, { Component } from 'react';
import './App.css';
import { addRow, removeRow, pascalsTriangle, renderTriangle } from './pascal.js';
import { colorRange } from './colors.js';
import { primeFactors } from './primes.js';

function primesWith1(n) {
  let a = primeFactors(n);
  a[1] = 1;
  return a;
}

class App extends Component {
  constructor(props) {
    super(props)
    const m = 2;
    const n = 32;
    const colors = colorRange(m)
    let vals = pascalsTriangle(n, m);
    this.state = {
      vals: vals,
      rows: n,
      primes: primesWith1(m),
      modulus: m,
      colors: colors,
      changeColors: true,
    }
  }

  autoUpdate() {
    return document.getElementById("autoUpdateCheck").checked
  }

  maybeUpdate() {
    if (this.autoUpdate()) {
      this.update()
    } else {
      this.setState({changeColors: false});
    }
  }

  definitelyUpdate() {
    document.getElementById("rowInput").blur()
    document.getElementById("modInput").blur()
    document.getElementById("updateButton").blur()
    this.update()
  }

  update() {
    const n = Number(document.getElementById("rowInput").value)
    const m = Number(document.getElementById("modInput").value)
    const nChanged = this.state.rows !== n
    const mChanged = this.state.modulus !== m
    let newState = {changeColors: true}
    if (mChanged) {
      newState['rows'] = n
      newState['vals'] = pascalsTriangle(n, m)
      newState['colors'] = colorRange(m)
      newState['modulus'] = m
      newState['primes'] = primesWith1(m)
      this.setState(newState)
      
      document.getElementById("primeSliders").reset()
    } else {
      if (nChanged) {
        let vals = this.state.vals
        while (n > vals.length) {
          addRow(vals, m)
        }
        while (n < vals.length) {
          removeRow(vals)
        }
        newState['vals'] = vals
        newState['rows'] = n
      } else {
        if (this.state.changeColors) {
          newState['modulus'] = m
          newState['primes'] = primesWith1(m)
          newState['colors'] = colorRange(m)
          document.getElementById("primeSliders").reset()
        }
      }
    }
    this.setState(newState)
  }

  renderOptions() {
    return (
      <div className="App-options">
        <div className="inputLabel1">Rows</div>
        <input 
          id="rowInput"
          className="input1" 
          type="number" 
          size="3" 
          maxLength="3" 
          defaultValue="32"
          min="1"
          max="150"
          onChange={() => this.maybeUpdate()}
        ></input>
        <div className="inputLabel2">Colors</div>
        <input 
          id="modInput"
          className="input2" 
          type="number" 
          size="3" 
          maxLength="3" 
          defaultValue="2"
          min="1"
          max="35"
        ></input>
        <button
            id="updateButton"
            className="updateButton"
            onClick={() => this.definitelyUpdate()}
          >Redraw</button>
      </div>
    )
  }

  maybeUpdateColors() {
    if (this.autoUpdate()) {
      this.updateColors()
    }
  }

  definitelyUpdateColors() {
    this.updateColors()
  }

  updateColors() {
    let total = 0;
    let primeparts = {};
    for (const p in this.state.primes) {
      const v = Number(document.getElementById(`primeSlider${p}`).value);
      if (p !== 1) {
        primeparts[p] = v;
        total += 8
      } else {
        primeparts[p] = v * .5;
        total += 4;
      }
    }
    let colors = this.state.colors;
    for (const c in colors) {
      let v = 0;
      for (const p in primeparts) {
        if (c % p === 0) {
          v += primeparts[p]
        }
      }
      colors[c].l = 75 * Math.sqrt(v/total) + 5;
      colors[c].s = 65 * Math.sqrt(v/total) + 35;
    }
    this.setState({colors: colors})
  }

  renderPrimeSlider(p) {
    const k = `primeSlider${p}`;
    return (
      <div className="primeSlider" key={`color${p}`}>
        {p}<input 
          key={k}
          id={k}
          type="range"
          min="0"
          max="8"
          step="1"
          defaultValue="4"
          onChange={() => this.maybeUpdateColors()}
        />
      </div>
    )
  }

  renderColorOptions() {
    const primeList = [];
    for (const p in this.state.primes) {
      primeList.push(p)
    }
    return (
      <div className="App-colors">
        <div>
        <input id="autoUpdateCheck"
          type="checkBox"
          />AutoUpdate
        </div>
        <p className="App-colors-title">Emphasize numbers divisible by:</p>
        <form id="primeSliders"
          className="primeSliders">
          {primeList.map(p => this.renderPrimeSlider(p))}
        </form>
        <button
          id="colorButton"
          className="updateButton"
          onClick={() => this.definitelyUpdateColors()}
        >Apply</button>
      </div>
    )
  }

  renderStyle() {
    let styles = []
    for (const k in this.state.colors) {
      styles.push(`.m${k} {fill:${this.state.colors[k]}}`)
    }
    return <style key="PascalColorMap">{styles.join('\n')}</style>
  }

  renderTriangle() {
    return (
      <div className="App-main">
        {this.renderStyle()}
        {renderTriangle(this.state.vals)}
      </div>
    )
  }

  render() {
    return (
      <div className="App">
        <header>
          <strong>Pascal's Triangle</strong>
        </header>
        {this.renderOptions()}
        {this.renderColorOptions()}
        {this.renderTriangle()}
      </div>
    );
  }
}

export default App;
