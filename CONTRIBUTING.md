# Contributing to PayeTonGréviste

Thank you for your interest in contributing to PayeTonGréviste! This app helps people discover Strike funds through a fun, Tinder-like interface with fake activist profiles.

> **⚠️ Important**: This project boycotts Google services in solidarity with the strike movement. We do not use Google Analytics, Google Fonts, or any other Google services. Please avoid suggesting Google-based solutions.

## 🎯 Project Overview

PayeTonGréviste is a Strike fund discovery app where users anonymously browse fake activist profiles to find and support real Strike funds. It's not a real matching app - it's a gamified way to discover and support important causes.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A code editor (VS Code recommended)

### Development Setup

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/your-username/paye-ton-greviste.git
   cd paye-ton-greviste
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:run` - Run tests once
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── __tests__/      # Component tests
│   ├── Card.tsx        # Swipeable profile card
│   ├── SwipeDeck.tsx   # Card stack with actions
│   └── ...
├── pages/              # Page components
│   ├── __tests__/      # Page tests
│   ├── DiscoverPage.tsx # Main swipe interface
│   └── ...
├── lib/                # Utility functions
├── store.ts            # Zustand state management
└── styles/             # Global styles
```

## 🎨 Code Style & Standards

### TypeScript

- Use strict TypeScript
- Define types for all props and state
- Use interfaces for object shapes
- Prefer `type` over `interface` for simple unions

### React

- Use functional components with hooks
- Use descriptive component and function names
- Keep components small and focused
- Use proper prop types and default values

### CSS

- Use CSS modules or styled-components
- Follow mobile-first responsive design
- Use CSS custom properties for theming
- Keep styles co-located with components

### File Naming

- Use PascalCase for components: `UserProfile.tsx`
- Use camelCase for utilities: `formatDate.ts`
- Use kebab-case for CSS: `user-profile.css`

## 🧪 Testing

### Writing Tests

- Write tests for all new components
- Test user interactions and edge cases
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:ui

# Run tests once
npm run test:run
```

### Test Structure

```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  });

  it('should handle user interaction', () => {
    // Test implementation
  });
});
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected behavior** vs actual behavior
4. **Screenshots** if applicable
5. **Browser/device** information
6. **Console errors** if any

## ✨ Feature Requests

When requesting features, please include:

1. **Clear description** of the feature
2. **Use case** and why it's needed
3. **Mockups or examples** if applicable
4. **Impact** on existing functionality

## 🔄 Pull Request Process

### Before Submitting

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes
4. **Add** tests for new functionality
5. **Run** tests and ensure they pass
6. **Run** linting and fix any issues
7. **Update** documentation if needed

### Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Screenshots

If applicable, add screenshots

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** on different devices/browsers
4. **Approval** and merge

## 🎯 Areas for Contribution

### High Priority

- **Strike Fund Integration**: Connect fake profiles to real Strike funds
- **Fund Database**: Create and maintain fund database
- **Fund Verification**: Ensure all funds are legitimate
- **Accessibility**: Improve screen reader support
- **Mobile Experience**: Enhance mobile usability

### Medium Priority

- **Internationalization**: Add multi-language support
- **Performance**: Optimize loading and rendering
- **Analytics**: Add anonymous usage tracking
- **Testing**: Increase test coverage
- **Documentation**: Improve code documentation

### Low Priority

- **Advanced Features**: Video profiles, AR features
- **Platform Support**: React Native, desktop app
- **Integrations**: Social media, payment systems

## 🤝 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Respect different opinions and approaches

### Communication

- Use clear, descriptive commit messages
- Ask questions if something is unclear
- Provide context in pull requests
- Be patient with review process

## 📚 Resources

### Learning Materials

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Framer Motion Guide](https://www.framer.com/motion/)

### Development Tools

- [VS Code](https://code.visualstudio.com/)
- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [Zustand DevTools](https://github.com/pmndrs/zustand#devtools)

## 🆘 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Discord/Slack**: For real-time chat (if available)

## 📝 License

This project is for educational/activist purposes. By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to PayeTonGréviste! Together, we can help people discover and support important Strike funds. 🚀
