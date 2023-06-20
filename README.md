# PraiseGPT - Praise your colleagues on a large scale!

ChatGPT-powered bot whose only goal is to help you write positive feedback to your colleagues.

<p align="center">
    <img src="app/public/images/social.png" width="300">
</p>

### Web application (installable, offline-ready)

[EnterPrompt](https://praise.promptengineering.rocks/) - ChatGPT-powered bot which only uses your enterprise data

## Getting Started

### Frontend

First, run the development server:

```bash
cd app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Backend

1. In your Azure account create a new resource group with the following services (free or lowest tier is fine):

- Azure OpenAI Service with gpt-35-turbo model deployments.
- Azure Static Web Apps (if you want to deploy your app later). Free tier is fine.

2. In `app/api/` folder rename `local.settings.template.json` to `local.settings.json` and fill in the values there by the names, endpoints, keys from the first step.

3. Run `func start` in `app/api/` folder. This will start Azure Functions locally.

6. You might also want to fine-tune prompts, quickstarts, and suggestions in JSON files located in `app/api/promptengineering` and `app/promptengineering` folders. 

You are fully ready to interact with your own assistant now!

## About

### Author

[Maxim Salnikov](https://twitter.com/webmaxru). Feel free to contact me if you have any questions about the project, PWA, Web Push, etc.

### License

This project is licensed under the terms of the MIT license.
