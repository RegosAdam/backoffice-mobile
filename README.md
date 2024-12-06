# Backoffice-Mobile Project Setup On A Linux System

This guide provides step-by-step instructions to set up a complete backoffice-mobile development environment using Node.js, Expo, and Firebase on a Linux system. By the end of this setup, you will be able to run and develop your Expo-based application locally, use Firebase for backend services, and leverage the associated tooling.

## Prerequisites

- A Linux distribution
- Basic knowledge of Terminal/CLI operations

## Table of Contents

1. [Node.js & NVM](#1-nodejs--nvm)
2. [Expo](#2-expo)
3. [Firebase](#3-firebase)
4. [Project Setup](#4-project-setup)
5. [Running and Developing Your App](#5-running-and-developing-your-app)
6. [Resetting the Project](#6-resetting-the-project)
7. [Additional Resources & Community](#7-additional-resources--community)

---

## 1. Node.js & NVM

NVM (Node Version Manager) allows you to install and manage multiple Node.js versions on your system. This ensures that the environment can be easily updated or rolled back as needed. For more information visit their official GitHub page [here](https://github.com/nvm-sh/nvm).

**Installation:**
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

## 2. Expo

[Expo](https://expo.dev) is an open-source platform for building universal native apps for Android, iOS, and the web with JavaScript and React.
No separate global install is required if you use ***npx*** commands provided by Expo. If you want the Expo CLI globally on your computer, you can install it.

**Installation:**

```bash
npm install -g expo-cli
```

To learn more about Expo and its CLI, visit the [Expo documentation](https://docs.expo.dev/more/expo-cli/).


## 3. Firebase

[Firebase](https://firebase.google.com) provides the necessary backend services, analytics, and tools for building scalable apps.

**Installation:**

```bash
curl -sL https://firebase.tools | upgrade=true bash
npm install -g firebase-tools
firebase --version
```
Visit [Firebase CLI Setup](https://firebase.google.com/docs/cli#linux) for more details and troubleshooting steps.

## 4. Project Setup

Navigate to the root directory of your project. The project contains an ***app*** directory for your Expo app and a ***.firebase/*** directory for Firebase configuration.

**Install Project Dependencies:**

```bash
npm install
```

**Initialize Firebase:**

```bash
firebase login
cd .firebase/
firebase init
```

Use the wizard to set up your Firebase project (select hosting, functions, etc. as required). After initialization, create and configure ***firebaseConfig.ts*** inside the ***.firebase/*** folder from the provided example file, ensuring you replace placeholders with your actual Firebase project settings.

Once done, return to the project root:

```bash
cd ..
```

## 5. Running and Developing Your App

Now that the environment and dependencies are in place, you can start the Expo development server:

```bash
npm run start
```

## 6. Resetting the Project

If you need a fresh start and want to move the starter code into ***app-example*** and have a blank app directory:

```bash
npm run reset-project
```

This command re-initializes the project structure, helpful if you want to start from scratch without the provided examples.

## 7. Additional Resources & Community
**Learn More About Expo:**

- [Expo Go](https://expo.dev/go)
- [Expo Documentation](https://docs.expo.dev)
- [Guides](https://docs.expo.dev/guides/overview/)
- [Tutorial](https://docs.expo.dev/tutorial/introduction/)

**Learn More About Firebase:**

- [Firebase Documentation](https://firebase.google.com/docs)
- [Guides](https://firebase.google.com/docs/guides)

**Community:**

- [Expo on GitHub](https://github.com/expo/expo)
- [Expo Discord Community](https://chat.expo.dev)
