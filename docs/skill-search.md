# Skill Search Component

The SkillSearch component provides a searchable dropdown for technical and professional skills with suggestions, powered by a local JSON database of top skills.

## Features

- Fast, client-side skill searching with 200+ predefined skills
- Searchable skill input with autocomplete functionality
- Keyboard navigation (arrow keys, enter to select)
- Selected skills displayed as removable badges
- Loading state simulation for improved UX
- Smooth animations and transitions
- Intelligent caching for improved performance
- Shows popular skills when clicking the search field

## Usage

```jsx
import SkillSearch from '@/app/components/SkillSearch';

// In your form component
<SkillSearch
  value={skills}
  onChange={setSkills}
  placeholder="Search for a skill..."
/>
```

## API Options

The component accepts the following props:

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| value | string[] | Current skills array | [] |
| onChange | function | Callback when skills array changes | required |
| placeholder | string | Input placeholder text | 'Search for a skill...' |

## How It Works

The component uses a local JSON file (`/src/app/utils/top-skills.json`) containing 200+ skills across various categories:

1. **Client-side filtering** provides instant results without API calls
2. **Smart sorting** prioritizes exact matches, then skills starting with the query
3. **In-memory caching** improves performance for repeated searches
4. **Category metadata** allows for future category-based filtering if needed

## Interaction Improvements

The component now shows skills suggestions when:
- Typing in the search field
- Clicking on the search field even without typing
- Focusing on the field with keyboard navigation

This provides a more intuitive user experience and makes skill discovery easier.

## Skill Categories

The skills JSON data includes entries from various categories:

- Programming Languages (JavaScript, Python, Java, etc.)
- Frameworks & Libraries (React, Angular, Vue.js, etc.)
- Data & AI (SQL, PyTorch, TensorFlow, etc.)
- Design (Figma, Adobe XD, UI Design, etc.)
- Cloud & DevOps (AWS, Docker, Kubernetes, etc.)
- Soft Skills (Communication, Leadership, Problem Solving, etc.)
- Business (Product Management, Financial Analysis, etc.)
- And many more categories

## Customization

To customize the available skills:

1. Edit the `/src/app/utils/top-skills.json` file to add, remove, or modify skills
2. Each skill has a `name` and a `category` property
3. The component will automatically use the updated list

To customize the appearance of the dropdown or suggestions, modify the component's Tailwind classes in `src/app/components/SkillSearch.tsx`. 