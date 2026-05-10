import { useState } from 'react'

const questions = [
  {
    id: 1,
    question: '朋友最近事业不顺，来占卜。你会选取哪个用神？',
    options: ['官鬼爻', '父母爻', '子孙爻', '妻财爻'],
    answer: 0,
    explanation: '事业工作相关的事宜，以官鬼爻为用神。官鬼代表上司、官员、事业、担忧之事。',
    category: '用神选取',
  },
  {
    id: 2,
    question: '占问父亲身体状况，应用哪个爻为用神？',
    options: ['兄弟爻', '子孙爻', '父母爻', '官鬼爻'],
    answer: 2,
    explanation: '占问父母之事，以父母爻为用神。父亲为男性长辈，属父母辈。',
    category: '用神选取',
  },
  {
    id: 3,
    question: '占问今日财运，应该看哪个爻？',
    options: ['子孙爻生财', '妻财爻', '官鬼爻', '兄弟爻劫财'],
    answer: 1,
    explanation: '财运相关以妻财爻为用神。妻财代表钱财、可支配之物，是判断财运的核心。',
    category: '用神选取',
  },
  {
    id: 4,
    question: '「世」爻在六爻中代表什么？',
    options: ['他人', '自己', '事情结果', '时间'],
    answer: 1,
    explanation: '世爻代表自己，是卦象中"我"的位置。所有分析都围绕世爻与其他爻的关系展开。',
    category: '世应关系',
  },
  {
    id: 5,
    question: '占卜时用神旺相，以下哪种情况最吉利？',
    options: ['用神被月建克制', '用神得日建生助', '用神被动爻克伤', '用神临玄武'],
    answer: 1,
    explanation: '用神得日月生助为旺相，最吉利。日建月建代表天时，能生助用神则用神有力。',
    category: '旺相休囚',
  },
  {
    id: 6,
    question: '动爻为「老阴」（9）时，会变为什么爻？',
    options: ['少阳', '老阳', '少阴', '不变'],
    answer: 2,
    explanation: '老阴（6和9中的9）为老阴，动则变阳，变为少阴爻。动变是六爻预测变化的核心。',
    category: '动变规则',
  },
  {
    id: 7,
    question: '青龙临官鬼爻，通常预示什么？',
    options: ['大凶之事', '吉凶参半', '有贵人相助的事业运', '破财'],
    answer: 2,
    explanation: '青龙为吉神，官鬼代表事业官运。青龙临官鬼，主事业上有贵人扶持、晋升之象。',
    category: '六神判断',
  },
  {
    id: 8,
    question: '兄弟爻动而克妻财爻，代表什么？',
    options: ['有财运', '破财损财', '事业顺利', '身体好'],
    answer: 1,
    explanation: '兄弟为劫财之神，兄弟爻动则克妻财。妻财代表钱财，故兄弟动主破财损财之象。',
    category: '六亲生克',
  },
  {
    id: 9,
    question: '原神的作用是什么？',
    options: ['克制用神', '生助用神', '与用神同类', '代表他人'],
    answer: 1,
    explanation: '原神是生助用神之爻。用神如得我之原神生助，则更加旺相有力，大吉之象。',
    category: '原神忌神',
  },
  {
    id: 10,
    question: '占问子女生育情况，应以什么爻为用神？',
    options: ['官鬼爻', '子孙爻', '父母爻', '兄弟爻'],
    answer: 1,
    explanation: '子孙爻代表子女、晚辈、福神。占问子女生育、子女健康等，皆以子孙爻为用神。',
    category: '用神选取',
  },
]

export default function Practice() {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [history, setHistory] = useState([])

  const q = questions[current]

  const handleSelect = (idx) => {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    const correct = idx === q.answer
    if (correct) setScore(s => s + 1)
    setHistory(h => [...h, { q: q.id, correct, selected: idx, answer: q.answer }])
  }

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
      setAnswered(false)
    } else {
      setDone(true)
    }
  }

  const restart = () => {
    setCurrent(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setDone(false)
    setHistory([])
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div>
        <section className="section-light text-center">
          <div className="max-w-[500px] mx-auto">
            <div className="text-[80px] mb-4">{pct >= 80 ? '✦' : pct >= 60 ? '◈' : '◇'}</div>
            <h1 className="text-[36px] font-semibold mb-2">练习完成</h1>
            <p className="text-[48px] font-semibold text-primary mb-2">{score}/{questions.length}</p>
            <p className="text-[17px] text-[#86868b] mb-8">
              {pct >= 80 ? '优秀！六爻基础扎实' : pct >= 60 ? '良好，继续努力' : '建议复习基础知识'}
            </p>
            <button onClick={restart} className="btn-primary">再练一次</button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <section className="section-parchment text-center py-12">
        <h1 className="text-[40px] font-semibold tracking-tight mb-3">练习中心</h1>
        <p className="text-[17px] text-[#86868b]">检验你的六爻知识掌握程度</p>
      </section>

      {/* Progress */}
      <section className="section-light py-4 border-b border-[#e0e0e0]">
        <div className="max-w-[700px] mx-auto">
          <div className="flex items-center justify-between text-[14px] text-[#86868b] mb-2">
            <span>第 {current + 1} / {questions.length} 题</span>
            <span>得分: {score}</span>
          </div>
          <div className="h-[4px] bg-[#e0e0e0] rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${((current) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* Question */}
      <section className="section-light">
        <div className="max-w-[600px] mx-auto">
          <div className="card mb-6">
            <span className="text-[12px] text-primary bg-[#0066cc0d] px-2 py-1 rounded-full">
              {q.category}
            </span>
            <h2 className="text-[19px] font-semibold mt-3 leading-snug">{q.question}</h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              let cls = 'card hover:border-[#86868b]'
              if (answered) {
                if (idx === q.answer) cls += ' border-primary bg-[#0066cc0d]'
                else if (idx === selected) cls += ' border-red-500 bg-red-50'
              } else {
                cls += selected === idx ? ' border-primary' : ''
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left transition-colors ${cls}`}
                  disabled={answered}
                >
                  <span className="text-[17px]">{opt}</span>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {answered && (
            <div className="mt-6 p-5 bg-[#f5f5f7] rounded-[18px]">
              <p className={`text-[16px] font-semibold mb-2 ${selected === q.answer ? 'text-green-600' : 'text-red-500'}`}>
                {selected === q.answer ? '✓ 回答正确' : '✗ 回答错误'}
              </p>
              <p className="text-[14px] text-[#444]">{q.explanation}</p>
            </div>
          )}

          {/* Next */}
          {answered && (
            <button onClick={next} className="w-full btn-primary mt-6">
              {current < questions.length - 1 ? '下一题 →' : '查看结果'}
            </button>
          )}
        </div>
      </section>
    </div>
  )
}
