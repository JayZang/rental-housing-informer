import mongoose, { Document, Model } from 'mongoose'
import { modelName as modelName591 } from './RentalSubscriptionRecord591'
import lineConfig from '../config/line'

const UserSchema = new mongoose.Schema({
  password: {
    required: true,
    type: String,
  },
  name: String,
  email: String,
  lineId: {
    type: String,
    unique: true
  },
  subscription591: [{
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: modelName591
  }]
}, {
  timestamps: true
})

UserSchema.statics.createSeed = async function () {
  const user: UserDocumentType = new this({
    password: '123456',
    name: 'Jay',
    lineId: lineConfig.yourUserId
  })
  await user.save()
}

export default mongoose.model<UserDocumentType, UserModel>('User', UserSchema)

export type UserType = {
  _id: string,
  name: string,
  email: string,
  lineId: string,
  subscription591: Array<mongoose.Schema.Types.ObjectId>
}

export type UserDocumentType = Document & UserType

export type UserModel = Model<UserDocumentType> & {
  createSeed: () => Promise<void>
}