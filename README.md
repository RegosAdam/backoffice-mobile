# Backoffice Project Setup On A Linux System

This guide will take you through the process of setting up all the required packages on a Linux system. We will be using Node.js, Expo, and Firebase. Follow the steps below to set up your environment.

# 

## 1. Node.js & NVM

NVM (Node Version Manager) is a version manager for Node.js, designed to be installed per-user, and invoked per-shell. Visit their official GitHub page [here](https://github.com/nvm-sh/nvm).

To install NVM and Node.js, execute the following commands:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm --version
```

```bash
nvm install --lts
node -v
npm -v
```

#

## 2. Expo

Expo is an open-source platform for making universal native apps for Android, iOS, and the web with JavaScript and React. Visit their official [documentation](https://docs.expo.dev/more/expo-cli/) for more details.

#

## 3. Firebase

Firebase provides the tools and infrastructure you need to build better apps and grow successful businesses. You can find the installation instructions for Linux systems [here](https://firebase.google.com/docs/cli#linux).

To install Firebase CLI, execute the following command:

```bash
curl -sL https://firebase.tools | upgrade=true bash
npm install -g firebase-tools
firebase --version
```

#

## 4. Project Setup

Once you have installed all the necessary tools, you can now setup your project. Navigate to your project directory and run the following commands:

```bash
npm install
```

```bash
firebase login
```

```bash
cd .firebase/
firebase init
```

Create and configure the `firebaseConfig.ts` file from the example file inside the `.firebase/` folder
\
Ensure to replace the placeholder values with your actual Firebase project settings

```bash
cd ..
```

```bash
npm run start
```
