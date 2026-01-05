# Contributing to Construction Bid Management System

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style](#code-style)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow the project's technical standards

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Google OAuth credentials

### Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/your-username/CRM-V2.git
   cd CRM-V2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming

- `feature/` - New features (e.g., `feature/add-bid-export`)
- `fix/` - Bug fixes (e.g., `fix/project-date-validation`)
- `refactor/` - Code refactoring (e.g., `refactor/api-error-handling`)
- `docs/` - Documentation updates (e.g., `docs/api-reference`)
- `test/` - Test additions/updates (e.g., `test/project-api`)

### Commit Messages

Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(projects): add CSV export functionality

Implement CSV export for project lists with customizable columns

Closes #123
```

```
fix(auth): resolve login redirect loop

Fix infinite redirect when user is already authenticated

Fixes #456
```

## Code Style

### TypeScript/JavaScript

- Use TypeScript for all new code
- Enable strict mode
- Use functional components with hooks
- Prefer async/await over promises
- Use descriptive variable names

### Formatting

- Use Prettier for code formatting (runs automatically)
- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- Trailing commas in objects/arrays

### File Organization

```
app/               # Next.js pages and API routes
├── api/           # API endpoints
├── dashboard/     # Protected dashboard pages
└── ...

components/        # React components
├── ui/            # shadcn/ui components
└── ...

lib/               # Utility functions and libraries
├── utils.ts       # General utilities
├── validations.ts # Zod schemas
├── constants.ts   # Application constants
└── ...

prisma/            # Database schema and seeds
```

### Component Guidelines

```typescript
// Good: Functional component with TypeScript
interface ProjectCardProps {
  project: Project
  onDelete: (id: string) => void
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  return <Card>...</Card>
}

// Bad: Missing types
export function ProjectCard({ project, onDelete }) {
  return <Card>...</Card>
}
```

### API Route Guidelines

```typescript
// Use standardized response format
import { withAuth, ApiResponses } from '@/lib/api-utils'

export const POST = withAuth(async (userId, request) => {
  try {
    // Validate input
    const body = await request.json()
    const data = createProjectSchema.parse(body)

    // Business logic
    const project = await prisma.project.create({ ... })

    // Return standardized response
    return ApiResponses.created(project)
  } catch (error) {
    logger.error('Failed to create project', error)
    return ApiResponses.serverError()
  }
})
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

- Place tests next to the code they test or in `__tests__/`
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert
- Mock external dependencies

Example:
```typescript
describe('createProjectSchema', () => {
  it('should validate a valid project', () => {
    const validProject = {
      name: 'Test Project',
      bidDueDate: '2026-12-31',
      projectDivisions: [{ divisionId: 'div-1' }],
      userId: 'user-123',
    }

    const result = createProjectSchema.safeParse(validProject)
    expect(result.success).toBe(true)
  })
})
```

## Pull Request Process

### Before Submitting

1. **Test your changes**:
   ```bash
   npm test
   npm run lint
   npm run build
   ```

2. **Update documentation** if needed

3. **Add tests** for new features

4. **Run the app locally** to verify changes

### Submitting a PR

1. Create a pull request with a clear title and description
2. Reference any related issues
3. Ensure all CI checks pass
4. Request review from maintainers
5. Address review feedback promptly

### PR Title Format

```
feat: Add CSV export for projects

fix: Resolve login redirect issue

docs: Update API documentation
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Tests pass locally
- [ ] Lint passes
- [ ] Documentation updated
- [ ] No console errors/warnings
```

## Project Structure

### Key Directories

- **`app/`** - Next.js 15 App Router (pages and API routes)
- **`components/`** - Reusable React components
- **`lib/`** - Utility functions, validations, constants
- **`prisma/`** - Database schema and migrations
- **`hooks/`** - Custom React hooks
- **`types/`** - TypeScript type definitions

### Architecture Patterns

- **Server Components**: Default for all pages
- **Client Components**: Use `'use client'` directive for interactive components
- **API Routes**: Follow RESTful conventions
- **Data Fetching**: Direct Prisma queries in Server Components
- **State Management**: React hooks (useState, useReducer)
- **Validation**: Zod schemas for all inputs

### Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name description_of_change

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## Questions?

If you have questions or need help:

1. Check existing issues and documentation
2. Open a new issue with the `question` label
3. Be specific and provide context

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
