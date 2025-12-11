// src/components/FlowlyMascot.tsx
import React from "react";
import { Image, ImageStyle } from "react-native";

export type FlowlyMascotName =
  | "calendario"
  | "categorias"
  | "criar"
  | "dashboard"
  | "dicas"
  | "engrenagem"
  | "flowly-desanimado"
  | "flowly-laptop"
  | "flowly-livro"
  | "flowly-logo"
  | "flowly-neutral"
  | "habito-agua"
  | "habito-bemestar"
  | "habito-energia"
  | "habito-estudo"
  | "habito-exercicio"
  | "habito-rotina"
  | "habito-sono"
  | "lapis"
  | "lixeira"
  | "lupa"
  | "notificacoes"
  | "perfil"
  | "progresso"
  | "reset"
  | "salvar"
  | "splash"
  | "voltar";

const mascots: Record<FlowlyMascotName, any> = {
  calendario: require("../../assets/mascote/calendario.png"),
  categorias: require("../../assets/mascote/categorias.png"),
  criar: require("../../assets/mascote/criar.png"),
  dashboard: require("../../assets/mascote/dashboard.png"),
  dicas: require("../../assets/mascote/dicas.png"),
  engrenagem: require("../../assets/mascote/engrenagem.png"),
  "flowly-desanimado": require("../../assets/mascote/flowly-desanimado.png"),
  "flowly-laptop": require("../../assets/mascote/flowly-laptop.png"),
  "flowly-livro": require("../../assets/mascote/flowly-livro.png"),
  "flowly-logo": require("../../assets/mascote/flowly-logo.png"),
  "flowly-neutral": require("../../assets/mascote/flowly-neutral.png"),
  "habito-agua": require("../../assets/mascote/habito-agua.png"),
  "habito-bemestar": require("../../assets/mascote/habito-bemestar.png"),
  "habito-energia": require("../../assets/mascote/habito-energia.png"),
  "habito-estudo": require("../../assets/mascote/habito-estudo.png"),
  "habito-exercicio": require("../../assets/mascote/habito-exercicio.png"),
  "habito-rotina": require("../../assets/mascote/habito-rotina.png"),
  "habito-sono": require("../../assets/mascote/habito-sono.png"),
  lapis: require("../../assets/mascote/lapis.png"),
  lixeira: require("../../assets/mascote/lixeira.png"),
  lupa: require("../../assets/mascote/lupa.png"),
  notificacoes: require("../../assets/mascote/notificacoes.png"),
  perfil: require("../../assets/mascote/perfil.png"),
  progresso: require("../../assets/mascote/progresso.png"),
  reset: require("../../assets/mascote/reset.png"),
  salvar: require("../../assets/mascote/salvar.png"),
  splash: require("../../assets/mascote/splash.png"),
  voltar: require("../../assets/mascote/voltar.png"),
};

export default function FlowlyMascot({
  name,
  size = 80,
  style,
}: {
  name: FlowlyMascotName;
  size?: number;
  style?: ImageStyle;
}) {
  return (
    <Image
      source={mascots[name]}
      style={{
        width: size,
        height: size,
        resizeMode: "contain",
        ...(style as any),
      }}
    />
  );
}
