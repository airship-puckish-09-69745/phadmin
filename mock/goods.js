const Mock = require('mockjs')

const GoodsList = []

for (let i = 0; i < 100; i++) {
  GoodsList.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    name: '@title(5, 10)',
    price: '@float(0, 100, 2, 2)'
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/goods/list',
    type: 'get',
    response: config => {
      const { page = 1, limit = 20 } = config.query

      const pageList = GoodsList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: GoodsList.length,
          items: pageList,
        }
      }
    }
  },

  {
    url: '/vue-element-admin/goods/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const goods of GoodsList) {
        if (goods.id === +id) {
          return {
            code: 20000,
            data: goods
          }
        }
      }
    }
  },

  {
    url: '/vue-element-admin/goods/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/goods/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
