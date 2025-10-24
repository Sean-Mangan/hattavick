# Hattavick

**Stop juggling Google Docs, Discord, and Roll20. Run your D&D campaign from one free, organized hub.**

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-TBD-lightgrey.svg)

---

## What is Hattavick?

Hattavick is a **free, self-hosted D&D campaign manager** designed for story-focused Dungeon Masters who want to keep their campaign lore organized without the complexity of World Anvil or the subscription cost of Roll20 Pro.

### The Problem We Solve

Running a D&D campaign means juggling:
- Roll20 for combat
- Google Docs for lore
- Discord for session notes
- Notion/OneNote for NPC tracking
- Sticky notes for plot twists you can't let players see yet

**Hattavick puts it all in one place.**

---

## Why Choose Hattavick?

| Feature | Roll20 | Foundry VTT | World Anvil | **Hattavick** |
|---------|--------|-------------|-------------|---------------|
| **Lore Management** | Basic handouts | Journal entries | Excellent | **Excellent** |
| **Hide Secrets from Players** | No | Manual workarounds | Yes (complex) | **Yes (everywhere)** |
| **Player-Owned Characters** | No | No | Limited | **Yes** |
| **Context-Aware Notes** | No | Basic | Basic | **Attached to everything** |
| **Mobile-Friendly** | Poor | Poor | Good | **Good** |
| **Cost** | $10/month | $50 one-time | $5-10/month | **Free** |
| **Dice Rolling & Maps** | Yes | Yes | No | No |

**Hattavick is not a VTT replacement**—it's a companion tool for managing your campaign's story, lore, and characters.

---

## Key Features

### 1. Unified Lore System
Organize your world with four interconnected categories:
- **Factions** - Political groups, guilds, organizations
- **Locations** - Cities, dungeons, points of interest
- **Things** - Artifacts, important items, MacGuffins
- **World Lore** - Campaign-wide context and history

Each lore item includes:
- Image upload
- Public description (visible to players)
- Private notes (admin-only, for plot twists)
- Visibility toggles
- File attachments

### 2. Progressive Disclosure for Plot Twists
**The killer feature:** Every piece of lore has public and private sections.

Want to show players the Thieves' Guild exists, but hide their secret alliance with the City Guard until the dramatic reveal? You can do that.

- Hide faction motivations until the right moment
- Show a location's public face while keeping secret passages private
- Control exactly what players discover and when

### 3. Player-Owned Characters
Players create and edit their own characters. You can view them, but you can't accidentally change them.

**Each character has:**
- Player-editable portrait, stats, and backstory
- Private backstory section (visible only to player and DM)
- Public backstory (shared with party)
- Attached notes with file uploads

### 4. Context-Aware Notes
Never lose track of campaign details again. Attach notes to:
- Characters (PC or NPC)
- Factions, locations, artifacts
- Session notes
- Campaign home page

**Notes support:**
- Public/private visibility
- File attachments (images, PDFs, audio)
- Author tracking
- Collapse/expand organization

### 5. Collaborative Campaign Management
- Invite players via email or shareable link
- Role-based permissions (Owner, Admin, Player)
- Session notes with date tracking
- Party page showing all characters

### 6. Free & Self-Hostable
No subscriptions. No vendor lock-in. Host it yourself for free.

---

## Screenshots

> **Note for Contributors**: We need screenshots! Priority areas:
> 1. Faction page showing public/private toggle
> 2. Character creation/edit view
> 3. Party page with character cards
> 4. Lore overview with faction/location/thing tabs
> 5. Session notes interface

---

## Who Is This For?

### Perfect for DMs who...
- Run narrative-heavy campaigns (not just combat)
- Track multiple factions, NPCs, and plot threads
- Want to hide plot twists until the perfect moment
- Are tired of alt-tabbing between 5 different tools
- Don't want to pay $10/month for campaign management

### Not ideal if you need...
- Dice rolling and battle maps (use Roll20/Foundry for combat)
- A complete VTT solution
- Character sheet automation (we're story-focused, not rules-focused)

---

## Getting Started

### Option 1: Try the Demo (Coming Soon)
We're working on a hosted demo. For now, follow Option 2.

### Option 2: Run Locally

#### Prerequisites
- Node.js 16+ and npm 8+
- Backend API running ([backend repository](https://github.com/Sean-Mangan/hattavick))
- Git

#### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Sean-Mangan/hattavick.git
cd hattavick/hattavick_ui

# 2. Install dependencies
npm install

# 3. Configure API endpoint
# Edit src/config/settings.json with your backend API URL

# 4. Start the app
npm start
```

The app opens at [http://localhost:3000](http://localhost:3000).

#### Full Setup Guide
For detailed setup including backend installation, see our [Installation Guide](./docs/INSTALLATION.md) _(coming soon)_.

---

## Roadmap

### Current Status (v0.1.0)
- Core lore management (factions, locations, things)
- Character management (PC and NPC)
- Session notes
- Public/private visibility controls
- Email and link-based invites

### Planned Features
- [ ] Dice roller integration
- [ ] Campaign export/backup (JSON/PDF)
- [ ] Search across all campaign content
- [ ] Timeline view for session history
- [ ] Mobile app (React Native)
- [ ] Initiative tracker
- [ ] Relationship mapping (visual faction/character connections)
- [ ] Markdown support in descriptions
- [ ] Dark mode

**Want to help prioritize?** Join our [discussions](https://github.com/Sean-Mangan/hattavick/discussions) or Discord _(coming soon)_.

---

## Contributing

We're actively looking for contributors! Here's how you can help:

### High Priority Needs
- **UX/UI Designers**: Help refine the user experience
- **Technical Writers**: Improve documentation and user guides
- **Frontend Developers**: React/Redux feature development
- **Backend Developers**: API enhancements ([backend repo](https://github.com/Sean-Mangan/hattavick))
- **Beta Testers**: Run real campaigns and give feedback

### How to Contribute
1. Check out our [Contributing Guide](./CONTRIBUTING.md) _(coming soon)_
2. Browse [open issues](https://github.com/Sean-Mangan/hattavick/issues)
3. Join our Discord _(coming soon)_ to discuss ideas
4. Submit pull requests (see [Development Guide](#development-guide) below)

---

## For Developers

### Tech Stack
- **React** 18.1.0 - UI framework
- **Redux Toolkit** 1.9.5 - State management with RTK Query
- **React Router** 6.3.0 - Client-side routing
- **Material-UI** 5.8.3 - Component library
- **Redux Persist** - State persistence
- **Axios** - HTTP client
- **SASS** - CSS preprocessing

### Project Structure
```
src/
├── app/
│   ├── store.js              # Redux store configuration
│   └── api/
│       └── apiSlice.js       # RTK Query base API
├── features/
│   ├── auth/                 # Authentication logic & API
│   └── campaign/             # Campaign management API & state
├── Pages/
│   ├── HomePage/             # Landing page
│   ├── LoginPage/            # Authentication
│   ├── CampaignPages/        # Campaign-specific pages
│   │   ├── CampaignHomePage/
│   │   ├── LorePage/         # Unified lore management
│   │   ├── CharacterPage/
│   │   └── ...
│   └── ...
├── Components/               # Reusable components
├── config/
│   └── settings.json         # App configuration
└── Resources/                # Static assets
```

### Development Workflow

```bash
# 1. Create a feature branch
git checkout -b feature/your-feature-name

# 2. Make changes (follow our coding standards)
# See CONTRIBUTING.md for details

# 3. Run the app locally
npm start

# 4. Build for production
npm run build

# 5. Commit with conventional commits
git commit -m "feat: add faction relationship mapping"

# 6. Push and create a PR
git push origin feature/your-feature-name
```

### Coding Standards
- Functional components with hooks
- PascalCase for components, camelCase for functions
- CSS Modules for scoped styling
- JSDoc comments for complex functions
- Conventional commits (feat, fix, docs, etc.)

Full coding standards in [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Community & Support

### Get Help
- **Issues**: [GitHub Issues](https://github.com/Sean-Mangan/hattavick/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Sean-Mangan/hattavick/discussions)
- **Discord**: _(coming soon)_

### Stay Updated
- Star this repo to follow development
- Watch for release notifications
- Follow [@HattavickApp](https://twitter.com/HattavickApp) _(coming soon)_

---

## FAQ

### Is Hattavick free?
Yes, completely free and open source. Self-host it on your own infrastructure.

### Do I need to be technical to use it?
To self-host, you'll need basic command-line knowledge. We're working on simpler deployment options (one-click deploys, hosted demo).

### Can I use this for other RPGs besides D&D?
Absolutely! It works for Pathfinder, Call of Cthulhu, homebrew systems—anything with campaigns, characters, and lore.

### How does this compare to World Anvil?
World Anvil is more comprehensive but also more complex. Hattavick focuses on core campaign management with a simpler, faster interface. Plus, it integrates character management better.

### What about Roll20/Foundry VTT?
Those are VTTs focused on combat. Hattavick focuses on lore and story. Use them together—Roll20 for battles, Hattavick for everything else.

### Is there a mobile app?
Not yet, but the web app is mobile-responsive. A native mobile app is on the roadmap.

### How do I back up my campaign data?
Export feature coming soon. For now, your data lives in your backend database—back up that database regularly.

---

## License

[License TBD - Add your license here]

---

## Credits

**Created by**: [Sean-Mangan](https://github.com/Sean-Mangan)

**Contributors**: [View all contributors](https://github.com/Sean-Mangan/hattavick/graphs/contributors)

**Inspired by**: The frustration of managing a 3-year campaign across 7 different tools.

---

## Share & Support

If Hattavick helps you run better campaigns:
- Star this repo
- Share it with your D&D group
- Contribute features or bug fixes
- Tell us about your campaign in [Discussions](https://github.com/Sean-Mangan/hattavick/discussions)

**Happy DMing!** 🎲

---

## Development Documentation

Looking for developer-specific documentation?
- [Pre-Commit Hooks](./PRE_COMMIT_HOOKS.md)
- [Hooks Setup Guide](./HOOKS_SETUP.md)
- [Hooks Commands Reference](./HOOKS_COMMANDS.md)
