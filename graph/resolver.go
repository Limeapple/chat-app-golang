package graph

import (
	"math/rand"
	"sync"

	"github.com/limeapple/chat/graph/model"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	// returns updated message
	UpdatedMessage []*model.Message
	// All messages since launching the GraphQL endpoint
	ChatMessages  []*model.Message
	// All active subscriptions
	ChatObservers map[string]chan []*model.Message
	ChatEmojiObservers map[string]chan []*model.Message

	mu            sync.Mutex
}

var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

func randString(n int) string {
	b := make([]rune, n)
	for i := range b {
		b[i] = letterRunes[rand.Intn(len(letterRunes))]
	}
	return string(b)
}