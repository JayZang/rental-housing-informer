import mongoose, { Document, Model } from 'mongoose'

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
  }, 
  readRecord: [Number]
}, {
  timestamps: true
})

RecordSchema.statics.createSeed = async function (userId: string) {
  const record: SubscriptionRecordDocumentType = new this({
    userId,
    title: '台北整層',
    queryString: 'is_new_list=1&type=1&kind=1&searchtype=1&region=1&section=3,7,10,1&pattern=4'
  })
  await record.save()
}

export default mongoose.model<SubscriptionRecordDocumentType, SubscriptionRecordModel>(modelName, RecordSchema)

export type SubscriptionRecordType = {
  userId: mongoose.Types.ObjectId,
  title: string,
  queryString: string
  readRecord: number[]
}

export type SubscriptionRecordDocumentType = Document & SubscriptionRecordType

export type SubscriptionRecordModel = Model<SubscriptionRecordDocumentType> & {
  createSeed: () => Promise<void>
}