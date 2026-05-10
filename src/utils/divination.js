// 六爻起卦与解析引擎

import { tianGan, diZhi, wuXing, diZhiWuXing, baGua, baGuaGong, shiYingPositions } from '../data/baGua'
import { getLiuQin } from '../data/liuQin'
import { getLiuShenOrder } from '../data/liuShen'

// 硬币起卦：3枚硬币，每枚正面=3，反面=2
// 3枚硬币相加：3+3+3=9少阳（阳爻动），3+3+2=8少阴（阴爻）
// 3+2+2=7少阳（阳爻），2+2+2=6老阳（阳爻动变阴）

export function coinToss(results) {
  // results: array of 'head' or 'tail', length 6 (for 6爻)
  const values = results.map(r => r === 'head' ? 3 : 2)
  const yaoValues = []
  for (let i = 0; i < 6; i++) {
    const sum = values.slice(i * 3, i * 3 + 3).reduce((a, b) => a + b, 0)
    if (sum === 6) yaoValues.push({ value: 6, type: '老阳', change: '阴' })
    else if (sum === 7) yaoValues.push({ value: 7, type: '少阳', change: null })
    else if (sum === 8) yaoValues.push({ value: 8, type: '少阴', change: null })
    else if (sum === 9) yaoValues.push({ value: 9, type: '老阴', change: '阳' })
  }
  return yaoValues
}

// 随机起卦
export function randomCast() {
  const results = []
  for (let i = 0; i < 18; i++) {
    results.push(Math.random() > 0.5 ? 'head' : 'tail')
  }
  return coinToss(results)
}

// 将6爻结果转换为上下卦象
// 爻值：7=少阳（阳），8=少阴（阴），9=老阴（阴动），6=老阳（阳动）
export function yaoValuesToHexagram(yaoValues) {
  // 上卦：爻1-3（从下到上），用4爻决定
  // 1爻=初（最低），2爻=二，3爻=三，4爻=四
  // 按先天八卦序：乾1 兑2 离3 震4 巽5 坎6 艮7 坤8
  const baguaOrder = ['乾', '兑', '离', '震', '巽', '坎', '艮', '坤']

  // 上卦用3爻（初爻、二爻、三爻）
  // 从下往上：yaoValues[0]=初爻，yaoValues[1]=二爻，yaoValues[2]=三爻
  // 阳爻=1（奇数），阴爻=0（偶数）
  // 坎=1+2*2=5，等等。简化：用二进制位计算
  const upperBits = (yaoValues[0].value === 7 || yaoValues[0].value === 6 ? 1 : 0) |
                    ((yaoValues[1].value === 7 || yaoValues[1].value === 6 ? 1 : 0) << 1) |
                    ((yaoValues[2].value === 7 || yaoValues[2].value === 6 ? 1 : 0) << 2)
  const upperGua = baguaOrder[upperBits % 8]

  // 下卦用三爻（四爻、五爻、六爻）
  const lowerBits = (yaoValues[3].value === 7 || yaoValues[3].value === 6 ? 1 : 0) |
                    ((yaoValues[4].value === 7 || yaoValues[4].value === 6 ? 1 : 0) << 1) |
                    ((yaoValues[5].value === 7 || yaoValues[5].value === 6 ? 1 : 0) << 2)
  const lowerGua = baguaOrder[lowerBits % 8]

  // 动爻：找 value 为 6 或 9 的爻
  const dongYaoIndex = yaoValues.findIndex(y => y.value === 6 || y.value === 9)
  const dongYao = dongYaoIndex >= 0 ? dongYaoIndex + 1 : 1

  return { upperGua, lowerGua, dongYao }
}

// 从年月日时起卦
export function timeCast(year, month, day, hour) {
  // 甲子历计算
  const baseYear = 1984 // 甲子年
  const yearDiff = year - baseYear
  const ganIndex = yearDiff % 10
  const zhiIndex = yearDiff % 12
  const gan = tianGan[ganIndex >= 0 ? ganIndex : ganIndex + 10]
  const zhi = diZhi[zhiIndex >= 0 ? zhiIndex : zhiIndex + 12]

  // 月份地支
  const monthZhi = diZhi[(month - 1) % 12]
  // 日干：简化计算
  const baseDayGan = 1 // 甲子日
  const dayCount = (new Date(year, month - 1, day) - new Date(baseYear, 0, 1)) / (1000 * 60 * 60 * 24)
  const dayGan = tianGan[Math.floor(dayCount) % 10]
  const dayZhi = diZhi[Math.floor(dayCount) % 12]

  // 时辰地支
  const hourZhi = diZhi[Math.floor(hour / 2) % 12]

  // 上卦：年+月+日之和除8
  const upperSum = tianGan.indexOf(dayGan) + diZhi.indexOf(dayZhi)
  const upperGua = Object.keys(baGua)[upperSum % 8]

  // 下卦：年+月+日+时之和除8
  const lowerSum = upperSum + diZhi.indexOf(hourZhi)
  const lowerGua = Object.keys(baGua)[lowerSum % 8]

  // 动爻：年+月+日+时除6余数
  const dongYao = (year + month + day + hour) % 6 || 6

  return {
    upperGua,
    lowerGua,
    dongYao,
    info: { gan, zhi: zhi, monthZhi, dayGan, dayZhi, hourZhi }
  }
}

// 获取六亲
function getWuXingRelation(wuXing1, wuXing2) {
  const relations = {
    '木': { '木': '比和', '火': '生', '土': '克', '金': '耗', '水': '泄' },
    '火': { '木': '泄', '火': '比和', '土': '生', '金': '克', '水': '耗' },
    '土': { '木': '克', '火': '泄', '土': '比和', '金': '生', '水': '耗' },
    '金': { '木': '耗', '火': '克', '土': '泄', '金': '比和', '水': '生' },
    '水': { '木': '生', '火': '耗', '土': '克', '金': '泄', '水': '比和' },
  }
  return relations[wuXing1]?.[wuXing2] || ''
}

// 构建六爻完整信息
export function buildHexagram(castResult, ganZhiDay, yaoValues) {
  const { upperGua, lowerGua, dongYao } = castResult
  const gong = baGuaGong[upperGua]

  // 动爻处理
  const dongYaoIndex = dongYao - 1 // 0-indexed

  // 六爻从下到上：爻1=初，爻2=二，爻3=三，爻4=四，爻5=五，爻6=上
  const yaoOrder = [6, 5, 4, 3, 2, 1] // 从上到下列
  const yaoInfo = yaoOrder.map((yaoPos, idx) => {
    const isDong = idx === (6 - dongYao)
    const yaoType = yaoValues && yaoValues[idx] ? yaoValues[idx].type : (isDong ? '老阳' : '少阴')
    return {
      position: yaoPos,
      isDong,
      type: yaoType,
      change: isDong ? '阳' : null,
    }
  })

  // 六神排列
  const shenOrder = getLiuShenOrder(ganZhiDay)

  // 世应
  const shiYing = shiYingPositions[upperGua] || { 世: [1], 应: [4] }

  return {
    upperGua,
    lowerGua,
    gong,
    dongYao,
    yaoInfo,
    shenOrder,
    shiYing,
  }
}

// 解析卦象
export function analyzeHexagram(castResult, ganZhiDay, question, yaoValues) {
  const { upperGua, lowerGua } = castResult
  const info = buildHexagram(castResult, ganZhiDay, yaoValues)

  // 确定用神
  const yongShen = determineYongShen(question)

  // 解析
  const analysis = {
    yongShen,
    hexagramName: `${upperGua}上${lowerGua}下`,
    gong: baGuaGong[upperGua],
    yaoInfo: info.yaoInfo,
    shenOrder: info.shenOrder,
    dongYao: castResult.dongYao,
    dayGan: ganZhiDay,
    originalText: getOriginalText(yongShen.name),
  }

  return analysis
}

// 用神选取
export function determineYongShen(question) {
  if (!question) return { name: '妻财', description: '占一般之事以妻财为用神', reason: '未指明，占一般之事以妻财为用神' }

  const q = question.toLowerCase()
  if (q.includes('官') || q.includes('工作') || q.includes('事业') || q.includes('担忧') || q.includes('疾病')) {
    return { name: '官鬼', description: '占官府、疾病、担忧之事', reason: '问事涉及官府/事业/疾病，取官鬼为用神' }
  }
  if (q.includes('父母') || q.includes('长辈') || q.includes('房子') || q.includes('车子') || q.includes('文书')) {
    return { name: '父母', description: '占父母、文书、房屋、车辆', reason: '问事涉及父母/文书/房屋，取父母为用神' }
  }
  if (q.includes('兄弟') || q.includes('姐妹') || q.includes('朋友') || q.includes('破财')) {
    return { name: '兄弟', description: '占兄弟姐妹、朋友、破财', reason: '问事涉及兄弟姐妹/朋友，取兄弟为用神' }
  }
  if (q.includes('妻') || q.includes('钱') || q.includes('财运') || q.includes('食物')) {
    return { name: '妻财', description: '占妻子、财运、食物', reason: '问事涉及妻子/财运/钱财，取妻财为用神' }
  }
  if (q.includes('子') || q.includes('女') || q.includes('孙') || q.includes('医药') || q.includes('旅行')) {
    return { name: '子孙', description: '占子女、医药、福神', reason: '问事涉及子女/医药/福神，取子孙为用神' }
  }
  return { name: '妻财', description: '占一般之事以妻财为用神', reason: '未明确，以妻财为用神' }
}

// 经典原文
export function getOriginalText(yongShenName) {
  const texts = {
    官鬼: {
      火珠林: '官鬼者，权柄也。占官府以官鬼为主，占疾病以官鬼为用神。',
      增删卜易: '官鬼为用神者，占官府则有权柄，占疾病则主灾祸。',
      卜筮正宗: '官鬼为祸害之神，亦为护身之符，须看五行生克。',
    },
    父母: {
      火珠林: '父母者，身之所庇也。占父母以父母为用神，占文书以父母为用神。',
      增删卜易: '父母爻为用神，占父母则父母爻旺相为吉，占文书则父母爻生世为吉。',
      卜筮正宗: '父母爻主辛勤劳苦，亦为文书契约之属。',
    },
    兄弟: {
      火珠林: '兄弟者，分财夺福。占兄弟以兄弟为用神，占破财以兄弟为忌神。',
      增删卜易: '兄弟爻动则克财，占兄弟则有益，占破财则为灾祸。',
      卜筮正宗: '兄弟为劫财之神，亦为同类相扶之意。',
    },
    妻财: {
      火珠林: '妻财者，己之所有也。占妻财以妻财为用神，占财运以妻财为用神。',
      增删卜易: '妻财爻为用神，占妻则妻爻旺相为吉，占财则财爻生世为吉。',
      卜筮正宗: '妻财为养命之源，亦为可支配之物。',
    },
    子孙: {
      火珠林: '子孙者，福德之神。占子孙以子孙为用神，占医药以子孙为用神。',
      增删卜易: '子孙爻为用神，占子女则子孙爻旺相为吉，占医药则子孙爻克官鬼为吉。',
      卜筮正宗: '子孙为解忧之神，亦为瑞庆之物。',
    },
  }
  return texts[yongShenName] || texts['妻财']
}

// 计算日月建对爻的影响
export function getYueJianInfluence(ganZhiDay) {
  const { gan, zhi } = ganZhiDay
  const ganWuXing = wuXing[gan]
  const zhiWuXing = diZhiWuXing[zhi]

  return {
    dayGan: gan,
    dayZhi: zhi,
    dayWuXing: ganWuXing,
    yueJianWuXing: zhiWuXing,
    influence: getWuXingRelation(zhiWuXing, ganWuXing),
  }
}
