# 🎮 Pokemon App

**React Native app for step tracking and Pokemon level progression**

## 📱 Project Description

Pokemon App is a mobile application that combines fitness tracking with gaming mechanics. Users can:

- 🏃‍♂️ **Track steps** using native Android and Ios modules
- 🎯 **Level up Pokemon** based on steps taken
- 📱 **Browse Pokemon list** from PokeAPI
- 💾 **Save progress** between sessions

## ✨ Key Features

### 🏃‍♂️ Step Tracking
- Native modules for Android and Ios with support for various sensors

### 🎮 Pokemon Level System
- **100 steps = +1 level** (configurable in constants)
- Progress bar shows progress to next level
- Automatic progress saving when leaving screen


## 🚀 How to Run

### 📋 Prerequisites

- Node.js 16+ 
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS, macOS only)
- JDK 11+ (for Android)

### 🔧 Install Dependencies

```bash
# Install npm packages
npm install

# For iOS (macOS only)
cd ios
bundle install
bundle exec pod install
cd ..
```

### 📱 Run Application

#### 1. Start Metro Server
```bash
npm start
# or
yarn start
```

#### 2. Run on Android
```bash
npm run android
# or
yarn android
```

#### 3. Run on iOS (macOS only)
```bash
npm run ios
# or
yarn ios
```

### 🔐 Permissions

On first run, the app will request permission for activity tracking for step counter functionality.

## 📚 Used Libraries

### 🎯 Core Libraries

| **React Native** | 0.80 | Main framework for mobile development |
| **TypeScript** | 4.9+ | JavaScript code typing |
| **React Navigation** | 6.x | Navigation between screens |
| **Zustand** | 4.x | Application state management |

### 🎨 UI and Animations

| **Animated API** | Built-in React Native animations |

### 💾 Data Storage

| **react-native-mmkv** | Fast key-value storage |
| **Zustand persist middleware** | Automatic state persistence |

### 🔌 Native Modules

| **NativeStepTracker** | Step tracking via Android sensors |
| **TurboModules** | Modern native module architecture |

### 🌐 API and Network

| **Fetch API** | HTTP requests to PokeAPI |
| **PokeAPI** | Pokemon data source |

## 🏗️ Project Architecture

### 📁 Folder Structure

```
src/
├── components/          # Reusable components
│   ├── PokemonCard.tsx # Pokemon card
│   └── PokemonList.tsx # Pokemon list
├── hooks/              # Custom React hooks
│   ├── useStepTracker.ts      # Step tracking logic
│   ├── usePokemonApi.ts      # PokeAPI requests
│   ├── useButtonAnimation.ts  # Button animations
│   └── index.ts              # Export all hooks
├── screens/            # Application screens
│   ├── HomeScreen.tsx        # Main screen with list
│   └── PokemonDetailsScreen.tsx # Pokemon details + Power Up
├── stores/             # Zustand state manager
│   ├── usePokemonLevelStore.ts # Pokemon level storage
│   └── index.ts              # Export all stores
├── types/              # TypeScript types
│   └── navigation.ts         # Navigation types
├── constants/          # Application constants
│   └── pokemon.ts           # Pokemon constants
└── utils/              # Utilities and helpers
```

### 🔄 Data Flow

1. **HomeScreen** → `usePokemonApi` → PokeAPI → Pokemon list
2. **PokemonDetailsScreen** → `useStepTracker` → native module → steps
3. **Power Up logic** → level calculation → `usePokemonLevelStore` → MMKV
4. **UI updates** → component re-render with new data

---

**Pokemon App** - made with ❤️ on React Native
