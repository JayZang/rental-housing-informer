import {
  FlexBubble
} from '@line/bot-sdk'
import { RentalData } from './591'

export default {
  getRentalBubbleTemplate
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