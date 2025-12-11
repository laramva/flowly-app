🌸 Flowly: Seu painel pastel de estudos

O Flowly é um aplicativo mobile desenvolvido em React Native (Expo) para ajudar estudantes a organizarem suas rotinas, criarem hábitos de estudo e acompanharem sua evolução com uma interface leve, fofa e totalmente gamificada.
Nasceu durante minha jornada de transição de carreira, estudando dia e noite, errando muito e aprendendo ainda mais.
É um app feito com carinho, código e pastel vibes.

✨ Funcionalidades
🕒 Foco (Pomodoro Premium Pastel)

Timer animado com gradiente pastel

Sugestões de tempo: 15min, 25min, 50min, 1h

Contabilização individual de minutos por matéria

Armazenamento persistente por usuário

Mascote Flowly reagindo durante o foco

📚 Gestão de Matérias

Criar, editar e excluir matérias

Nome + categoria

Ícones premium (lixeira, lápis, categorias)

Pop-ups pastel gradiente

👤 Perfil do Usuário

Resumo do dia

Total por matéria

Resumo semanal destacado

Logout com pop-up premium

📊 Painel Semanal (Dashboard Pastel)

Gráficos de barras animados

Gradiente suave preenchendo cada barra

Total de minutos organizados por matéria

Dados separados por usuário

🧠 Armazenamento e estrutura de dados

O app utiliza AsyncStorage e separação por usuário, garantindo que cada conta tenha seus próprios dados:

Chaves internas:

@flowly_weekly_summary_${userId}
@flowly_study_subjects_${userId}
@flowly_today_minutes_${userId}


Storages:

authStorage – autenticação

studySubjectStorage – matérias

studyStorage – minutos do dia

weeklyStudyStorage – minutos por semana

pomodoroStorage – estado do timer

🎨 UI / UX Design

O Flowly segue uma estética:

Pastel premium

Gradientes neon suaves

Sombras macias

Cantos arredondados

Mascotes fofos

Microinterações animadas

Tipografia harmoniosa

Layout consistente e confortável

Ferramentas:

Figma

Expo Linear Gradient

Animated API

Ícones personalizados do Flowly

🛠 Tecnologias
Front-end

React Native

Expo

Typescript

React Navigation

AsyncStorage

Animated API

Arquitetura

Componentização

Hooks personalizados

Separação por features

Navegação stack

🚀 Como rodar o projeto
git clone https://github.com/laramva/flowly-app.git
cd flowly-app
npm install
npx expo start


Abra no Expo Go.

🔒 Autenticação

Cadastro com nome, email e senha

Reset automático de dados ao criar novo usuário

Armazenamento isolado por conta

💭 Por que o Flowly existe?

Porque estudar pode (e deve) ser mais leve.
Quis criar um app que unisse produtividade real com uma estética aconchegante e acolhedora.
O resultado é um painel pastel de estudos que motiva, organiza e te acompanha de forma gentil.


🤝 Contribuições

Sinta-se livre para enviar PRs, issues ou sugestões.
Toda contribuição é bem-vinda!

🐱 Criado com carinho por Lara

Entre estudos, erros, madrugadas e muito café pastel. 💜🌸
