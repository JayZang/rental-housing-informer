export type SignUpRequestData = {
  account: string
  email: string
  password: string
  passwordConfirm: string
  fullName: string
  nickName: string
  sex: string
}

type SignUpResponseSuccessData = {
  result: true
  authKey: string
}

type SignUpResponseFailData = {
  result: false,
  errFields: {
    [key: string]: {
      location: string
      msg: string
      param: string
      value: string
    }
  }
}

export type SignUpResponseData = SignUpResponseFailData | SignUpResponseSuccessData