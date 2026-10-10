import { IsMars, IsProd } from '@/utils/env'

export const systemMoneyChart = {
  data: () => {
    return {
      gameNames: {
        10: 'Crash',
        15: 'Texas Poker',
        51: '凤凰',
        52: '睡美人',
        21: 'Pusoy',
        22: 'Tongits-Pot',
        23: 'Lucky 9',
        25: 'Color',
        20: 'MINES',
        34: 'Pusoy-Dos',
        49: 'Niu Niu',
        100: 'Tower',
        76: 'Candy Rush',
        77: '糖果传奇Allline',
        78: 'SuperGems',
        79: 'CandyCrazeMars',
        80: 'Candy Craze',
        81: 'SuperGemsMars',
        82: 'Millionaire',
        83: 'MillionaireMars',
        84: 'Fortune Ace',
        85: 'FortuneAce',
        154: 'GrandAce',
        160: 'GigaAce',
        86: 'SuperGems2',
        87: '超级宝宝石II Mars',
        88: 'Lucky777',
        90: 'Fortune Coming',
        92: 'Ultra Ace',
        94: 'Wild Buffalo',
        96: 'Roman Arena',
        98: 'Super Tongit',
        28: 'Tongits Joker',
        29: 'Tongits Quick',
        31: 'Tongits-经典',
        32: 'Texas Plus',
        2032: 'Texas MTT',
        101: 'Sicbo',
        102: 'Hilo',
        103: 'Windrop',
        119: 'Windropc积分',
        6: '7Up7Down',
        104: 'Dragon Tiger',
        35: 'Solitaire',
        37: 'BlackJack',
        46: 'Domino',
        47: '8 Ball Plus',
        48: '9 Ball Plus',
        105: 'Andar Bahar',
        106: 'PIGGY TAP',
        500: 'Gold Master',
        501: 'Balloon Tap',
        107: 'Baccarat',
        108: 'Dropball',
        110: 'VideoPoker',
        111: 'Domino QiuQiu',
        112: 'Wingo',
        113: 'PusoySwap',
        115: 'Multi NiuNiu',
        116: 'Gin Rummy',
        117: 'Uno',
        152: 'Aladdin\'s Lamp',
        150: 'SuperGems3',
        156: 'Crazy Ace',
        158: 'Shark Kingdom',
        168: 'Pharaoh\'s Treasure',
        118: 'Car Racing',
        120: 'Tongits Swap',
        162: 'Major Ace',
        166: 'Fire Link',
        164: 'MahjongFortune',
        165: 'MahjongFortuneMars',
        198: 'FortuneBlessing',
        202: 'FortunateEbisu',
        206: 'LuckyWineglass',
        212: 'PirateShip',
        218: 'WrathOfZeus2',
        228: 'JokerAce',
        188: 'StreetFighting',
        190: 'Arcane Egypt',
        192: 'BountyRaid',
        180: 'FishingMaster',
        172: 'WrathOfZeus',
        122: 'Filipino Mahjong',
        123: 'MINES SHOWDOWN',
        124: 'Jackpot Wheel',
        125: 'Free Spin',
        170: 'Epic Ace',
        174: 'Treasure Bowl',
        176: 'Puppy Home',
        182: 'God Of Fortune',
        184: 'Dance of the Lion',
        186: 'MahjongJackpot',
        178: 'Mayan Totem',
        194: 'GoldTrain',
        196: 'GoldMiner',
        200: 'AtlantisTreasure',
        204: 'Space Treasure',
        208: 'Candy Burst',
        210: 'Lucky Spirits',
        214: 'PumpkinCash',
        216: 'Phoenix',
        220: 'Golden Dragon',
        222: 'Lion Fortune',
        226: 'Fortune Wheel',
        230: 'Pahiyas Win\'s',
        232: 'Mafia Wars',
        234: 'Fortune Tree',
        236: 'Pacquiao Fortune',
        238: 'Masskara Fortune',
        240: 'Bathala Age of Creation',
        242: 'Museo Yaman',
        244: 'Wild Bone',
        248: 'Mayan Temple',
        250: 'Light Of Mactan',
        271: 'Sweet Bonanza 5000',
        9: 'Teen Patti',
        126: 'Pusoy Wild',
        2031: 'TongitsMtt',
        127: 'SaBong',
        128: 'Tongits JP',
        129: 'Live Color',
        130: 'Remi',
        131: 'Remi Pro',
        132: 'Mines Magic',
        134: 'Pusoy JP',
        1: 'Rummy',
        135: 'Super Color',
        136: 'Limbo',
        137: 'BlackjackMH',
        138: 'Chicken Go',
        139: 'Manny Punch',
        140: 'HiloPlus',
        141: 'Pirate Scratch',
        142: 'Pirate Tap',
        143: 'Triple Wheels Spin',
        2033: 'PusoyMtt',
        10000: '汇总'
      },
      defaultOrder: [10000, 15, 22, 28, 29, 2031, 23, 25, 10, 21, 20, 34, 100, 102, 101, 103, 104, 105, 106, 500, 501, 111, 6, 32, 2032,
        35, 37, 107, 108, 110, 112, 115, 46, 47, 48, 49, 113, 118, 123, 117, 116, 126, 127, 128, 129, 132, 134, 135, 136, 137, 138, 139, 140, 141, 230, 2033, 142, 143] // 糖果传奇调用addGameNames特殊处理
    }
  },
  methods: {
    isPopType(o) {
      const popTypes = [1, 9, 8, 14, 15, 21, 22, 29, 23, 28, 31, 34, 2032, 46, 47, 48, 35, 49, 113, 122, 130, 131]
      for (let i = 0; i < popTypes.length; i++) {
        if (popTypes[i] === o) {
          return false
        }
      }
      return true
    },
    isPoker(o) {
      const pokerTypes = [22, 21, 28, 15, 23, 29, 34, 32, 49, 46, 35, 113, 120, 123, 117, 116, 126, 128, 134]
      for (let i = 0; i < pokerTypes.length; i++) {
        if (pokerTypes[i] === o) {
          return true
        }
      }
      return false
    },
    isSlots(o) {
      if ((o > 50 && o < 100) || (o > 149 && o < 500)) {
        return true
      } else {
        return false
      }
    },
    isActivity(o) {
      if (o && o.Bet !== 0) {
        return true
      } else {
        return false
      }
    },
    isTexasMaster(o) {
      if (o === 32) {
        return true
      } else {
        return false
      }
    },
    getSummaryClass(ob, isSlot) {
      if (ob && ob.Bet !== 0) {
        let systemGot = ob.Lose + ob.Tax - ob.Won
        if (isSlot) {
          systemGot = ob.Bet - ob.Won
        }
        const rate = systemGot * 100 / ob.Bet
        if (rate > 5.5) {
          return 'card-panel-OK'
        } else if (rate < 4.5) {
          return 'card-panel-Danger'
        } else {
          return 'card-panel-Normal'
        }
      } else {
        return 'card-panel-Normal'
      }
    },
    getSummaryResult(ob, isSlots) {
      if (ob && ob.Bet !== 0) {
        let systemGot = ob.Lose + ob.Tax - ob.Won
        if (isSlots) {
          systemGot = ob.Bet - ob.Won
        }
        // if (this.authorityNum>0){
        //   systemGot = ob.Bet - ob.Won
        // }
        return systemGot * 100 / ob.Bet
      } else {
        return 0
      }
    },
    getSystemGot(ob, isSlots) {
      if (ob) {
        if (isSlots) {
          return this.formatNumber(Math.floor((ob.Bet - ob.Won) / 1000))
        } else {
          // let flag = true
          // 汇总只有老虎机的时候
          // for (const o of this.defaultOrder) {
          //   if (!this.isSlots(o) && o!==10000){
          //     flag = false
          //   }
          // }
          //
          // if (flag) {
          //   return this.formatNumber(Math.floor((ob.Bet - ob.Won) / 1000))
          // }
          // if (this.authorityNum>0){
          //   return this.formatNumber(Math.floor((ob.Bet - ob.Won) / 1000))
          // }
          return this.formatNumber(Math.floor((ob.Lose + ob.Tax - ob.Won) / 1000))
        }
      }
    },
    getRtp(ob) {
      if (ob && ob.Bet !== 0) {
        return (ob.Won * 100 / ob.Bet).toFixed(2)
      }
      return 0
    },
    formatNumber(n) {
      return n.toLocaleString()
    }
  }
}
