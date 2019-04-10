import {
  FlexBubble,
  TemplateMessage
} from '@line/bot-sdk'
import { RentalData } from './591'
import appConfig from '../config/appServer'

export default {
  getAuthRequirementButtonTemplate,
  getNon591SubscriptionHintButtonTemplate,
  getRentalBubbleTemplate
}

// 用戶認證連結之 Button Message 模板
function getAuthRequirementButtonTemplate(objectId: string): TemplateMessage {
  return {
    type: 'template',
    altText: '前往用戶認證',
    template: {
      type: 'buttons',
      title: '用戶認證',
      text: '您尚為未認證之用戶，點選按鍵前往認證中心',
      actions: [{
        label: '前往認證',
        type: 'uri',
        uri: `${appConfig.domain}/authentication/${objectId}`
      }]
    }
  }
}

// 租屋訂閱中心連結之模板
function getNon591SubscriptionHintButtonTemplate(): TemplateMessage {
  return {
    type: 'template',
    altText: '前往租屋訂閱',
    template: {
      type: 'buttons',
      title: '租屋訂閱',
      text: '您尚未有租屋訂閱資料，點選按鍵前往訂閱',
      actions: [{
        label: '前往訂閱',
        type: 'uri',
        uri: `${appConfig.domain}/subscription`
      }]
    }
  }
}

// 取得租屋物件資訊 line 模板，使用 FlexMessage 的 Bubble type
function getRentalBubbleTemplate(item: RentalData): FlexBubble {
  return {
    type: 'bubble',
    hero: {
      type: 'image',
      url: item.cover,
      aspectRatio: '4:3',
      aspectMode: 'cover',
      size: 'full'
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [{
        type: 'text',
        text: item.address_img_title,
        size: 'lg',
        weight: 'bold'
      }, {
        type: 'separator',
        margin: 'sm'
      }, {
        type: 'text',
        text: item.kind_name + ' | ' + item.layout + ' | ' + item.floorInfo,
        margin: 'lg'
      }, {
        type: 'text',
        text: item.section_name + ' - ' + item.street_name
      }, {
        type: 'box',
        layout: 'horizontal',
        spacing: 'md',
        contents: [{
          type: 'text',
          text: item.price,
          color: '#FF4214',
          align: 'end',
          flex: 1,
          size: 'lg',
          weight: 'bold'
        }, {
          type: 'text',
          text: item.unit,
          flex: 0,
          gravity: 'bottom',
          size: 'xxs'
        }]
      }]
    },
    footer: {
      type: 'box',
      layout: 'vertical',
      contents: [{
        type: 'button',
        style: 'link',
        height: 'sm',
        action: {
          type: 'uri',
          label: '591 連結',
          uri: `https://rent.591.com.tw/rent-detail-${item.id}.html`
        }
      }]
    }
  }
}
