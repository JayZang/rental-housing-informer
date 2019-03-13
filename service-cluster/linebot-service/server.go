package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/line/line-bot-sdk-go/linebot"
)

func main() {
	// CHANNEL_SECRET := "2f2cf334e7234d91c941c1ccce574dc0"
	// CHANNEL_ACCESS_TOKEN := "VECzbB+53YfW+6AcnzescHxbVVySo47YR/PK4LODFs9IK/7rOwt+xya1OSFCuMRyahtj+V7kWmATySM3Da5h2adYC6sq32qCzL7H852ICvRhwPZ65FUWmWUAY0/gOoia+8F59YbzqFfO5bbMDVrbiAdB04t89/1O/w1cDnyilFU="
	// bot, err := linebot.New(CHANNEL_SECRET, CHANNEL_ACCESS_TOKEN)
	// if err != nil {
	// 	fmt.Println("Init Line bot err")
	// 	fmt.Println(err)
	// 	return
	// }

	// http.HandleFunc("/callback", func(w http.ResponseWriter, req *http.Request) {
	// 	events, err := bot.ParseRequest(req)
	// 	if err != nil {
	// 		if err == linebot.ErrInvalidSignature {
	// 			w.WriteHeader(400)
	// 		} else {
	// 			w.WriteHeader(500)
	// 		}
	// 		return
	// 	}
	// 	for _, event := range events {
	// 		if event.Type == linebot.EventTypeMessage {
	// 			switch message := event.Message.(type) {
	// 			case *linebot.TextMessage:
	// 				if _, err = bot.ReplyMessage(event.ReplyToken, linebot.NewTextMessage(message.Text)).Do(); err != nil {
	// 					log.Print(err)
	// 				}
	// 			}
	// 		}
	// 	}
	// })

	// if err := http.ListenAndServeTLS(":8080", "server.pem", "server.key", nil); err != nil {
	// 	log.Fatal(err)
	// }

	getHouseInfo()
}

func lineBotSendMsg() {
	ID := "U0f73684cba52a9a8a4e7c1759be18b86"
	CHANNEL_SECRET := "2f2cf334e7234d91c941c1ccce574dc0"
	CHANNEL_ACCESS_TOKEN := "VECzbB+53YfW+6AcnzescHxbVVySo47YR/PK4LODFs9IK/7rOwt+xya1OSFCuMRyahtj+V7kWmATySM3Da5h2adYC6sq32qCzL7H852ICvRhwPZ65FUWmWUAY0/gOoia+8F59YbzqFfO5bbMDVrbiAdB04t89/1O/w1cDnyilFU="
	// url := "https://api.line.me/v2/bot/message/push"

	bot, err := linebot.New(CHANNEL_SECRET, CHANNEL_ACCESS_TOKEN)
	if err != nil {
		fmt.Println("Init Line bot err")
		fmt.Println(err)
		return
	}

	var messages []linebot.SendingMessage

	txtMsg := linebot.NewTextMessage("Hello World")

	messages = append(messages, txtMsg)

	_, err = bot.PushMessage(ID, messages...).Do()
	if err != nil {
		fmt.Println("訊息發送失敗")
		return
	}

	fmt.Println("發送成功")
}

func getHouseInfo() {
	fmt.Print()
	resp, err := http.Get("https://rent.591.com.tw/home/search/rsList?is_new_list=1&type=1&kind=1&searchtype=1&region=1&patternMore=4,5")

	if err != nil {
		fmt.Print(err)
		return
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		fmt.Print(err)
		return
	}

	result := map[string]interface{}{}
	err = json.Unmarshal(body, &result)
	if err != nil {
		fmt.Print(err)
		return
	}

	fmt.Print(result)
}
