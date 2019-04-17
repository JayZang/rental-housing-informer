import axios, { AxiosResponse } from 'axios'
import cheerio from 'cheerio'
import config591 from '../config/591'

const homeURL = config591.homeURL
const apiURL = config591.apiURL
let dateFromLastToken: Date = undefined
let CSRF_Token: String = undefined
let new_591_session: String = undefined

export default {
  init,
  getAllRentalHouse,
  getRentalByQueryString
}

// 初始 591，造訪頁面取得相關 TOKEN 及 Session
async function init() {
  const res = await axios.get(homeURL)
  const body = res.data
  const $ = cheerio.load(body)
  const target = $('meta[name="csrf-token"]')
  CSRF_Token = target.attr('content')
  dateFromLastToken = new Date()

  getSessionKeyFromResponse(res)
}

// 取得所有租屋資訊
async function getAllRentalHouse(): Promise<RentalApiResponseSchema591> {
  await checkVariableValid()

  const res = await axios({
    method: 'GET',
    url: apiURL,
    responseType: 'json',
    headers: {
      'X-CSRF-TOKEN': CSRF_Token,
      'Cookie': `591_new_session=${new_591_session};`
    }
  })

  getSessionKeyFromResponse(res)

  return res.data
}

// 利用 URL 參數取得租屋資料，最多90筆
async function getRentalByQueryString(query: string): Promise<RentalData[]> {
  let rentalData: RentalData[] = []
  let rawData = await getRawDataByQueryString(query)
  const recordCount = parseInt(rawData.records.split(',').join(''))

  rentalData = rentalData.concat(rawData.data.data)
  for (let firstRow = 30; recordCount > 30 && firstRow <= 30; firstRow += 30) {

    rawData = await getRawDataByQueryString(query, firstRow)
    rentalData = rentalData.concat(rawData.data.data)
  }

  return rentalData
}

// 確認 Token, Session 及有效期限是否為有效的，否則執行 init 函數
async function checkVariableValid() {
  const now = new Date()
  const validDuration = 60 * 60 * 1000
  const isValidDuration = dateFromLastToken ?
    (now.valueOf() - dateFromLastToken.valueOf() < validDuration) : false

  if (!CSRF_Token ||
    !new_591_session ||
    !dateFromLastToken ||
    !isValidDuration) {
    await init()
  }
}

// 從 Home 頁面或者 API 請求回復裡取得特定 Session
function getSessionKeyFromResponse(res: AxiosResponse) {
  const setCookies = res.headers['set-cookie']
  setCookies.forEach((item: String) => {
    if (!item.includes('591_new_session'))
      return

    const keyValue = item.split(';')[0]
    new_591_session = keyValue.split('=')[1]
  })
}

// 給予 URL 參數及從第幾筆數搜尋
async function getRawDataByQueryString(query: string, firstRow?: number): Promise<RentalApiResponseSchema591> {
  await checkVariableValid()

  const region = query.split('&').filter(param => param.split('=')[0] === 'region')[0].split('=')[1]
  const res = await axios({
    method: 'GET',
    url: `${apiURL}?${query}${firstRow ? `&firstRow=${firstRow}` : ''}`,
    responseType: 'json',
    headers: {
      'X-CSRF-TOKEN': CSRF_Token,
      'Cookie': `591_new_session=${new_591_session}; urlJumpIp=${region}`
    }
  })

  getSessionKeyFromResponse(res)

  return res.data
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
