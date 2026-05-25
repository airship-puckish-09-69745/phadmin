import { Message } from 'element-ui'
import { getCustomize } from '@/api/custome_configV2'
import request from '@/utils/request'
import { SubKeyMap } from '@/constants/subkey'

function normalizeBetList(betList) {
  if (!Array.isArray(betList)) return []
  return betList.map(item => Number(item)).filter(item => !Number.isNaN(item))
}

function isSameBetList(oldBetList, newBetList) {
  const oldList = normalizeBetList(oldBetList)
  const newList = normalizeBetList(newBetList)
  if (oldList.length !== newList.length) return false
  return oldList.every((item, index) => item === newList[index])
}

function normalizeScriptBetItems(betList, gameId) {
  return normalizeBetList(betList).map(bet => ({
    scriptBet: bet,
    createBet: gameId > 100000 ? bet / 1.5 : bet
  }))
}

function getSlotsGameId(subKey) {
  for (const gameId in SubKeyMap) {
    if (SubKeyMap[gameId] === subKey) {
      return Number(gameId)
    }
  }
  return 0
}

function getAppLabel(vm, appId) {
  const target = (vm.appOptions || []).find(item => Number(item.value) === Number(appId))
  return target ? target.label : String(appId)
}

function getGameLabel(vm, gameId) {
  if (typeof vm.getGameName === 'function') return vm.getGameName(gameId)
  return String(gameId)
}

function getScriptKey(gameId) {
  return 'SlotsCustomScriptConfig_' + gameId
}

function parseConfigData(response) {
  if (!response || response.RetCode !== 0 || !response.Data || !response.Data.Data) return null
  try {
    return JSON.parse(response.Data.Data || '{}')
  } catch (e) {
    return null
  }
}

function getCurrentScriptBetSet(scriptData) {
  return new Set(Object.keys(scriptData || {}).map(item => String(item)))
}

function hasScriptBet(scriptData, bet) {
  return getCurrentScriptBetSet(scriptData).has(String(bet))
}

function isPlanEnabled(planRow) {
  return planRow && (planRow.IsDisabled === false || planRow.IsDisabled === 0)
}

function ensureConfirmBoxStyle() {
  if (document.getElementById('script-v3-bet-list-create-style')) return
  const style = document.createElement('style')
  style.id = 'script-v3-bet-list-create-style'
  style.innerHTML = `
    .script-v3-bet-list-create-box {
      width: 1180px !important;
      max-width: 96vw;
      min-width: 860px;
      min-height: 620px;
      resize: both;
      overflow: auto;
    }
    .script-v3-bet-list-create-box .el-message-box__content {
      max-height: 76vh;
      overflow: hidden;
    }
    .script-v3-bet-list-create-box .el-message-box__message {
      width: 100%;
    }
    .script-v3-bet-list-create-table-wrap {
      max-height: 56vh;
      overflow: auto;
      margin-bottom: 8px;
      border: 1px solid #ebeef5;
    }
    .script-v3-bet-list-create-table-wrap thead th {
      position: sticky;
      top: 0;
      z-index: 1;
    }
  `
  document.head.appendChild(style)
}

function buildConfirmMessage(vm, items) {
  const h = vm.$createElement
  const thStyle = {
    padding: '6px 8px',
    background: '#f5f7fa',
    border: '1px solid #ebeef5',
    textAlign: 'left',
    whiteSpace: 'nowrap'
  }
  const tdStyle = {
    padding: '6px 8px',
    border: '1px solid #ebeef5',
    verticalAlign: 'top'
  }
  const betTdStyle = {
    ...tdStyle,
    minWidth: '260px'
  }
  const rows = items.map(item => h('tr', [
    h('td', { style: tdStyle }, getGameLabel(vm, item.gameId)),
    h('td', { style: tdStyle }, getAppLabel(vm, item.appId)),
    h('td', { style: tdStyle }, `${item.planName || ''}(${item.planId})`),
    h('td', { style: tdStyle }, String(item.version)),
    h('td', { style: betTdStyle }, [
      h('input', {
        attrs: {
          id: `script-v3-missing-bets-input-${item.uid}`
        },
        domProps: {
          value: item.missingBets.join(',')
        },
        style: {
          width: '100%',
          boxSizing: 'border-box'
        }
      })
    ])
  ]))

  return h('div', [
    h('div', {
      style: {
        marginBottom: '10px'
      }
    }, `是否创建以上剧本（共 ${items.length} 条）`),
    h('div', {
      class: 'script-v3-bet-list-create-table-wrap'
    }, [
      h('table', {
        style: {
          width: '100%',
          minWidth: '980px',
          borderCollapse: 'collapse'
        }
      }, [
        h('thead', [
          h('tr', [
            h('th', { style: thStyle }, '游戏'),
            h('th', { style: thStyle }, 'App'),
            h('th', { style: thStyle }, '方案'),
            h('th', { style: thStyle }, '版本'),
            h('th', { style: thStyle }, '需要创建剧本的 bet 值')
          ])
        ]),
        h('tbody', rows)
      ])
    ]),
    h('div', {
      style: {
        marginTop: '6px',
        color: '#909399'
      }
    }, '可直接编辑每一行需要创建的 bet 值')
  ])
}

function parseBetInput(value) {
  return normalizeBetList(String(value || '').split(/[,，\s\n]+/))
}

async function getVersion(gameId, row, planRow, appId, bet = undefined) {
  return request({
    url: '/dataProxy/info',
    method: 'get',
    data: {
      Path: '/slotsStat/script/plan/data',
      planID: planRow.PlanId,
      gameID: gameId,
      planVer: row.Version,
      appID: appId,
      bet: bet
    }
  })
}

async function createVersion(gameId, row, planRow, appId, bet) {
  return request({
    url: '/dataProxy/info',
    method: 'post',
    data: {
      Path: '/slotsStat/script/plan/data',
      planID: planRow.PlanId,
      gameID: gameId,
      planVer: row.Version,
      appID: appId,
      bet: bet
    }
  })
}

async function collectMissingScriptBets(vm, appIds, gameId, betItems, options = {}) {
  const scriptKey = getScriptKey(gameId)
  const result = []

  for (const appId of appIds) {
    const response = await getCustomize(scriptKey, appId)
    const data = parseConfigData(response)
    if (!data) continue

    const plans = data.Plans || []
    for (const planRow of plans) {
      if (options.planId !== undefined && planRow.PlanId !== options.planId) continue
      if (!isPlanEnabled(planRow)) continue

      const versions = planRow.Versions || []
      for (const row of versions) {
        if (options.version !== undefined && row.Version !== options.version) continue
        if (row.IsReady !== true) continue

        const versionResponse = await getVersion(gameId, row, planRow, appId)
        if (!versionResponse || versionResponse.RetCode !== 0) continue
        const currentBetSet = getCurrentScriptBetSet(versionResponse && versionResponse.Data)
        const missingBets = betItems.filter(item => !currentBetSet.has(String(item.scriptBet)))
        if (missingBets.length === 0) continue
        const confirmedMissingBets = []

        for (const item of missingBets) {
          const betVersionResponse = await getVersion(gameId, row, planRow, appId, item.scriptBet)
          if (!betVersionResponse || betVersionResponse.RetCode !== 0 || !hasScriptBet(betVersionResponse.Data, item.scriptBet)) {
            confirmedMissingBets.push(item)
          }
        }
        if (confirmedMissingBets.length === 0) continue

        result.push({
          uid: result.length,
          appId,
          gameId,
          planId: planRow.PlanId,
          planName: planRow.PlanName,
          version: row.Version,
          row,
          planRow,
          missingBets: confirmedMissingBets.map(item => item.scriptBet),
          createBetMap: confirmedMissingBets.reduce((result, item) => {
            result[String(item.scriptBet)] = item.createBet
            return result
          }, {})
        })
      }
    }
  }

  return result
}

export async function handleScriptV3BetListCreate(vm, options) {
  const oldBaseCfg = options.oldBaseCfg
  const newBaseCfg = options.newBaseCfg || {}
  const isBetListByAppCfg = newBaseCfg.IsBetListByAppCfg === true

  if (isBetListByAppCfg || newBaseCfg.EnableScriptV3 !== true) return
  if (oldBaseCfg && isSameBetList(oldBaseCfg.BetList, newBaseCfg.BetList)) return

  const gameId = options.gameId || getSlotsGameId(options.subKey || vm.subKey)
  const betItems = normalizeScriptBetItems(newBaseCfg.BetList, gameId)
  if (!gameId || betItems.length === 0) return

  const appIds = (options.appIds || [vm.appId]).filter(appId => appId !== undefined && appId !== null)
  const missingItems = await collectMissingScriptBets(vm, appIds, gameId, betItems, options)
  if (missingItems.length === 0) return

  ensureConfirmBoxStyle()
  await vm.$msgbox({
    title: '确认创建剧本',
    message: buildConfirmMessage(vm, missingItems),
    showCancelButton: true,
    confirmButtonText: '是',
    cancelButtonText: '否',
    closeOnClickModal: false,
    closeOnPressEscape: false,
    showClose: false,
    customClass: 'script-v3-bet-list-create-box',
    beforeClose: async(action, instance, done) => {
      if (action !== 'confirm') {
        done()
        return
      }
      const itemBetMap = {}
      let hasBet = false
      for (const item of missingItems) {
        const input = document.getElementById(`script-v3-missing-bets-input-${item.uid}`)
        const bets = parseBetInput(input && input.value)
        itemBetMap[item.uid] = bets
        if (bets.length > 0) hasBet = true
      }
      if (!hasBet) {
        Message.warning('请至少填写一个 bet 值')
        return
      }

      try {
        instance.confirmButtonLoading = true
        for (const item of missingItems) {
          const createBets = itemBetMap[item.uid]
          for (const bet of createBets) {
            await createVersion(item.gameId, item.row, item.planRow, item.appId, item.createBetMap[String(bet)] || bet)
          }
        }
        Message.success('剧本创建完成')
        done()
      } catch (e) {
        Message.error('剧本创建失败')
      } finally {
        instance.confirmButtonLoading = false
      }
    }
  }).catch(() => {})
}
