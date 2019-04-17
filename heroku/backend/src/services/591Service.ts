import axios, { AxiosResponse, AxiosError } from 'axios'
import cheerio from 'cheerio'
import config591 from '../config/591'

const homeURL = config591.homeURL
const apiURL = config591.apiURL
const MAX_RENTAL_COUNT = 60
let dateFromLastToken: Date = undefined
let CSRF_Token: String = undefined
let new_591_session: String = undefined

export default {
  init,
  getRentals
}

// 初始 591，造訪頁面取得相關 TOKEN 及 Session
async function init() {
  const res = await axios.get(homeURL)
  const body = res.data
  const $ = cheerio.load(body)
  const target = $('meta[name="csrf-token"]')
  CSRF_Token = target.attr('content')
  dateFromLastToken = new Date()

  // 取得 591_new_session
  const setCookies = res.headers['set-cookie']
  setCookies.forEach((item: String) => {
    if (!item.includes('591_new_session'))
      return

    const keyValue = item.split(';')[0]
    new_591_session = keyValue.split('=')[1]
  })
}

// 利用 URL 參數取得租屋資料，最多60筆
async function getRentals(query: string, maxCount?: number): Promise<RentalData[]> {
  let rentalData: RentalData[] = []
  let rawData = await getRawDataByQueryString(query)
  if (!rawData) return []

  const recordCount = parseInt(rawData.records.split(',').join(''))
  const maxDataCount = maxCount || MAX_RENTAL_COUNT

  rentalData = rentalData.concat(rawData.data.data)
  for (let firstRow = 30; recordCount > 30 && firstRow < maxDataCount; firstRow += 30) {
    rawData = await getRawDataByQueryString(query, firstRow)
    if (!rawData) return []

    rentalData = rentalData.concat(rawData.data.data)
  }

  return rentalData
}

// 向 591 API 請求取得指定起始筆數後的租屋資料
async function getRawDataByQueryString(query: string, firstRow?: number): Promise<RentalApiResponseSchema591 | undefined> {
  // 初始或檢查 TOKEN 及 SESSION 是否已存在
  await checkVariableValid()

  query = `${query}${firstRow ? `&firstRow=${firstRow}` : ''}`
  let res = undefined

  try {
    res = await request591api(query)
  } catch {
    console.log(`CSRF_Token: ${CSRF_Token}`)
    console.log(`new_591_session: ${new_591_session}`)

    // 假若回傳 419 則重新執行 init 函數
    await init()

    // 再次請求並且給予失敗處理函數
    res = await request591api(query)
      .catch(handleRequestError)

    // 若請求又失敗此條件式會成立
    if (!res) return undefined
  }

  return res.data
}

// 給予 URL 參數向 591 api 請求資料
function request591api(query: string) {
  const region = query.split('&').filter(param => param.split('=')[0] === 'region')[0].split('=')[1]
  return axios({
    method: 'GET',
    url: `${apiURL}?${query}`,
    responseType: 'json',
    headers: {
      'X-CSRF-TOKEN': CSRF_Token,
      'Cookie': `591_new_session=${new_591_session}; urlJumpIp=${region}`
    }
  })
}

// 確認 Token, Session 及有效期限是否為有效的，否則執行 init 函數
async function checkVariableValid() {
  const now = new Date()
  const validDuration = 29 * 60 * 1000
  const isValidDuration = dateFromLastToken ?
    (now.valueOf() - dateFromLastToken.valueOf() < validDuration) : false

  if (!CSRF_Token ||
    !new_591_session ||
    !isValidDuration) {
    await init()
  }
}

function handleRequestError(error: AxiosError): undefined {
  console.log(`handleRequestError: ${error}`)

  // TODO: logger
  return undefined
}

export interface RentalData {
  id: number
  user_id: number
  address: string
  type: string
  post_id: number
  regionid: number
  sectionid: number
  streetid: number
  room: number
  area: number
  price: string
  storeprice: number
  comment_total: number
  comment_unread: number
  comment_ltime: number
  hasimg: number
  kind: number
  shape: number
  houseage: number
  posttime: string
  updatetime: number
  refreshtime: number
  checkstatus: number
  status: string
  closed: number
  living: string
  condition: string
  isvip: number
  mvip: number
  is_combine: number
  cover: string
  browsenum: number
  browsenum_all: number
  floor2: number
  floor: number
  ltime: string
  cases_id: number
  social_house: number
  distance: number
  search_name: string
  mainarea: undefined,
  balcony_area: undefined,
  groundarea: undefined,
  linkman: string
  housetype: number
  street_name: string
  alley_name: string
  lane_name: string
  addr_number_name: string
  kind_name_img: string
  address_img: string
  cases_name: string
  layout: string
  layout_str: string
  allfloor: number
  floorInfo: string
  house_img: string
  houseimg: undefined,
  cartplace: string
  space_type_str: string
  photo_alt: string
  addition4: number
  addition2: number
  addition3: number
  vipimg: string
  vipstyle: string
  vipBorder: string
  new_list_comment_total: number
  comment_class: string
  price_hide: string
  kind_name: string
  photoNum: string
  filename: string
  nick_name: string
  new_img: string
  regionname: string
  sectionname: string
  icon_name: string
  icon_class: string
  fulladdress: string
  address_img_title: string
  browsenum_name: string
  unit: string
  houseid: number
  region_name: string
  section_name: string
  addInfo: string
  onepxImg: string
}

// 租屋 591 API 返回資料之結構
export interface RentalApiResponseSchema591 {
  status: number
  data: {
    topData: {
      is_new_index: number
      is_new_list: number
      type: number
      post_id: number
      isAd: number
      regionid: number
      photoNum: number
      classLast: string
      detail_url: string
      address: string
      img_src: string
      alt: string
      address_2: string
      section_str: string
      region: number
      kind_str: string
      area: string
      price_str: string
      recom_num: number
      address_3: string
      ico: string
      price: string
      price_unit: string
      onepxImg: string
    }[]
    biddings: Object[]
    data: RentalData[]
  }
  records: string
  is_recom: number
  deal_recom: object[]
  online_social_user: number
}
