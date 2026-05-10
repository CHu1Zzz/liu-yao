import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="section-light text-center">
        <h1 className="text-[48px] font-semibold tracking-tight text-[#1d1d1f] leading-tight mb-3">
          六爻占卜
        </h1>
        <p className="text-[19px] text-[#86868b] mb-8 max-w-[600px] mx-auto">
          古典占卜工具 · 硬币起卦 · 时间起卦 · 随机起卦
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/divination" className="btn-primary text-[17px] font-semibold">
            开始占卜
          </Link>
          <Link to="/learn" className="btn-secondary text-[17px]">
            学习六爻
          </Link>
        </div>
      </section>

      {/* 方法介绍 */}
      <section className="section-parchment">
        <div className="max-w-[980px] mx-auto">
          <h2 className="text-[32px] font-semibold tracking-tight text-center mb-12">
            三种起卦方式
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: '硬币起卦',
                desc: '三枚硬币，摇六次，记录正面次数，得出六爻卦象',
                icon: '◎',
                tag: '传统法',
              },
              {
                title: '随机起卦',
                desc: '系统随机产生卦象结果，适合快速占问或练习',
                icon: '⚄',
                tag: '便捷法',
              },
              {
                title: '时间起卦',
                desc: '输入年月日时，自动推算卦象与动爻',
                icon: '☰',
                tag: '梅花法',
              },
            ].map(({ title, desc, icon, tag }) => (
              <div key={title} className="card text-center p-8">
                <div className="text-[48px] mb-4">{icon}</div>
                <h3 className="text-[19px] font-semibold mb-2">{title}</h3>
                <p className="text-[15px] text-[#86868b] mb-4">{desc}</p>
                <span className="inline-block text-[12px] text-primary bg-[#0066cc0d] px-3 py-1 rounded-full">
                  {tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 功能 */}
      <section className="section-light">
        <div className="max-w-[980px] mx-auto">
          <h2 className="text-[32px] font-semibold tracking-tight text-center mb-12">
            核心功能
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: '卦象解析', desc: '六爻排列、世应定位、用神选取、动变分析', emoji: '☰' },
              { title: '经典原文', desc: '《火珠林》《增删卜易》《卜筮正宗》精华对照', emoji: '📜' },
              { title: '六亲六神', desc: '六亲定位、六神排法、五行生克关系', emoji: '六' },
              { title: '学习练习', desc: '浅学/深学切换、互动练习题、巩固知识', emoji: '✦' },
            ].map(({ title, desc, emoji }) => (
              <div key={title} className="card flex items-start gap-4">
                <span className="text-[28px]">{emoji}</span>
                <div>
                  <h3 className="text-[17px] font-semibold mb-1">{title}</h3>
                  <p className="text-[15px] text-[#86868b]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-dark text-center">
        <h2 className="text-[36px] font-semibold tracking-tight mb-4">
          立即开始
        </h2>
        <p className="text-[17px] text-[#86868b] mb-8">
          选择起卦方式，感受六爻的神奇
        </p>
        <Link to="/divination" className="btn-primary text-[17px]">
          开始占卜
        </Link>
      </section>
    </div>
  )
}
