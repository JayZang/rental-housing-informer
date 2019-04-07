import mongoose from 'mongoose'

export const modelName = 'SubscriptionRecord591'

const RecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  queryString: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

export default mongoose.model(modelName, RecordSchema)

export type SubscriptionRecordType = {
  userId: mongoose.Types.ObjectId,
  title: string,
  queryString: string
}

export type SubscriptionRecordDocumentType = Document & SubscriptionRecordType