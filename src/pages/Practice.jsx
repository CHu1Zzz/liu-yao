import { useState } from 'react'
import { randomCast, analyzeHexagram } from '../utils/divination'

const questions = [
  {
    q: '占问事业发展的用神是？',
    options: ['父母爻', '官鬼爻', '妻财爻', '子孙爻'],
    answer: 0,
    explanation: '事业相关应取父母爻，因为父母爻代表文书、合同、庇护、单位等与事业相关的客体。',
  },
  {
    q: '占问财运时，哪个六亲代表钱财？',
    options: ['父母爻', '兄弟爻', '妻财爻', '官鬼爻'],
    answer: 2,
    explanation: '妻财爻代表钱财、妻子、情人、珠宝粮食等。占财运即以妻财爻为用神。',
  },
  {
    q: '六爻中"世爻"代表什么？',
    options: ['他人', '自己', '长辈', '文书'],
    answer: 1,
    explanation: '世爻代表求卦者本人，即"我"。应爻则代表他人或对方。',
  },
  {
    q: '老阳（6）动则会变成？',
    options: ['老阴', '少阳', '少阴', '不变'],
    answer: 2,
    explanation: '老阳（6）为动爻，动则变为少阴。老阴（9）动则变为少阳。这是阴阳互变的基本规则。',
  },
  {
    q: '五行中木克什么？',
    options: ['火', '土', '金', '水'],
    answer: 1,
    explanation: '木克土。五行相克：木克土、土克水、水克火、火克金、金克木。',
  },
  {
    q: '占问子女事情时，用神是？',
    options: ['子孙爻', '妻财爻', '父母爻', '官鬼爻'],
    answer: 0,
    explanation: '子孙爻代表子女、晚辈、六畜、药物、欢乐等。占问子女事即以子孙爻为用神。',
  },
  {
    q: '青龙临官鬼爻通常表示？',
    options: ['大吉', '口舌是非', '伤病凶灾', '财运亨通'],
    answer: 2,
    explanation: '青龙为吉神，但临官鬼爻时反不吉。官鬼爻代表疾病、鬼祟、压力，青龙临之仍有其吉意，但合并官鬼则主伤病。',
  },
  {
    q: '占问文书合同相关事宜，用神是？',
    options: ['子孙爻', '官鬼爻', '父母爻', '妻财爻'],
    answer: 2,
    explanation: '父母爻代表父母、长辈、房屋、车辆、文书合同等庇护之物。',
  },
  {
    q: '朱雀在六神中主要代表？',
    options: ['盗贼', '口舌是非', '伤病', '喜庆'],
    answer: 1,
    explanation: '朱雀为凶神，代表口舌、官非、火灾、书信文书等口舌是非之事。',
  },
  {
    q: '卦中用神旺相且得原神生助，通常表示？',
    options: ['大凶', '小吉', '大吉', '无影响'],
    answer: 2,
    explanation: '用神旺相又得原神生助，是最好的卦象组合，主大吉。若忌神也旺，则吉中带凶。',
  },
]

export default function Practice() {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [streak, setStreak] = useState(0)

  const handleSelect = (idx) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    if (idx === questions[current].answer) {
      setScore(score + 1)
      setStreak(streak + 1)
    } else {
      setStreak(0)
    }
  }

  const next = () => {
    if (current + 1 >= questions.length) {
      setDone(true)
    } else {
      setCurrent(current + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  const restart = () => {
    setCurrent(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setDone(false)
    setStreak(0)
  }

  return (
    <div>
      {/* Header */}
      <section className="page-section page-section--light" style={{ padding: '60px 24px 40px' }}>
        <div className="container--narrow" style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 600, letterSpacing: '-0.028em', marginBottom: 8 }}>互动练习</h1>
          <p className="text代-muted">检验六爻知识掌握程度</p>
        </div>
      </section>

      {/* Quiz */}
      {!done ? (
        <section className="page-section page-section--white">
          <div className="container--narrow">
            {/* Progress */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 14, color: 'var(--color-ink-48)' }}>第 {current + 1} / {questions.length} 题</span>
                {streak >= 2 && (
                  <span style={{ fontSize: 12, color: 'var(--color-primary)', background: 'rgba(0,113,227,0.08)', padding: '2px 10px', borderRadius: 'var(--radius-pill)', fontWeight: 500 }}>
                    连续 {streak} 正确
                  </span>
                )}
              </div>
              <div className="quiz-progress">
                <div className="quiz-progress__bar" style={{ width: `${((current) / questions.length) * 100}%` }} />
              </div>
            </div>

            {/* Question */}
            <div className="card" style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600, lineHeight: 1.3, marginBottom: 0 }}>
                {questions[current].q}
              </h2>
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {questions[current].options.map((opt, idx) => {
                let cls = 'quiz-option'
                if (answered) {
                  if (idx === questions[current].answer) cls += ' quiz-option--correct'
                  else if (idx === selected) cls += ' quiz-option--wrong'
                }
                return (
                  <button key={idx} onClick={() => handleSelect(idx)} className={cls} disabled={answered}>
                    <span style={{
                      width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 500,
                      background: answered && idx === questions[current].answer ? '#34c759' :
                        answered && idx === selected ? '#ff3b30' : 'var(--color-parchment)',
                      color: answered ? 'var(--color-white)' : 'var(--color-ink-muted)',
                      flexShrink: 0
                    }}>
                      {answered && idx === questions[current].answer ? '✓' : answered && idx === selected ? '✗' : String.fromCharCode(65 + idx)}
                    </span>
                    <span style={{ fontSize: 16 }}>{opt}</span>
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            {answered && (
              <div className="card" style={{ background: 'var(--color-parchment)', marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: selected === questions[current].answer ? '#34c759' : '#ff3b30' }}>
                    {selected === questions[current].answer ? '✓ 正确' : '✗ 错误'}
                  </span>
                </h3>
                <p style={{ fontSize: 14, color: 'var(--color-ink-muted)', lineHeight: 1.6 }}>{questions[current].explanation}</p>
              </div>
            )}

            {/* Next */}
            {answered && (
              <button onClick={next} className="btn-primary" style={{ width: '100%' }}>
                {current + 1 >= questions.length ? '查看结果' : '下一题'}
              </button>
            )}
          </div>
        </section>
      ) : (
        /* Results */
        <section className="page-section page-section--light">
          <div className="container--narrow" style={{ textAlign: 'center' }}>
            <div className="card" style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, marginBottom: 16 }}>练习完成</h2>
              <div style={{ fontSize: 80, fontWeight: 200, lineHeight: 1, marginBottom: 8, fontFamily: 'var(--font-display)' }}>
                {score}/{questions.length}
              </div>
              <p style={{ fontSize: 17, color: 'var(--color-ink-muted)' }}>
                {score === questions.length ? '完美！六爻基础扎实' :
                  score >= 7 ? '不错！继续深入学习' :
                    score >= 5 ? '及格，建议回顾基础知识' : '需要加强学习'}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button onClick={restart} className="btn-primary" style={{ width: '100%' }}>重新开始</button>
              <a href="/learn" className="btn-secondary" style={{ width: '100%', textAlign: 'center', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                去学习
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
