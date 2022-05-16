package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gorilla/websocket"
	"github.com/limeapple/chat/graph"
	"github.com/limeapple/chat/graph/generated"
	"github.com/limeapple/chat/graph/model"
	"github.com/rs/cors"
)

const defaultPort = "8082"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3001", "http://localhost:3002"},
		AllowCredentials: true,
		Debug:            false,
	})

// Use New instead of NewDefaultServer in order to have full control over defining transports
srv := handler.New(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{
	UpdatedMessage: []*model.Message{},
	ChatMessages: []*model.Message{},
	ChatObservers: map[string]chan []*model.Message{},
	ChatEmojiObservers: map[string]chan []*model.Message{},

}}))
srv.AddTransport(transport.POST{})
srv.AddTransport(transport.Websocket{
	KeepAlivePingInterval: 10 * time.Second,
	Upgrader: websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	},
})
srv.Use(extension.Introspection{})
	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", c.Handler(srv))

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
