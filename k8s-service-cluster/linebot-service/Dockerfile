FROM golang

WORKDIR /go/src/app
COPY . .

# 安裝依賴
RUN go get -d -v ./

# 編譯為可執行黨
RUN go install -v ./

CMD ["app"]