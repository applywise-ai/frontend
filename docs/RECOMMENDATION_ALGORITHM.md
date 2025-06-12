# Job Recommendation Algorithm

## Overview

The ApplyWise job recommendation system uses a sophisticated scoring algorithm to provide personalized job recommendations. It prioritizes role level matching above all else, then considers specialization, salary, location, and skills to deliver the top 20 most relevant jobs for each user.

## Algorithm Architecture

### Scoring System (100-point scale)

The algorithm uses a weighted scoring system with the following priorities:

| Factor | Weight | Priority | Description |
|--------|--------|----------|-------------|
| **Role Level** | 30 points | 1st | Experience level matching (entry, junior, mid, senior, lead, principal) |
| **Specialization** | 25 points | 2nd | Field specialization (frontend, backend, fullstack, etc.) |
| **Salary** | 20 points | 3rd | Salary expectation alignment |
| **Location** | 15 points | 4th | Location preferences (remote, hybrid, specific cities) |
| **Skills** | 10 points | 5th | Technical skills matching |
| **Bonus Factors** | +10 points | Extra | Verified companies, sponsorship, recent postings |

### 1. Role Level Scoring (30 points max)

**Perfect Match (30 points):** User's experience level exactly matches job requirement
- Senior developer → Senior role = 30 points

**Adjacent Level (21 points):** One level difference
- Senior developer → Mid-level role = 21 points
- Mid-level developer → Senior role = 21 points

**Two Levels Apart (12 points):** Two levels difference
- Senior developer → Junior role = 12 points

**More than 2 levels apart:** 0 points

**Level Hierarchy:**
```
Entry → Junior → Mid → Senior → Lead → Principal
```

### 2. Specialization Scoring (25 points max)

**Perfect Match (25 points):** Exact specialization match
- Frontend developer → Frontend role = 25 points

**Related Field (15 points):** Related specializations
- Frontend developer → Fullstack role = 15 points
- Backend developer → DevOps role = 15 points

**Related Specializations Map:**
```javascript
{
  'frontend': ['fullstack', 'ui_ux', 'web'],
  'backend': ['fullstack', 'devops', 'api'],
  'fullstack': ['frontend', 'backend', 'web'],
  'mobile': ['frontend', 'ios', 'android'],
  'devops': ['backend', 'cloud', 'infrastructure'],
  'ml_ai': ['data_science', 'python', 'analytics'],
  'data_science': ['ml_ai', 'analytics', 'python'],
  'ui_ux': ['frontend', 'design', 'product'],
  'qa': ['automation', 'testing', 'backend'],
  'security': ['backend', 'devops', 'infrastructure']
}
```

### 3. Salary Scoring (20 points max)

**At or Above Expectation (20 points):** Job salary ≥ user expectation
- User expects $100k, job pays $120k = 20 points

**Within 20% of Expectation (16 points):** Job salary 80-99% of expectation
- User expects $100k, job pays $90k = 16 points

**Within 40% of Expectation (10 points):** Job salary 60-79% of expectation
- User expects $100k, job pays $70k = 10 points

**Below 60% of Expectation:** 0 points

### 4. Location Scoring (15 points max)

**Remote Jobs (15 points):** Always preferred
**Exact Location Match (15 points):** User location = job location
**Partial Location Match (10.5 points):** City/state partial match
**Hybrid Options (7.5 points):** Flexible work arrangements

### 5. Skills Scoring (10 points max)

**Skill Matching:** Compares user skills with job tags
- Score = (Matching Skills / Total User Skills) × 10
- User has [React, Node.js, Python], job requires [React, Vue.js] = 3.33 points

### 6. Bonus Factors (+10 points max)

- **Verified Company:** +3 points
- **Sponsorship Match:** +5 points (if user needs sponsorship and job provides it)
- **Recent Posting:** +2 points (posted within 7 days)

## Algorithm Flow

### Step 1: Score Calculation
```javascript
const scoredJobs = jobs.map(job => ({
  job,
  score: calculateJobScore(job, userProfile)
}));
```

### Step 2: Initial Sorting
```javascript
scoredJobs.sort((a, b) => b.score - a.score);
```

### Step 3: Diversity Filtering
- Limit to 2 jobs per company (prevents monopolization)
- Ensure diverse specializations in top 10 results
- Maintain high-scoring jobs while adding variety

### Step 4: Guarantee 20 Results
- Backfill with remaining high-scored jobs
- Handle edge cases with fewer than 20 total jobs
- Create variants if necessary to ensure exactly 20 results

## Usage Examples

### Basic Usage
```typescript
import { useRecommender } from '@/app/contexts/RecommenderContext';
import { useProfile } from '@/app/contexts/ProfileContext';

function JobRecommendations() {
  const { getRecommendedJobs } = useRecommender();
  const { profile } = useProfile();
  
  const recommendedJobs = getRecommendedJobs(allJobs, profile);
  // Returns exactly 20 jobs, sorted by relevance
}
```

## Optimization Features

### Performance Optimizations
- **Single Pass Scoring:** Each job scored once
- **Efficient Sorting:** Native JavaScript sort
- **Memory Efficient:** Processes jobs in batches
- **Lazy Evaluation:** Only calculates what's needed

### Quality Assurance
- **Always 20 Results:** Guaranteed output size
- **Diversity Enforcement:** Prevents echo chambers
- **Score Validation:** Bounded 0-100 scoring
- **Error Handling:** Graceful degradation

### Customization Options
- **Adjustable Weights:** Easy to modify scoring priorities
- **Extensible Bonus System:** Add new bonus factors
- **Configurable Diversity:** Adjust company/specialization limits
- **Threshold Filtering:** Set minimum score requirements

## Integration Points

### Required User Profile Fields
```typescript
interface UserProfile {
  experienceLevel?: string;    // For role level scoring
  specialization?: string;     // For specialization scoring
  salaryExpectation?: number;  // For salary scoring
  location?: string;           // For location scoring
  skills?: string[];           // For skills scoring
  needsSponsorship?: boolean;  // For bonus scoring
}
```

### Required Job Fields
```typescript
interface Job {
  experienceLevel?: string;
  specialization?: string;
  salaryValue?: number;
  location?: string;
  tags?: string[];
  isVerified?: boolean;
  providesSponsorship?: boolean;
  postedDate?: string;
}
```

## Analytics & Monitoring

### Key Metrics to Track
- **Average Score Distribution:** Monitor score ranges
- **Specialization Coverage:** Ensure diverse recommendations
- **User Engagement:** Track clicks on recommended jobs
- **Conversion Rates:** Applications from recommendations

### A/B Testing Opportunities
- **Weight Adjustments:** Test different scoring priorities
- **Diversity Levels:** Vary company/specialization limits
- **Bonus Factor Impact:** Measure bonus factor effectiveness
- **Threshold Experiments:** Test minimum score requirements

## Future Enhancements

### Machine Learning Integration
- **User Behavior Learning:** Adapt weights based on user actions
- **Collaborative Filtering:** "Users like you also liked..."
- **Content-Based Evolution:** Improve job similarity detection
- **Feedback Loop:** Learn from user saves/applications

### Advanced Features
- **Time-Based Scoring:** Consider application deadlines
- **Company Culture Matching:** Factor in company values
- **Career Path Optimization:** Consider growth opportunities
- **Market Trend Integration:** Weight trending technologies

### Performance Improvements
- **Caching Layer:** Cache scores for frequently accessed jobs
- **Incremental Updates:** Update scores only when profile changes
- **Parallel Processing:** Score jobs in parallel for large datasets
- **Database Optimization:** Pre-compute common score components 