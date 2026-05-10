import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero hero--light">
        <div className="animate-fade-up">
          <p className="hero__eyebrow">古典占卜 · 现代呈现</p>
          <h1 className="hero__title">六爻占卜</h1>
          <p className="hero__subtitle">
            硬币起卦 · 随机起卦 · 时间起卦<br />
            配合《火珠林》《增删卜易》《卜筮正宗》经典原文
          </p>
          <div className="hero__actions">
            <Link to="/divination" className="btn-primary">开始占卜</Link>
            <Link to="/learn" className="btn-secondary">学习六爻</Link>
          </div>
        </div>
      </section>

      {/* Three Methods */}
      <section className="page-section page-section--dark">
        <div className="container">
          <h2 className="display-section" style={{ textAlign: 'center', marginBottom: 16, color: '#fff' }}>
            三种起卦方式
          </h2>
          <p className="text代-muted" style={{ textAlign: 'center', marginBottom: 48, color: 'rgba(255,255,255,0.65)' }}>
            各適其適，擇而用之
          </p>
          <div className="feature-grid--3">
            {[
              {
                icon: '◎',
                title: '硬币起卦',
                desc: '三枚硬币，摇六次，记录正面次数，得出六爻卦象',
                tag: '传统法',
              },
              {
                icon: '⚄',
                title: '随机起卦',
                desc: '系统随机产生卦象结果，适合快速占问或练习',
                tag: '便捷法',
              },
              {
                icon: '☰',
                title: '时间起卦',
                desc: '输入年月日时，自动推算卦象与动爻',
                tag: '梅花法',
              },
            ].map(({ icon, title, desc, tag }) => (
              <div key={title} className="card--dark" style={{ textAlign: 'center', padding: '40px 24px' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>{icon}</div>
                <h3 className="display-card" style={{ marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, marginBottom: 20 }}>{desc}</p>
                <span className="method-card__tag">{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="page-section page-section--white">
        <div className="container">
          <h2 className="display-section" style={{ textAlign: 'center', marginBottom: 48 }}>
            核心功能
          </h2>
          <div className="feature-grid">
            {[
              { icon: '☰', title: '卦象解析', desc: '六爻排列、世应定位、用神选取、动变分析' },
              { icon: '📜', title: '经典原文', desc: '《火珠林》《增删卜易》《卜筮正宗》精华对照' },
              { icon: '六', title: '六亲六神', desc: '六亲定位、六神排法、五行生克关系' },
              { icon: '✦', title: '学习练习', desc: '浅学/深学切换、互动练习题、巩固知识' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <span style={{ fontSize: 32 }}>{icon}</span>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>{title}</h3>
                  <p className="text代-muted" style={{ fontSize: 14 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-section page-section--dark" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div className="container--narrow">
          <h2 className="display-section" style={{ color: '#fff', marginBottom: 16 }}>立即开始</h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.65)', marginBottom: 40 }}>
            选择起卦方式，感受六爻的神奇
          </p>
          <Link to="/divination" className="btn-primary" style={{ fontSize: 17 }}>
            开始占卜
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer__inner">
          <p className="footer__text">六爻占卜 · 仅供学习参考 · 理性对待</p>
        </div>
      </footer>
    </div>
  )
}
