package database

import (
	"context"
	"fmt"

	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"strconv"
	"time"

	"github.com/limeapple/chat/graph/model"
	"github.com/tidwall/gjson"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)
type DB struct {
	client *mongo.Client
}

func Connect() *DB {
	client, err := mongo.NewClient(options.Client().ApplyURI("mongodb://localhost:27017"))
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	
	defer cancel()
	if client.Connect(ctx) != nil{
		log.Fatal(err)
		return nil
	}

	return &DB{
		client: client,
	}
	
}

func (db* DB) SendMessage(input *model.GetMessage) *model.Message {
	collection := db.client.Database("general").Collection(input.ChannelName)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_, err := collection.InsertOne(ctx, input)
	if err != nil {
		log.Fatal(err)
	}

	items:= []*model.MessageReactionEmoji{}
	for _, itemInput := range input.Emoji {
		items = append(items, &model.MessageReactionEmoji{
			MemberID:itemInput.MemberID,
      		EmojiCode:itemInput.EmojiCode,
		})
	}

	return &model.Message{
		ID: input.ID,
		Member: &model.Member{
			ID:input.Member.ID,
			Nickname: input.Member.Nickname,
			Color: input.Member.Color,
			Image: input.Member.Image,
		},
		Content: input.Content,
		CreatedAt: input.CreatedAt,
		Emoji: items,
		ChannelName:input.ChannelName,
	}
}

func (db* DB) UpdateMessage(input *model.GetMessage) *model.Message {
	collection := db.client.Database("general").Collection(input.ChannelName)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

result, err := collection.UpdateOne(
    ctx,
    bson.M{"id": bson.M{"$eq": input.ID}},
	bson.M{"$set": bson.M{"emoji": input.Emoji}},
)
fmt.Printf("Person: %+v\n", *result)
fmt.Printf("Person: %+v\n", *input)


if err != nil {
    log.Fatal(err)
}
// var items []*model.MessageReactionEmoji
items:= []*model.MessageReactionEmoji{}
for _, itemInput := range input.Emoji {
	items = append(items, &model.MessageReactionEmoji{
		MemberID:itemInput.MemberID,
		  EmojiCode:itemInput.EmojiCode,
	})
}
return &model.Message{
	ID: input.ID,
	Member: &model.Member{
		ID:input.Member.ID,
		Nickname: input.Member.Nickname,
		Color: input.Member.Color,
		Image: input.Member.Image,
	},
	Content: input.Content,
	CreatedAt: input.CreatedAt,
	Emoji: items,
	ChannelName: input.ChannelName,
}
}

func(db *DB) GetMessage(selectRoom string) []*model.Message{
	fmt.Println(selectRoom)
	collection := db.client.Database("general").Collection(selectRoom)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	cur, err := collection.Find(ctx, bson.D{})
	if err != nil {
		log.Fatal(err)
	}
	var messageList []* model.Message
	for cur.Next(ctx){
		var message *model.Message
		err := cur.Decode(&message)
		if err != nil {
			log.Fatal(err)
		}
		// aJSON, _ := json.Marshal(message)
		// fmt.Printf("JSON Print - \n%s\n", string(aJSON))
		messageList = append(messageList,message)
	}
	return messageList
}

func(db *DB) CreateMember() *model.Member{
	rand.Seed(time.Now().UnixNano())
    pokedexNumber := rand.Intn(897) + 1
	hslaNumber := rand.Intn(360)

	res, err := http.Get("https://pokeapi.co/api/v2/pokemon/"+strconv.Itoa(pokedexNumber))
    if err != nil {
        print(err)
    }
    defer res.Body.Close()
    body, err := ioutil.ReadAll(res.Body)
    if err != nil {
        print(err)
    }

	return &model.Member{
			Nickname: gjson.Get(string(body), "name").String(),
			Color: "hsla(" + strconv.Itoa(hslaNumber) + ", 100%, 60%, 1)",
			Image: gjson.Get(string(body), "sprites.other.official-artwork.front_default").String(),
			CreatedAt: strconv.FormatInt(time.Now().UnixMilli(), 10),
	}
}