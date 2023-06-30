# Projeto Door Access

🚀 Este projeto é parte do trabalho de conclusão do curso de Análise e Desenvolvimento de Sistemas da Faculdade de Técnologia.

📝 Abaixo serão descritos os passos necessários para a instalação da aplicação para desenvolvimentos futuros:

## Pré Requisitos
1. Android Studio + SDK
2. Java 11
3. Emulador Android ou dispositivo físico conectado via USB
3. Node (v16.19.0 ou maior)
4. Pacote expo-cli instalado globalmente: `npm install -g expo-cli`
5. Visual Studio Code (ou outra IDE de desenvolvimento)
6. Chave ssh pública vinculada na conta GitHub

## Passos de instalação
1. Clone (ou fork) do repositório: `git clone git@github.com:LuccasJSantos/door-access-mobile.git`
2. Abrir o repositório no VSCode e terminal
3. Executar comando `npm install` ou `yarn` (se estiver utilizando o <u>yarn</u> como package manager) no terminal para instalar as dependências necessárias
4. Executar comando `npx expo prebuild --platform android` para limpar pastas de build
5. Executar comando `npx expo-doctor` para validar se todas as dependências estão instaladas corretamente, se não, execute os comandos recomendados pelo **expo-doctor**
6. Conectar via cabo USB um dispositivo Android físico. Ignorar caso utilizar emulador
7. Executar comando `npm run android` ou `yarn android` para buildar a aplicação
    1. Se estiver utilizando dispositivo físico, permitir o acesso solicitado
8. Aguardar a aplicação abrir
