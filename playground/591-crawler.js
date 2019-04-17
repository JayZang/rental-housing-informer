// Http Request
const axios = require('axios')

// 後端 jQuery
const cheerio = require('cheerio')

;(async function() {
    let CSRF_Token = null
    let new_591_session = null

    // Request 靜態頁面用以取得 CSRF_Token 和 591_new_session
    await axios.get('https://rent.591.com.tw/')
        .then((res) => {
            let body = res.data
            let $ = cheerio.load(body)
            let target = $('meta[name="csrf-token"]')
            CSRF_Token = target.attr('content')

            let setCookies = res.headers['set-cookie']
            setCookies.forEach((item) => {
                if (!item.includes('591_new_session'))
                    return
                
                let keyValue = item.split(';')[0]
                new_591_session = keyValue.split('=')[1]
            })
        })
    
    const queryArr = [
        'kind=1&is_new_list=1&type=1&searchtype=1&region=1&section=3,7,10,1&pattern=4&order=money&orderType=asc',
        'kind=3&region=3&section=47&rentprice=2&not_cover=1&order=money&orderType=asc',
        'kind=2&mrtline=168&mrtline=168&region=1&section=1,2,3,4,5,6,7,11&rentprice=,12000&option=cold,washer,bed&other=balcony_1&not_cover=1'
    ]

    console.log(`Init: ${new_591_session}`)
    queryArr.forEach(async (query, index) => {
        // 使用剛剛取得的 CSRF_Token 和 591_new_session 來 request 591 API
        const region = query.split('&').filter(param => param.split('=')[0] === 'region')[0].split('=')[1]
        let data = await axios({
            method: 'get',
            url: `https://rent.591.com.tw/home/search/rsList?${query}`,
            responseType: 'json',
            headers: {
                'X-CSRF-TOKEN': CSRF_Token,
                'Cookie': `591_new_session=${new_591_session}; urlJumpIp=${region}`
            }
        }).then((res) => {
            let setCookies = res.headers['set-cookie']
            setCookies.forEach((item) => {
                if (!item.includes('591_new_session'))
                    return

                let keyValue = item.split(';')[0]
                new_591_session = keyValue.split('=')[1]
            })

            console.log(`${index}: ${res.data.data.data.length}筆; ${new_591_session}`)
            return res.data
        }).catch((err) => {
            console.log(err)
        })
    })
})()