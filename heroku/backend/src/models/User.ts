import mongoose, { Document } from 'mongoose'
import { modelName as modelName591 } from './RentalSubscriptionRecord591'

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

export default mongoose.model('User', UserSchema)

export type UserType = {
  _id: string,
  name: string,
  email: string,
  lineId: string,
  subscription591: Array<mongoose.Schema.Types.ObjectId>
}

export type UserDocumentType = Document & UserType