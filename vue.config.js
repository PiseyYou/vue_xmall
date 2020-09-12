const fs = require('fs')

function pagination(pageSize, currentPage, arr) {
  const skipNum = (currentPage - 1) * pageSize
  const newArr = (skipNum + pageSize >= arr.length) ? arr.slice(skipNum, arr.length) : arr.slice(skipNum, skipNum + pageSize)
  return newArr
}

function range(arr, gt, lte) {
  return arr.filter(item => item.salePrice >= gt && item.salePrice <= lte)
}

function sortBy(attr, rev) {
  if (rev === undefined) {
    rev = 1
  } else {
    rev = rev ? 1 : -1
  }
  return function (a, b) {
    a = a[attr]
    b = b[attr]
    if (a < b) {
      return rev * -1
    }
    if (a > b) {
      return rev * 1
    }
    return 0
  }
}

module.exports = {
  devServer: {
    before(app, serve) {
      app.get('/api/goods/home', (req, res) => {
        fs.readFile('./db/home.json', 'utf8', (err, data) => {
          if (!err) {
            res.json(JSON.parse(data))
          }
        })
      })
      app.get('/api/goods/allGoods', (req, res) => {
        // 获取的是前端地址栏上的查询参数
        const page = parseInt(req.query.page)
        const size = parseInt(req.query.size)
        const sort = parseInt(req.query.sort)
        const gt = parseInt(req.query.priceGt)
        const lte = parseInt(req.query.priceLte)
        const cid = req.query.cid
        console.log(res.query)
        let newData = []
        fs.readFile('./db/allGoods.json', 'utf8', (err, data) => {
          if (!err) {
            const {
              result
            } = JSON.parse(data)
            const allData = result.data
            // 分页显示
            newData = pagination(size, page, allData)
            if (cid === '1184') { // 品牌周边
              newData = allData.filter((item) => item.productName.match(RegExp(/Smartisan/)))
              if (sort === 1) { // 价格由低到高
                newData = newData.sort(sortBy('salePrice', true))
              } else if (sort === -1) { // 价格由高到低
                newData = newData.sort(sortBy('salePrice', false))
              }
            } else {
              if (sort === 1) { // 价格由低到高
                newData = newData.sort(sortBy('salePrice', true))
              } else if (sort === -1) { // 价格由高到低
                newData = newData.sort(sortBy('salePrice', false))
              }
              if (gt && lte) {
                // 过滤 10~1000
                newData = range(newData, gt, lte)
              }
              // 32
            }

            if (newData.length < size) {
              res.json({
                data: newData,
                total: newData.length
              })
            } else {
              res.json({
                data: newData,
                total: allData.length
              })
            }
          }
        })
      })
    }
  }
}
