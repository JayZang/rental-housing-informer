import axios, { AxiosPromise, AxiosError } from 'axios'
import {
  SignUpRequestData,
  SignUpResponseData
} from './types'

/**
 * 確認指定用戶是否需要被認證
 * Response Http Status Code:
 * 200 - 需要被認證
 * 404 - 不需要被認證
 * @param userId 
 * @return Promise<Boolean>
 */
export async function checkIfNeedAuth(userId: string): Promise<boolean> {
  try {
    await axios.get(`/api/authentication/${userId}`)
    return Promise.resolve(true)
  } catch {
    return Promise.resolve(false)
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