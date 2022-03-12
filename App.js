import React, { useState, useEffect } from "react";
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

export default function App() {
  const [news, setnews] = useState([]);
  const [card, setcard] = useState([]);
  const [visible, setVisible] = useState(true);
  const [load, setload] = useState(true);
  const showDialog = () => setVisible(true);

  const loadnews = async () => {
    setload(true);
    const newsapi = new NewsAPI("cbb03903718c400b87de3beaedacd706");
    newsapi.v2
      .topHeadlines({
        category: "general",
        language: "en",
        country: "in",
        pageSize: 100,
      })
      .then((response) => {
        setnews(response);
      })
      .then(() => {
        setTimeout(() => {
          renderAllCards();
          setload(false);
        }, 5000);
      })
      .catch((error) => {
        console.log(`LIMIT HIT ${error}`);
        setload(false);
      });
  };

  const hideDialog = () => setVisible(false);
  const MORE_ICON = Platform.OS === "ios" ? "details" : "details";

  const renderAllCards = () => {
    let newsArray = news.articles;
    let CardArray = newsArray.map((news) => createCard(news));
    setcard(CardArray);
    setload(false);
    console.log(typeof newsArray);
  };

  const createCard = (data) => {
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

  useEffect(() => {
    loadnews();
  }, []);

  return (
    <Provider>
      {load ? (
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
            <Appbar.Action icon={MORE_ICON} onPress={showDialog} />
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
              visible={visible}
              onDismiss={hideDialog}
            >
              <Dialog.Title>About</Dialog.Title>
              <Dialog.Content>
                <Paragraph>
                  NEWS APP is built to Learn React Native development.Headlines
                  are commint from API provided by NEWSAPIORG.
                </Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                <Button onPress={hideDialog}>I understand</Button>
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
            {card}
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
