import { useState } from 'react'
import { Link } from 'react-router-dom'
import { coinToss, randomCast, timeCast, analyzeHexagram, yaoValuesToHexagram } from '../utils/divination'

export default function Divination() {
  const [step, setStep] = useState(1)
  const [method, setMethod] = useState(null)
  const [question, setQuestion] = useState('')
  const [timeInput, setTimeInput] = useState({ year: '', month: '', day: '', hour: '' })
  const [coinResults, setCoinResults] = useState([])
  const [castResult, setCastResult] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [tossCount, setTossCount] = useState(0)

  const handleMethod = (m) => {
    setMethod(m)
    setStep(2)
  }

  const getTodayGanZhi = () => {
    const now = new Date()
    const baseYear = 1984
    const yearDiff = now.getFullYear() - baseYear
    const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
    const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
    const dayCount = Math.floor((now - new Date(baseYear, 0, 1)) / (1000 * 60 * 60 * 24))
    return { gan: tianGan[dayCount % 10], zhi: diZhi[dayCount % 12] }
  }

  const handleQuestion = (q) => {
    setQuestion(q)
    if (method === 'coin') {
      setStep(3)
      setTossCount(0)
      setCoinResults([])
    } else if (method === 'random') {
      const yaoValues = randomCast()
      const hex = yaoValuesToHexagram(yaoValues)
      const ganZhiDay = getTodayGanZhi()
      setCastResult(hex)
      const a = analyzeHexagram(hex, ganZhiDay, q, yaoValues)
      setAnalysis(a)
      setStep(4)
    } else if (method === 'time') {
      setStep(3)
    }
  }

  const handleTimeSubmit = () => {
    const { year, month, day, hour } = timeInput
    if (!year || !month || !day || !hour) return
    const result = timeCast(parseInt(year), parseInt(month), parseInt(day), parseInt(hour))
    const ganZhiDay = getTodayGanZhi()
    setCastResult(result)
    const a = analyzeHexagram(result, ganZhiDay, question)
    setAnalysis(a)
    setStep(4)
  }

  const recordToss = (yinCount) => {
    const newResults = [...coinResults, yinCount]
    setCoinResults(newResults)
    setTossCount(tossCount + 1)

    if (tossCount + 1 >= 6) {
      const yaoValues = []
      // 硬币：正面(花)=3，反面=2
      // 3枚相加：6=老阳(阳动)，7=少阳(阳)，8=少阴(阴)，9=老阴(阴动)
      const sumMap = { 0: 6, 1: 7, 2: 8, 3: 9 }
      const typeMap = { 0: '老阴', 1: '少阳', 2: '少阴', 3: '老阳' }
      const changeMap = { 0: '阳', 1: null, 2: null, 3: '阴' }
      for (let i = 0; i < 6; i++) {
        const heads = newResults[i]
        yaoValues.push({
          value: sumMap[heads],
          type: typeMap[heads],
          change: changeMap[heads],
        })
      }
      const hex = yaoValuesToHexagram(yaoValues)
      const ganZhiDay = getTodayGanZhi()
      const castRes = { upperGua: hex.upperGua, lowerGua: hex.lowerGua, dongYao: hex.dongYao }
      setCastResult(castRes)
      const a = analyzeHexagram(castRes, ganZhiDay, question, yaoValues)
      setAnalysis(a)
      setStep(4)
    }
  }

  const reset = () => {
    setStep(1)
    setMethod(null)
    setQuestion('')
    setCoinResults([])
    setCastResult(null)
    setAnalysis(null)
    setTossCount(0)
    setTimeInput({ year: '', month: '', day: '', hour: '' })
  }

  const getYinYangSymbol = (yinCount) => {
    if (yinCount === 3) return { symbol: '—', type: '阳爻' }
    if (yinCount === 2) return { symbol: '- -', type: '阴爻' }
    return null
  }

  return (
    <div>
      {/* Header */}
      <section className="page-section page-section--light" style={{ padding: '60px 24px 40px' }}>
        <div className="container--narrow" style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 600, letterSpacing: '-0.028em', marginBottom: 8 }}>起卦</h1>
          <p className="text代-muted">选择起卦方式，开始六爻占卜</p>
        </div>
      </section>

      {/* Step 1: 选择方式 */}
      {step === 1 && (
        <section className="page-section page-section--white">
          <div className="container--narrow">
            <div className="feature-grid--3">
              {[
                { key: 'coin', title: '硬币起卦', desc: '三枚硬币摇六次，得出卦象', sub: '传统法' },
                { key: 'random', title: '随机起卦', desc: '系统自动生成，快速简便', sub: '便捷法' },
                { key: 'time', title: '时间起卦', desc: '输入年月日时，推算卦象动爻', sub: '梅花法' },
              ].map(({ key, title, desc, sub }) => (
                <button
                  key={key}
                  onClick={() => handleMethod(key)}
                  className="card"
                  style={{ cursor: 'pointer', textAlign: 'left', border: 'none', background: 'var(--color-white)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 600 }}>{title}</h3>
                    <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-primary)', background: 'rgba(0,113,227,0.08)', padding: '3px 10px', borderRadius: 'var(--radius-pill)' }}>{sub}</span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--color-ink-muted)' }}>{desc}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Step 2: 输入问题 */}
      {step === 2 && (
        <section className="page-section page-section--white">
          <div className="container--narrow">
            <h2 style={{ fontSize: 24, fontWeight: 600, textAlign: 'center', marginBottom: 8 }}>请输入占问之事</h2>
            <p style={{ fontSize: 14, color: 'var(--color-ink-muted)', textAlign: 'center', marginBottom: 32 }}>描述您想占问的事情</p>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="例如：我的事业发展如何？"
              className="card"
              style={{
                width: '100%',
                border: '1px solid var(--color-hairline)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                fontSize: 17,
                resize: 'none',
                height: 120,
                fontFamily: 'var(--font-body)',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--color-hairline)'}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
              <button onClick={() => handleQuestion(question)} className="btn-primary" style={{ width: '100%' }}>
                确定并{method === 'coin' ? '开始摇卦' : method === 'time' ? '选择时间' : '起卦'}
              </button>
              <button onClick={() => setStep(1)} className="btn-secondary" style={{ width: '100%' }}>返回</button>
            </div>
          </div>
        </section>
      )}

      {/* Step 3: 硬币起卦 */}
      {step === 3 && method === 'coin' && (
        <section className="page-section page-section--white">
          <div className="container--narrow" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>第 {tossCount + 1} 爻</h2>
            <p style={{ fontSize: 14, color: 'var(--color-ink-muted)', marginBottom: 32 }}>请记录正面（花）朝上的数量</p>
            <div style={{ fontSize: 64, marginBottom: 32 }}>
              {coinResults.length < 6 ? `◎◎◎` : '完成'}
            </div>
            <p style={{ fontSize: 17, color: 'var(--color-ink-muted)', marginBottom: 24 }}>{coinResults.length} / 6 爻</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { count: 3, label: '3个正面（阳爻）' },
                { count: 2, label: '2个正面（阴爻）' },
                { count: 1, label: '1个正面（阴爻）' },
                { count: 0, label: '0个正面（阳爻）' },
              ].map(({ count, label }) => (
                <button
                  key={count}
                  onClick={() => recordToss(count)}
                  className="card"
                  style={{ cursor: 'pointer', textAlign: 'center', border: 'none', background: 'var(--color-white)', padding: '18px' }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{count === 3 ? '🪙🪙🪙' : count === 2 ? '🪙🪙◎' : count === 1 ? '🪙◎◎' : '◎◎◎'}</div>
                  <span style={{ fontSize: 14 }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Step 3: 时间起卦 */}
      {step === 3 && method === 'time' && (
        <section className="page-section page-section--white">
          <div className="container--narrow">
            <h2 style={{ fontSize: 24, fontWeight: 600, textAlign: 'center', marginBottom: 32 }}>输入占卜时间</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 14, color: 'var(--color-ink-muted)', display: 'block', marginBottom: 6 }}>年</label>
                <input
                  type="number"
                  value={timeInput.year}
                  onChange={(e) => setTimeInput({ ...timeInput, year: e.target.value })}
                  placeholder="2025"
                  className="card"
                  style={{ width: '100%', border: '1px solid var(--color-hairline)', borderRadius: 'var(--radius-md)', padding: '14px 16px', fontSize: 17, outline: 'none' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 14, color: 'var(--color-ink-muted)', display: 'block', marginBottom: 6 }}>月</label>
                  <input
                    type="number"
                    value={timeInput.month}
                    onChange={(e) => setTimeInput({ ...timeInput, month: e.target.value })}
                    placeholder="1-12"
                    className="card"
                    style={{ width: '100%', border: '1px solid var(--color-hairline)', borderRadius: 'var(--radius-md)', padding: '14px 16px', fontSize: 17, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 14, color: 'var(--color-ink-muted)', display: 'block', marginBottom: 6 }}>日</label>
                  <input
                    type="number"
                    value={timeInput.day}
                    onChange={(e) => setTimeInput({ ...timeInput, day: e.target.value })}
                    placeholder="1-31"
                    className="card"
                    style={{ width: '100%', border: '1px solid var(--color-hairline)', borderRadius: 'var(--radius-md)', padding: '14px 16px', fontSize: 17, outline: 'none' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 14, color: 'var(--color-ink-muted)', display: 'block', marginBottom: 6 }}>时辰（24小时制）</label>
                <input
                  type="number"
                  value={timeInput.hour}
                  onChange={(e) => setTimeInput({ ...timeInput, hour: e.target.value })}
                  placeholder="0-23"
                  className="card"
                  style={{ width: '100%', border: '1px solid var(--color-hairline)', borderRadius: 'var(--radius-md)', padding: '14px 16px', fontSize: 17, outline: 'none' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
              <button onClick={handleTimeSubmit} className="btn-primary" style={{ width: '100%' }}>起卦</button>
              <button onClick={() => setStep(2)} className="btn-secondary" style={{ width: '100%' }}>返回</button>
            </div>
          </div>
        </section>
      )}

      {/* Step 4: 结果 */}
      {step === 4 && castResult && analysis && (
        <section className="page-section page-section--light">
          <div className="container--narrow">
            {/* 卦名 */}
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <div className="hexagram-display">{castResult.upperGua}{castResult.lowerGua}</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600, marginBottom: 8 }}>{analysis.hexagramName}</h2>
              <p style={{ fontSize: 14, color: 'var(--color-ink-muted)' }}>第 {analysis.dongYao} 爻动</p>
            </div>

            {/* 六爻 */}
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>六爻排列</h3>
              <div className="yao-grid">
                {['上', '五', '四', '三', '二', '初'].map((pos, idx) => {
                  const isDong = (6 - analysis.dongYao) === idx
                  const yaoType = analysis.yaoInfo[idx]?.type || (isDong ? '老阳' : '少阴')
                  return (
                    <div key={pos} className={`yao-row ${isDong ? 'yao-row--active' : ''}`}>
                      <span style={{ width: 32, fontSize: 14, color: 'var(--color-ink-48)' }}>{pos}</span>
                      <span className={`yao-symbol ${isDong ? 'yao-symbol--dong' : 'yao-symbol--yang'}`}>
                        {isDong ? '— ○' : '—'}
                      </span>
                      <span style={{ fontSize: 14, color: isDong ? 'var(--color-primary)' : 'var(--color-ink-48)' }}>
                        {yaoType}{isDong ? '（动）' : ''}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 用神 */}
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>用神选取</h3>
              <p style={{ fontSize: 17, marginBottom: 4 }}>
                <span style={{ fontWeight: 600 }}>{analysis.yongShen.name}</span>
                <span style={{ color: 'var(--color-ink-muted)', marginLeft: 8 }}>{analysis.yongShen.description}</span>
              </p>
              <p style={{ fontSize: 13, color: 'var(--color-ink-48)' }}>{analysis.yongShen.reason}</p>
            </div>

            {/* 经典原文 */}
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>经典原文</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {Object.entries(analysis.originalText).map(([book, text]) => (
                  <div key={book} style={{ borderLeft: '2px solid var(--color-primary)', paddingLeft: 16 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', marginBottom: 6 }}>{book}</p>
                    <p style={{ fontSize: 14, color: 'var(--color-ink)', lineHeight: 1.6 }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 操作 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button onClick={reset} className="btn-primary" style={{ width: '100%' }}>重新起卦</button>
              <Link to="/learn" className="btn-secondary" style={{ width: '100%', textAlign: 'center' }}>学习六爻知识</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
