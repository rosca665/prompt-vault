# PromptVault

A professional Windows desktop application for managing, organizing, and reusing AI prompts. Built with **Tauri 2**, **React**, **TypeScript**, and **SQLite**.

## Features

### Core
- ✅ Create, edit, delete, restore prompts
- ✅ Organize by categories, tags, collections
- ✅ Search by title, body, tags, model, notes
- ✅ Filter and sort (newest, oldest, rated, alphabetical)
- ✅ Favourite and rate prompts (1–5)
- ✅ Copy to clipboard with usage tracking

### Advanced (Phase 2+)
- 📋 Variable modal for prompt templating (`[VAR_NAME]` syntax)
- 📜 Version history with restore and diff view
- 📊 Token estimates and word/character counts
- 📦 Import/export (JSON, Markdown, TXT)
- 💾 Auto-backup and restore
- ⌨️ Keyboard shortcuts and global hotkey

### UX
- 🎨 Dark mode (default) and light mode
- 📱 Three-panel responsive layout with resizable dividers
- ⚡ Real-time search and auto-save
- 📝 Markdown preview toggle
- 🌙 Professional Windows desktop feel

## Tech Stack

| Layer | Technology |
|-------|----------|
| **Desktop Framework** | Tauri 2 |
| **Frontend** | React 18 + TypeScript |
| **State** | Zustand |
| **Database** | SQLite with Rusqlite |
| **Styling** | CSS Modules + Tailwind (optional) |
| **Backend** | Rust |

## Getting Started

### Prerequisites
- **Node.js** 18+ (npm or pnpm)
- **Rust** 1.70+ (via [rustup](https://rustup.rs/))
- **Windows** 10+ or macOS 11+ (Tauri 2 supports both)

### Installation

```bash
# Clone the repository
git clone https://github.com/rosca665/prompt-vault.git
cd prompt-vault

# Install dependencies
pnpm install

# Start development server
pnpm tauri dev
```

### Build for Production

```bash
pnpm tauri build
```

The executable will be in `src-tauri/target/release/`.

## Project Structure

```
prompt-vault/
├── src/                          # React frontend
│   ├── components/
│   │   ├── Layout/
│   │   ├── Sidebar/
│   │   ├── MainPanel/
│   │   ├── DetailPanel/
│   │   ├── Modals/
│   │   └── Common/
│   ├── hooks/
│   ├── services/
│   ├── store/
│   ├── types/
│   ├── styles/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── src-tauri/
│   ├── src/
│   │   ├── commands/           # Tauri command handlers
│   │   ├── db/
│   │   ├── models.rs
│   │   └── main.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
├── docs/                        # Documentation
└── package.json
```

## Development

### Frontend
- **React** components with TypeScript
- **CSS Modules** for styling
- **Zustand** for state management
- **Tauri API** for IPC with backend

### Backend (Rust)
- **Tauri commands** for API endpoints
- **Rusqlite** for SQLite queries
- **Serde** for serialization
- **Error handling** with Result types

### Database
- Auto-initialized on first run
- Migrations applied safely
- SQLite at `%APPDATA%\PromptVault\prompts.db` (Windows)

## Usage Examples

### Create a Prompt
```typescript
import { createPrompt } from '@/services/api';

const newPrompt = await createPrompt({
  title: 'React Component Template',
  body: 'const [name] = useState([DEFAULT_VALUE]);\nreturn <div>{name}</div>;',
  categoryId: 'some-uuid',
  model: 'gpt-4',
});
```

### Search Prompts
```typescript
import { searchPrompts } from '@/services/api';

const results = await searchPrompts('react');
```

## Roadmap

### Phase 1: Foundation ✅ (Current)
- ✅ Project scaffold
- ✅ Database and migrations
- ✅ Three-panel layout
- ✅ CRUD operations
- ✅ Basic search and filter
- ✅ Default categories

### Phase 2: Power Features (Next)
- 📋 Variable modal
- 📜 Version history
- 🔍 Advanced filters

### Phase 3: Import/Export & Backup
- 📦 JSON/Markdown export
- 💾 Backup and restore
- 📊 Settings screen

### Phase 4: Polish & Release
- ⌨️ Keyboard shortcuts
- 🎨 UI refinement
- ♿ Accessibility review
- 🚀 Production build

## Contributing

1. Create a branch: `git checkout -b feature/my-feature`
2. Make changes following code standards
3. Commit with conventional commits: `git commit -m "feat: add variable modal"`
4. Push and open a PR

## Code Standards

### TypeScript
- Strict mode enabled
- All functions typed
- No implicit `any`

### React
- Functional components
- Custom hooks for logic
- Memoization where needed

### Rust
- No `unwrap()` in production
- Result<T, E> for error handling
- Descriptive error messages

### Git
- Branch names: `feature/`, `fix/`, `docs/`
- Commit messages: `type(scope): description`
- One feature per commit (atomic)

## License

MIT

## Support

- 📖 [Documentation](./docs)
- 🐛 [Report Issues](https://github.com/rosca665/prompt-vault/issues)
- 💬 [Discussions](https://github.com/rosca665/prompt-vault/discussions)

---

**Made with ❤️ for prompt engineers and AI enthusiasts**
