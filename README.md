# ESL Delivery

Aplicativo móvel para motoristas acompanharem manifestos e registrarem entregas, integrado ao TMS.

## Funcionalidades

- Login por empresa e sessão persistida
- Consulta, aceite e início de manifestos
- Registro de KM inicial e final
- Confirmação de chegada e saída do local
- Baixa de serviços com ocorrência, dados do recebedor e fotos
- Registro de eventos
- Consulta de ocorrências
- Abertura de rotas no aplicativo de mapas

> O envio de dados requer conexão com a internet. A fila de sincronização offline ainda não foi implementada.

## Tecnologias

- React Native, Expo e TypeScript
- React Navigation
- MobX-State-Tree
- React Native Paper
- Axios
- MMKV

## Como executar

Pré-requisitos: Node.js, npm e o ambiente nativo configurado (Android Studio para Android ou Xcode, no macOS, para iOS).

```bash
npm install
npm run android   # ou: npm run ios
```

O projeto usa módulos nativos e precisa de um development build; não roda no Expo Go. Com o build já instalado no aparelho, basta iniciar o servidor:

```bash
npm start
```

No login, informe a empresa (subdomínio de `tmsweb.com.br`), o e-mail e a senha.

## Verificações

```bash
npm run lint
npx tsc --noEmit
```

## Estrutura de diretórios

```text
esl-delivery/
├── assets/             # Ícones, logos e imagens
├── src/
│   ├── components/     # Componentes reutilizáveis
│   │   ├── forms/      # Botões, inputs e selects
│   │   └── shared/     # Drawer, cabeçalhos, loading e sincronização
│   ├── helpers/        # Datas, mapas e mensagens
│   ├── models/         # Modelos de domínio (MobX-State-Tree)
│   ├── navigation/     # Navegadores stack, drawer e tabs
│   ├── screens/        # Telas do aplicativo
│   ├── services/
│   │   └── api/        # Cliente HTTP, endpoints e erros
│   ├── stores/         # Estado global e regras de negócio
│   ├── themes/         # Tema e cores
│   ├── App.tsx         # Componente raiz
│   ├── persist.ts      # Persistência das stores
│   └── storage.ts      # Armazenamento local (MMKV)
├── app.json            # Configuração do Expo
├── index.ts            # Ponto de entrada
└── package.json        # Dependências e scripts
```

Os diretórios `android/` e `ios/` são gerados pelo Expo e não são versionados.
