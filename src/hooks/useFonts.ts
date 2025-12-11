import * as Font from "expo-font";

export async function loadFlowlyFonts() {
  await Font.loadAsync({
    "Outfit-Bold": require("../../assets/fonts/Outfit-Bold.ttf"),
    "Outfit-SemiBold": require("../../assets/fonts/Outfit-SemiBold.ttf"),
    "Lexend-Regular": require("../../assets/fonts/Lexend-Regular.ttf"),
    "Lexend-Medium": require("../../assets/fonts/Lexend-Medium.ttf")
  });
}
