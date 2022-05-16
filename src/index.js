import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import ApolloProvider from "./graphql/ApolloProvider";

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
