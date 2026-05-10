// 天干地支数据

export const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

export const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

export const wuXing = {
  甲: '木', 乙: '木',
  丙: '火', 丁: '火',
  戊: '土', 己: '土',
  庚: '金', 辛: '金',
  壬: '水', 癸: '水',
}

export const diZhiWuXing = {
  子: '水', 丑: '土', 寅: '木', 卯: '木',
  辰: '土', 巳: '火', 午: '火', 未: '土',
  申: '金', 酉: '金', 戌: '土', 亥: '水',
}

// 地支方位
export const diZhiPosition = {
  子: '北', 丑: '东北', 寅: '东北', 卯: '东',
  辰: '东南', 巳: '东南', 午: '南', 未: '西南',
  申: '西南', 酉: '西', 戌: '西北', 亥: '西北',
}

// 地支藏干
export const diZhiCangGan = {
  子: ['癸'], 丑: ['己', '癸', '辛'], 寅: ['甲', '丙', '戊'],
  卯: ['乙'], 辰: ['戊', '乙', '癸'], 巳: ['丙', '庚', '戊'],
  午: ['丁', '己'], 未: ['己', '丁', '乙'], 申: ['庚', '壬', '戊'],
  酉: ['辛'], 戌: ['戊', '辛', '丁'], 亥: ['壬', '甲'],
}

// 八卦
export const baGua = {
  乾: { gua: '☰', wuXing: '金', position: '西北', dui: '父' },
  兑: { gua: '☱', wuXing: '金', position: '西', dui: '少女' },
  离: { gua: '☲', wuXing: '火', position: '南', dui: '中女' },
  震: { gua: '☳', wuXing: '木', position: '东', dui: '长男' },
  巽: { gua: '☴', wuXing: '木', position: '东南', dui: '长女' },
  坎: { gua: '☵', wuXing: '水', position: '北', dui: '中男' },
  艮: { gua: '☶', wuXing: '土', position: '东北', dui: '少男' },
  坤: { gua: '☷', wuXing: '土', position: '西南', dui: '母' },
}

// 六爻排法：世应位置
// 八卦六爻世应歌诀
export const shiYingPositions = {
  乾: { 世: [1], 应: [4] }, // 初爻世，六爻应
  兑: { 世: [2], 应: [5] },
  离: { 世: [3], 应: [6] },
  震: { 世: [4], 应: [1] },
  巽: { 世: [5], 应: [2] },
  坎: { 世: [6], 应: [3] },
  艮: { 世: [1], 应: [4] },
  坤: { 世: [2], 应: [5] },
}

// 八卦所属宫
export const baGuaGong = {
  乾: '乾宫', 兑: '乾宫', 离: '离宫', 震: '震宫',
  巽: '巽宫', 坎: '坎宫', 艮: '艮宫', 坤: '坤宫',
}

// 天干地支纪年→起卦
export function getGanZhiYear(year) {
  const ganIndex = (year - 4) % 10
  const zhiIndex = (year - 4) % 12
  return { gan: tianGan[ganIndex < 0 ? ganIndex + 10 : ganIndex], zhi: diZhi[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex] }
}

export function getGanZhiMonth(year, month) {
  const ganTable = [
    ['甲', '己'], ['乙', '庚'], ['丙', '辛'], ['丁', '壬'], ['戊', '癸'],
    ['甲', '己'], ['乙', '庚'], ['丙', '辛'], ['丁', '壬'], ['戊', '癸'],
    ['甲', '己'], ['乙', '庚'],
  ]
  const yearGan = getGanZhiYear(year).gan
  const row = tianGan.indexOf(yearGan)
  return { gan: ganTable[month - 1][row % 2], zhi: diZhi[month - 1] }
}

export function getGanZhiDay(year, month, day) {
  // 简化版：以固定基数推算
  const baseYear = 2000
  const baseDate = new Date(baseYear, 0, 1)
  const targetDate = new Date(year, month - 1, day)
  const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24))
  const baseGanIndex = 6 // 2000年1月1日是戊子
  const baseZhiIndex = 0 // 子
  const ganIndex = (baseGanIndex + diffDays) % 10
  const zhiIndex = (baseZhiIndex + diffDays) % 12
  return { gan: tianGan[ganIndex < 0 ? ganIndex + 10 : ganIndex], zhi: diZhi[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex] }
}

export function getGanZhiHour(zhi, isLeapMonth) {
  const zhiIndex = diZhi.indexOf(zhi)
  const ganTable = [
    ['甲', '丙', '戊', '庚', '壬'],
    ['乙', '丁', '己', '辛', '癸'],
    ['丙', '戊', '庚', '壬', '甲'],
    ['丁', '己', '辛', '癸', '乙'],
    ['戊', '庚', '壬', '甲', '丙'],
    ['己', '辛', '癸', '乙', '丁'],
    ['庚', '壬', '甲', '丙', '戊'],
    ['辛', '癸', '乙', '丁', '己'],
    ['壬', '甲', '丙', '戊', '庚'],
    ['癸', '乙', '丁', '己', '辛'],
    ['甲', '丙', '戊', '庚', '壬'],
    ['乙', '丁', '己', '辛', '癸'],
  ]
  // 子时23-1点，用夜子时
  const hourIndex = Math.floor((zhiIndex % 2 === 0 ? zhiIndex + 1 : zhiIndex) / 2)
  const ganRow = tianGan.indexOf(getGanZhiYear(new Date().getFullYear()).gan)
  return { gan: ganTable[zhiIndex][hourIndex % 5], zhi: diZhi[zhiIndex] }
}
