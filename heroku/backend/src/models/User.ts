import mongoose, { Document, Model, DocumentQuery } from 'mongoose'
import bcryptjs from 'bcryptjs'
import crypto from 'crypto'
import { modelName as modelName591 } from './RentalSubscriptionRecord591'

const UserSchema = new mongoose.Schema<UserDocumentType>({
  account: {
    type: String,
    unique: true,
    default: function () {
      const sha256 = crypto.createHash('sha256')
      const now = new Date()
      const lineId = this.lineId || ''

      return sha256.update(`${lineId}.${now.valueOf()}`).digest('hex')
    }
  },
  password: String,
  fullName: String,
  nickName: String,
  sex: Number,
  email: String,
  lineId: {
    type: String,
    unique: true
  },
  isLineFollowing: {
    type: Boolean,
    default: true
  },
  authInform: {
    isAuth: {
      type: Boolean,
      default: false
    },
    authKey: String,
    authKeyExpired: Date,
    authDate: Date
  },
  subscription591: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: modelName591
  }]
}, {
  timestamps: true
})

UserSchema.statics.findByLineId = async function (lineId: string): Promise<UserDocumentType> {
  const Users: UserModel = this
  return Users.findOne({ lineId })
}

UserSchema.statics.findHoursPushTargets = async function (): Promise<UserDocumentType[]> {
  const Users: UserModel = this
  return Users.find({
    isLineFollowing: true,
    'authInform.isAuth': true
  }).populate({ path: 'subscription591', option: { limit: 1 } }).exec()
}

UserSchema.statics.findByAccountAndPassword = async function (account: string, password: string): Promise<UserDocumentType> {
  const Users: UserModel = this
  const user = await Users.findOne({ account })

  if (!user) return undefined

  const hashedPassword = user.password
  const result = bcryptjs.compareSync(password, hashedPassword)

  if (!result) return undefined

  return user
}

UserSchema.pre<UserDocumentType>('save', function(next) {
  const user = this
  if (!user.isModified('password')) return next()
  const password = user.password
  const salt = bcryptjs.genSaltSync(10)
  const hash = bcryptjs.hashSync(password, salt)
  user.password = hash
  next()
})

export default mongoose.model<UserDocumentType, UserModel>('User', UserSchema)

export interface UserDocumentType extends Document {
  _id: string,
  account: string,
  password: string,
  fullName: string,
  nickName: string,
  sex: number,
  email: string,
  lineId: string,
  isLineFollowing: boolean,
  authInform: {
    isAuth: boolean,
    authKey: String,
    authKeyExpired: Date,
    authDate: Date
  },
  subscription591: Array<mongoose.Schema.Types.ObjectId>
}

export enum UserSexEnum {
  Man = 0,
  Woman = 1
}

export type UserModel = Model<UserDocumentType> & {
  findByLineId: (lineId: string) => Promise<UserDocumentType>
  findHoursPushTargets: () => Promise<UserDocumentType[]>
  findByAccountAndPassword: (account: string, password: string) => Promise<UserDocumentType>
}