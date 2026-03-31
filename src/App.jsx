import { useState } from 'react'
import './App.css'

const YEAR = 2026

const INHABILES_DATA = {
  cna: [
    "2026-01-01","2026-01-02",
    "2026-02-02",
    "2026-03-16","2026-03-30","2026-03-31",
    "2026-04-01","2026-04-02","2026-04-03",
    "2026-05-01","2026-05-05",
    "2026-07-20","2026-07-21","2026-07-22","2026-07-23","2026-07-24",
    "2026-07-27","2026-07-28","2026-07-29","2026-07-30","2026-07-31",
    "2026-09-16","2026-11-16","2026-12-25",
  ],
  pjcdmx: [
    "2026-01-01","2026-01-02","2026-01-05","2026-01-06",
    "2026-02-02",
    "2026-03-16","2026-03-30","2026-03-31",
    "2026-04-01","2026-04-02","2026-04-03",
    "2026-05-01","2026-05-04","2026-05-08",
    "2026-06-19",
    "2026-07-15","2026-07-16","2026-07-17",
    "2026-07-20","2026-07-21","2026-07-22","2026-07-23","2026-07-24",
    "2026-07-27","2026-07-28","2026-07-29","2026-07-30","2026-07-31",
    "2026-09-14","2026-09-15","2026-09-16",
    "2026-10-30",
    "2026-11-02","2026-11-16",
    "2026-12-16","2026-12-17","2026-12-18",
    "2026-12-21","2026-12-22","2026-12-23","2026-12-24",
    "2026-12-25",
    "2026-12-28","2026-12-29","2026-12-30","2026-12-31",
  ],
  pjf: [
    "2026-01-01",
    "2026-02-02","2026-02-05",
    "2026-03-16",
    "2026-04-01","2026-04-02","2026-04-03",
    "2026-05-01","2026-05-04","2026-05-05",
    "2026-07-16","2026-07-17",
    "2026-07-20","2026-07-21","2026-07-22","2026-07-23","2026-07-24",
    "2026-07-27","2026-07-28","2026-07-29","2026-07-30","2026-07-31",
    "2026-09-14","2026-09-15","2026-09-16",
    "2026-10-12",
    "2026-11-02","2026-11-16","2026-11-20",
    "2026-12-16","2026-12-17","2026-12-18",
    "2026-12-21","2026-12-22","2026-12-23","2026-12-24",
    "2026-12-25",
    "2026-12-28","2026-12-29","2026-12-30","2026-12-31",
  ],
}

const INH = {
  cna:    new Set(INHABILES_DATA.cna),
  pjcdmx: new Set(INHABILES_DATA.pjcdmx),
  pjf:    new Set(INHABILES_DATA.pjf),
}

const CALS = [
  { id:'cna',    label:'CNA (Comisión Nacional Antimonopolio)', primary:'#185FA5', surface:'#E6F1FB', border:'#B5D4F4', t800:'#0C447C', nota:'Fuente: Acuerdo de Pleno CNA, DOF dic 2024. Receso dic 2026 pendiente.', warn:true  },
  { id:'pjcdmx', label:'P.J. Ciudad de México',                primary:'#0F6E56', surface:'#E1F5EE', border:'#9FE1CB', t800:'#085041', nota:'Fuente: Calendario oficial PJCDMX 2026.', warn:false },
  { id:'pjf',    label:'P.J. Federal (OAJ / SCJN)',            primary:'#534AB7', surface:'#EEEDFE', border:'#CECBF6', t800:'#3C3489', nota:'Fuente: oaj.gob.mx · Circular 3/2026 · Arts. 19 LA, 229 y 76 LOPJF.', warn:false },
]

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function dk(y, m, d) {
  return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
}
function dim(y, m) { return new Date(y, m+1, 0).getDate() }
function off(y, m) { return (new Date(y, m, 1).getDay() + 6) % 7 }
function getToday() {
  const t = new Date()
  return dk(t.getFullYear(), t.getMonth(), t.getDate())
}
function countDays(id) {
  const inh = INH[id]; let h = 0, i = 0
  for (let m = 0; m < 12; m++)
    for (let d = 1; d <= dim(YEAR, m); d++) {
      const dow = (new Date(YEAR, m, d).getDay() + 6) % 7
      if (dow >= 5) continue
      inh.has(dk(YEAR, m, d)) ? i++ : h++
    }
  return { h, i }
}
function Mes({ m, cal, hoy }) {
  const C = 17
  const dias = dim(YEAR, m)
  const offset = off(YEAR, m)
  const inh = INH[cal.id]
  const celdas = []

  for (let i = 0; i < offset; i++)
    celdas.push(<div key={`e${i}`} style={{ width: C, height: C }} />)

  for (let d = 1; d <= dias; d++) {
    const k = dk(YEAR, m, d)
    const isHoy = k === hoy
    const isInh = inh.has(k)
    const dow = (offset + d - 1) % 7
    const isSat = dow === 5
    const isSun = dow === 6
    const isWkd = isSat || isSun
    let bg = 'transparent', color = 'var(--color-text, #111)', fw = '400', r = '3px'
    if (isHoy)              { bg = cal.primary; color = 'white'; fw = '500'; r = '50%' }
    else if (isInh && !isWkd) { bg = '#F7C1C1'; color = '#791F1F'; fw = '500'; r = '50%' }
    else if (isInh && isWkd)  { color = '#E24B4A'; fw = '500' }
    else if (isSun)           { color = '#E24B4A' }
    else if (isSat)           { color = '#888' }

    celdas.push(
      <div key={k} style={{ width:C, height:C, borderRadius:r, background:bg,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:10, fontWeight:fw, color }}>
        {d}
      </div>
    )
  }

  return (
    <div style={{ padding:'10px 8px 9px', width:'fit-content', margin:'0 auto' }}>
      <div style={{ fontSize:11, fontWeight:500, color:'#888',
        textTransform:'uppercase', letterSpacing:'.07em', marginBottom:7 }}>
        {MESES[m]}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:`repeat(7,${C}px)`, gap:2, marginBottom:3 }}>
        {['L','M','X','J','V','S','D'].map(x =>
          <div key={x} style={{ width:C, textAlign:'center', fontSize:9, color:'#888', fontWeight:500 }}>{x}</div>
        )}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:`repeat(7,${C}px)`, gap:2 }}>
        {celdas}
      </div>
    </div>
  )
}
export default function App() {
  const [active, setActive] = useState('cna')
  const cal = CALS.find(c => c.id === active)
  const hoy = getToday()
  const { h, i } = countDays(active)

  return (
    <div style={{ maxWidth:900, width: '100%', margin:'0 auto', padding:'24px 16px', fontFamily:'system-ui, sans-serif', boxSizing:'border-box' }}>

      {/* Encabezado */}
      <div style={{ marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:10, flexWrap:'wrap' }}>
          <span style={{ fontSize:18, fontWeight:500 }}>Calendario jurídico</span>
          <span style={{ fontSize:12, fontWeight:500, color:'white', padding:'2px 10px',
            borderRadius:100, background:cal.primary }}>2026</span>
        </div>
        <p style={{ margin:'4px 0 0', fontSize:12, color:'#888' }}>
          DELAFUENTE · Competencia Económica y Regulación
        </p>
      </div>

      {/* Toggle */}
      <div style={{ display:'inline-flex', border:'0.5px solid #ccc', borderRadius:100,
        overflow:'hidden', marginBottom:13 }}>
        {CALS.map((c, idx) => (
          <button key={c.id} onClick={() => setActive(c.id)} style={{
            padding:'7px 16px', border:'none', cursor:'pointer',
            fontFamily:'inherit', fontSize:12,
            borderLeft: idx > 0 ? '0.5px solid #ddd' : 'none',
            borderRadius: idx === 0 ? '100px 0 0 100px' : idx === CALS.length-1 ? '0 100px 100px 0' : 0,
            background: c.id === active ? c.primary : 'transparent',
            color: c.id === active ? 'white' : '#666',
            fontWeight: c.id === active ? 500 : 400,
          }}>
            {c.id === 'cna' ? 'CNA' : c.id === 'pjcdmx' ? 'PJ-CDMX' : 'PJ-Federal'}
          </button>
        ))}
      </div>

      {/* Info strip */}
      <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap',
        padding:'9px 14px', borderRadius:8, marginBottom:14, width:'fit-content',
        background:cal.surface, border:`0.5px solid ${cal.border}`,
        borderLeft:`3px solid ${cal.primary}` 
        }}>
        <span style={{ fontSize:13, fontWeight:500, color:cal.t800 }}>{cal.label}</span>
        <span style={{ fontSize:12, color:'#666' }}>
          · <b style={{ color:'#111' }}>{h}</b> días hábiles
          · <b style={{ color:'#791F1F' }}>{i}</b> inhábiles
        </span>
      </div>

      {/* Grid de meses */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 155fr)', gap:7, width:'fit-content' }}>
        {Array.from({ length:12 }, (_, m) => (
          <div key={m} style={{ background:'white', border:'0.5px solid #e5e5e5', borderRadius:12, 
          display:'flex', justifyContent:'center' }}>
            <Mes m={m} cal={cal} hoy={hoy} />
          </div>
        ))}
      </div>

      {/* Nota de fuente */}
      <div style={{ marginTop:12, padding:'9px 12px', borderRadius:8,
        background: cal.warn ? '#FAEEDA' : '#f5f5f5',
        border: `0.5px solid ${cal.warn ? '#FAC775' : '#e5e5e5'}` }}>
        <span style={{ fontSize:11, color: cal.warn ? '#633806' : '#888', lineHeight:1.5 }}>
          {cal.warn ? '⚠ ' : ''}{cal.nota}
        </span>
      </div>

    </div>
  )
}
