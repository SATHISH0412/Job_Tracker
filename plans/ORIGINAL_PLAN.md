# Personal LinkedIn Job Finder --- V1 Product Plan

## 1. Project Overview

**Project name:** Personal LinkedIn Job Finder

**Version:** V1

**Primary goal:** Build a private web application that helps one user
search LinkedIn jobs using structured filters and quickly open matching
LinkedIn job-search results.

V1 intentionally focuses only on **job discovery/search**. It does not
automatically apply to jobs, generate applications, or perform browser
automation.

The project should be designed so that future versions can add:

-   Saved jobs
-   PostgreSQL persistence
-   Resume upload and preview
-   AI-powered job/resume matching
-   Application tracking
-   Application preparation
-   Browser automation with explicit user confirmation

The architecture should therefore be modular from the beginning without
over-engineering V1.

------------------------------------------------------------------------

# 2. V1 Scope

## Included

### Job Search

The user can enter:

-   Job title / keywords
-   Location
-   Remote preference
-   Experience level
-   Job type
-   Date posted
-   Optional additional keywords

Example:

``` text
Keyword:       Software Engineer
Location:      Chennai
Experience:    Entry level
Remote:        Remote
Date posted:   Past week
```

The application generates a LinkedIn job-search request based on those
filters.

### Search Results

The application should display useful search information such as:

-   Job title
-   Company
-   Location
-   Search parameters
-   LinkedIn job/search URL
-   Optional result metadata when it is obtained through a permitted
    integration

Each result should provide:

-   `Open on LinkedIn`
-   `Search Again`
-   Optional `Save` placeholder for a future version

### Private Access

V1 is intended for a single user.

The application should have a simple authentication layer or private
deployment protection so that the application is not publicly usable by
arbitrary users.

------------------------------------------------------------------------

# 3. Explicitly Out of Scope for V1

Do not implement these yet:

-   Automatic LinkedIn login
-   Automatic LinkedIn applications
-   Automatic form filling
-   CAPTCHA solving
-   2FA handling
-   Automatic application submission
-   Resume parsing
-   AI job matching
-   Application tracking
-   Email monitoring
-   Interview tracking
-   Multi-user accounts
-   Complex recommendation systems
-   Large-scale scraping infrastructure

These can be introduced in later versions after the search experience is
stable.

------------------------------------------------------------------------

# 4. Technology Stack

## Frontend

### Next.js

Use Next.js with the App Router.

Responsibilities:

-   Page rendering
-   Search interface
-   Form handling
-   Result display
-   Server-side API routes where appropriate
-   Authentication integration

### TypeScript

Use TypeScript throughout the frontend and backend application code.

Benefits:

-   Type safety
-   Better IDE support
-   Easier refactoring
-   Clear API contracts
-   Fewer runtime mistakes

### Tailwind CSS

Use Tailwind CSS for the UI.

Benefits:

-   Fast development
-   Responsive design
-   Consistent spacing
-   Easy dashboard styling

------------------------------------------------------------------------

## Backend

For V1, use the Next.js backend/API layer instead of introducing a
separate backend service.

Example:

``` text
app/
  api/
    linkedin/
      search/
        route.ts
```

This keeps the initial architecture simple.

A separate Python service can be introduced later if resume processing,
AI pipelines, or automation workers become necessary.

------------------------------------------------------------------------

## Database

### V1

A database is optional if search history is not required.

However, the application should keep its code structured so PostgreSQL
can be added without redesigning the entire application.

### V2+

Use:

-   PostgreSQL
-   Prisma ORM

Potential future data:

-   Users
-   Search history
-   Saved jobs
-   Resumes
-   Applications
-   Preferences

------------------------------------------------------------------------

## AI

### V1

No LLM is required.

The application is a search tool, so an AI model would add unnecessary
complexity at this stage.

### Future

Potential providers:

-   Google Gemini API
-   OpenRouter
-   Other compatible LLM providers

Future AI features:

-   Job/resume matching
-   Skill extraction
-   Job summarization
-   Missing-skill detection
-   Cover-letter generation
-   Application-question assistance

The AI layer should eventually be isolated behind an internal service
interface so the provider can be changed without changing the rest of
the application.

------------------------------------------------------------------------

## Browser Automation

### V1

No browser automation.

### Future

Use Playwright for permitted browser workflows.

Potential future flow:

``` text
Job
  ↓
Application page
  ↓
Detect fields
  ↓
Prepare answers
  ↓
User review
  ↓
User confirmation
  ↓
Submit
```

The system should not be designed around bypassing CAPTCHA,
authentication controls, or other website security mechanisms.

------------------------------------------------------------------------

# 5. LinkedIn Search Strategy

The initial implementation should avoid building V1 around unauthorized
or brittle LinkedIn scraping.

The preferred approach is:

``` text
User search form
      ↓
Validate filters
      ↓
Build LinkedIn search parameters
      ↓
Generate LinkedIn search URL
      ↓
Open LinkedIn
```

Where an official or otherwise permitted LinkedIn API/integration is
available for the required functionality, the backend can later use that
integration.

This gives V1 a stable and simple foundation.

------------------------------------------------------------------------

# 6. High-Level Architecture

``` text
                         ┌──────────────────────┐
                         │        User          │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      Next.js UI      │
                         │                      │
                         │  Search Form         │
                         │  Filters             │
                         │  Result Cards        │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ Search API / Service │
                         │                      │
                         │ Validate input       │
                         │ Normalize filters    │
                         │ Build search request │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │ LinkedIn Search      │
                         │ / permitted API      │
                         └──────────────────────┘
```

Future architecture:

``` text
                           User
                            │
                            ▼
                       Next.js UI
                            │
                  ┌─────────┴─────────┐
                  │                   │
                  ▼                   ▼
             Search API          Job Database
                  │                   │
                  ▼                   │
              LinkedIn               │
                                      │
                  ┌───────────────────┘
                  │
                  ▼
             AI Matching
                  │
                  ▼
              Resume
                  │
                  ▼
        Application Preparation
                  │
                  ▼
             Playwright
                  │
                  ▼
         Application Tracker
```

------------------------------------------------------------------------

# 7. Application Architecture

Recommended project structure:

``` text
job-agent/
│
├── app/
│   ├── page.tsx
│   │
│   ├── jobs/
│   │   └── page.tsx
│   │
│   ├── api/
│   │   └── linkedin/
│   │       └── search/
│   │           └── route.ts
│   │
│   └── layout.tsx
│
├── components/
│   ├── SearchForm.tsx
│   ├── SearchFilters.tsx
│   ├── JobResults.tsx
│   ├── JobCard.tsx
│   ├── EmptyState.tsx
│   └── Header.tsx
│
├── lib/
│   ├── linkedin.ts
│   ├── validation.ts
│   └── search.ts
│
├── types/
│   └── job.ts
│
├── public/
│
├── .env.local
├── .env.example
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

------------------------------------------------------------------------

# 8. Frontend Design

## Overall Design

The UI should be clean, minimal, and productivity-focused.

Primary navigation:

``` text
┌──────────────────────────────────────────────┐
│ JobFinder                         Profile    │
├────────────┬─────────────────────────────────┤
│ Search     │                                 │
│ Jobs       │        Search LinkedIn Jobs     │
│ Saved*     │                                 │
│ Settings*  │   [ Search form                ]│
│            │                                 │
│            │        Search Results           │
│            │                                 │
└────────────┴─────────────────────────────────┘

* Future functionality
```

For V1, only `Search` needs to be fully functional.

------------------------------------------------------------------------

# 9. Search Form

The primary interaction should be a simple form.

``` text
Search LinkedIn Jobs

Keywords
[ Software Engineer                         ]

Location
[ Chennai                                   ]

Experience Level
[ Entry level                         ▼     ]

Remote
[ Any                                 ▼     ]

Job Type
[ Any                                 ▼     ]

Date Posted
[ Past week                           ▼     ]

                 [ Search Jobs ]
```

## Supported filters

### Keywords

Free-text field.

Examples:

-   Software Engineer
-   Backend Developer
-   React Developer
-   Python Developer
-   Full Stack Developer

### Location

Examples:

-   Chennai
-   Bangalore
-   Hyderabad
-   Remote
-   India

### Experience

Options:

-   Any
-   Internship
-   Entry level
-   Associate
-   Mid-Senior
-   Director
-   Executive

### Work arrangement

Options:

-   Any
-   Remote
-   Hybrid
-   On-site

### Job type

Options:

-   Any
-   Full-time
-   Part-time
-   Contract
-   Internship
-   Temporary

### Date posted

Options:

-   Any time
-   Past 24 hours
-   Past week
-   Past month

------------------------------------------------------------------------

# 10. Search Validation

Before building the search request:

1.  Trim whitespace.
2.  Reject completely empty searches.
3.  Validate known filter values.
4.  Encode query parameters safely.
5.  Prevent malformed URLs.
6.  Show user-friendly validation messages.

Example:

``` text
Keyword is required.

or

Please enter a job title or keyword.
```

------------------------------------------------------------------------

# 11. Job Result Design

Each result should be presented as a compact card.

``` text
┌─────────────────────────────────────────────┐
│ Software Engineer                           │
│ Google                                      │
│ Chennai · Hybrid                            │
│                                             │
│ Full-time · Entry level                     │
│                                             │
│ Posted recently                             │
│                                             │
│ [ Open on LinkedIn ]                        │
└─────────────────────────────────────────────┘
```

If only a LinkedIn search URL is available rather than individual job
data, clearly label the action as:

``` text
Search LinkedIn
```

rather than pretending the application has retrieved individual job
records.

------------------------------------------------------------------------

# 12. Loading State

While searching:

``` text
Searching LinkedIn...

[ spinner ]

Preparing your search...
```

The button should become disabled during the request to prevent
accidental duplicate submissions.

------------------------------------------------------------------------

# 13. Empty State

If no result data is available:

``` text
No jobs found

Try changing:
- keywords
- location
- experience level
- date posted
```

If the implementation redirects to LinkedIn search instead of retrieving
job records, the UI should explain that the search will open on
LinkedIn.

------------------------------------------------------------------------

# 14. Error Handling

Potential errors:

-   Invalid search input
-   Network failure
-   LinkedIn unavailable
-   Unsupported filter
-   API rate limit
-   Authentication failure
-   Server error

Display concise messages.

Example:

``` text
Unable to create the LinkedIn search.

Please check your filters and try again.
```

Do not expose:

-   API keys
-   internal stack traces
-   database credentials
-   server configuration
-   sensitive logs

------------------------------------------------------------------------

# 15. Security

Because this is intended for personal use, security should still be
treated as a first-class concern.

## Authentication

Protect the application with authentication.

Future architecture:

``` text
User
 ↓
Authentication
 ↓
Private Dashboard
```

## Secrets

Store secrets only in environment variables.

Example:

``` env
DATABASE_URL=
LINKEDIN_API_KEY=
GEMINI_API_KEY=
OPENROUTER_API_KEY=
AUTH_SECRET=
```

Never put secrets inside client-side code.

## Input validation

Validate all user input server-side even if the frontend already
validates it.

## URL safety

Only construct URLs from validated, encoded search parameters.

------------------------------------------------------------------------

# 16. Responsive Design

The application should work on:

-   Desktop
-   Laptop
-   Tablet
-   Mobile

Mobile layout:

``` text
┌───────────────────────┐
│ JobFinder             │
├───────────────────────┤
│ Keywords              │
│ [ Software Engineer ] │
│                       │
│ Location              │
│ [ Chennai           ] │
│                       │
│ Experience            │
│ [ Entry level       ] │
│                       │
│ [ Search LinkedIn ]   │
│                       │
│ Results               │
│                       │
│ Job Card              │
│ Job Card              │
└───────────────────────┘
```

------------------------------------------------------------------------

# 17. Future Database Design

When persistence is introduced, use PostgreSQL.

Potential schema:

``` text
users
├── id
├── email
└── created_at

searches
├── id
├── user_id
├── keywords
├── location
├── experience_level
├── remote_type
├── job_type
├── date_posted
└── created_at

jobs
├── id
├── external_id
├── title
├── company
├── location
├── url
├── description
├── source
└── created_at

saved_jobs
├── id
├── user_id
├── job_id
└── created_at
```

Applications should be added only in a later version.

------------------------------------------------------------------------

# 18. Future Resume Architecture

Later, add:

``` text
Resume Upload
      ↓
PDF/DOCX Parser
      ↓
Extract text
      ↓
Structured resume data
      ↓
PostgreSQL
      ↓
Resume Preview
```

Potential data:

``` json
{
  "name": "Candidate Name",
  "skills": [
    "Python",
    "Java",
    "React",
    "SQL"
  ],
  "experience": [],
  "education": [],
  "projects": [],
  "certifications": []
}
```

------------------------------------------------------------------------

# 19. Future AI Architecture

The AI layer should not be tightly coupled to the UI.

Recommended abstraction:

``` text
AIService
   │
   ├── GeminiProvider
   │
   ├── OpenRouterProvider
   │
   └── FutureProvider
```

Possible interface:

``` typescript
interface AIProvider {
  analyzeJob(description: string): Promise<JobAnalysis>;
  analyzeResume(text: string): Promise<ResumeAnalysis>;
  matchJob(
    resume: ResumeAnalysis,
    job: JobAnalysis
  ): Promise<JobMatch>;
}
```

This makes the LLM provider replaceable.

------------------------------------------------------------------------

# 20. Future Job Matching

The matching system should combine deterministic logic with semantic AI.

Example:

``` text
Skill match            40%
Experience match       20%
Location match         15%
Salary match           10%
Semantic similarity    15%
```

The final score can be calculated by application code rather than asking
an LLM to invent a score.

Output:

``` text
Software Engineer

Match: 87%

Skills
✓ Python
✓ SQL
✓ React
✗ AWS

Experience
✓ Entry-level requirement

Location
✓ Chennai

Missing skills
AWS
```

------------------------------------------------------------------------

# 21. Future Application Tracker

Eventually add:

``` text
Saved
  ↓
Preparing
  ↓
Ready for Review
  ↓
Applied
  ↓
Assessment
  ↓
Interview
  ↓
Offer
```

Alternative terminal states:

``` text
Rejected
Withdrawn
No Response
```

Application details could contain:

-   Job
-   Company
-   Resume used
-   Application URL
-   Applied date
-   Status
-   Notes
-   Interview dates
-   AI-generated answers
-   Activity history

------------------------------------------------------------------------

# 22. Future Application Automation

The eventual automation architecture should be:

``` text
Matched Job
     ↓
Prepare Application
     ↓
Extract application questions
     ↓
Generate draft answers
     ↓
Fill supported fields
     ↓
USER REVIEW
     ↓
USER CONFIRMATION
     ↓
Submit where permitted
     ↓
Record application
```

The user should remain in control of the final submission.

The system should not attempt to bypass:

-   CAPTCHA
-   MFA/2FA
-   security controls
-   access restrictions
-   website anti-automation mechanisms

------------------------------------------------------------------------

# 23. Deployment Plan

## Development

``` text
Local machine
    │
    ├── Next.js
    └── Local environment variables
```

## Initial deployment

``` text
GitHub
   │
   ▼
Vercel
   │
   ▼
Next.js application
```

If PostgreSQL is introduced:

``` text
Vercel
  │
  └────── PostgreSQL
          │
          └── Supabase / Neon
```

If a Python worker is introduced later:

``` text
Vercel
  │
  └── Next.js

Railway / Render
  │
  └── Python worker

Supabase / Neon
  │
  └── PostgreSQL
```

------------------------------------------------------------------------

# 24. Development Roadmap

## Phase 1 --- Project Setup

Tasks:

-   Create Next.js project
-   Configure TypeScript
-   Configure Tailwind CSS
-   Create Git repository
-   Establish environment variables
-   Create basic layout

Deliverable:

``` text
Running Next.js application
```

------------------------------------------------------------------------

## Phase 2 --- Search UI

Tasks:

-   Build header
-   Build search form
-   Add filters
-   Add validation
-   Add responsive layout
-   Add loading states
-   Add error states

Deliverable:

``` text
Functional search interface
```

------------------------------------------------------------------------

## Phase 3 --- LinkedIn Search Integration

Tasks:

-   Create LinkedIn search parameter builder
-   Encode search parameters
-   Validate generated URLs
-   Add `Open on LinkedIn`
-   Test combinations of filters

Deliverable:

``` text
User enters filters
       ↓
Application creates LinkedIn search
       ↓
User opens LinkedIn results
```

------------------------------------------------------------------------

## Phase 4 --- Search History

Optional V1.1:

-   Store recent searches
-   Display recent searches
-   Re-run previous searches

Requires PostgreSQL.

------------------------------------------------------------------------

## Phase 5 --- Saved Jobs

V2:

-   Save job
-   Remove saved job
-   Saved jobs page
-   Add notes

Requires individual job data or a permitted job integration.

------------------------------------------------------------------------

## Phase 6 --- Resume

V3:

-   Upload resume
-   Parse resume
-   Preview resume
-   Store resume metadata
-   Multiple resume versions

------------------------------------------------------------------------

## Phase 7 --- AI Matching

V4:

-   Job analysis
-   Resume analysis
-   Skill matching
-   Match score
-   Missing skills
-   Job recommendations

------------------------------------------------------------------------

## Phase 8 --- Application Tracking

V5:

-   Application records
-   Status tracking
-   Timeline
-   Notes
-   Interview dates
-   Analytics

------------------------------------------------------------------------

## Phase 9 --- Application Assistance

V6:

-   Application-question extraction
-   AI answer drafts
-   Resume selection
-   Cover-letter generation
-   User review

------------------------------------------------------------------------

## Phase 10 --- Automation

V7:

-   Playwright worker
-   Supported application workflows
-   Form filling
-   Human confirmation
-   Application recording

------------------------------------------------------------------------

# 25. Product Principles

## Principle 1 --- Start Simple

V1 should solve one problem well:

> "Help me search LinkedIn jobs quickly."

Do not introduce AI or automation until the basic search workflow is
reliable.

## Principle 2 --- Modular Architecture

Keep:

-   UI
-   search logic
-   LinkedIn integration
-   AI
-   database
-   automation

separated.

## Principle 3 --- User Control

Future automation should prepare and assist rather than blindly submit
applications.

## Principle 4 --- Privacy

This is a personal job-search tool.

Minimize stored personal information and protect resumes, credentials,
API keys, and application data.

## Principle 5 --- Replaceable Providers

Do not make the entire application dependent on one AI provider or one
infrastructure vendor.

------------------------------------------------------------------------

# 26. V1 Success Criteria

V1 is complete when:

-   [ ] Application runs locally
-   [ ] Application is responsive
-   [ ] Search form works
-   [ ] Keyword filtering works
-   [ ] Location filtering works
-   [ ] Experience filtering works
-   [ ] Remote filtering works
-   [ ] Job-type filtering works
-   [ ] Date-posted filtering works
-   [ ] Inputs are validated
-   [ ] LinkedIn search URL is generated correctly
-   [ ] User can open the search on LinkedIn
-   [ ] Loading states work
-   [ ] Error states work
-   [ ] No secrets are exposed to the browser
-   [ ] Project is documented
-   [ ] Project can be deployed

------------------------------------------------------------------------

# 27. Summary

The project should begin as a **private LinkedIn job-search assistant**,
not an autonomous application bot.

The initial architecture is intentionally small:

``` text
Next.js
   +
TypeScript
   +
Tailwind CSS
   +
LinkedIn search integration
```

No AI, database, Python service, Redis, or Playwright is required for
the first release.

The long-term architecture can grow into:

``` text
                 Personal Job Agent
                         │
          ┌──────────────┼──────────────┐
          │              │              │
       Job Search      Resume          Tracker
          │              │              │
          └──────────────┼──────────────┘
                         │
                    AI Matching
                         │
                  Application Prep
                         │
                  User Confirmation
                         │
                    Automation
```

The key development strategy is to **build each layer independently and
keep the interfaces clean**, allowing AI, PostgreSQL, resume processing,
tracking, and automation to be added without rewriting the V1 search
application.


---

# 28. Autonomous Job Application Workflow

The long-term goal of the project is to evolve from a LinkedIn job-search assistant into a personal job-application agent.

The complete workflow should be:

```text
LinkedIn Job Search
       ↓
Open / Retrieve Job
       ↓
Extract Job Description
       ↓
Analyze Job Requirements
       ↓
Compare Job ↔ Resume
       ↓
Calculate Match Probability
       ↓
Is Match Above User Threshold?
       │
   ┌───┴────┐
   │        │
  No       Yes
   │        │
Skip     Prepare Application
            ↓
       Select Resume
            ↓
       Generate Answers
            ↓
       Fill Application
            ↓
       Submit Application
            ↓
       Save Application
            ↓
       Monitor Email
            ↓
       Detect Employer Email
            ↓
       Update Application Status
```

## 28.1 Job Description Extraction

When the user opens a job, the system should obtain the job description through a permitted LinkedIn integration or supported job-page workflow.

The extracted information should include:

- Job title
- Company
- Location
- Employment type
- Experience level
- Salary when available
- Required skills
- Preferred skills
- Education requirements
- Experience requirements
- Job responsibilities
- Work arrangement
- Application URL
- Job identifier
- Source

Example:

```json
{
  "title": "Backend Software Engineer",
  "company": "Example Company",
  "location": "Chennai",
  "employment_type": "Full-time",
  "experience_level": "Entry level",
  "required_skills": [
    "Python",
    "FastAPI",
    "PostgreSQL",
    "Docker"
  ],
  "preferred_skills": [
    "AWS",
    "Redis"
  ],
  "responsibilities": [
    "Build REST APIs",
    "Maintain backend services",
    "Work with PostgreSQL"
  ]
}
```

The system should retain the original job description or a normalized representation so that the match decision can be audited later.

---

# 29. Resume Analysis

The application should maintain a structured representation of the user's resume.

```text
Resume PDF/DOCX
       ↓
Text Extraction
       ↓
Resume Parser
       ↓
Structured Resume
       ↓
PostgreSQL
```

Example:

```json
{
  "skills": [
    "Python",
    "FastAPI",
    "PostgreSQL",
    "Docker",
    "React"
  ],
  "experience": [
    {
      "title": "Software Developer Intern",
      "company": "Example Technologies",
      "years": 1
    }
  ],
  "education": [
    {
      "degree": "B.Tech Computer Science"
    }
  ],
  "projects": [
    "Job Finder",
    "REST API Platform"
  ]
}
```

The structured resume should be used by the matching engine rather than repeatedly sending the entire PDF to an LLM.

---

# 30. Job ↔ Resume Matching Engine

The application should compare the job requirements against the resume before deciding whether to apply.

The matching system should consider:

```text
Required skills
       +
Preferred skills
       +
Experience
       +
Education
       +
Location
       +
Employment type
       +
Work arrangement
       +
Semantic similarity
```

A possible scoring model:

```text
Required skills       40%
Preferred skills      10%
Experience            20%
Education             5%
Location              10%
Semantic similarity   15%
```

The exact weights should be configurable.

The system should distinguish between:

- Required qualifications
- Preferred qualifications
- Nice-to-have skills

A missing required qualification should have a significantly larger effect than a missing preferred skill.

---

# 31. Match Probability

The system should produce a transparent match score.

Example:

```text
Backend Software Engineer
Example Company

Match Probability
██████████████████░░ 88%

Required Skills
✓ Python
✓ FastAPI
✓ PostgreSQL
✓ Docker

Preferred Skills
✓ Redis
✗ AWS

Experience
✓ Meets requirement

Location
✓ Chennai

Semantic Match
91%
```

The score should be generated using deterministic matching logic plus semantic similarity rather than asking an LLM to arbitrarily assign a probability.

The UI should clearly label this as a **system-generated match estimate**, not a guarantee of getting the job.

---

# 32. Automatic Application Threshold

The user should be able to configure an application threshold.

Example:

```text
Automatic Application Threshold

[ 85% ]

Automatically prepare/apply when:
Match >= 85%
```

Possible settings:

```text
70%  → Broad search
80%  → Moderate matching
85%  → Strict matching
90%  → Very strict matching
```

The threshold should be configurable rather than hard-coded.

Example:

```typescript
const shouldApply = matchScore >= userPreferences.autoApplyThreshold;
```

However, the system should also support mandatory safety gates.

For example:

```text
match >= threshold
        AND
job is not already applied
        AND
required resume exists
        AND
application is supported
        AND
required questions can be answered reliably
        AND
user's automation settings allow submission
```

---

# 33. Auto-Apply Decision Engine

The application should have a dedicated decision service.

```text
Job
 │
 ▼
Job Analyzer
 │
 ▼
Resume Matcher
 │
 ▼
Match Score
 │
 ▼
Decision Engine
 │
 ├── Below threshold → Skip
 │
 ├── Duplicate → Skip
 │
 ├── Unsupported → Manual Review
 │
 └── Qualified → Application Workflow
```

Example:

```typescript
const decision = evaluateApplication({
  matchScore,
  threshold,
  alreadyApplied,
  supportedWorkflow,
  requiredResumeAvailable,
  requiredQuestionsSupported
});
```

Possible decisions:

```text
SKIP
DUPLICATE
MANUAL_REVIEW
READY_TO_APPLY
AUTO_APPLY
```

---

# 34. Application Preparation

For a qualified job:

```text
Qualified Job
      ↓
Select Best Resume
      ↓
Extract Application Questions
      ↓
Generate Draft Answers
      ↓
Validate Answers
      ↓
Fill Supported Fields
      ↓
Submit According to User Settings
```

The application should choose the resume version that best matches the job.

Example:

```text
Job:
Backend Engineer

Available resumes:

Backend Resume       94%
General Resume       82%
Frontend Resume      61%

Selected:
Backend Resume
```

---

# 35. Application Automation

The automation layer can use Playwright for supported workflows.

Conceptual architecture:

```text
Application Service
        ↓
Playwright Worker
        ↓
Open Application
        ↓
Identify Fields
        ↓
Fill User Information
        ↓
Attach Resume
        ↓
Fill Supported Questions
        ↓
Validate
        ↓
Submit
```

The worker should return:

```json
{
  "success": true,
  "application_url": "...",
  "submitted_at": "...",
  "confirmation_message": "...",
  "external_application_id": "..."
}
```

If automation cannot safely complete an application, it should stop and mark the application:

```text
Manual Review Required
```

The system should not attempt to bypass CAPTCHA, MFA/2FA, access restrictions, anti-automation controls, or other security mechanisms.

---

# 36. Application Database

The application tracker should maintain a complete record.

```text
applications
├── id
├── user_id
├── job_id
├── resume_id
├── match_score
├── decision
├── status
├── application_url
├── external_application_id
├── applied_at
├── last_status_update
├── source
├── notes
└── created_at
```

Example:

```json
{
  "job_title": "Backend Software Engineer",
  "company": "Example Company",
  "match_score": 88,
  "status": "Applied",
  "applied_at": "2026-09-25T10:30:00Z"
}
```

---

# 37. Email Integration

One of the major future features is connecting the user's email account to the application.

The email integration should use OAuth and the email provider's supported APIs rather than storing the user's email password.

Architecture:

```text
                 User Email
                     │
                  OAuth
                     │
                     ▼
              Email Provider API
                     │
                     ▼
              Email Sync Worker
                     │
                     ▼
               Email Analyzer
                     │
                     ▼
            Application Matcher
                     │
                     ▼
             Application Tracker
```

Potential providers:

- Gmail
- Outlook / Microsoft 365

The exact integration should use the provider's official OAuth/API capabilities.

---

# 38. Email Monitoring

The system should periodically check for new application-related emails.

Examples:

```text
Application received
Application confirmation
Assessment invitation
Interview invitation
Interview scheduled
Recruiter message
Application rejected
Offer
```

The email worker should avoid treating every email as an application update.

It should first determine:

1. Is this email related to a known application?
2. Which company sent it?
3. Which job does it refer to?
4. What status does it indicate?
5. How confident is the classification?

---

# 39. Email-to-Application Matching

The system can match an email to an application using multiple signals.

```text
Company
   +
Job title
   +
Application ID
   +
Sender domain
   +
Application URL
   +
Email subject
   +
Email body
```

Example:

```text
Email:

Subject:
Your application for Backend Software Engineer

From:
jobs@examplecompany.com

       ↓

Company Match       ✓
Job Title Match     ✓
Sender Domain       ✓

       ↓

Application ID: #1234
```

The system then associates the email with the correct application.

---

# 40. Email Status Classification

The email analyzer should classify application events.

Example categories:

```text
APPLICATION_RECEIVED
ASSESSMENT_REQUESTED
ASSESSMENT_COMPLETED
INTERVIEW_REQUESTED
INTERVIEW_SCHEDULED
INTERVIEW_COMPLETED
RECRUITER_CONTACT
REJECTED
OFFER
WITHDRAWN
UNKNOWN
```

Example:

```text
Email:
"We are pleased to invite you to the next round..."

       ↓

Classification:
INTERVIEW_REQUESTED

Confidence:
96%
```

---

# 41. Automatic Application Status Updates

When a trusted email is matched to an application:

```text
Email
  ↓
Classify
  ↓
Match application
  ↓
Check confidence
  ↓
Update status
  ↓
Create activity event
```

Example:

```text
Before:

Applied
September 20


Email received:

"Congratulations! We'd like to invite you
to an interview."


After:

Applied
September 20
      ↓
Interview
September 25
```

The system should retain the previous status in an activity history.

---

# 42. Application Timeline

Each application should eventually have an event timeline.

```text
Backend Software Engineer
Example Company

88% Match

Timeline

● Sep 20
  Job discovered

● Sep 20
  Resume matched

● Sep 20
  Application submitted

● Sep 21
  Application confirmation email received

● Sep 25
  Interview invitation received

Current Status:
Interview
```

This provides an audit trail for automated actions and email-derived updates.

---

# 43. Email Privacy

Email integration is sensitive and should follow least-privilege principles.

The application should request only the permissions required for reading application-related emails.

The system should:

- Use OAuth
- Never store email passwords
- Encrypt stored tokens
- Protect refresh tokens
- Allow the user to disconnect the account
- Store only necessary email metadata
- Avoid storing unrelated email content when possible
- Keep email processing isolated from the public frontend

Ideally, the system should process only relevant messages rather than indexing the entire mailbox permanently.

---

# 44. Email Sync Architecture

A background worker should handle email synchronization.

```text
Scheduler
   ↓
Email Sync Worker
   ↓
Fetch new messages
   ↓
Filter application-related messages
   ↓
Analyze
   ↓
Match to applications
   ↓
Update status
   ↓
Create activity event
```

Store a synchronization cursor or provider message ID so the system does not repeatedly process the same email.

---

# 45. Complete Autonomous Architecture

The long-term system becomes:

```text
                         ┌──────────────────┐
                         │      User        │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     Dashboard    │
                         └────────┬─────────┘
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ▼                    ▼                    ▼
       Job Search             Resume              Preferences
             │                    │                    │
             ▼                    └─────────┬──────────┘
       LinkedIn / API                       │
             │                              │
             ▼                              ▼
       Job Description              Matching Engine
             │                              │
             └──────────────┬───────────────┘
                            ▼
                     Match Probability
                            │
                            ▼
                    Decision Engine
                            │
              ┌─────────────┼─────────────┐
              │             │             │
            Skip       Manual Review   Auto Apply
                                          │
                                          ▼
                                  Application Worker
                                          │
                                          ▼
                                    Application
                                          │
                                          ▼
                                  PostgreSQL Tracker
                                          ▲
                                          │
                                  Email Integration
                                          │
                                          ▼
                                  Email Sync Worker
                                          │
                                          ▼
                                  Email Classifier
                                          │
                                          ▼
                                  Status Detection
                                          │
                                          ▼
                                  Tracker Update
```

---

# 46. Autonomous Agent Control Panel

The dashboard should eventually provide controls such as:

```text
Automation

Auto Apply                    [ ON ]

Minimum Match Score           [ 85% ]

Maximum Applications / Day    [ 10 ]

Require Confirmation          [ OFF ]

Email Tracking                [ ON ]

Application Notifications     [ ON ]
```

For safety and predictability, the application should also support a **dry-run mode**:

```text
Dry Run: ON

The agent will:
✓ Search jobs
✓ Analyze descriptions
✓ Match resumes
✓ Prepare applications
✗ Submit applications
```

This allows the user to test the agent before enabling automatic submission.

---

# 47. Application Limits

Automatic application should have configurable limits.

Example:

```text
Daily application limit: 10

Today's applications:
7 / 10
```

When the limit is reached:

```text
Daily application limit reached.

Automatic applications paused until tomorrow.
```

This prevents an unexpected bug from producing a large number of applications.

---

# 48. Duplicate Detection

Before applying:

```text
Check:
  ↓
Have I already applied to this job?
  ↓
Yes → Skip
No  → Continue
```

Duplicate detection should use:

- LinkedIn job ID
- External application ID
- Canonical URL
- Company
- Job title
- Job fingerprint

Example:

```text
Job A:
Backend Engineer
Company X
LinkedIn ID: 12345

Job B:
Backend Engineer
Company X
LinkedIn ID: 12345

Result:
Duplicate
```

---

# 49. Confidence-Based Automation

Not every AI decision should automatically trigger an application.

Use confidence levels:

```text
High confidence
     ↓
Potentially automatic

Medium confidence
     ↓
Manual review

Low confidence
     ↓
Skip
```

Example:

```text
Match: 91%
Question confidence: 97%
Company identification: 99%

Decision:
AUTO_APPLY
```

Versus:

```text
Match: 86%
Question confidence: 62%

Decision:
MANUAL_REVIEW
```

This makes automation more reliable than using one threshold alone.

---

# 50. Failure Recovery

Every automated workflow should be recoverable.

If an application fails:

```text
Application
   ↓
Automation Error
   ↓
Save current state
   ↓
Record error
   ↓
Mark Manual Review
```

The tracker should never falsely report:

```text
Applied
```

unless the application workflow has actually confirmed submission.

Possible statuses:

```text
PREPARING
READY
SUBMITTING
APPLIED
FAILED
MANUAL_REVIEW
```

---

# 51. Observability and Audit Logs

Automated actions should be logged.

Example:

```text
09:31 Job discovered
09:32 Description extracted
09:32 Resume matched — 91%
09:33 Application prepared
09:34 Application submitted
09:34 Confirmation received
09:35 Tracker updated
```

The logs should help answer:

- Why was this job selected?
- Which resume was used?
- What was the match score?
- Why did the system apply?
- Did submission succeed?
- Which email changed the status?
- What caused an automation failure?

---

# 52. Revised Development Roadmap

## Phase 1 — LinkedIn Search

Build:

- Next.js
- TypeScript
- Tailwind
- Search form
- LinkedIn search URL generation
- Responsive UI

## Phase 2 — Job Persistence

Add:

- PostgreSQL
- Prisma
- Search history
- Saved jobs
- Job records

## Phase 3 — Resume

Add:

- Resume upload
- PDF/DOCX parsing
- Resume preview
- Structured resume data
- Multiple resume versions

## Phase 4 — Job Description Analysis

Add:

- Job description extraction
- Requirement parsing
- Skill extraction
- Experience extraction
- Structured job data

## Phase 5 — Matching Engine

Add:

- Required skill matching
- Preferred skill matching
- Experience matching
- Location matching
- Semantic similarity
- Configurable match score

## Phase 6 — AI Application Preparation

Add:

- Resume selection
- Question extraction
- Answer generation
- Application preparation
- Validation
- Dry-run mode

## Phase 7 — Application Automation

Add:

- Playwright worker
- Supported application workflows
- Form filling
- Resume upload
- Submission confirmation
- Failure handling
- Daily limits
- Duplicate detection

## Phase 8 — Email Integration

Add:

- Gmail OAuth
- Outlook OAuth
- Email synchronization
- Application email detection
- Email-to-job matching
- Status classification

## Phase 9 — Application Tracking

Add:

- Application dashboard
- Timeline
- Status updates
- Interview tracking
- Recruiter messages
- Rejection tracking
- Offer tracking

## Phase 10 — Autonomous Agent

Combine everything:

```text
Search
  ↓
Analyze
  ↓
Match
  ↓
Decide
  ↓
Apply
  ↓
Track
  ↓
Read Email
  ↓
Update Status
```

---

# 53. Final Product Vision

The final application should function as a private personal job-search and application assistant.

The intended workflow is:

```text
1. User defines job preferences
              ↓
2. Agent searches LinkedIn
              ↓
3. Agent finds relevant jobs
              ↓
4. Agent obtains job descriptions
              ↓
5. Agent analyzes requirements
              ↓
6. Agent compares jobs against resume
              ↓
7. Agent calculates match probability
              ↓
8. Agent checks user's automation rules
              ↓
9. Qualified jobs enter application workflow
              ↓
10. Agent selects appropriate resume
              ↓
11. Agent prepares application
              ↓
12. Agent submits supported applications
              ↓
13. Application is recorded
              ↓
14. Email integration monitors application emails
              ↓
15. Email events are classified
              ↓
16. Events are matched to applications
              ↓
17. Application status is automatically updated
              ↓
18. Dashboard shows current job-search pipeline
```

The core product loop is therefore:

```text
SEARCH → ANALYZE → MATCH → APPLY → TRACK → UPDATE
   ↑                                      │
   └──────────────────────────────────────┘
```

This is the long-term architecture that V1 should be designed to grow into while keeping the first release small and maintainable.
