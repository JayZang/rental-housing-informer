export type AddSubscriptionResponseSuccess = {
  result: true
}

export type AddSubscriptionResponseFail = {
  result: false
  errFields: {
    [key: string]: {
      location: string
      msg: string
      param: string
      value: string
    }
  },
  errMsg: string
}

export type AddSubscriptionResponse = AddSubscriptionResponseSuccess | AddSubscriptionResponseFail