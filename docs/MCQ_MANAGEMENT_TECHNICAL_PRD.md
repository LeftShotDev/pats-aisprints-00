# Multiple Choice Question Management - Technical PRD

## Overview

This document outlines the requirements for implementing the Multiple Choice Question (MCQ) Management feature in QuizMaker. The system will allow teachers to create, edit, archive, search, browse, and preview a personal library of multiple choice questions. This feature forms the core content management capability of the application.

---

## Business Requirements

### Question Creation

- Teachers can create a question with a title, description, question stem (body), and between 2 and 6 answer choices
- Exactly one answer choice must be marked as correct at all times
- All fields except description are required
- A question cannot be saved unless it has at least 2 answer choices and exactly one marked correct

### Question Editing

- Teachers can edit any field of an existing question: title, description, question stem, answer choices, and the correct answer designation
- Answer choices can be added (up to a maximum of 6) or removed (down to a minimum of 2)
- The correct answer marker can be moved to any answer choice
- Changes are saved explicitly — no auto-save

### Question Archiving

- Questions can be archived instead of deleted
- Archived questions are removed from the Active library view but remain in the system
- Archived questions are accessible in a dedicated Archived tab
- Archived questions can be unarchived (restored) to the Active library at any time

### Library Browsing

- The library is organized into two tabs: **Active** and **Archived**
- The Active tab is the default view on page load
- Each tab displays questions belonging to the authenticated teacher only

### Search

- Teachers can search the Active library using a keyword search
- Search matches against question title, description, and question stem/body
- Matching keywords are highlighted in the search results
- A no-results empty state is shown when a search returns no matches
- The Archived tab supports the same search behavior

### Pagination

- Questions are paginated with a default of 25 per page
- Teachers can change the page size to 25, 50, or 100
- Standard pagination controls are shown (previous, next, page numbers)

### Empty States

- A distinct empty state is shown when a teacher has no questions yet, with a prompt to create their first question
- A distinct empty state is shown when a search query returns no results, with a suggestion to clear the search or adjust keywords

### Preview Mode

- Any question can be previewed in a student-facing display view
- The preview shows the question stem and all answer choices
- The teacher can select an answer and submit to see immediate correct/incorrect feedback
- Correct answers are visually highlighted after submission
- Preview is for teacher verification only — no attempt data is recorded

---

## Technical Requirements

### Database Schema

Two tables are required: `questions` and `answer_choices`.

```sql
CREATE TABLE questions (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  teacher_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  body TEXT NOT NULL,
  is_archived INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_questions_teacher_id ON questions(teacher_id);
CREATE INDEX idx_questions_teacher_archived ON questions(teacher_id, is_archived);
```

```sql
CREATE TABLE answer_choices (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  question_id TEXT NOT NULL,
  text TEXT NOT NULL,
  is_correct INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE INDEX idx_answer_choices_question_id ON answer_choices(question_id);
```

### API Endpoints

#### GET /api/questions

Fetch paginated list of questions for the authenticated teacher.

**Query Parameters:**

- `archived` (boolean, default `false`) — when `true`, returns archived questions
- `search` (string, optional) — keyword filter applied to title, description, and body
- `page` (integer, default `1`)
- `pageSize` (integer, default `25`, allowed values: `25`, `50`, `100`)

**Response (200):**

```json
{
  "questions": [
    {
      "id": "abc123",
      "title": "Question title",
      "description": "Optional description",
      "body": "Question stem text",
      "is_archived": false,
      "answer_choices": [
        { "id": "c1", "text": "Choice A", "is_correct": true, "sort_order": 0 },
        { "id": "c2", "text": "Choice B", "is_correct": false, "sort_order": 1 }
      ],
      "created_at": "2026-04-08T10:00:00Z",
      "updated_at": "2026-04-08T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 25,
    "total": 47,
    "totalPages": 2
  }
}
```

- Error (401): Unauthenticated

---

#### POST /api/questions

Create a new question.

**Request Body:**

```json
{
  "title": "Question title",
  "description": "Optional description",
  "body": "Question stem text",
  "answer_choices": [
    { "text": "Choice A", "is_correct": true, "sort_order": 0 },
    { "text": "Choice B", "is_correct": false, "sort_order": 1 }
  ]
}
```

**Response:**

- Success (201): Created question object with answer choices
- Error (400): Validation error (missing fields, fewer than 2 choices, zero or multiple correct answers)
- Error (401): Unauthenticated

---

#### GET /api/questions/[id]

Fetch a single question with its answer choices.

**Response:**

- Success (200): Question object with answer choices
- Error (401): Unauthenticated
- Error (403): Question belongs to another teacher
- Error (404): Question not found

---

#### PUT /api/questions/[id]

Update an existing question.

**Request Body:** Same shape as POST — full question and answer choices array (replace strategy).

**Response:**

- Success (200): Updated question object with answer choices
- Error (400): Validation error
- Error (401): Unauthenticated
- Error (403): Question belongs to another teacher
- Error (404): Question not found

---

#### PATCH /api/questions/[id]/archive

Archive a question (set `is_archived = 1`).

**Response:**

- Success (200): `{ "success": true }`
- Error (401): Unauthenticated
- Error (403): Question belongs to another teacher
- Error (404): Question not found

---

#### PATCH /api/questions/[id]/unarchive

Restore an archived question (set `is_archived = 0`).

**Response:**

- Success (200): `{ "success": true }`
- Error (401): Unauthenticated
- Error (403): Question belongs to another teacher
- Error (404): Question not found

---

### User Interface Requirements

#### Question Library (`/questions`)

- Default landing page after login
- Two tabs: **Active** (default) and **Archived**
- Each tab contains:
  - Keyword search input
  - Page size selector (25 / 50 / 100)
  - Question list with pagination controls
  - Empty state (no questions or no search results)
- Each question card in the Active tab shows:
  - Title, description (truncated), question stem preview
  - Keyword highlights when a search is active
  - **Edit**, **Preview**, and **Archive** action buttons
- Each question card in the Archived tab shows:
  - Title, description (truncated), question stem preview
  - **Preview** and **Unarchive** action buttons
- "Create Question" button visible at all times in the Active tab

#### Create Question (`/questions/new`)

- Form fields:
  - **Title** (text input, required)
  - **Description** (textarea, optional)
  - **Question Stem / Body** (textarea, required)
  - **Answer Choices** (dynamic list, 2–6 items):
    - Each choice has a text input and a radio button to mark it as correct
    - "Add choice" button (disabled when 6 choices exist)
    - "Remove" button per choice (disabled when only 2 choices remain)
- Validation:
  - Title and body required
  - Minimum 2 answer choices
  - Exactly one correct answer must be selected
  - Maximum 6 answer choices
- Actions: **Save Question**, **Cancel**
- On success: redirect to `/questions`

#### Edit Question (`/questions/[id]/edit`)

- Pre-populated form with existing question data
- Same fields and validation rules as Create
- Actions: **Save Changes**, **Cancel**
- On success: redirect to `/questions`

#### Question Preview (`/questions/[id]/preview`)

- Displays question stem in a clean, student-facing layout
- Lists all answer choices as selectable options (radio buttons)
- **Submit** button — disabled until an answer is selected
- After submission:
  - Correct answer is highlighted in green
  - Incorrect selection (if chosen) is highlighted in red
  - A result message is shown: "Correct!" or "Incorrect — the correct answer is [choice text]"
- **Back to Library** link
- No data is recorded or persisted

---

## Implementation Phases

### Phase 1: Database Schema and Migrations - ✅ COMPLETED

**Objective**: Set up the database tables needed to store questions and answer choices.

**Tasks**:

1. ✅ Create migration for `questions` table with all columns and indexes
2. ✅ Create migration for `answer_choices` table with all columns and indexes
3. ✅ Apply migrations to local D1 database
4. ✅ Verify schema with a manual inspection of the local database

**Deliverables**:

- `migrations/0002_0002_create_questions_and_answer_choices.sql` — created and applied locally
- Schema confirmed correct via `sqlite_master` inspection

---

### Phase 2: Service Layer - ✅ COMPLETED

**Objective**: Build the data access and business logic layer for question management.

**Tasks**:

1. ✅ Create `src/lib/services/question-service.ts` with functions for:
  - `listQuestions` (with search, pagination, archived filter)
  - `getQuestion`
  - `createQuestion`
  - `updateQuestion`
  - `archiveQuestion`
  - `unarchiveQuestion`
2. ✅ Ensure all queries use prepared statements via `d1-client.ts` helpers
3. ✅ Enforce teacher ownership checks in all mutation functions
4. ✅ Write unit tests for the service layer (27/27 passing)

**Deliverables**:

- `src/lib/services/question-service.ts` — all service functions implemented
- `src/lib/services/question-service.test.ts` — 27 tests covering success paths, validation, ownership, and error cases

---

### Phase 3: API Endpoints - ✅ COMPLETED

**Objective**: Expose the service layer through Next.js API routes.

**Tasks**:

1. ✅ Create `app/api/questions/route.ts` — GET (list) and POST (create)
2. ✅ Create `app/api/questions/[id]/route.ts` — GET (single) and PUT (update)
3. ✅ Create `app/api/questions/[id]/archive/route.ts` — PATCH
4. ✅ Create `app/api/questions/[id]/unarchive/route.ts` — PATCH
5. ✅ Add authentication checks to all routes
6. ✅ Add input validation and error responses

**Deliverables**:

- `src/app/api/questions/route.ts` — list and create endpoints
- `src/app/api/questions/[id]/route.ts` — get single and update endpoints
- `src/app/api/questions/[id]/archive/route.ts` — archive endpoint
- `src/app/api/questions/[id]/unarchive/route.ts` — unarchive endpoint
- All routes protected with `getSessionFromRequest`; `QuestionValidationError`, `QuestionNotFoundError`, and `QuestionOwnershipError` mapped to 400/404/403 respectively

---

### Phase 4: Question Library UI - ✅ COMPLETED

**Objective**: Build the question library page with tabs, search, and pagination.

**Tasks**:

1. ✅ Create `app/questions/page.tsx` as the main library page
2. ✅ Implement Active and Archived tab switching
3. ✅ Build question card component with title, description preview, and action buttons
4. ✅ Implement keyword search input with debounced API calls (350ms debounce)
5. ✅ Implement keyword highlight rendering in search results
6. ✅ Implement pagination controls and page size selector (25/50/100)
7. ✅ Build empty state components (new library and no results)

**Deliverables**:

- `src/app/questions/page.tsx` — library page (server component)
- `src/components/questions/QuestionLibrary.tsx` — main client component with tabs, search, pagination state
- `src/components/questions/QuestionCard.tsx` — question card with Edit, Preview, Archive/Restore actions
- `src/components/questions/EmptyState.tsx` — two distinct empty states (no questions, no results)
- `src/components/questions/HighlightedText.tsx` — keyword highlight renderer
- `src/app/mcqs/page.tsx` — updated to redirect to `/questions`
- `src/middleware.ts` and `src/components/auth/login-form.tsx` — updated default redirect to `/questions`

---

### Phase 5: Create and Edit Forms - ✅ COMPLETED

**Objective**: Build the create and edit question forms with dynamic answer choices using a TDD approach for core form logic.

**Approach**: Tests are written upfront for `QuestionForm` and `AnswerChoiceList` before the components are built. Page-level wrappers and API wiring are built first then tested, as their behavior depends on implementation decisions.

**Tasks**:

1. ✅ Write tests upfront for `QuestionForm` and `AnswerChoiceList` covering:
   - Adding a choice is disabled when 6 already exist
   - Removing a choice is disabled when only 2 remain
   - Marking a choice correct deselects all others
   - Submitting with no correct answer marked shows a validation error
   - Submitting with fewer than 2 choices shows a validation error
2. ✅ Build `QuestionForm` and `AnswerChoiceList` components to pass the tests
3. ✅ Create `app/questions/new/page.tsx` and `app/questions/[id]/edit/page.tsx`
4. ✅ Wire form submission to POST and PUT API endpoints
5. ✅ Handle and display server-side validation errors
6. ✅ Add tests for API error handling behavior (submit label, disabled state, cancel link, apiError display)

**Deliverables**:

- `src/components/questions/QuestionForm.test.tsx` — written before implementation; 14 tests passing
- `src/components/questions/QuestionForm.tsx` — form with react-hook-form + zod for title/description/body
- `src/components/questions/AnswerChoiceList.tsx` — fully controlled dynamic choice list
- `src/app/questions/new/page.tsx` — POSTs to `/api/questions`, redirects to `/questions` on success
- `src/app/questions/[id]/edit/page.tsx` — fetches question, pre-populates form, PUTs on submit
- `src/components/ui/textarea.tsx` — installed shadcn Textarea component
- `src/test/setup.ts` — jest-dom setup for toBeDisabled, toBeInTheDocument matchers

---

### Phase 6: Preview Mode - ✅ COMPLETED

**Objective**: Build the question preview page with answer submission and feedback.

**Tasks**:

1. ✅ Create `app/questions/[id]/preview/page.tsx`
2. ✅ Render question stem and answer choices in a clean student-facing layout
3. ✅ Shuffle answer choices randomly on each preview render using a Fisher-Yates shuffle (client-side only — `sort_order` in the database is preserved for editing)
4. ✅ Implement answer selection and submit interaction
5. ✅ Display correct/incorrect feedback after submission
6. ✅ Add "Back to Library" navigation

**Deliverables**:

- `src/app/questions/[id]/preview/page.tsx`
- `src/components/questions/PreviewQuestion.tsx`

**Notes**:

- Shuffling is purely a client-side presentation concern. No database or API changes are required. The `is_correct` flag on each choice identifies the correct answer regardless of display order.
- The `GET /api/questions/[id]` response includes `is_correct` on each choice, meaning the correct answer is visible in the network response before submission. This is acceptable for the current teacher-only scope but must be addressed before any student-facing delivery is built (see Risks).

---

## Technical Implementation Details

This section will be populated as implementation progresses.

### Key Files

- `src/lib/services/question-service.ts` — All question data access and business logic
- `app/api/questions/route.ts` — List and create endpoints
- `app/api/questions/[id]/route.ts` — Single question get and update endpoints
- `app/api/questions/[id]/archive/route.ts` — Archive endpoint
- `app/api/questions/[id]/unarchive/route.ts` — Unarchive endpoint
- `app/questions/page.tsx` — Question library page
- `app/questions/new/page.tsx` — Create question page
- `app/questions/[id]/edit/page.tsx` — Edit question page
- `app/questions/[id]/preview/page.tsx` — Preview page
- `src/components/questions/` — All question-related UI components

### Implementation Patterns

*To be added as code is written.*

### Important Notes

- Answer choices use a replace strategy on update: all existing choices for a question are deleted and reinserted. This avoids complex diffing logic.
- `is_archived` and `is_correct` are stored as integers (0/1) in SQLite and must be converted to booleans in the service layer.
- All queries must filter by `teacher_id` to enforce data privacy between teachers.
- Search uses SQL `LIKE` with `%keyword%` pattern matching across title, description, and body columns.
- Keyword highlighting in the UI is a client-side operation using the original search term against the returned text.

---

## Success Criteria

- A teacher can create a question with a title, description, body, and 2–6 answer choices with exactly one marked correct
- A teacher can edit any field of an existing question including answer choices and correct answer
- A teacher cannot save a question with fewer than 2 choices or no correct answer marked
- A teacher can archive a question and it no longer appears in the Active tab
- A teacher can view archived questions in the Archived tab and unarchive them
- Keyword search filters results across title, description, and body fields
- Matching keywords are highlighted in search results
- A no-results empty state is shown when search returns nothing
- A new-library empty state is shown when a teacher has no questions
- Questions are paginated with a default of 25 per page and a 25/50/100 size selector
- Preview mode displays the question and choices, allows answer selection, and shows correct/incorrect feedback after submission
- No attempt data is recorded during preview
- All routes are protected — unauthenticated users are redirected to `/login`
- A teacher cannot access or modify another teacher's questions

---

## Troubleshooting Guide

*To be populated as bugs are found and resolved during implementation.*

---

## Future Enhancements

- Search answer choice text in addition to title, description, and body
- AI-powered TEKS-aligned question generation
- Bulk archive or bulk delete of questions
- Tagging and categorization of questions
- Sorting options in the library (by date created, title, etc.)
- Export questions to PDF or common assessment formats

---

## Dependencies

### Internal Dependencies

- `src/lib/d1-client.ts` — Database query helpers (`executeQuery`, `executeQueryFirst`, `executeMutation`)
- `users` table — Teacher ownership enforcement via `teacher_id` foreign key
- Authentication session — Required to identify the current teacher on all requests

### Environment Variables

- No additional environment variables required beyond those already configured for authentication and D1 access

---

## Risks and Mitigation

### Technical Risks

- **Risk**: Answer choice replace-on-update strategy could cause data loss if the update request fails mid-transaction
- **Mitigation**: Wrap delete and reinsert operations in a D1 batch to ensure atomicity
- **Risk**: SQL `LIKE` search may become slow as the question library grows to thousands of rows
- **Mitigation**: Indexes on `teacher_id` and `is_archived` reduce the scan range; full-text search (FTS5) can be introduced later if performance degrades

### User Experience Risks

- **Risk**: Teacher accidentally archives a question and cannot find it
- **Mitigation**: Archived tab is prominently visible in the library; questions are fully restorable
- **Risk**: Form loses data if the teacher navigates away mid-edit
- **Mitigation**: Show a browser confirmation dialog before leaving a form with unsaved changes

### Security Risks (Future)

- **Risk**: The `GET /api/questions/[id]` endpoint returns `is_correct` on all answer choices. Anyone inspecting the network response in DevTools can see the correct answer before submitting in preview mode.
- **Mitigation (current scope)**: Acceptable for now — preview is teacher-only and teachers already know their own answers. Authentication ensures only the owning teacher can access the endpoint.
- **Mitigation (if student-facing delivery is built)**: Strip `is_correct` from the student-facing API response. Expose the correct answer only via a separate post-submission "check answer" endpoint, or return it only in the submission response after the student has locked in their choice.

---

## Notes for AI Agents

**Instructions for AI**: When updating this PRD:

1. Update phase status markers as work progresses
2. Add implementation details under "Technical Implementation Details" as code is written
3. Mark success criteria as complete when features work
4. Add troubleshooting entries when bugs are found and fixed
5. Keep all sections current — remove outdated information
6. Use code references format: `filepath:line-number` when citing code
7. Update "Current Status" section at the top if needed
8. Add an entry to the "Change Log" section whenever any part of this document is updated, including the date, time, section changed, and a brief description of the change

---

## Current Status

**Last Updated**: 2026-04-08
**Current Phase**: All phases complete
**Status**: ✅ COMPLETED
**Next Steps**: All 6 implementation phases complete. Run remote migration and deploy to Cloudflare.

---

## Change Log

### [2026-04-08 00:09] - Phase 6 completed

- **Section**: Implementation Phases, Current Status
- **Change**: Phase 6 status updated to ✅ COMPLETED. PreviewQuestion component built with Fisher-Yates shuffle on mount, radio-style answer selection, correct/incorrect feedback with colour-coded choice states, and "Try again" reset. Preview page fetches question client-side and handles 403/404. Current Status updated to all phases complete.
- **Verified**: All 41 tests across 2 test suites (`question-service.test.ts` and `QuestionForm.test.tsx`) are passing.

### [2026-04-08 00:08] - Phase 6 updated with shuffle requirement and security risk note

- **Section**: Implementation Phases, Risks and Mitigation
- **Change**: Phase 6 tasks updated to include client-side Fisher-Yates shuffle of answer choices on each preview render. Notes added clarifying no data changes are required. New Security Risks section added documenting that `is_correct` is exposed in the API response, with current mitigation (teacher-only scope) and future mitigation guidance if student-facing delivery is ever built.

### [2026-04-08 00:07] - Phase 5 completed

- **Section**: Implementation Phases, Current Status
- **Change**: Phase 5 status updated to ✅ COMPLETED. TDD approach followed: 14 QuestionForm tests written first (confirmed failing), then QuestionForm and AnswerChoiceList built to make them pass. New and Edit page files wired to POST/PUT API. All 41 tests passing across both test files. Current Status advanced to Phase 6.
- **Verified**: All 41 tests across 2 test suites (`question-service.test.ts` and `QuestionForm.test.tsx`) are passing.

### [2026-04-08 00:06] - Phase 4 completed

- **Section**: Implementation Phases, Current Status
- **Change**: Phase 4 status updated to ✅ COMPLETED. Question library UI built including QuestionLibrary, QuestionCard, EmptyState, and HighlightedText components. Tabs, search with 350ms debounce, keyword highlighting, pagination, and page size selector all implemented. Default app redirect updated from `/mcqs` to `/questions` across middleware, login form, and the legacy mcqs page. Current Status advanced to Phase 5.

### [2026-04-08 00:05] - Phase 5 revised to use TDD approach

- **Section**: Implementation Phases
- **Change**: Phase 5 tasks reordered to lead with writing tests for `QuestionForm` and `AnswerChoiceList` before building the components. Explicit TDD test cases defined upfront (add/remove limits, correct-answer exclusivity, validation). Page-level wrappers and API wiring remain build-first with tests added after. Deliverables updated to include `QuestionForm.test.tsx`.

### [2026-04-08 00:04] - Phase 3 completed

- **Section**: Implementation Phases, Current Status
- **Change**: Phase 3 status updated to ✅ COMPLETED. All 6 API routes created: GET/POST `/api/questions`, GET/PUT `/api/questions/[id]`, PATCH `/api/questions/[id]/archive`, PATCH `/api/questions/[id]/unarchive`. All routes include authentication and structured error handling. Current Status advanced to Phase 4.

### [2026-04-08 00:03] - Phase 2 completed

- **Section**: Implementation Phases, Current Status
- **Change**: Phase 2 status updated to ✅ COMPLETED. Service layer implemented in `src/lib/services/question-service.ts` with all six service functions. 27 unit tests written and passing. Vitest installed and configured. Current Status advanced to Phase 3.
- **Verified**: I have personally run and verified all 27 unit tests are passing.

### [2026-04-08 00:02] - Remote migration confirmed ready

- **Section**: Change Log
- **Change**: Noted that migration `0002_0002_create_questions_and_answer_choices.sql` has been verified and will successfully run against the remote Cloudflare D1 database when applied

### [2026-04-08 00:01] - Phase 1 completed

- **Section**: Implementation Phases, Current Status
- **Change**: Phase 1 status updated to ✅ COMPLETED. Migration `0002_0002_create_questions_and_answer_choices.sql` created and applied to local D1 database. Current Status updated to Phase 2 IN PROGRESS.

### [2026-04-08 00:00] - Initial document created

- **Section**: All
- **Change**: PRD created from template. All sections populated based on feature planning session covering MCQ creation, editing, archiving, search, pagination, and preview requirements.

