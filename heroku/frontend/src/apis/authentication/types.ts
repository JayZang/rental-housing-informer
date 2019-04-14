export type SignUpRequestData = {
  account: string
  email: string
  password: string
  passwordConfirm: string
  fullName: string
  nickName: string
  sex: string
}

type SignUpSuccessResponseData = {
  result: true
  authKey: string
}

type SignUpFailResponseData = {
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

export type SignUpResponseData = SignUpSuccessResponseData | SignUpFailResponseData


type LoginSuccessResponseData = {
  result: true,
  token: string
  user: {
    id: string,
    nickname: string
  }
}

type LoginFailResponseData = {
  result: false,
  errFields: {
    [key: string]: {
      location: string
      msg: string
      param: string
      value: string
    }
  },
  errMsg?: string
}

export type LoginResponseData = LoginSuccessResponseData | LoginFailResponseData

export type certLoginTokenResponseData = LoginSuccessResponseData | undefined