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
    
    console.log('CSRF Token:')
    console.log(CSRF_Token)

    console.log('591 New Session:')
    console.log(new_591_session)

    // 使用剛剛取得的 CSRF_Token 和 591_new_session 來 request 591 API
    let data = await axios({
        method: 'get',
        url: 'https://rent.591.com.tw/home/search/rsList?is_new_list=1&type=1&kind=1&searchtype=1&region=1&patternMore=4,5',
        responseType: 'json',
        headers: {
            'X-CSRF-TOKEN': CSRF_Token,
            'Cookie': `591_new_session=${new_591_session};`
        }
    }).then((res) => {
        let setCookies = res.headers['set-cookie']
        setCookies.forEach((item) => {
            if (!item.includes('591_new_session'))
                return

            let keyValue = item.split(';')[0]
            new_591_session = keyValue.split('=')[1]
        })

        return res.data
    }).catch((err) => {
        console.log(err)
    })

    console.log('591 New Session:')
    console.log(new_591_session)

    console.log('Data:')
    console.log(data)
})()