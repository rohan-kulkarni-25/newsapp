import React, { Component } from "react";
import { Text, View, ScrollView, Platform } from "react-native";

import {
  Appbar,
  Card,
  Button,
  Title,
  Paragraph,
  Dialog,
  Portal,
  Provider,
  ActivityIndicator,
  Colors,
} from "react-native-paper";
import NewsAPI from "newsapi";

export default class APP extends Component {
  constructor() {
    super();
    this.state = {
      news: [],
      cards: [],
      visible: true,
      loading: true,
    };
    MORE_ICON = Platform.OS === "ios" ? "details" : "details";
    // this.renderAPP();
  }

  showDialog = () => this.setState({ visible: true });
  hideDialog = () => this.setState({ visible: false });

  loadnews = () => {
    console.log(`NEws Loading`);
    this.setState({ loading: true });
    const newsapi = new NewsAPI("cbb03903718c400b87de3beaedacd706");
    newsapi.v2
      .topHeadlines({
        category: "general",
        language: "en",
        country: "in",
        pageSize: 100,
      })
      .then((response) => {
        this.setState({ news: response }, () => this.renderAllCards);
        this.renderAllCards();
      })
      .catch((error) => {
        console.log(`LIMIT HIT ${error}`);
        this.setState({ loading: false });
      });
  };

  renderAllCards = () => {
    console.log(`I need object now`);
    let newsArray = this.state.news.articles;
    let CardArray = newsArray.map((news) => this.createCard(news));
    this.setState({ cards: CardArray }, () =>
      this.setState({ loading: false })
    );
  };

  createCard = (data) => {
    return (
      <Card
        key={`${data.title}${Math.random()}`}
        style={{
          flexShrink: 1,
          margin: 10,
          borderRadius: 20,
        }}
      >
        <Card.Cover
          style={{
            borderRadius: 0,
            borderTopEndRadius: 20,
            borderTopLeftRadius: 20,
          }}
          source={{ uri: data.urlToImage }}
        />
        <Card.Content>
          <Title style={{ color: "black", fontSize: 20 }}>{data.title}</Title>
          <Paragraph style={{ color: "black", fontSize: 12 }}>
            {data.description}
          </Paragraph>
        </Card.Content>
      </Card>
    );
  };

  componentDidMount() {
    this.loadnews();
  }

  render() {
    return (
      <Provider>
        {this.state.loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator animating={true} color={Colors.purple800} />
            <Text>{"Loading for more than 15 seconds ? "}</Text>
            <Text>{"API Rate Limit Over Please try again after sometime"}</Text>
          </View>
        ) : (
          <View>
            <Appbar.Header>
              <Appbar.Content
                title="NEWS APP"
                subtitle="Build with React Native"
              />
              <Appbar.Action icon={MORE_ICON} onPress={this.showDialog} />
            </Appbar.Header>
            <View>
              <Text
                style={{
                  fontSize: 25,
                  padding: 10,
                  backgroundColor: "black",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {"TOP NEWS"}
              </Text>
            </View>
            <Portal>
              <Dialog
                style={{ borderRadius: 20 }}
                visible={this.state.visible}
                onDismiss={this.hideDialog}
              >
                <Dialog.Title>About</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>
                    NEWS APP is built to Learn React Native
                    development.Headlines are commint from API provided by
                    NEWSAPIORG.
                  </Paragraph>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={this.hideDialog}>I understand</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
            <ScrollView
              style={{
                flexDirection: "column",
                flexShrink: 1,
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              {this.state.cards}
            </ScrollView>
            <Text
              style={{
                textAlign: "center",
                fontSize: 15,
                padding: 10,
                backgroundColor: "black",
                color: "white",
                fontWeight: "bold",
              }}
            >
              {"MADE WITH ❤️ BY ROHAN"}
            </Text>
          </View>
        )}
      </Provider>
    );
  }
}
