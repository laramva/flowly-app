// src/screens/SplashScreen.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image, Animated } from "react-native";
import { FlowlyColors } from "../theme/colors";
import { getUser } from "../storage/authStorage";

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedText = Animated.createAnimatedComponent(Text);

type Props = {
  navigation: any;
};

export default function SplashScreen({ navigation }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // animação simples
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -10,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();

    let isMounted = true;

    async function decideRoute() {
      try {
        const user = await getUser();
        const target = user ? "Home" : "Login";

        console.log("[Splash] usuário encontrado?", !!user, "→", target);

        setTimeout(() => {
          if (isMounted) {
            navigation.replace(target);
          }
        }, 1200);
      } catch (error) {
        console.warn("[Splash] error", error);
        if (isMounted) {
          navigation.replace("Login");
        }
      }
    }

    decideRoute();

    return () => {
      isMounted = false;
      loop.stop();
    };
  }, [navigation, opacity, translateY]);

  return (
    <View style={styles.container}>
      <AnimatedImage
        source={require("../../assets/mascote/splash.png")}
        style={[
          styles.image,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
        resizeMode="contain"
      />

      <AnimatedText style={[styles.logoText, { opacity }]}>
        Flowly
      </AnimatedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FlowlyColors.background.creamLight,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 220,
    height: 220,
    marginBottom: 16,
  },
  logoText: {
    fontFamily: "Outfit-Bold",
    fontSize: 30,
    color: FlowlyColors.text.primary,
  },
});
