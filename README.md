# Helios - AI Chat Application

A modern, feature-rich AI chat application built with React, Vite, and Tailwind CSS. Helios provides a sleek interface for interacting with multiple AI models through OpenRouter, with support for text, image, and file inputs.

## ✨ Features

### 🤖 Multiple AI Models
- **11 Free AI Models** from various providers (Mistral, DeepSeek, Google, NVIDIA, Meta, etc.)
- **Vision Models**: Support for image analysis (Nemotron Nano 12B VL, Gemini Flash)
- **File Models**: Support for document attachments (Nova 2 Lite)
- **Easy Model Switching**: Dropdown selector with model status indicator

### 💬 Chat Interface
- **Session Management**: Create, rename, delete, and switch between chat sessions
- **Conversation History**: Persistent storage with Supabase backend
- **Typing Animation**: Smooth text rendering effect for AI responses
- **Markdown Support**: Rich text formatting with code highlighting
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 📁 File & Image Support
- **Image Upload**: Upload and analyze images with vision-capable models
- **File Attachments**: Support for multiple file formats (.txt, .md, .json, .csv, .log, .yaml, .xml)
- **Smart Model Detection**: Automatically shows relevant upload options based on selected model

### 🎯 Quick Actions
- **Pre-built Prompts**: Quick-start buttons for common tasks
  - Write cover letters
  - Code debugging and optimization
  - And more...
- **One-click Actions**: Instant prompt insertion for faster workflow

### 🎨 Modern UI/UX
- **Dark Theme**: Easy on the eyes with zinc-based color palette
- **Glassmorphism Effects**: Modern backdrop blur and transparency
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Sidebar Navigation**: Collapsible sidebar with session management
- **Responsive Layout**: Adapts seamlessly to different screen sizes

### 🔐 Authentication & Security
- **Supabase Auth**: Secure user authentication system
- **Session Persistence**: User data and chat history saved securely
- **Environment Variables**: Secure API key management

### ⚡ Performance & Technology
- **React 19**: Latest React version with modern hooks
- **Vite**: Lightning-fast development and build tool
- **Tailwind CSS 4**: Utility-first CSS framework with Vite integration
- **React Icons**: Comprehensive icon library
- **React Markdown**: GitHub-flavored markdown rendering

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- OpenRouter API key
- Supabase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd helios
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   - Run the SQL migration in your Supabase dashboard
   - Set up the required tables (`chat_sessions`, `conversations`)

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
helios/
├── src/
│   ├── components/          # React components
│   │   ├── AssistantResponse.jsx
│   │   ├── Auth.jsx
│   │   ├── ErrorBanner.jsx
│   │   ├── Header.jsx
│   │   ├── PromptForm.jsx
│   │   ├── QuickActions.jsx
│   │   ├── RemoveButton.jsx
│   │   ├── Sidebar.jsx
│   │   ├── UploadButton.jsx
│   │   └── markdown/       # Markdown rendering components
│   ├── constants/
│   │   └── models.js       # AI model configurations
│   ├── context/
│   │   └── AuthContext.jsx # Authentication context
│   ├── lib/
│   │   └── supabase.js     # Supabase client configuration
│   ├── App.jsx             # Main application component
│   ├── main.jsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── dist/                   # Build output
└── package.json            # Dependencies and scripts
```

## 🎯 Available AI Models

| Model | Provider | Capabilities |
|-------|----------|--------------|
| Devstral 2 | Mistral AI | Text |
| DeepSeek 3.1 | DeepSeek | Text |
| Nova 2 Lite | TNG Tech | Text + Files |
| Trinity Mini | Z-AI | Text |
| TNG Chimera | Qwen | Text |
| Olmo 3.32B | NVIDIA | Text |
| Kat Coder Pro | Meta Llama | Text |
| Nemotron Nano 12B | NVIDIA | Vision |
| Deepresearch 30B | Google | Text |
| GPT-4o Mini | OpenAI | Vision |
| Gemini Flash | Google | Vision |

## 🔧 Configuration

### Model Customization
Edit `src/constants/models.js` to:
- Add new AI models
- Modify existing model configurations
- Update vision/file model sets

### Styling
The application uses Tailwind CSS with custom configurations:
- Dark theme with zinc color palette
- Glassmorphism effects
- Responsive breakpoints
- Custom animations

### Database Schema
Required Supabase tables:
- `chat_sessions`: Stores user chat sessions
- `conversations`: Stores individual messages and responses

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality
- ESLint configuration for React best practices
- Modern React patterns with hooks
- Component-based architecture
- Responsive design principles

## 🌟 Highlights

- **Modern Tech Stack**: React 19, Vite, Tailwind CSS 4
- **Multi-Modal AI**: Text, image, and file processing
- **Professional UI**: Glassmorphism, animations, responsive design
- **Production Ready**: Authentication, database, error handling
- **Developer Friendly**: Clean code, modular components, comprehensive documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using React, Vite, and Tailwind CSS**
