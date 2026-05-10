import { useState } from 'react'
import { Link } from 'react-router-dom'
import { coinToss, randomCast, timeCast, analyzeHexagram, buildHexagram } from '../utils/divination'
import { tianGan, diZhi } from '../data/baGua'
import hexagrams from '../data/hexagrams'

export default function Divination() {
  const [step, setStep] = useState(1) // 1: 选择方式, 2: 输入问题, 3: 起卦过程, 4: 结果
  const [method, setMethod] = useState(null) // 'coin' | 'random' | 'time'
  const [question, setQuestion] = useState('')
  const [timeInput, setTimeInput] = useState({ year: '', month: '', day: '', hour: '' })
  const [coinResults, setCoinResults] = useState([])
  const [castResult, setCastResult] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [tossCount, setTossCount] = useState(0)
  const [currentToss, setCurrentToss] = useState([])

  const handleMethod = (m) => {
    setMethod(m)
    setStep(2)
  }

  const handleQuestion = (q) => {
    setQuestion(q)
    if (method === 'coin') {
      setStep(3)
      setTossCount(0)
      setCoinResults([])
      setCurrentToss([])
    } else if (method === 'random') {
      const result = randomCast()
      const ganZhiDay = { gan: '甲', zhi: '子' } // 简化
      setCastResult({ upperGua: '乾', lowerGua: '乾', dongYao: 1 })
      const a = analyzeHexagram({ upperGua: '乾', lowerGua: '乾', dongYao: 1 }, ganZhiDay, q)
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
    const ganZhiDay = { gan: '甲', zhi: '子' }
    setCastResult(result)
    const a = analyzeHexagram(result, ganZhiDay, question)
    setAnalysis(a)
    setStep(4)
  }

  const tossCoin = () => {
    const h = Math.random() > 0.5 ? 'head' : 'tail'
    const newToss = [...currentToss, h]
    setCurrentToss(newToss)

    if (newToss.length === 3) {
      const yao = h === 'head' ? '阳' : '阴'
      const newResults = [...coinResults, { toss: newToss, yao }]
      setCoinResults(newResults)
      setCurrentToss([])
      setTossCount(tossCount + 1)

      if (tossCount + 1 >= 6) {
        // 完成
        const heads = newResults.map(r => r.yao === '阳')
        // 简化：生成卦象
        const upper = heads.slice(0, 3).filter(Boolean).length >= 2 ? '乾' : '坤'
        const lower = heads.slice(3, 6).filter(Boolean).length >= 2 ? '乾' : '坤'
        const dongYao = (Math.floor(Math.random() * 6) + 1)
        setCastResult({ upperGua: upper, lowerGua: lower, dongYao })
        const ganZhiDay = { gan: '甲', zhi: '子' }
        const a = analyzeHexagram({ upperGua: upper, lowerGua: lower, dongYao }, ganZhiDay, question)
        setAnalysis(a)
        setStep(4)
      }
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
    setCurrentToss([])
  }

  return (
    <div>
      {/* Header */}
      <section className="section-parchment text-center py-12">
        <h1 className="text-[40px] font-semibold tracking-tight mb-3">起卦</h1>
        <p className="text-[17px] text-[#86868b]">选择起卦方式，开始六爻占卜</p>
      </section>

      {/* Step 1: 选择方式 */}
      {step === 1 && (
        <section className="section-light">
          <div className="max-w-[600px] mx-auto">
            <h2 className="text-[24px] font-semibold text-center mb-8">选择起卦方式</h2>
            <div className="space-y-4">
              {[
                { key: 'coin', title: '硬币起卦', desc: '三枚硬币摇六次，得出卦象', sub: '传统法' },
                { key: 'random', title: '随机起卦', desc: '系统自动生成，快速简便', sub: '便捷法' },
                { key: 'time', title: '时间起卦', desc: '输入年月日时，推算卦象动爻', sub: '梅花法' },
              ].map(({ key, title, desc, sub }) => (
                <button
                  key={key}
                  onClick={() => handleMethod(key)}
                  className="w-full card text-left hover:border-primary transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-[17px] font-semibold">{title}</h3>
                      <p className="text-[14px] text-[#86868b]">{desc}</p>
                    </div>
                    <span className="text-[12px] text-primary bg-[#0066cc0d] px-2 py-1 rounded-full">{sub}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Step 2: 输入问题 */}
      {step === 2 && (
        <section className="section-light">
          <div className="max-w-[600px] mx-auto">
            <h2 className="text-[24px] font-semibold text-center mb-2">请输入占问之事</h2>
            <p className="text-[14px] text-[#86868b] text-center mb-8">描述您想占问的事情，如：工作运势如何？</p>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="例如：我的事业发展如何？"
              className="w-full border border-[#e0e0e0] rounded-[12px] p-4 text-[17px] resize-none h-[120px] focus:outline-none focus:border-primary"
            />
            <div className="mt-6 space-y-3">
              <button onClick={() => handleQuestion(question)} className="w-full btn-primary">
                确定并{method === 'coin' ? '开始摇卦' : method === 'time' ? '选择时间' : '起卦'}
              </button>
              <button onClick={() => setStep(1)} className="w-full btn-secondary">返回</button>
            </div>
          </div>
        </section>
      )}

      {/* Step 3: 硬币起卦过程 */}
      {step === 3 && method === 'coin' && (
        <section className="section-light text-center">
          <div className="max-w-[400px] mx-auto">
            <h2 className="text-[24px] font-semibold mb-2">第 {tossCount + 1} 爻</h2>
            <p className="text-[14px] text-[#86868b] mb-8">
              请摇动三枚硬币，然后记录正面（花）朝上的数量
            </p>
            <div className="text-[64px] mb-8">
              {currentToss.length === 0 ? '◎◎◎' : currentToss.map((t, i) => (
                <span key={i}>{t === 'head' ? '🪙' : '◎'}</span>
              ))}
            </div>
            <div className="text-[48px] mb-8">{coinResults.length}/6 爻</div>
            <div className="space-y-3">
              {['3个正面(阳爻)', '2个正面(阴爻)', '1个正面(阴爻)', '0个正面(阳爻)'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    const yao = opt.includes('阳') ? '阳' : '阴'
                    const newResults = [...coinResults, { toss: [], yao }]
                    setCoinResults(newResults)
                    setTossCount(tossCount + 1)
                    if (tossCount + 1 >= 6) {
                      const heads = newResults.map(r => r.yao === '阳')
                      const upper = heads.slice(0, 3).filter(Boolean).length >= 2 ? '乾' : '坤'
                      const lower = heads.slice(3, 6).filter(Boolean).length >= 2 ? '乾' : '坤'
                      const dongYao = (Math.floor(Math.random() * 6) + 1)
                      setCastResult({ upperGua: upper, lowerGua: lower, dongYao })
                      const a = analyzeHexagram({ upperGua: upper, lowerGua: lower, dongYao }, { gan: '甲', zhi: '子' }, question)
                      setAnalysis(a)
                      setStep(4)
                    }
                  }}
                  className="w-full card text-center hover:border-primary transition-colors cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Step 3: 时间起卦 */}
      {step === 3 && method === 'time' && (
        <section className="section-light">
          <div className="max-w-[400px] mx-auto">
            <h2 className="text-[24px] font-semibold text-center mb-8">输入占卜时间</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[14px] text-[#86868b] block mb-1">年</label>
                <input
                  type="number"
                  value={timeInput.year}
                  onChange={(e) => setTimeInput({ ...timeInput, year: e.target.value })}
                  placeholder="2025"
                  className="w-full border border-[#e0e0e0] rounded-[12px] p-3 text-[17px] focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[14px] text-[#86868b] block mb-1">月</label>
                  <input
                    type="number"
                    value={timeInput.month}
                    onChange={(e) => setTimeInput({ ...timeInput, month: e.target.value })}
                    placeholder="1-12"
                    className="w-full border border-[#e0e0e0] rounded-[12px] p-3 text-[17px] focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-[14px] text-[#86868b] block mb-1">日</label>
                  <input
                    type="number"
                    value={timeInput.day}
                    onChange={(e) => setTimeInput({ ...timeInput, day: e.target.value })}
                    placeholder="1-31"
                    className="w-full border border-[#e0e0e0] rounded-[12px] p-3 text-[17px] focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="text-[14px] text-[#86868b] block mb-1">时辰（24小时制）</label>
                <input
                  type="number"
                  value={timeInput.hour}
                  onChange={(e) => setTimeInput({ ...timeInput, hour: e.target.value })}
                  placeholder="0-23"
                  className="w-full border border-[#e0e0e0] rounded-[12px] p-3 text-[17px] focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <button onClick={handleTimeSubmit} className="w-full btn-primary">起卦</button>
              <button onClick={() => setStep(2)} className="w-full btn-secondary">返回</button>
            </div>
          </div>
        </section>
      )}

      {/* Step 4: 结果 */}
      {step === 4 && castResult && analysis && (
        <section className="section-light">
          <div className="max-w-[700px] mx-auto">
            {/* 卦名 */}
            <div className="text-center mb-8">
              <div className="text-[72px] mb-2">{castResult.upperGua}{castResult.lowerGua}</div>
              <h2 className="text-[32px] font-semibold">{analysis.hexagramName}</h2>
              <p className="text-[14px] text-[#86868b]">第 {analysis.dongYao} 爻动</p>
            </div>

            {/* 六爻 */}
            <div className="card mb-6">
              <h3 className="text-[17px] font-semibold mb-4">六爻排列</h3>
              <div className="space-y-2">
                {['上', '五', '四', '三', '二', '初'].map((pos, idx) => {
                  const isDong = (6 - analysis.dongYao) === idx
                  const yaoType = isDong ? '老阳' : '少阴'
                  const yaoSymbol = yaoType.includes('阳') ? '—' : '- -'
                  return (
                    <div key={pos} className="flex items-center justify-between text-[15px] p-2 bg-[#f5f5f7] rounded">
                      <span className="text-[#86868b] w-6">{pos}</span>
                      <span className="font-mono text-[20px] tracking-widest">
                        {isDong ? <span className="text-primary">{yaoSymbol} ○</span> : <span className="text-[#86868b]">{yaoSymbol}</span>}
                      </span>
                      <span className="text-[14px] text-[#86868b]">{isDong ? yaoType + '（动）' : yaoType}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 用神 */}
            <div className="card mb-6">
              <h3 className="text-[17px] font-semibold mb-2">用神选取</h3>
              <p className="text-[15px] mb-1"><span className="font-semibold">{analysis.yongShen.name}</span> - {analysis.yongShen.description}</p>
              <p className="text-[13px] text-[#86868b]">{analysis.yongShen.reason}</p>
            </div>

            {/* 世应 */}
            <div className="card mb-6">
              <h3 className="text-[17px] font-semibold mb-2">世应关系</h3>
              <p className="text-[15px]">世爻位于第 {6 - analysis.dongYao + 1} 爻，应爻位于第 {((6 - analysis.dongYao + 3) % 6) + 1} 爻</p>
              <p className="text-[13px] text-[#86868b] mt-1">世为自己，应为他人或对方</p>
            </div>

            {/* 经典原文 */}
            <div className="card mb-6">
              <h3 className="text-[17px] font-semibold mb-4">经典原文</h3>
              <div className="space-y-4">
                {Object.entries(analysis.originalText).map(([book, text]) => (
                  <div key={book} className="border-l-2 border-primary pl-4">
                    <p className="text-[13px] font-semibold text-primary mb-1">{book}</p>
                    <p className="text-[14px] text-[#333]">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 操作 */}
            <div className="space-y-3">
              <button onClick={reset} className="w-full btn-primary">重新起卦</button>
              <Link to="/learn" className="block w-full btn-secondary text-center">学习六爻知识</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
