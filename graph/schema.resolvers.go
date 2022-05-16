package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/limeapple/chat/graph/database"
	"github.com/limeapple/chat/graph/generated"
	"github.com/limeapple/chat/graph/model"
)

func (r *mutationResolver) SendMessage(ctx context.Context, input model.GetMessage) (*model.Message, error) {
	// fmt.Printf("Person: %+v\n", *r.Resolver)
	message := db.SendMessage(&input)
	r.ChatMessages = append(r.ChatMessages, message)
	r.mu.Lock()
	// Notify all active subscriptions that a new message has been posted by posted. In this case we push the now
	// updated ChatMessages array to all clients that care about it.
	for _, observer := range r.ChatObservers {
		observer <- r.ChatMessages
		// fmt.Println(&observer)
	}
	// for a, observer := range r.ChatMessages {
	// 	fmt.Println("test", a, observer)
	// }
	r.mu.Unlock()
	fmt.Println(message)
	return message, nil
}

func (r *mutationResolver) UpdateMessage(ctx context.Context, input model.GetMessage) (*model.Message, error) {
	// fmt.Printf("Person: %+v\n", *r.Resolver)
	message := db.UpdateMessage(&input)
	r.UpdatedMessage = append(r.UpdatedMessage, message)
	r.mu.Lock()
	// Notify all active subscriptions that a new message has been posted by posted. In this case we push the now
	// updated ChatMessages array to all clients that care about it.
	for _, observer := range r.ChatEmojiObservers {
		observer <- r.UpdatedMessage
		fmt.Println(&observer)
	}
	// for a, observer := range r.UpdatedMessage {
	// 	fmt.Println("testing", a, observer)
	// }
	r.mu.Unlock()
	fmt.Println("testing")
	return message, nil
}

func (r *queryResolver) GetMessage(ctx context.Context, selectRoom string) ([]*model.Message, error) {
	return db.GetMessage(selectRoom), nil
}

func (r *queryResolver) CreateMember(ctx context.Context) (*model.Member, error) {
	return db.CreateMember(), nil
}

func (r *subscriptionResolver) Messages(ctx context.Context) (<-chan []*model.Message, error) {
	// Create an ID and channel for each active subscription. We will push changes into this channel.
	// When a new subscription is created by the client, this resolver will fire first.
	id := randString(8)
	msgs := make(chan []*model.Message, 1)

	// Start a goroutine to allow for cleaning up subscriptions that are disconnected.
	// This go routine will only get past Done() when a client terminates the subscription. This allows us
	// to only then remove the reference from the list of ChatObservers since it is no longer needed.
	go func() {
		<-ctx.Done()
		r.mu.Lock()
		delete(r.ChatObservers, id)
		r.mu.Unlock()
	}()
	r.mu.Lock()
	// Keep a reference of the channel so that we can push changes into it when new messages are posted.
	r.ChatObservers[id] = msgs
	r.mu.Unlock()
	// This is optional, and this allows newly subscribed clients to get a list of all the messages that have been
	// posted so far. Upon subscribing the client will be pushed the messages once, further changes are handled
	// in the PostMessage mutation.
	r.ChatObservers[id] <- r.ChatMessages
	return msgs, nil
}

func (r *subscriptionResolver) UpdateMessage(ctx context.Context) (<-chan []*model.Message, error) {
	// Create an ID and channel for each active subscription. We will push changes into this channel.
	// When a new subscription is created by the client, this resolver will fire first.
	id := randString(8)
	msgs := make(chan []*model.Message, 1)

	// Start a goroutine to allow for cleaning up subscriptions that are disconnected.
	// This go routine will only get past Done() when a client terminates the subscription. This allows us
	// to only then remove the reference from the list of ChatObservers since it is no longer needed.
	go func() {
		<-ctx.Done()
		r.mu.Lock()
		delete(r.ChatEmojiObservers, id)
		r.mu.Unlock()
	}()
	r.mu.Lock()
	// Keep a reference of the channel so that we can push changes into it when new messages are posted.
	r.ChatEmojiObservers[id] = msgs
	r.mu.Unlock()
	// This is optional, and this allows newly subscribed clients to get a list of all the messages that have been
	// posted so far. Upon subscribing the client will be pushed the messages once, further changes are handled
	// in the PostMessage mutation.
	r.ChatEmojiObservers[id] <- r.UpdatedMessage
	return msgs, nil
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Subscription returns generated.SubscriptionResolver implementation.
func (r *Resolver) Subscription() generated.SubscriptionResolver { return &subscriptionResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type subscriptionResolver struct{ *Resolver }

// !!! WARNING !!!
// The code below was going to be deleted when updating resolvers. It has been copied here so you have
// one last chance to move it out of harms way if you want. There are two reasons this happens:
//  - When renaming or deleting a resolver the old code will be put in here. You can safely delete
//    it when you're done.
//  - You have helper methods in this file. Move them out to keep these resolver files clean.
var db = database.Connect()
