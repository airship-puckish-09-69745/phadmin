<script>

import Publish from '@/components/Publish/index.vue'
import robotAiSettingOutCard from '@/views/config/tableConfig/tongits/robotAiSettingOutCard.vue'
import robotAiSettingDrop from '@/views/config/tableConfig/tongits/robotAiSettingDrop.vue'
import robotAiSettingFight from '@/views/config/tableConfig/tongits/robotAiSettingFight.vue'
import robotAiSettingBuildCard from '@/views/config/tableConfig/tongits/robotAiSettingBuildCard.vue'
import robotAiSettingChallenge from '@/views/config/tableConfig/tongits/robotAiSettingChallenge.vue'
import robotAiSettingDecision from '@/views/config/tableConfig/tongits/robotAiSettingDecision.vue'
import { Message } from 'element-ui'
import request from '@/utils/request'
import Compare from '@/components/Compare/index.vue'
function NewRobotAIItem() {
  const configLevel = 1
  const configName = '防作弊机器⼈'
  return {
    AiConfigId: configLevel,
    AiConfigLevel: configLevel,
    AiConfigName: configName,
    BuildCard: {
      BuildFlush3MaxNum: 3,
      BuildFlush3Ratio: 30,
      BuildFlush4MaxNum: 2,
      BuildFlush4Ratio: 20,
      BuildFlushGte5MaxNum: 2,
      BuildFlushGte5Ratio: 100,
      BuildFourMaxNum: 2,
      BuildFourRatio: 8,
      BuildJokerMaxNum: 2,
      BuildJokerRatio: 100,
      BuildThree3MaxNum: 3,
      BuildThreeRatio: 30,
      IsDoBuildCard: false
    },
    Challenge: {
      Lose: {
        HandCards: [
          {
            End: 100,
            Percent: 10,
            Start: 5
          }
        ],
        Point: [
          {
            End: 5,
            Percent: 30,
            Start: 0
          }
        ],
        RemainHandCards: [
          {
            End: 2,
            Percent: 1,
            Start: 1
          }
        ],
        Round: [
          {
            End: 3,
            Percent: 10,
            Start: 1
          }
        ]
      },
      NobodyDropOwnerGreatOther: 20,
      NobodyDropOwnerLessOther: 80,
      Special: {
        HandAOther1Fight: 95,
        PointGe51NotFight: 100,
        Round2NotDrop: 95
      },
      Win: {
        HandCards: [
          {
            End: 100,
            Percent: 30,
            Start: 5
          }
        ],
        Point: [
          {
            End: 5,
            Percent: 60,
            Start: 0
          }
        ],
        RemainHandCards: [
          {
            End: 2,
            Percent: 30,
            Start: 1
          }
        ],
        Round: [
          {
            End: 2,
            Percent: 30,
            Start: 2
          }
        ]
      }
    },
    Drop: {
      DropGroupHasLinkMaybe: 80,
      NobodyDropOwnerGreatOther: 50,
      NobodyDropOwnerLessOther: 50
    },
    Fight: {
      Lose: {
        HandCards: [
          {
            End: 100,
            Percent: 15,
            Start: 5
          }
        ],
        Point: [
          {
            End: 5,
            Percent: 10,
            Start: 0
          }
        ],
        RemainHandCards: [
          {
            End: 2,
            Percent: 10,
            Start: 1
          }
        ],
        Round: [
          {
            End: 3,
            Percent: 0,
            Start: 2
          }
        ]
      },
      Special: {
        HandAOther1Fight: 95,
        OtherNotDropButCanWin: 70,
        PointGe51NotFight: 100,
        RealPlayerNotDrop: [],
        Round2NotDrop: 95
      },
      Win: {
        HandCards: [
          {
            End: 100,
            Percent: 20,
            Start: 5
          }
        ],
        Point: [
          {
            End: 5,
            Percent: 60,
            Start: 0
          }
        ],
        RemainHandCards: [
          {
            End: 2,
            Percent: 30,
            Start: 1
          }
        ],
        Round: [
          {
            End: 2,
            Percent: 10,
            Start: 2
          }
        ]
      }
    },
    OutCard: {
      OutCardCanOtherContribute: -1
    }
  }
}
export default {
  components: {
    Compare,
    robotAiSettingChallenge, robotAiSettingBuildCard, robotAiSettingFight,
    robotAiSettingDrop, robotAiSettingOutCard, Publish, robotAiSettingDecision },
  data() {
    return {
      GameType: 'normal', // 游戏类型
      subKey: 'tongits_cheat_cfg', // 子key
      editAIVisible: false,
      editAI: {},
      editJokerVisible: false,
      editJokerAI: {},
      editQuickVisible: false,
      editQuickAI: {},
      IsAutoMaybe: false,
      MaybeMin: 0,
      MaybeReduce: 0,
      CheatCfg: {
        IsAutoMaybe: false, // 是否自动调整
        MaybeMin: 0, // 最小可能性
        MaybeReduce: 0, // 减少可能性
        TickScore: 100, // 踢人
        PotPercent: 20, // pot百分比
        GiveMoreTimes: [
          {
            Count: 2,
            MaybeAdd: 3
          },
          {
            Count: 3,
            MaybeAdd: 4
          },
          {
            Count: 4,
            MaybeAdd: 5
          }
        ],
        FirstGiveMoreTimes: [{
          Per: 50,
          MaybeAdd: 3
        }],
        DisAndGive: {
          Count: 1,
          MaybeAdd: 3
        },
        SameName: {
          MaybeAdd: 3
        },
        LeaveFre: [
          {
            Per: 10,
            MaybeAdd: 3
          },
          {
            Per: 20,
            MaybeAdd: 4
          },
          {
            Per: 30,
            MaybeAdd: 5
          }
        ],
        PreWinFight: [
          {
            RangeMin: 10,
            RangeMax: 20,
            MaybeAdd: 3
          },
          {
            RangeMin: 20,
            RangeMax: 30,
            MaybeAdd: 3
          },
          {
            RangeMin: 30,
            RangeMax: 100,
            MaybeAdd: 3
          }
        ],
        PreWinFold: [
          {
            RangeMin: 10,
            RangeMax: 20,
            MaybeAdd: 3
          },
          {
            RangeMin: 20,
            RangeMax: 30,
            MaybeAdd: 3
          },
          {
            RangeMin: 30,
            RangeMax: 100,
            MaybeAdd: 3
          }
        ],
        BigPotWin: [
          {
            Count: 4,
            MaybeAdd: 3
          },
          {
            Count: 5,
            MaybeAdd: 4
          },
          {
            Count: 6,
            MaybeAdd: 5
          },
          {
            Count: 7,
            MaybeAdd: 4
          },
          {
            Count: 8,
            MaybeAdd: 5
          },
          {
            Count: 9,
            MaybeAdd: 4
          },
          {
            Count: 10,
            MaybeAdd: 5
          },
          {
            Count: 11,
            MaybeAdd: 4
          },
          {
            Count: 12,
            MaybeAdd: 5
          }
        ],
        BigPotLeave: [
          {
            Count: 1,
            MaybeAdd: 3
          },
          {
            Count: 2,
            MaybeAdd: 4
          },
          {
            Count: 3,
            MaybeAdd: 5
          },
          {
            Count: 4,
            MaybeAdd: 4
          },
          {
            Count: 5,
            MaybeAdd: 5
          },
          {
            Count: 6,
            MaybeAdd: 4
          }
        ],
        PlayMoreTimes: [
          {
            Count: 30,
            MaybeAdd: 3
          },
          {
            Count: 40,
            MaybeAdd: 3
          },
          {
            Count: 100,
            MaybeAdd: 3
          }
        ],
        AiConfigRow: {},
        JokerAiConfigRow: {},
        QuickAiConfigRow: {}
      },
      form: {
        Data: {}
      },
      oldCheatMin: 0,
      potTableBlackTickTableMoneys: '', // pot同桌分值到了是否踢人的场次列表
      jokerTableBlackTickTableMoneys: '', // joker同桌分值到了是否踢人的场次列表
      quickTableBlackTickTableMoneys: '', // quick同桌分值到了是否踢人的场次列表

      potTableBlackRadioTableMoneys: '', // 异常局拉黑的场次列表
      jokerTableBlackRadioTableMoneys: '', // joker异常局拉黑的场次列表
      quickTableBlackRadioTableMoneys: '', // quick异常局拉黑的场次列表

      potTableAutoBlackTableMoneys: '', // pot自动拉黑的场次列表
      jokerTableAutoBlackTableMoneys: '', // joker自动拉黑的场次列表
      quickTableAutoBlackTableMoneys: '', // quick自动拉黑的场次列表
      TableTickLeave: 0, // 组合作弊离桌人数门槛
      JokerDisAndGive: {
        Count: 1,
        MaybeAdd: 3,
        BlackAdd: 3
      },
      nearID: [
        {
          Score: 10,
          MaybeAdd: 3
        },
        {
          Score: 100,
          MaybeAdd: 3
        },
        {
          Score: 500,
          MaybeAdd: 3
        }
      ],
      AutoBlack: [

      ],
    }
  },

  created() {
    // this.editAI = NewRobotAIItem()
    this.getData()
  },
  methods: {
    getFullKey() {
      return 'CustomizeCfg_' + this.subKey
    },
    getData() {
      const $this = this
      request({
        url: '/customizeconfig/one',
        method: 'get',
        data: {
          SubKey: this.subKey
        }
      }).then(response => {
        if (response.RetCode === 0) {
          console.log('robotSetting', response.Data)
          $this.form = response.Data || {}
          if (response.Data && response.Data.Data !== '' && response.Data.Data !== '{}') {
            $this.CheatCfg = JSON.parse(response.Data.Data)
            // eslint-disable-next-line no-prototype-builtins
            if (!$this.CheatCfg.hasOwnProperty('PlayMoreTimes') || !Array.isArray(this.CheatCfg.PlayMoreTimes)) {
              $this.CheatCfg.PlayMoreTimes = [
                {
                  Count: 30,
                  MaybeAdd: 3
                },
                {
                  Count: 40,
                  MaybeAdd: 3
                },
                {
                  Count: 100,
                  MaybeAdd: 3
                }
              ]
            }
            if ($this.CheatCfg.TableBlackScore === undefined) {
              $this.CheatCfg.TableBlackScore = 100
            }
            $this.TableTickLeave = $this.CheatCfg.TableTickLeave || 0
            $this.JokerDisAndGive = $this.CheatCfg.JokerDisAndGive || $this.JokerDisAndGive
            const potTableBlackTickTableMoneys = []
            if ($this.CheatCfg.PotTableBlackTickTableMoneys !== undefined) {
              for (let i = 0; i < $this.CheatCfg.PotTableBlackTickTableMoneys.length; i++) {
                const result = $this.CheatCfg.PotTableBlackTickTableMoneys[i] / 1000
                const tableMoney = result % 1 === 0 ? result : parseFloat(result.toFixed(1))
                potTableBlackTickTableMoneys.push(tableMoney)
              }
            }
            $this.potTableBlackTickTableMoneys = potTableBlackTickTableMoneys.join(',')

            const jokerTableBlackTickTableMoneys = []
            if ($this.CheatCfg.JokerTableBlackTickTableMoneys !== undefined) {
              for (let i = 0; i < $this.CheatCfg.JokerTableBlackTickTableMoneys.length; i++) {
                const result = $this.CheatCfg.JokerTableBlackTickTableMoneys[i] / 1000
                const tableMoney = result % 1 === 0 ? result : parseFloat(result.toFixed(1))
                jokerTableBlackTickTableMoneys.push(tableMoney)
              }
            }
            $this.jokerTableBlackTickTableMoneys = jokerTableBlackTickTableMoneys.join(',')
            const quickTableBlackTickTableMoneys = []
            if ($this.CheatCfg.QuickTableBlackTickTableMoneys !== undefined) {
              for (let i = 0; i < $this.CheatCfg.QuickTableBlackTickTableMoneys.length; i++) {
                const result = $this.CheatCfg.QuickTableBlackTickTableMoneys[i] / 1000
                const tableMoney = result % 1 === 0 ? result : parseFloat(result.toFixed(1))
                quickTableBlackTickTableMoneys.push(tableMoney)
              }
            }
            $this.quickTableBlackTickTableMoneys = quickTableBlackTickTableMoneys.join(',')

            ////////////////////////////
            const potTableAutoBlackTableMoneys = []
            if ($this.CheatCfg.potTableAutoBlackTableMoneys !== undefined) {
              for (let i = 0; i < $this.CheatCfg.potTableAutoBlackTableMoneys.length; i++) {
                const result = $this.CheatCfg.potTableAutoBlackTableMoneys[i] / 1000
                const tableMoney = result % 1 === 0 ? result : parseFloat(result.toFixed(1))
                if (tableMoney <= 0) {
                  continue
                }
                potTableAutoBlackTableMoneys.push(tableMoney)
              }
            }
            $this.potTableAutoBlackTableMoneys = potTableAutoBlackTableMoneys.join(',')

            const jokerTableAutoBlackTableMoneys = []
            if ($this.CheatCfg.jokerTableAutoBlackTableMoneys !== undefined) {
              for (let i = 0; i < $this.CheatCfg.jokerTableAutoBlackTableMoneys.length; i++) {
                const result = $this.CheatCfg.jokerTableAutoBlackTableMoneys[i] / 1000
                const tableMoney = result % 1 === 0 ? result : parseFloat(result.toFixed(1))
                if (tableMoney <= 0) {
                  continue
                }
                jokerTableAutoBlackTableMoneys.push(tableMoney)
              }
            }
            $this.jokerTableAutoBlackTableMoneys = jokerTableAutoBlackTableMoneys.join(',')
            const quickTableAutoBlackTableMoneys = []
            if ($this.CheatCfg.quickTableAutoBlackTableMoneys !== undefined) {
              for (let i = 0; i < $this.CheatCfg.quickTableAutoBlackTableMoneys.length; i++) {
                const result = $this.CheatCfg.quickTableAutoBlackTableMoneys[i] / 1000
                const tableMoney = result % 1 === 0 ? result : parseFloat(result.toFixed(1))
                if (tableMoney <= 0) {
                  continue
                }
                quickTableAutoBlackTableMoneys.push(tableMoney)
              }
            }
            $this.quickTableAutoBlackTableMoneys = quickTableAutoBlackTableMoneys.join(',')

            const potTableBlackRadioTableMoneys = []
            if ($this.CheatCfg.potTableBlackRadioTableMoneys !== undefined) {
              for (let i = 0; i < $this.CheatCfg.potTableBlackRadioTableMoneys.length; i++) {
                const result = $this.CheatCfg.potTableBlackRadioTableMoneys[i] / 1000
                const tableMoney = result % 1 === 0 ? result : parseFloat(result.toFixed(1))
                if (tableMoney <= 0) {
                  continue
                }
                potTableBlackRadioTableMoneys.push(tableMoney)
              }
            }
            $this.potTableBlackRadioTableMoneys = potTableBlackRadioTableMoneys.join(',')

            const jokerTableBlackRadioTableMoneys = []
            if ($this.CheatCfg.jokerTableBlackRadioTableMoneys !== undefined) {
              for (let i = 0; i < $this.CheatCfg.jokerTableBlackRadioTableMoneys.length; i++) {
                const result = $this.CheatCfg.jokerTableBlackRadioTableMoneys[i] / 1000
                const tableMoney = result % 1 === 0 ? result : parseFloat(result.toFixed(1))
                if (tableMoney <= 0) {
                  continue
                }
                jokerTableBlackRadioTableMoneys.push(tableMoney)
              }
            }
            $this.jokerTableBlackRadioTableMoneys = jokerTableBlackRadioTableMoneys.join(',')
            const quickTableBlackRadioTableMoneys = []
            if ($this.CheatCfg.quickTableBlackRadioTableMoneys !== undefined) {
              for (let i = 0; i < $this.CheatCfg.quickTableBlackRadioTableMoneys.length; i++) {
                const result = $this.CheatCfg.quickTableBlackRadioTableMoneys[i] / 1000
                const tableMoney = result % 1 === 0 ? result : parseFloat(result.toFixed(1))
                if (tableMoney <= 0) {
                  continue
                }
                quickTableBlackRadioTableMoneys.push(tableMoney)
              }
            }
            $this.quickTableBlackRadioTableMoneys = quickTableBlackRadioTableMoneys.join(',')
            ////////////////////////////

            $this.nearID = $this.CheatCfg.NearID || $this.nearID

            if ($this.CheatCfg.GiveMoreTimes[0].BlackAdd === undefined) {
              for (let i = 0; i < $this.CheatCfg.GiveMoreTimes.length; i++) {
                $this.CheatCfg.GiveMoreTimes[i].BlackAdd = 3
              }
            }
            if ($this.CheatCfg.DisAndGive.BlackAdd === undefined) {
              $this.CheatCfg.DisAndGive.BlackAdd = 3
            }
            if ($this.CheatCfg.FirstGiveMoreTimes.length !== 10) {
              const FirstGiveMoreTimes = []
              for (let i = 0; i < 10; i++) {
                if ($this.CheatCfg.FirstGiveMoreTimes[i] === undefined) {
                  FirstGiveMoreTimes.push({
                    Per: 50,
                    MaybeAdd: 3,
                    BlackAdd: 3,
                    Count: i + 1
                  })
                } else {
                  FirstGiveMoreTimes.push({
                    Per: 50,
                    MaybeAdd: $this.CheatCfg.FirstGiveMoreTimes[i].MaybeAdd,
                    BlackAdd: 3,
                    Count: i + 1
                  })
                }
              }
              $this.CheatCfg.FirstGiveMoreTimes = FirstGiveMoreTimes
            }
            if ($this.CheatCfg.FirstGiveMoreTimes.length === 10) {
              for (let i = 0; i < 10; i++) {
                if ($this.CheatCfg.FirstGiveMoreTimes[i].Count === undefined) {
                  $this.CheatCfg.FirstGiveMoreTimes[i].Count = i + 1
                }
              }
            }
            if ($this.CheatCfg.BigPotWin[0].BlackAdd === undefined) {
              for (let i = 0; i < $this.CheatCfg.BigPotWin.length; i++) {
                $this.CheatCfg.BigPotWin[i].BlackAdd = 3
              }
            }
            if ($this.CheatCfg.BigPotLeave[0].BlackAdd === undefined) {
              for (let i = 0; i < $this.CheatCfg.BigPotLeave.length; i++) {
                $this.CheatCfg.BigPotLeave[i].BlackAdd = 3
              }
            }
            if ($this.CheatCfg.PlayMoreTimes[0].BlackAdd === undefined) {
              for (let i = 0; i < $this.CheatCfg.PlayMoreTimes.length; i++) {
                $this.CheatCfg.PlayMoreTimes[i].BlackAdd = 3
              }
            }
            if ($this.CheatCfg.SameName.BlackAdd === undefined) {
              $this.CheatCfg.SameName.BlackAdd = 3
            }
            if ($this.CheatCfg.LeaveFre.length === 3) {
              const LeaveFre = []
              for (let i = 1; i <= 10; i++) {
                let maybeAdd = 3
                if ($this.CheatCfg.LeaveFre[i] !== undefined) {
                  maybeAdd = $this.CheatCfg.LeaveFre[i].MaybeAdd
                }
                LeaveFre.push({
                  Per: i * 10,
                  MaybeAdd: maybeAdd
                })
              }
              $this.CheatCfg.LeaveFre = LeaveFre
            }
            // eslint-disable-next-line no-prototype-builtins
            if (!$this.CheatCfg.hasOwnProperty('SameName')) {
              $this.CheatCfg.SameName = {
                MaybeAdd: 3
              }
            }
            // eslint-disable-next-line no-prototype-builtins
            if (!$this.CheatCfg.hasOwnProperty('AiConfigRow')) {
              this.CheatCfg.AiConfigRow = NewRobotAIItem()
            }
            this.editAI = this.CheatCfg.AiConfigRow

            // eslint-disable-next-line no-prototype-builtins
            if (!$this.CheatCfg.hasOwnProperty('JokerAiConfigRow')) {
              this.CheatCfg.JokerAiConfigRow = NewRobotAIItem()
            }
            this.editAI = this.CheatCfg.AiConfigRow
            // eslint-disable-next-line no-prototype-builtins
            if (!$this.CheatCfg.hasOwnProperty('QuickAiConfigRow')) {
              this.CheatCfg.QuickAiConfigRow = NewRobotAIItem()
            }
            this.editAI = this.CheatCfg.AiConfigRow

            // eslint-disable-next-line no-prototype-builtins
            if (!this.CheatCfg.PotPercent) {
              this.CheatCfg.PotPercent = 0
            }
            this.editJokerAI = this.CheatCfg.JokerAiConfigRow
            this.editQuickAI = this.CheatCfg.QuickAiConfigRow
            this.AutoBlack = this.CheatCfg.AutoBlack || this.AutoBlack
            const maybeMin = $this.CheatCfg.MaybeMin
            $this.oldCheatMin = maybeMin
            const old = JSON.parse(response.Data.Data)
            // 设置修改之前数据
            $this.$refs.compare.SetOldVal(old)
          }
        }
      })
    },
    encodeData() {
      const cpy = {}
      this.CheatCfg.MaybeMin = parseInt(this.CheatCfg.MaybeMin)
      this.CheatCfg.PotPercent = parseInt(this.CheatCfg.PotPercent)
      this.CheatCfg.MaybeReduce = parseInt(this.CheatCfg.MaybeReduce)
      this.CheatCfg.TableBlackScore = parseInt(this.CheatCfg.TableBlackScore)
      this.CheatCfg.TableTickLeave = parseInt(this.TableTickLeave)
      const potItems = this.potTableBlackTickTableMoneys.split(',')
      this.CheatCfg.PotTableBlackTickTableMoneys = []
      for (const o in potItems) {
        this.CheatCfg.PotTableBlackTickTableMoneys.push(potItems[o] * 1000)
      }
      const jokerItems = this.jokerTableBlackTickTableMoneys.split(',')
      this.CheatCfg.JokerTableBlackTickTableMoneys = []
      for (const o in jokerItems) {
        this.CheatCfg.JokerTableBlackTickTableMoneys.push(jokerItems[o] * 1000)
      }
      const quickItems = this.quickTableBlackTickTableMoneys.split(',')
      this.CheatCfg.QuickTableBlackTickTableMoneys = []
      for (const o in quickItems) {
        this.CheatCfg.QuickTableBlackTickTableMoneys.push(quickItems[o] * 1000)
      }
      ///////////////////////////
      const potAutoItems = this.potTableAutoBlackTableMoneys.split(',')
      this.CheatCfg.potTableAutoBlackTableMoneys = []
      for (const o in potAutoItems) {
        this.CheatCfg.potTableAutoBlackTableMoneys.push(potAutoItems[o] * 1000)
      }
      const jokerAutoItems = this.jokerTableAutoBlackTableMoneys.split(',')
      this.CheatCfg.jokerTableAutoBlackTableMoneys = []
      for (const o in jokerAutoItems) {
        this.CheatCfg.jokerTableAutoBlackTableMoneys.push(jokerAutoItems[o] * 1000)
      }
      const quickAutoItems = this.quickTableAutoBlackTableMoneys.split(',')
      this.CheatCfg.quickTableAutoBlackTableMoneys = []
      for (const o in quickAutoItems) {
        this.CheatCfg.quickTableAutoBlackTableMoneys.push(quickAutoItems[o] * 1000)
      }
      const potRadioItems = this.potTableBlackRadioTableMoneys.split(',')
      this.CheatCfg.potTableBlackRadioTableMoneys = []
      for (const o in potRadioItems) {
        this.CheatCfg.potTableBlackRadioTableMoneys.push(potRadioItems[o] * 1000)
      }
      const jokerRadioItems = this.jokerTableBlackRadioTableMoneys.split(',')
      this.CheatCfg.jokerTableBlackRadioTableMoneys = []
      for (const o in jokerRadioItems) {
        this.CheatCfg.jokerTableBlackRadioTableMoneys.push(jokerRadioItems[o] * 1000)
      }
      const quickRadioItems = this.quickTableBlackRadioTableMoneys.split(',')
      this.CheatCfg.quickTableBlackRadioTableMoneys = []
      for (const o in quickRadioItems) {
        this.CheatCfg.quickTableBlackRadioTableMoneys.push(quickRadioItems[o] * 1000)
      }
      //////////////////////////////
      const NearID = []
      for (let i = 0; i < this.nearID.length; i++) {
        const item = this.nearID[i]
        NearID.push({
          Score: parseInt(item.Score),
          MaybeAdd: parseInt(item.MaybeAdd)
        })
      }
      this.CheatCfg.NearID = NearID

      const GiveMoreTimes = []
      for (let i = 0; i < this.CheatCfg.GiveMoreTimes.length; i++) {
        const item = this.CheatCfg.GiveMoreTimes[i]
        GiveMoreTimes.push({
          Count: parseInt(item.Count),
          MaybeAdd: parseInt(item.MaybeAdd),
          BlackAdd: parseInt(item.BlackAdd)
        })
      }
      this.CheatCfg.GiveMoreTimes = GiveMoreTimes
      const FirstGiveMoreTimes = []
      for (let i = 0; i < this.CheatCfg.FirstGiveMoreTimes.length; i++) {
        const item = this.CheatCfg.FirstGiveMoreTimes[i]
        FirstGiveMoreTimes.push({
          Per: parseInt(item.Per),
          MaybeAdd: parseInt(item.MaybeAdd),
          BlackAdd: parseInt(item.BlackAdd),
          Count: parseInt(item.Count)
        })
      }
      this.CheatCfg.FirstGiveMoreTimes = FirstGiveMoreTimes
      const DisAndGive = {
        Count: parseInt(this.CheatCfg.DisAndGive.Count),
        MaybeAdd: parseInt(this.CheatCfg.DisAndGive.MaybeAdd),
        BlackAdd: parseInt(this.CheatCfg.DisAndGive.BlackAdd)
      }
      this.CheatCfg.DisAndGive = DisAndGive
      const JokerDisAndGive = {
        Count: parseInt(this.JokerDisAndGive.Count),
        MaybeAdd: parseInt(this.JokerDisAndGive.MaybeAdd),
        BlackAdd: parseInt(this.JokerDisAndGive.BlackAdd)
      }
      this.CheatCfg.JokerDisAndGive = JokerDisAndGive
      const SameName = {
        MaybeAdd: parseInt(this.CheatCfg.SameName.MaybeAdd),
        BlackAdd: parseInt(this.CheatCfg.SameName.BlackAdd)
      }
      this.CheatCfg.SameName = SameName
      const playMoreTimes = []
      for (let i = 0; i < this.CheatCfg.PlayMoreTimes.length; i++) {
        const item = this.CheatCfg.PlayMoreTimes[i]
        playMoreTimes.push({
          Count: parseInt(item.Count),
          MaybeAdd: parseInt(item.MaybeAdd),
          BlackAdd: parseInt(item.BlackAdd)
        })
      }
      this.CheatCfg.PlayMoreTimes = playMoreTimes
      const LeaveFre = []
      for (let i = 0; i < this.CheatCfg.LeaveFre.length; i++) {
        const item = this.CheatCfg.LeaveFre[i]
        LeaveFre.push({
          Per: parseInt(item.Per),
          MaybeAdd: parseInt(item.MaybeAdd)
        })
      }
      this.CheatCfg.LeaveFre = LeaveFre
      const PreWinFight = []
      for (let i = 0; i < this.CheatCfg.PreWinFight.length; i++) {
        const item = this.CheatCfg.PreWinFight[i]
        PreWinFight.push({
          RangeMin: parseInt(item.RangeMin),
          RangeMax: parseInt(item.RangeMax),
          MaybeAdd: parseInt(item.MaybeAdd)
        })
      }
      this.CheatCfg.PreWinFight = PreWinFight
      const PreWinFold = []
      for (let i = 0; i < this.CheatCfg.PreWinFold.length; i++) {
        const item = this.CheatCfg.PreWinFold[i]
        PreWinFold.push({
          RangeMin: parseInt(item.RangeMin),
          RangeMax: parseInt(item.RangeMax),
          MaybeAdd: parseInt(item.MaybeAdd)
        })
      }
      this.CheatCfg.PreWinFold = PreWinFold
      const BigPotWin = []
      for (let i = 0; i < this.CheatCfg.BigPotWin.length; i++) {
        const item = this.CheatCfg.BigPotWin[i]
        BigPotWin.push({
          Count: parseInt(item.Count),
          MaybeAdd: parseInt(item.MaybeAdd),
          BlackAdd: parseInt(item.BlackAdd)
        })
      }
      this.CheatCfg.BigPotWin = BigPotWin
      const BigPotLeave = []
      for (let i = 0; i < this.CheatCfg.BigPotLeave.length; i++) {
        const item = this.CheatCfg.BigPotLeave[i]
        BigPotLeave.push({
          Count: parseInt(item.Count),
          MaybeAdd: parseInt(item.MaybeAdd),
          BlackAdd: parseInt(item.BlackAdd)
        })
      }
      this.CheatCfg.BigPotLeave = BigPotLeave
      this.CheatCfg.AiConfigRow = this.editAI
      this.CheatCfg.JokerAiConfigRow = this.editJokerAI
      this.CheatCfg.QuickAiConfigRow = this.editQuickAI

      // 拉黑配置
      this.CheatCfg.AutoBlack = this.AutoBlack
      Object.assign(cpy, this.CheatCfg)
      return JSON.stringify(cpy)
    },
    setData() {
      this.editAIVisible = false
      this.editJokerVisible = false
      this.editQuickVisible = false
      console.log('setData', this.CheatCfg)
      const $this = this
      this.form.Data = this.encodeData()
      // 设置修改后数据
      this.$refs.compare.SetNewVal(this.form.Data)
      this.$refs.compare.Compare(function(isEdit) {
        if (!isEdit) {
          Message.error('没有任何修改，不需要提交')
          return
        }
        request({
          url: 'customizeconfig/update',
          method: 'post',
          data: $this.form
        }).then(response => {
          if (response.RetCode === 0) {
            console.log('save', response)
            Message.success('保存成功')
          }
        })
      })
    },
    handleAIUpdate() {
      this.editAIVisible = true
    },
    handleJokerUpdate() {
      this.editJokerVisible = true
    },
    handleQuickUpdate() {
      this.editQuickVisible = true
    },
    getWinTimesTitle(item, index) {
      if (index === this.CheatCfg.BigPotWin.length - 1) {
        return item.Count + '次及以上'
      } else {
        return item.Count + '次'
      }
    },
    getTableBlackTickTableMoneys(tableMoneys) {
      return tableMoneys.join(',')
    },
    getBigPotLeaveTitle(item, index) {
      if (index === this.CheatCfg.BigPotLeave.length - 1) {
        return item.Count + '人及以上'
      } else {
        return item.Count + '人'
      }
    },
    getPlayMoreTimesTitle(item, index) {
      if (index === this.CheatCfg.PlayMoreTimes.length - 1) {
        return '>=' + item.Count
      } else {
        return item.Count
      }
    },
    updateCheatMin(maybeMin) {
      request({
        url: '/dataProxy/info',
        method: 'post',
        data: {
          Env: this.env,
          Path: '/misc/tongits/cheat/update/cheat/cfg',
          MaybeMin: maybeMin,
          Gid: 22
        }
      }).then(response => {
      })
    },
    addAutoBlackButton() {
      return (
        <div>
          <span>操作</span>
          <el-button type='primary' size='mini' style='padding:5px;margin-left:5px;' onClick={() => this.doAddAutoBlack()}>添加范围</el-button>
        </div>
      )
    },
    doAddAutoBlack() {
      console.log('AutoBlack')
      this.AutoBlack.push(
        {
          CheatRadio: 0,
          CheatScoreMin: 0,
          CheatScoreMax: 0
        }
      )
    },
    delAutoBlackRow(mine, row) {
      console.log('mine:' + mine, row)
      this.AutoBlack.splice(mine, 1)
    }
  }
}
</script>

<template>
  <div id="app" class="page-container" style="padding: 10px">
    <div style="margin-bottom: 20px;">
      <publish primary-key="ID" :key-id="getFullKey()" :env-empty="false" compare-type="CustomizeConfig" />
    </div>
    <el-tabs type="border-card">
      <el-tab-pane label="通用配置">
        <el-descriptions :column="2" :colon="false" border>
          <el-descriptions-item label="疑似度⻔槛" :content-style="{'text-align': 'center','width': '250px'}" :label-style="{'text-align': 'center'}">
            <el-input v-model.number="CheatCfg.MaybeMin" type="number" size="medium" style="width: 120px" />
          </el-descriptions-item>
          <el-descriptions-item label="踢人⻔槛" :content-style="{'text-align': 'center','width': '250px'}" :label-style="{'text-align': 'center'}">
            <el-input v-model.number="CheatCfg.TickScore" type="number" size="medium" style="width: 120px" />
          </el-descriptions-item>
          <el-descriptions-item label="疑似踢人开关" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-switch
              v-model="CheatCfg.IsAutoMaybe"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-descriptions-item>
          <el-descriptions-item label="疑似度降低值" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model.number="CheatCfg.MaybeReduce" type="number" size="medium" style="width: 120px" />
          </el-descriptions-item>
          <el-descriptions-item label="机器人pot百分比" :content-style="{'text-align': 'center','width': '250px'}" :label-style="{'text-align': 'center'}">
            <!--            <el-input v-model.number="CheatCfg.PotPercent" type="number" size="medium" style="width: 120px"><span>%</span></el-input>-->
            <template>
              <div>
                <el-input v-model.number="CheatCfg.PotPercent" type="number" size="medium" style="width: 120px" />
                <span>%</span>
              </div>
            </template>
          </el-descriptions-item>
          <el-descriptions-item label="POT同一桌积分自动拉黑" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="CheatCfg.TableBlackScore" type="number" size="medium" style="width: 120px" />
          </el-descriptions-item>
          <el-descriptions-item label="组合作弊离桌人数门槛" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="TableTickLeave" type="number" size="medium" style="width: 120px" />
          </el-descriptions-item>
          <el-descriptions-item label="POT防作弊机器⼈" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-document-copy"
              @click="handleAIUpdate()"
            >修改
            </el-button>
          </el-descriptions-item>
          <el-descriptions-item label="JOKER防作弊机器⼈" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-document-copy"
              @click="handleJokerUpdate()"
            >修改
            </el-button>
          </el-descriptions-item>
          <el-descriptions-item label="QUICK防作弊机器⼈" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-document-copy"
              @click="handleQuickUpdate()"
            >修改
            </el-button>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1" :colon="false" border>
          <el-descriptions-item label="POT开通同一桌积分拉黑场次" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="potTableBlackTickTableMoneys" size="medium" style="width: 1000px" />
          </el-descriptions-item>
          <el-descriptions-item label="JOKER开通同一桌积分拉黑场次" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="jokerTableBlackTickTableMoneys" size="medium" style="width: 1000px" />
          </el-descriptions-item>
          <el-descriptions-item label="QUICK开通同一桌积分拉黑场次" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="quickTableBlackTickTableMoneys" size="medium" style="width: 1000px" />
          </el-descriptions-item>

          <el-descriptions-item label="POT开通保底自动拉黑场次" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="potTableAutoBlackTableMoneys" size="medium" style="width: 1000px" />
          </el-descriptions-item>
          <el-descriptions-item label="JOKER开通保底自动拉黑场次" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="jokerTableAutoBlackTableMoneys" size="medium" style="width: 1000px" />
          </el-descriptions-item>
          <el-descriptions-item label="QUICK开通保底自动拉黑场次" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="quickTableAutoBlackTableMoneys" size="medium" style="width: 1000px" />
          </el-descriptions-item>

          <el-descriptions-item label="POT开通按照异常局拉黑场次" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="potTableBlackRadioTableMoneys" size="medium" style="width: 1000px" />
          </el-descriptions-item>
          <el-descriptions-item label="JOKER开通按照异常局拉黑场次" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="jokerTableBlackRadioTableMoneys" size="medium" style="width: 1000px" />
          </el-descriptions-item>
          <el-descriptions-item label="QUICK开通按照异常局拉黑场次" :content-style="{'text-align': 'center'}" :label-style="{'text-align': 'center'}">
            <el-input v-model="quickTableBlackRadioTableMoneys" size="medium" style="width: 1000px" />
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="疑似度配置">
        <h3 class="title">操作异常增加疑似度配置</h3>
        <div class="table-container">
          <h5 class="title">单局多次喂牌</h5>
          <table class="support-table">
            <thead>
              <tr>
                <th>单局多次喂牌</th>
                <th v-for="(item, index) in CheatCfg.GiveMoreTimes" :key="'h'+index">
                  {{ item.Count }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>增加疑似度</td>
                <td v-for="(item, index) in CheatCfg.GiveMoreTimes" :key="'h'+index">
                  <el-input v-model="item.MaybeAdd" type="number" size="medium" style="width: 120px" />
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td>和黑子额外加分</td>
                <td v-for="(item, index) in CheatCfg.GiveMoreTimes" :key="'h'+index">
                  <el-input v-model="item.BlackAdd" type="number" size="medium" style="width: 120px" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-container">
          <h5 class="title">打一局放弃pot离桌：</h5>
          <table class="support-table">
            <thead>
              <tr>
                <th>连续触发局数</th>
                <th v-for="(item, index) in CheatCfg.LeaveFre" :key="'h'+index">
                  {{ item.Per*10/100 }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>增加疑似度</td>
                <td v-for="(item, index) in CheatCfg.LeaveFre" :key="'h'+index">
                  <el-input v-model="item.MaybeAdd" type="number" size="medium" style="width: 120px" />
                </td>
              </tr>
            </tbody>
          </table>
          <!--          <el-form v-model="CheatCfg" label-width="150px" style="margin-top: 10px">-->
          <!--            <el-form-item label="增加疑似分">-->
          <!--              <el-input v-model.number="CheatCfg.LeaveFre[1].MaybeAdd" type="number" size="medium" style="width: 120px" />-->
          <!--            </el-form-item>-->
          <!--          </el-form>-->
        </div>
        <div class="table-container">
          <h5 class="title">皇冠⾼分Fight：皇冠⽐Challenge玩家⾼多少分Fight</h5>
          <table class="support-table">
            <thead>
              <tr>
                <th>Fight异常分数差区间</th>
                <th v-for="(item, index) in CheatCfg.PreWinFight" :key="'h'+index">
                  <template>
                    <div style="display: flex; align-items: center; justify-content: center;">
                      <el-input
                        v-model="item.RangeMin"
                        style="width: 80px; margin-right: 5px;"
                        type="number"
                      />
                      <span>-</span>
                      <el-input
                        v-model="item.RangeMax"
                        style="width: 80px; margin-left: 5px;"
                        type="number"
                      />
                    </div>
                  </template>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>增加疑似度</td>
                <td v-for="(item, index) in CheatCfg.PreWinFight" :key="'h'+index">
                  <el-input v-model="item.MaybeAdd" class="centered-input" type="number" size="medium" style="width: 120px" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-container">
          <h5 class="title">皇冠低分Fold：皇冠⽐fight赢家低多少分Fold</h5>
          <table class="support-table">
            <thead>
              <tr>
                <th>FOLD异常分数差区间</th>
                <th v-for="(item, index) in CheatCfg.PreWinFold" :key="'h'+index">
                  <template>
                    <div style="display: flex; align-items: center; justify-content: center;">
                      <el-input
                        v-model="item.RangeMin"
                        style="width: 80px; margin-right: 5px;"
                        type="number"
                      />
                      <span>-</span>
                      <el-input
                        v-model="item.RangeMax"
                        style="width: 80px; margin-left: 5px;"
                        type="number"
                      />
                    </div>
                  </template>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>增加疑似度</td>
                <td v-for="(item, index) in CheatCfg.PreWinFold" :key="'h'+index">
                  <el-input v-model="item.MaybeAdd" class="centered-input" type="number" size="medium" style="width: 120px" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-container">
          <h5 class="title">POT拆成牌喂牌</h5>
          <el-form v-model="CheatCfg" label-width="150px" style="margin-top: 10px">
            <el-form-item label="拆成牌喂牌">
              <el-input v-model.number="CheatCfg.DisAndGive.MaybeAdd" type="number" size="medium" style="width: 120px" />
            </el-form-item>
            <el-form-item label="和黑子额外加分">
              <el-input v-model.number="CheatCfg.DisAndGive.BlackAdd" type="number" size="medium" style="width: 120px" />
            </el-form-item>
          </el-form>
        </div>
        <div class="table-container">
          <h5 class="title">JOKER拆成牌喂牌</h5>
          <el-form v-model="JokerDisAndGive" label-width="150px" style="margin-top: 10px">
            <el-form-item label="拆成牌喂牌">
              <el-input v-model.number="JokerDisAndGive.MaybeAdd" type="number" size="medium" style="width: 120px" />
            </el-form-item>
            <el-form-item label="和黑子额外加分">
              <el-input v-model.number="JokerDisAndGive.BlackAdd" type="number" size="medium" style="width: 120px" />
            </el-form-item>
          </el-form>
        </div>
        <div class="table-container">
          <h5 class="title">多局⾸出被吃(5局>=3次)</h5>
          <table class="support-table">
            <thead>
              <tr>
                <th>同一桌加分的次数</th>
                <th v-for="(item, index) in CheatCfg.FirstGiveMoreTimes" :key="'h'+index">
                  第{{ item.Count }}次
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>增加疑似度</td>
                <td v-for="(item, index) in CheatCfg.FirstGiveMoreTimes" :key="'h'+index">
                  <el-input v-model="item.MaybeAdd" class="center-input" type="number" size="medium" style="width: 120px" />
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td>和黑子额外疑似度</td>
                <td v-for="(item, index) in CheatCfg.FirstGiveMoreTimes" :key="'h'+index">
                  <el-input v-model="item.BlackAdd" class="center-input" type="number" size="medium" style="width: 120px" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3 class="title">数据异常增加疑似度配置</h3>
        <div class="table-container">
          <h5 class="title">玩家在Pot累积局未被拿胜率超过50%</h5>
          <table class="support-table">
            <thead>
              <tr>
                <th>玩家该桌总局数</th>
                <th v-for="(item, index) in CheatCfg.BigPotWin" :key="'h'+index">
                  {{ getWinTimesTitle(item,index) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>增加疑似度</td>
                <td v-for="(item, index) in CheatCfg.BigPotWin" :key="'h'+index">
                  <el-input v-model="item.MaybeAdd" type="number" size="medium" style="width: 120px" />
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td>和黑子额外加分</td>
                <td v-for="(item, index) in CheatCfg.BigPotWin" :key="'h'+index">
                  <el-input v-model="item.BlackAdd" type="number" size="medium" style="width: 120px" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-container">
          <h5 class="title">作弊组合一起时POT不为0时根据离桌人数每次加分</h5>
          <table class="support-table">
            <thead>
              <tr>
                <th>⼤Pot多⼈离场</th>
                <th v-for="(item, index) in CheatCfg.BigPotLeave" :key="'h'+index">
                  {{ getBigPotLeaveTitle(item,index) }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>增加疑似度</td>
                <td v-for="(item, index) in CheatCfg.BigPotLeave" :key="'h'+index">
                  <el-input v-model="item.MaybeAdd" type="number" size="medium" style="width: 120px" />
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td>和黑子额外加分</td>
                <td v-for="(item, index) in CheatCfg.BigPotLeave" :key="'h'+index">
                  <el-input v-model="item.BlackAdd" type="number" size="medium" style="width: 120px" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-container">
          <h5 class="title">对局过多并盈利</h5>
          <table class="support-table">
            <thead>
              <tr>
                <th>对局过多并盈利</th>
                <th v-for="(item, index) in CheatCfg.PlayMoreTimes" :key="'h'+index">
                  <el-input v-model="item.Count" type="number" size="medium" style="width: 120px" />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>增加疑似度</td>
                <td v-for="(item, index) in CheatCfg.PlayMoreTimes" :key="'h'+index">
                  <el-input v-model="item.MaybeAdd" type="number" size="medium" style="width: 120px" />
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td>和黑子额外加分</td>
                <td v-for="(item, index) in CheatCfg.PlayMoreTimes" :key="'h'+index">
                  <el-input v-model="item.BlackAdd" type="number" size="medium" style="width: 120px" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="table-container">
          <h5 class="title">名字相似度</h5>
          <el-form v-model="CheatCfg" label-width="150px" style="margin-top: 10px">
            <el-form-item label="名字相似度高于70%">
              <el-input v-model.number="CheatCfg.SameName.MaybeAdd" type="number" size="medium" style="width: 120px" />
            </el-form-item>
            <el-form-item label="和黑子额外加分">
              <el-input v-model.number="CheatCfg.SameName.BlackAdd" type="number" size="medium" style="width: 120px" />
            </el-form-item>
          </el-form>
        </div>
        <h3 class="title">额外增加疑似度配置</h3>

        <div class="table-container">
          <h5 class="title">ID相近额外加分</h5>
          <table class="support-table">
            <thead>
              <tr>
                <th>ID的差值</th>
                <th v-for="(item, index) in nearID" :key="'h'+index">
                  {{ item.Score }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>增加疑似度</td>
                <td v-for="(item, index) in nearID" :key="'h'+index">
                  <el-input v-model="item.MaybeAdd" type="number" size="medium" style="width: 120px" />
                </td>
              </tr>
            </tbody>

          </table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="自动拉黑配置">
        <el-row style="padding-top: 5px">
          <h3 style="text-align:center;">拉黑配置</h3>
          <el-col :span="24">
            <div style="padding-top: 10px">
              <el-table
                :data="AutoBlack"
                stripe
                border
                style="width: 100%"
              >
                <el-table-column
                  label="作弊分值最小值（闭）"
                  width="120"
                >
                  <template scope="subScope">
                    <el-input v-model.number="subScope.row.CheatScoreMin" />
                  </template>
                </el-table-column>

                <el-table-column
                  label="作弊分值最大值（开）"
                  width="120"
                >
                  <template scope="subScope">
                    <el-input v-model.number="subScope.row.CheatScoreMax" />
                  </template>
                </el-table-column>

                <el-table-column
                  label="异常局占比（%）"
                  width="120"
                >
                  <template scope="subScope">
                    <el-input v-model.number="subScope.row.CheatRadio" />
                  </template>
                </el-table-column>

                <el-table-column label="操作" :render-header="(h,obj)=>addAutoBlackButton()">
                  <template scope="subScope">
                    <el-button
                      size="mini"
                      type="danger"
                      @click="delAutoBlackRow(subScope.$index,subScope.row)"
                    >删除</el-button>
                  </template>
                </el-table-column>

              </el-table>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <div style="margin-bottom: 20px;">
      <el-button type="primary" @click="setData">保存信息</el-button>
    </div>
    <el-dialog
      title="pot贴防机器人配置"
      :visible.sync="editAIVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit" :model="editAI" width="70%" label-position="top">
        <el-row>
          <el-tabs type="border-card">
            <el-tab-pane label="机器人挑战">
              <robot-ai-setting-fight v-model="editAI" />
            </el-tab-pane>
            <el-tab-pane label="机器人面对挑战">
              <robot-ai-setting-challenge v-model="editAI" />
            </el-tab-pane>
            <el-tab-pane label="放牌配置">
              <robot-ai-setting-drop v-model="editAI" />
            </el-tab-pane>
            <el-tab-pane label="出牌配置">
              <robot-ai-setting-out-card v-model="editAI" />
            </el-tab-pane>
            <el-tab-pane label="好牌配置">
              <robot-ai-setting-build-card v-model="editAI" />
            </el-tab-pane>
            <el-tab-pane label="决策配置">
              <robot-ai-setting-decision v-model="editAI" />
            </el-tab-pane>
          </el-tabs>
        </el-row>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="setData">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="quick贴防机器人配置"
      :visible.sync="editQuickVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit" :model="editQuickAI" width="70%" label-position="top">
        <el-row>
          <el-tabs type="border-card">
            <el-tab-pane label="机器人挑战">
              <robot-ai-setting-fight v-model="editQuickAI" />
            </el-tab-pane>
            <el-tab-pane label="机器人面对挑战">
              <robot-ai-setting-challenge v-model="editQuickAI" />
            </el-tab-pane>
            <el-tab-pane label="放牌配置">
              <robot-ai-setting-drop v-model="editQuickAI" />
            </el-tab-pane>
            <el-tab-pane label="出牌配置">
              <robot-ai-setting-out-card v-model="editQuickAI" />
            </el-tab-pane>
            <el-tab-pane label="好牌配置">
              <robot-ai-setting-build-card v-model="editQuickAI" game-type="joker" />
            </el-tab-pane>
            <el-tab-pane label="决策配置">
              <robot-ai-setting-decision v-model="editQuickAI" />
            </el-tab-pane>
          </el-tabs>
        </el-row>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="setData">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="joker贴防机器人配置"
      :visible.sync="editJokerVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form ref="edit" :model="editJokerAI" width="70%" label-position="top">
        <el-row>
          <el-tabs type="border-card">
            <el-tab-pane label="机器人挑战">
              <robot-ai-setting-fight v-model="editJokerAI" />
            </el-tab-pane>
            <el-tab-pane label="机器人面对挑战">
              <robot-ai-setting-challenge v-model="editJokerAI" />
            </el-tab-pane>
            <el-tab-pane label="放牌配置">
              <robot-ai-setting-drop v-model="editJokerAI" />
            </el-tab-pane>
            <el-tab-pane label="出牌配置">
              <robot-ai-setting-out-card v-model="editJokerAI" />
            </el-tab-pane>
            <el-tab-pane label="好牌配置">
              <robot-ai-setting-build-card v-model="editJokerAI" game-type="joker" />
            </el-tab-pane>
            <el-tab-pane label="决策配置">
              <robot-ai-setting-decision v-model="editJokerAI" />
            </el-tab-pane>
          </el-tabs>
        </el-row>
        <el-form-item>
          <el-row>
            <el-col :span="12" :offset="10">
              <el-button type="primary" size="medium" @click="setData">保存</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--对比组件-->
    <compare ref="compare" />
  </div>
</template>

<style>
.table-container {
  margin: 20px;
}

.support-table {
  border-collapse: collapse; /* 合并边框 */
  width: 100%;
  max-width: 500px;
  margin: 0 0;
  font-family: Arial, sans-serif;
}

.support-table th,
.support-table td {
  border: 1px solid #ddd; /* 边框样式 */
  padding: 8px;
  text-align: center; /* 文字居中 */
}

.support-table th {
  background-color: #f2f2f2; /* 表头背景色 */
  font-weight: bold;
}

.support-table tr:hover {
  background-color: #f1f1f1; /* 鼠标悬停效果 */
}
.centered-input >>> .el-input__inner {
  text-align: center;
  font-size: 16px;
  padding: 10px 15px;
}
</style>
