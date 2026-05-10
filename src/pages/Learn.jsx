import { useState } from 'react'
import { liuQinRules } from '../data/liuQin'
import { liuShenRules } from '../data/liuShen'
import { tianGan, diZhi, wuXing, diZhiWuXing, baGua } from '../data/baGua'

const topics = [
  {
    id: 'basics',
    title: '基础概念',
    icon: '◎',
    items: [
      { q: '什么是六爻？', a: '六爻是以铜钱为媒介，通过六次摇卦形成六个爻，组成一个完整的卦象进行占卜的方法。' },
      { q: '天干地支是什么？', a: '天干有十：甲乙丙丁戊己庚辛壬癸；地支有十二：子丑寅卯辰巳午未申酉戌亥。天干地支配合形成六十甲子。' },
      { q: '五行是什么？', a: '木、火、土、金、水五种基本物质，相生：木→火→土→金→水→木；相克：木克土、土克水、水克火、火克金、金克木。' },
      { q: '八卦是哪八卦？', a: '乾兑离震巽坎艮坤，分别代表天、泽、火、雷、风、水、山、地八种自然现象。' },
    ],
  },
  {
    id: 'liUQin',
    title: '六亲',
    icon: '六',
    items: [
      { q: '什么是六亲？', a: '六亲指父母、兄弟、官鬼、子孙、妻财，以及代表自己的世爻。六亲根据五行生克关系确定。' },
      { q: '六亲与五行关系？', a: '以卦宫五行为"我"，所生者为子孙，生我者为父母，我克者为妻财，克我者为官鬼，与我比和者为兄弟。' },
      { q: '父母爻代表什么？', a: '父母爻代表父母、长辈、房屋、衣服、车辆、文书合同等庇护之物。占父母、占文书、占房屋时以父母爻为用神。' },
      { q: '官鬼爻代表什么？', a: '官鬼爻代表官员、上司、丈夫、疾病、鬼祟等。占官运、占疾病、占担忧之事时以官鬼爻为用神。' },
      { q: '妻财爻代表什么？', a: '妻财爻代表妻子、情人、钱财、珠宝、粮食等。占财运、占妻子、占食物时以妻财爻为用神。' },
      { q: '子孙爻代表什么？', a: '子孙爻代表子女、晚辈、六畜、药物、欢乐等。占子女、占医药、占福神时以子孙爻为用神。占出行则子孙爻为忌神（子孙克官鬼，官鬼为旅途阻碍）。' },
      { q: '兄弟爻代表什么？', a: '兄弟爻代表兄弟姐妹、朋友、同辈、竞争对手等。兄弟爻动则劫财，占破财时兄弟为忌神。' },
    ],
  },
  {
    id: 'liuShen',
    title: '六神',
    icon: '六',
    items: [
      { q: '什么是六神？', a: '六神即青龙、朱雀、勾陈、螣蛇、白虎、玄武，按日干起卦排列于六爻之上，用以辅助判断吉凶。' },
      { q: '青龙代表什么？', a: '青龙为吉神，代表喜庆、祥瑞、财富、长辈贵人。青龙临世应，办事多吉。' },
      { q: '朱雀代表什么？', a: '朱雀为凶神，代表口舌、官非、火灾、书信文书。朱雀动须防口舌是非。' },
      { q: '白虎代表什么？', a: '白虎为凶神，代表疾病、伤灾、死亡、孝服。白虎临官鬼为最凶之象。' },
      { q: '玄武代表什么？', a: '玄武为阴私之神，主盗贼、阴谋、暧昧不明之事。玄武动须防暗昧损失。' },
      { q: '六神如何起卦？', a: '甲乙日起青龙，丙丁日起朱雀，戊日起勾陈，庚辛日起白虎，壬癸日起玄武，顺时针排列六神。' },
    ],
  },
  {
    id: 'shiYing',
    title: '世应',
    icon: '☰',
    items: [
      { q: '什么是世应？', a: '世爻代表自己，应爻代表他人或对方。世爻与应爻的关系体现自我与外界的相互作用。' },
      { q: '世应位置如何确定？', a: '每个卦的世应位置固定。乾卦世在五爻，应在二爻；坤卦世在二爻，应在五爻；其余卦各有定位。' },
      { q: '世爻旺衰代表什么？', a: '世爻旺相则精力充沛、主动性强；世爻休囚则精力不足、被动消极。' },
      { q: '应爻旺衰代表什么？', a: '应爻旺相则对方强势、对我有助力或压力；应爻休囚则对方弱势或对我帮助不大。' },
    ],
  },
  {
    id: 'dongbian',
    title: '动变',
    icon: '☲',
    items: [
      { q: '什么是动爻？', a: '摇卦时硬币组合为老阳（6）或老阴（9）时为动爻，动爻是卦象中发生变化的关键爻。' },
      { q: '动爻为什么会变？', a: '动爻为老阳则变为少阴，为老阴则变为少阳。动变后的爻组成变卦，体现事物发展的结果。' },
      { q: '动爻在分析中有什么作用？', a: '动爻是用神强弱的关键影响点。动爻能生克冲合其他爻，是卦象变化的触发点。' },
      { q: '什么是原神、忌神、仇神？', a: '原神是生用神的爻，忌神是克用神的爻，仇神是生忌神的爻（间接害用神）。' },
      { q: '日建月建是什么？', a: '日建为当日地支，主一天之事；月建为当月地支，主一月之事。日月能生克冲合任意爻。' },
    ],
  },
  {
    id: 'yongshen',
    title: '用神',
    icon: '◎',
    items: [
      { q: '什么是用神？', a: '用神是卦中代表所问之事的核心爻。如问父母事则以父母爻为用神，问财运则以妻财爻为用神。' },
      { q: '如何选取用神？', a: '根据所问之事性质确定：问父母事取父母爻，问官运取官鬼爻，问财运取妻财爻，问子女事取子孙爻，问兄弟事取兄弟爻。' },
      { q: '用神旺相是什么意思？', a: '用神得日月生助，或动爻相生，或临青龙等吉神，称为旺相，主吉；用神被日月克制，或被忌神克伤，称为休囚，主凶。' },
      { q: '用神不现怎么办？', a: '用神不现于卦中时，需查伏神（找本宫首卦中的用神位置），或查动爻变化（动变之爻可作为参考）。' },
    ],
  },
]

export default function Learn() {
  const [depth, setDepth] = useState('shallow') // 'shallow' | 'deep'
  const [activeTopic, setActiveTopic] = useState('basics')
  const [openItems, setOpenItems] = useState({})

  const toggleItem = (topicId, q) => {
    const key = `${topicId}-${q}`
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div>
      {/* Header */}
      <section className="section-parchment text-center py-12">
        <h1 className="text-[40px] font-semibold tracking-tight mb-3">学习中心</h1>
        <p className="text-[17px] text-[#86868b]">六爻占卜基础知识与进阶</p>
      </section>

      {/* Depth Toggle */}
      <section className="section-light py-6 border-b border-[#e0e0e0]">
        <div className="max-w-[980px] mx-auto flex items-center justify-center gap-4">
          <span className={`text-[15px] ${depth === 'shallow' ? 'text-primary font-semibold' : 'text-[#86868b]'}`}>浅学</span>
          <button
            onClick={() => setDepth(depth === 'shallow' ? 'deep' : 'shallow')}
            className="w-[52px] h-[30px] rounded-full bg-[#e0e0e0] relative transition-colors"
          >
            <div className={`absolute top-[3px] w-[24px] h-[24px] rounded-full bg-white shadow transition-transform ${depth === 'deep' ? 'translate-x-[25px]' : 'translate-x-[3px]'}`} />
          </button>
          <span className={`text-[15px] ${depth === 'deep' ? 'text-primary font-semibold' : 'text-[#86868b]'}`}>深学</span>
          {depth === 'deep' && (
            <span className="text-[13px] text-[#86868b] bg-[#f5f5f7] px-2 py-1 rounded-full">
              含进阶概念与实战案例
            </span>
          )}
        </div>
      </section>

      {/* Topic Tabs */}
      <section className="section-light">
        <div className="max-w-[980px] mx-auto">
          {/* 快速导航 */}
          <div className="flex flex-wrap gap-2 mb-8">
            {topics.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTopic(t.id)}
                className={`px-4 py-2 rounded-full text-[14px] transition-colors ${
                  activeTopic === t.id ? 'bg-primary text-white' : 'bg-[#f5f5f7] text-[#86868b] hover:bg-[#e0e0e0]'
                }`}
              >
                {t.icon} {t.title}
              </button>
            ))}
          </div>

          {/* Topic Content */}
          {topics.filter(t => t.id === activeTopic).map(topic => (
            <div key={topic.id}>
              <h2 className="text-[28px] font-semibold mb-6">{topic.icon} {topic.title}</h2>

              {/* 基础内容 */}
              <div className="space-y-3 mb-8">
                {topic.items.map((item, idx) => {
                  const key = `${topic.id}-${item.q}`
                  const isOpen = openItems[key]
                  return (
                    <div key={idx} className="card">
                      <button
                        onClick={() => toggleItem(topic.id, item.q)}
                        className="w-full flex items-center justify-between text-left"
                      >
                        <span className="text-[16px] font-medium pr-4">{item.q}</span>
                        <span className={`text-[#86868b] transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
                      </button>
                      {isOpen && (
                        <div className="mt-4 pt-4 border-t border-[#e0e0e0]">
                          <p className="text-[15px] text-[#333] leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* 深度内容 */}
              {depth === 'deep' && (
                <div className="mt-8 p-6 bg-[#f5f5f7] rounded-[18px]">
                  <h3 className="text-[19px] font-semibold mb-4 flex items-center gap-2">
                    <span className="text-primary">◈</span> 进阶理解
                  </h3>
                  {topic.id === 'basics' && (
                    <div className="space-y-3 text-[14px] text-[#444]">
                      <p>六爻体系中，"爻"是最基本的单元。每个爻有阴阳之分，动爻（老阳老阴）代表变化的关键点。六爻组成一卦，六爻卦共有64种，每卦有六个爻位，从初爻到上爻。</p>
                      <p>五行生克是判断吉凶的核心框架。生助用神者为原神，吉；克制用神者为忌神，凶；生助忌神者为仇神，不利。掌握五行生克是六爻预测的基本功。</p>
                    </div>
                  )}
                  {topic.id === 'liUQin' && (
                    <div className="space-y-3 text-[14px] text-[#444]">
                      <p>六亲的实质是以卦宫五行为"我"建立的一套生克关系网。以乾宫卦为例，乾宫属金，金之父母为土，金之官鬼为火，金之子孙为木，金之妻财为水，金之兄弟为金。</p>
                      <p>实际预测中，用神旺衰是核心。用神旺相又得原神生助，大吉；用神休囚又逢忌神克制，大凶。用神不现时可查伏神，或以动变之爻作为参考。</p>
                    </div>
                  )}
                  {topic.id === 'liuShen' && (
                    <div className="space-y-3 text-[14px] text-[#444]">
                      <p>六神在六爻中作为辅助判断工具，并非决定性因素。青龙吉而朱雀凶，但若卦象中用神旺相，即使朱雀临之，亦主口舌但终吉。六神配合爻位、动变综合判断方为全面。</p>
                      <p>六神临世爻或用神时，其吉凶含义最为明显。如青龙临用神，主喜庆吉利之事；白虎临官鬼爻且动，主伤病凶灾。</p>
                    </div>
                  )}
                  {topic.id === 'shiYing' && (
                    <div className="space-y-3 text-[14px] text-[#444]">
                      <p>世应之间的关系反映占问事项中"我"与"对方"的力量对比。世爻旺而应爻衰，主我有力量掌控局面；世爻衰而应爻旺，主对方占优势。</p>
                      <p>世应相生相克的关系也很重要：世生应或应生世，主双方有互动往来；世克应或应克世，主双方存在冲突或对抗。</p>
                    </div>
                  )}
                  {topic.id === 'dongbian' && (
                    <div className="space-y-3 text-[14px] text-[#444]">
                      <p>动爻是六爻变化的核心枢纽。动爻可以生克冲合静爻，而静爻不能直接生克动爻。动爻与日建、月建的关系尤为重要：日月能生克冲合任意爻爻。</p>
                      <p>动变规则：老阳（6）动变少阴，老阴（9）动变少阳。动变后的卦象（变卦）反映事物发展的最终结果。分析时需结合本卦与变卦综合判断。</p>
                    </div>
                  )}
                  {topic.id === 'yongshen' && (
                    <div className="space-y-3 text-[14px] text-[#444]">
                      <p>用神选取是六爻预测的第一步，也是最关键的一步。用神选错，全卦皆错。选取用神需仔细分析所问之事的性质，有时一件事可涉及多个用神。</p>
                      <p>用神两现时，取动爻或旺相之爻为用；用神不现时，查本宫伏神或以日干地支辅助判断。特殊情况如占梦、占怪事则以官鬼爻为用神。</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
