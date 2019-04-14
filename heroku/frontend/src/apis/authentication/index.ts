import axios, { AxiosPromise, AxiosError } from 'axios'
import {
  SignUpRequestData,
  SignUpResponseData,
  LoginResponseData,
  certLoginTokenResponseData
} from './types'

/**
 * 確認指定用戶是否需要被認證
 * Response Http Status Code:
 * 200 - 需要被認證
 * 404 - 不需要被認證
 * @param userId 
 * @return Promise<Boolean>
 */
export async function checkIfNeedAuth(userId: string): Promise<string> {
  try {
    const res = await axios.get(`/api/authentication/${userId}`)
    return Promise.resolve(res.data.authKey || '')
  } catch {
    return Promise.reject()
  }
}

/**
 * 註冊用戶
 * @param userId 
 * @param data 
 */
export async function signUpUser(userId: string, data: SignUpRequestData): Promise<SignUpResponseData> {
  const res = await axios.post(`/api/authentication/${userId}`, data)
  return res.data
}

/**
 * 登入用戶
 * @param account 
 * @param password 
 */
export async function login(param: { account: string, password: string }): Promise<LoginResponseData> {
  const res = await axios.post('/api/login', param)
  return res.data
}

/**
 * 驗證 token 是否還是有效為登入狀態
 * @param token 
 */
export async function certLoginToken(token: string): Promise<certLoginTokenResponseData> {
  const res = await axios.get('/api/authentication/login-token', { 
    headers: {
      'X-Auth': token
    }
  })
  return res.data
}