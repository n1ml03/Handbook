export interface Document {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
}

export interface DocumentCategory {
  id: string;
  name: string;
  color: string;
  count: number;
}

export const documentsData: Document[] = [
  {
    id: '1',
    title: 'Getting Started with DOAX Venus Vacation',
    content: `<h1>Getting Started with DOAX Venus Vacation</h1>

<h2>Welcome to the Ultimate Guide</h2>

<p>Dead or Alive Xtreme Venus Vacation is a complex game with many mechanics to master. This comprehensive guide will help you get started on your journey.</p>

<h3>Basic Gameplay</h3>
<ul>
  <li><strong>Character Selection</strong>: Choose your favorite characters and build your roster</li>
  <li><strong>Training</strong>: Improve your characters' stats through various training activities</li>
  <li><strong>Events</strong>: Participate in seasonal events for exclusive rewards</li>
</ul>

<h3>Key Features</h3>
<ol>
  <li><strong>Swimsuit Collection</strong>: Collect beautiful swimsuits with unique stats and abilities</li>
  <li><strong>Character Development</strong>: Train and improve your characters' abilities</li>
  <li><strong>Social Features</strong>: Connect with other players and share your progress</li>
</ol>

<h3>Tips for New Players</h3>
<ul>
  <li>Start with the tutorial to understand basic mechanics</li>
  <li>Focus on one character initially to build a strong foundation</li>
  <li>Save your V-stones for important events and gachas</li>
</ul>

<p>This guide will be updated regularly with new information and strategies.</p>`,
    category: 'tutorial',
    tags: ['beginner', 'basics', 'guide', 'tutorial'],
    author: 'Admin',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    isPublished: true
  },
  {
    id: '2',
    title: 'Advanced Swimsuit Collection Strategies',
    content: `<h1>Advanced Swimsuit Collection Strategies</h1>

<h2>Maximize Your Collection Efficiency</h2>

<p>Collecting swimsuits is one of the core aspects of DOAX Venus Vacation. Here are advanced strategies to help you build the perfect collection.</p>

<h3>Gacha Strategy</h3>
<ul>
  <li><strong>Save for Featured Events</strong>: Don't pull on every banner</li>
  <li><strong>Track Pity Systems</strong>: Understand the gacha mechanics</li>
  <li><strong>Plan Your Pulls</strong>: Use community resources to plan ahead</li>
</ul>

<h3>Stats and Skills</h3>
<p>Understanding swimsuit stats is crucial for optimal performance:</p>

<h4>Primary Stats</h4>
<ul>
  <li><strong>POW (Power)</strong>: Affects physical activities</li>
  <li><strong>TEC (Technique)</strong>: Important for skill-based activities</li>
  <li><strong>STM (Stamina)</strong>: Determines endurance</li>
  <li><strong>APL (Appeal)</strong>: Influences charm-based activities</li>
</ul>

<h4>Skill Types</h4>
<ol>
  <li><strong>Active Skills</strong>: Triggered during gameplay</li>
  <li><strong>Passive Skills</strong>: Always active bonuses</li>
  <li><strong>Combo Skills</strong>: Work with other swimsuits/accessories</li>
</ol>

<h3>Collection Tips</h3>
<ul>
  <li>Focus on your main characters first</li>
  <li>Don't ignore lower rarity suits with good skills</li>
  <li>Consider future events when planning pulls</li>
  <li>Use the calculator to optimize stat distributions</li>
</ul>`,
    category: 'gameplay',
    tags: ['swimsuit', 'collection', 'strategy', 'advanced'],
    author: 'Admin',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    isPublished: true
  },
  {
    id: '3',
    title: 'Character Stats and Development Guide',
    content: `# Character Stats and Development Guide

## Understanding Your Characters

Each character in DOAX Venus Vacation has unique characteristics and development paths.

### Character Types
- **POW Type**: Excel in power-based activities
- **TEC Type**: Best for technique-focused challenges
- **STM Type**: High endurance for long activities

### Development Strategies
Focus on building characters according to their strengths while addressing weaknesses through equipment and training.

### Training Tips
- Use the Venus Board system effectively
- Prioritize stats based on character type
- Don't neglect secondary stats

This guide covers advanced character development techniques and optimization strategies.`,
    category: 'reference',
    tags: ['characters', 'stats', 'skills', 'development'],
    author: 'Admin',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-12',
    isPublished: false
  },
  {
    id: '4',
    title: 'Event Optimization Strategies',
    content: `# Event Optimization Strategies

## Maximizing Event Rewards

Events are crucial for obtaining rare items and exclusive swimsuits. Here's how to optimize your event participation.

### Event Types
- **Festival Events**: Long-term participation with daily activities
- **Gacha Events**: Limited-time banners with increased rates
- **Tournament Events**: Competitive ranking-based rewards

### Planning Your Events
1. **Resource Management**: Save currencies for major events
2. **Time Management**: Plan your daily activities around event schedules
3. **Priority Setting**: Focus on events that benefit your main characters

### Advanced Tips
- Track event calendars and plan ahead
- Understand pity systems in gacha events
- Coordinate with community for strategies`,
    category: 'gameplay',
    tags: ['events', 'strategy', 'optimization', 'rewards'],
    author: 'EventMaster',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-15',
    isPublished: true
  },
  {
    id: '5',
    title: 'Accessory and Equipment Guide',
    content: `# Accessory and Equipment Guide

## Building the Perfect Equipment Setup

Accessories play a crucial role in character optimization. This guide covers everything you need to know.

### Accessory Types
- **Head**: Crowns, tiaras, headbands
- **Face**: Glasses, masks, visors
- **Hand**: Gloves, bracelets, rings
- **Body**: Necklaces, charms, pendants

### Stat Optimization
Understanding how accessories complement your character's natural abilities is key to maximizing performance.

### Rarity Tiers
- **N (Normal)**: Basic accessories with small bonuses
- **R (Rare)**: Moderate improvements
- **SR (Super Rare)**: Significant stat boosts
- **SSR (Super Super Rare)**: Major enhancements
- **UR (Ultra Rare)**: Game-changing accessories

### Building Synergy
Combine accessories that work well together for maximum effect.`,
    category: 'reference',
    tags: ['accessories', 'equipment', 'optimization', 'stats'],
    author: 'GearGuru',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-20',
    isPublished: true
  },
  {
    id: '6',
    title: 'Skill System Deep Dive',
    content: `# Skill System Deep Dive

## Understanding Skills and Their Applications

The skill system is one of the most complex aspects of the game. Master it to unlock your characters' true potential.

### Skill Categories
- **Active Skills**: Manually triggered abilities
- **Passive Skills**: Always-active effects
- **Combo Skills**: Multi-character synergies
- **Elemental Skills**: Nature-based powers

### Skill Combinations
Learn which skills work well together and how to build effective skill loadouts.

### Advanced Mechanics
- Skill cooldowns and timing
- Elemental interactions
- Team skill synergies

This comprehensive guide will help you become a skill master.`,
    category: 'tutorial',
    tags: ['skills', 'combat', 'strategy', 'advanced'],
    author: 'SkillSensei',
    createdAt: '2024-02-25',
    updatedAt: '2024-03-05',
    isPublished: true
  },
  {
    id: '7',
    title: 'Bromide Collection and Photography',
    content: `# Bromide Collection and Photography

## Capturing Perfect Moments

Bromides are collectible photos that provide both aesthetic and gameplay benefits.

### Types of Bromides
- **Character Bromides**: Feature specific characters
- **Scene Bromides**: Showcase beautiful locations
- **Frame Bromides**: Decorative borders
- **Effect Bromides**: Special visual enhancements

### Photography Tips
- Understand lighting and composition
- Time your shots perfectly
- Experiment with different angles

### Collection Strategies
Build a comprehensive bromide collection that enhances both your album and gameplay experience.`,
    category: 'gameplay',
    tags: ['bromides', 'photography', 'collection', 'aesthetics'],
    author: 'PhotoPro',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-10',
    isPublished: true
  },
  {
    id: '8',
    title: 'Advanced Combat Mechanics',
    content: `# Advanced Combat Mechanics

## Mastering Battle Systems

Combat in DOAX Venus Vacation involves more than just raw stats. Understanding advanced mechanics is crucial.

### Combat Flow
1. **Initiative Phase**: Speed determines turn order
2. **Action Phase**: Execute your planned moves
3. **Resolution Phase**: Calculate damage and effects

### Advanced Techniques
- **Perfect Timing**: Execute actions at optimal moments
- **Elemental Advantages**: Exploit weaknesses
- **Combo Chains**: Link abilities for maximum effect

### Team Composition
Build balanced teams that cover each other's weaknesses while amplifying strengths.`,
    category: 'tutorial',
    tags: ['combat', 'advanced', 'mechanics', 'strategy'],
    author: 'BattleMaster',
    createdAt: '2024-03-15',
    updatedAt: '2024-03-25',
    isPublished: true
  },
  {
    id: '9',
    title: 'Seasonal Event Calendar 2024',
    content: `# Seasonal Event Calendar 2024

## Year-Round Event Planning

Stay ahead of the game with our comprehensive event calendar.

### Spring Events (March-May)
- Cherry Blossom Festival
- Spring Tournament Series
- Easter Special Events

### Summer Events (June-August)
- Beach Festival Season
- Summer Olympics
- Tropical Paradise Collection

### Autumn Events (September-November)
- Harvest Festival
- Halloween Spectacular
- Autumn Championship

### Winter Events (December-February)
- Winter Wonderland
- New Year Celebrations
- Valentine's Day Special

Plan your resources and time accordingly to maximize event rewards.`,
    category: 'update',
    tags: ['events', 'calendar', 'seasonal', 'planning'],
    author: 'EventPlanner',
    createdAt: '2024-01-01',
    updatedAt: '2024-03-30',
    isPublished: true
  },
  {
    id: '10',
    title: 'Community Resources and Tools',
    content: `# Community Resources and Tools

## Essential Community Tools

The DOAX Venus Vacation community has created amazing tools to enhance your gameplay experience.

### Popular Tools
- **Stat Calculators**: Optimize your character builds
- **Event Trackers**: Never miss important events
- **Gacha Simulators**: Plan your pulls
- **Database Search**: Find specific items quickly

### Community Websites
- Official forums
- Reddit communities
- Discord servers
- Fan-made wikis

### Contributing to the Community
Learn how you can contribute guides, translations, and tools to help other players.`,
    category: 'reference',
    tags: ['community', 'tools', 'resources', 'guides'],
    author: 'CommunityManager',
    createdAt: '2024-04-01',
    updatedAt: '2024-04-10',
    isPublished: true
  },
  {
    id: '11',
    title: 'Game Updates and Patch Notes',
    content: `# Game Updates and Patch Notes

## Latest Game Changes

Stay informed about the latest updates, balance changes, and new features.

### Version 3.2.0 Updates
- New character: Celestial Guardian series
- Enhanced skill system with elemental combinations
- Improved bromide photography mechanics
- Quality of life improvements

### Upcoming Features
- New event types
- Enhanced customization options
- Additional character development paths

### Balance Changes
Recent adjustments to ensure fair and competitive gameplay across all activities.`,
    category: 'update',
    tags: ['updates', 'patches', 'balance', 'features'],
    author: 'DevTeam',
    createdAt: '2024-04-15',
    updatedAt: '2024-04-20',
    isPublished: true
  },
  {
    id: '15',
    title: 'Documentation Platform Updates - May 2024',
    content: `# Documentation Platform Updates - May 2024

## Enhanced Text Editor and New Features

We've significantly upgraded our documentation platform with advanced text editing capabilities and improved user experience.

### 🚀 Major Text Editor Enhancements

#### **New TipTap Extensions Added**
- **@tiptap/extension-bubble-menu**: Floating context menu for quick formatting
- **@tiptap/extension-character-count**: Real-time character and word counting
- **@tiptap/extension-code-block-lowlight**: Syntax highlighting for code blocks
- **@tiptap/extension-font-family**: Font selection capabilities
- **@tiptap/extension-task-list**: Interactive task lists with checkboxes
- **@tiptap/extension-text-align**: Text alignment options (left, center, right, justify)
- **@tiptap/extension-typography**: Smart typography with auto-formatting
- **@tiptap/extension-underline**: Underline text formatting
- **@tiptap/extension-mention**: @mention functionality for collaboration
- **@tiptap/extension-focus**: Enhanced focus management
- **@tiptap/extension-placeholder**: Dynamic placeholder text

#### **Enhanced User Experience Features**
- **Drag & Drop Support**: Seamless content reordering with visual indicators
- **Smart Cursor Navigation**: Improved cursor positioning in complex layouts
- **Auto-save Functionality**: Automatic content preservation
- **Keyboard Shortcuts**: Comprehensive shortcut support for power users
- **Responsive Design**: Optimized for all device sizes

#### **Advanced Formatting Capabilities**
- **Rich Text Styling**: Enhanced color palette and highlighting options
- **Table Management**: Advanced table creation with resizable columns
- **Media Integration**: Improved image embedding with auto-resize
- **Code Syntax Highlighting**: Support for multiple programming languages
- **Mathematical Expressions**: LaTeX-style math rendering (coming soon)

### 📚 New Documentation Features

#### **Document Categories Expansion**
- Added comprehensive text editor documentation
- Enhanced reference materials with technical specifications
- Improved tutorial structure with step-by-step guides

#### **Search and Navigation**
- Enhanced search functionality with tag-based filtering
- Improved document categorization
- Quick navigation shortcuts

#### **Accessibility Improvements**
- Enhanced screen reader support
- Keyboard navigation optimization
- High contrast mode compatibility

### 🔧 Technical Improvements

#### **Performance Optimizations**
- Lazy loading of editor extensions
- Optimized bundle sizes
- Improved rendering performance
- Enhanced memory management

#### **Developer Experience**
- TypeScript integration improvements
- Enhanced error handling
- Better debugging capabilities
- Comprehensive API documentation

### 📊 Statistics and Metrics

#### **Platform Usage**
- 25+ TipTap extensions now available
- 5 document categories with detailed guides
- 14+ comprehensive documentation articles
- Enhanced editor with 20+ formatting options

#### **Performance Metrics**
- 40% faster editor initialization
- 60% smaller bundle size for core features
- 99.9% uptime for documentation platform
- Real-time collaboration support (beta)

### 🎯 Upcoming Features

#### **Q3 2024 Roadmap**
- **Collaborative Editing**: Real-time multi-user editing
- **Version Control**: Document history and diff viewing
- **Export Options**: PDF, Word, and Markdown export
- **Custom Themes**: User-customizable editor themes
- **Plugin System**: Extensible architecture for custom extensions

#### **Advanced Features**
- **AI-Powered Writing Assistance**: Smart suggestions and auto-completion
- **Advanced Table Features**: Spreadsheet-like functionality
- **Media Library**: Centralized asset management
- **Template System**: Pre-designed document templates

### 💡 User Tips and Best Practices

#### **Getting Started with New Features**
1. **Try the Bubble Menu**: Select text to see the floating toolbar
2. **Use Task Lists**: Create interactive checklists for better organization
3. **Explore Syntax Highlighting**: Use code blocks for technical documentation
4. **Customize Text Alignment**: Use the new alignment options for better layout

#### **Power User Features**
- Use keyboard shortcuts (Ctrl+B for bold, Ctrl+I for italic)
- Leverage the mention system for collaborative workflows
- Utilize the character counter for content length management
- Take advantage of smart typography for professional formatting

### 🐛 Bug Fixes and Improvements

- Fixed table resizing issues on mobile devices
- Improved link handling and validation
- Enhanced image upload and processing
- Better error handling for network interruptions
- Optimized memory usage for large documents

### 📞 Support and Feedback

We're continuously improving the documentation platform based on user feedback. For questions, suggestions, or technical support:

- Visit our support documentation
- Join our community Discord
- Submit feedback through the platform
- Report bugs via our issue tracker

Thank you for using our documentation platform!`,
    category: 'update',
    tags: ['platform-updates', 'text-editor', 'features', 'improvements', 'changelog'],
    author: 'PlatformTeam',
    createdAt: '2024-05-25',
    updatedAt: '2024-05-25',
    isPublished: true
  },
  {
    id: '12',
    title: 'Competitive Play and Rankings',
    content: `# Competitive Play and Rankings

## Climbing the Competitive Ladder

For players who want to test their skills against others, competitive play offers exciting challenges.

### Ranking Systems
- **Bronze Tier**: Entry level competition
- **Silver Tier**: Intermediate challenges
- **Gold Tier**: Advanced competition
- **Platinum Tier**: Elite level play
- **Diamond Tier**: The highest echelon

### Tournament Formats
- Single elimination
- Round robin
- Swiss format
- Custom bracket systems

### Competitive Strategies
Learn the meta, understand character matchups, and develop winning strategies for tournament play.`,
    category: 'gameplay',
    tags: ['competitive', 'rankings', 'tournaments', 'strategy'],
    author: 'ProPlayer',
    createdAt: '2024-04-25',
    updatedAt: '2024-05-01',
    isPublished: true
  },
  {
    id: '13',
    title: 'Troubleshooting and FAQ',
    content: `# Troubleshooting and FAQ

## Common Issues and Solutions

Having trouble with the game? This comprehensive FAQ covers the most common issues and their solutions.

### Technical Issues
- **Game Won't Start**: Check system requirements and update drivers
- **Performance Problems**: Adjust graphics settings and close background apps
- **Connection Issues**: Verify internet connection and server status

### Gameplay Questions
- **Lost Progress**: Contact support with account details
- **Missing Items**: Check inventory and event rewards
- **Character Issues**: Verify character status and equipment

### Account Management
- Data backup and recovery
- Account linking and transfers
- Privacy and security settings

If you can't find your answer here, contact our support team for personalized assistance.`,
    category: 'reference',
    tags: ['troubleshooting', 'faq', 'support', 'technical'],
    author: 'SupportTeam',
    createdAt: '2024-05-05',
    updatedAt: '2024-05-15',
    isPublished: true
  },
  {
    id: '14',
    title: 'Advanced Text Editor Features and Packages',
    content: `# Advanced Text Editor Features and Packages

## Comprehensive Text Editing with TipTap

Our documentation platform features a powerful, extensible text editor built with TipTap, providing rich formatting capabilities for creating and editing documents.

### Core Text Editor Packages

#### **TipTap Core Extensions**
- **@tiptap/react**: React integration for TipTap editor
- **@tiptap/starter-kit**: Essential formatting tools bundle
- **@tiptap/pm**: ProseMirror integration layer

#### **Advanced Formatting Extensions**
- **@tiptap/extension-text-style**: Base for text styling
- **@tiptap/extension-color**: Text color customization
- **@tiptap/extension-highlight**: Text highlighting
- **@tiptap/extension-underline**: Underline formatting
- **@tiptap/extension-typography**: Smart typography features

#### **Layout and Structure**
- **@tiptap/extension-paragraph**: Enhanced paragraph handling
- **@tiptap/extension-document**: Document structure management
- **@tiptap/extension-hard-break**: Line break controls
- **@tiptap/extension-horizontal-rule**: Horizontal dividers

#### **Lists and Tasks**
- **@tiptap/extension-list-item**: Enhanced list items
- **@tiptap/extension-task-list**: Interactive task lists
- **@tiptap/extension-task-item**: Individual task items
- **@tiptap/extension-text-align**: Text alignment options

#### **Media and Links**
- **@tiptap/extension-image**: Image embedding
- **@tiptap/extension-link**: URL linking
- **@tiptap/extension-table**: Table creation and editing
- **@tiptap/extension-table-row**: Table row management
- **@tiptap/extension-table-cell**: Cell formatting
- **@tiptap/extension-table-header**: Header styling

#### **Code and Technical Writing**
- **@tiptap/extension-code-block-lowlight**: Syntax-highlighted code blocks
- **lowlight**: Syntax highlighting engine
- **@tiptap/extension-mention**: @mention functionality

#### **User Experience Enhancements**
- **@tiptap/extension-placeholder**: Placeholder text
- **@tiptap/extension-character-count**: Character counting
- **@tiptap/extension-focus**: Focus management
- **@tiptap/extension-bubble-menu**: Floating toolbar
- **@tiptap/extension-dropcursor**: Drag-and-drop indicators
- **@tiptap/extension-gapcursor**: Gap cursor navigation
- **@tiptap/extension-history**: Undo/redo functionality

#### **Font and Typography**
- **@tiptap/extension-font-family**: Font family selection
- **@tiptap/extension-typography**: Smart quotes and punctuation

### Editor Features

#### **Rich Text Formatting**
- Bold, italic, strikethrough, underline
- Text colors and highlighting
- Multiple heading levels (H1-H6)
- Code inline and blocks with syntax highlighting

#### **Lists and Organization**
- Bullet and numbered lists
- Interactive task lists with checkboxes
- Blockquotes for emphasis
- Horizontal rules for section breaks

#### **Media and Content**
- Image embedding with auto-resize
- Link creation and management
- Table creation with resizable columns
- Code blocks with syntax highlighting

#### **Advanced Functionality**
- Real-time character counting
- Undo/redo with keyboard shortcuts
- Drag-and-drop content support
- Floating bubble menu for quick formatting
- Auto-focus and cursor management

### Usage Examples

#### **Basic Text Formatting**
\`\`\`typescript
// Bold text
editor.chain().focus().toggleBold().run()

// Add heading
editor.chain().focus().toggleHeading({ level: 2 }).run()

// Insert link
editor.chain().focus().setLink({ href: 'https://example.com' }).run()
\`\`\`

#### **Advanced Features**
\`\`\`typescript
// Insert table
editor.chain().focus().insertTable({ 
  rows: 3, 
  cols: 3, 
  withHeaderRow: true 
}).run()

// Add image
editor.chain().focus().setImage({ 
  src: 'image-url.jpg',
  alt: 'Description'
}).run()

// Create task list
editor.chain().focus().toggleTaskList().run()
\`\`\`

### Customization Options

#### **Styling and Themes**
- Custom CSS classes for all elements
- Theme-aware color schemes
- Responsive design support
- Accessibility features

#### **Extension Configuration**
- Configurable toolbar layouts
- Custom keyboard shortcuts
- Plugin-specific settings
- Event handlers and callbacks

### Best Practices

#### **Content Organization**
- Use semantic heading hierarchy
- Structure content with lists and sections
- Include alt text for images
- Maintain consistent formatting

#### **Performance Optimization**
- Lazy load extensions when needed
- Optimize image sizes
- Use efficient data structures
- Implement proper cleanup

### Integration with Documentation System

The text editor seamlessly integrates with our documentation platform, providing:
- Real-time content preview
- Auto-save functionality
- Version control integration
- Collaborative editing support
- Export capabilities (HTML, Markdown)

This comprehensive text editing solution ensures that documentation creation and editing is both powerful and user-friendly.`,
    category: 'reference',
    tags: ['text-editor', 'tiptap', 'documentation', 'features', 'packages'],
    author: 'TechDocTeam',
    createdAt: '2024-05-20',
    updatedAt: '2024-05-25',
    isPublished: true
  }
];

export const documentCategoriesData: DocumentCategory[] = [
  { id: 'tutorial', name: 'Tutorials', color: 'bg-accent-pink', count: 3 },
  { id: 'gameplay', name: 'Gameplay', color: 'bg-accent-cyan', count: 4 },
  { id: 'reference', name: 'Reference', color: 'bg-accent-purple', count: 5 },
  { id: 'update', name: 'Updates', color: 'bg-accent-gold', count: 3 }
]; 