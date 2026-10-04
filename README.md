# CVBuilder — Professional Role-Specific CV Builder

This package is a complete rebuild for the CVBuilder project.

## Core flow

**Landing Page → Account Login → Dashboard → Category → Job Role → Role-Specific Template → CV Form → A4 Preview → Save to Firestore / Download PDF**

## Included

- Professional landing page
- Email/password Firebase Authentication
- Google account chooser login
- Dashboard with saved CVs
- Category → Job Role → Template selection
- 10 career categories
- 60+ job roles
- Role-specific form fields
- Experience, projects and education repeaters
- Certifications, achievements, skills and languages
- Live information preview
- Professional A4 CV preview
- Multiple visual template families
- Firestore save/edit/delete
- PDF download
- Responsive mobile layout
- ATS-aware content structure

## Firebase

Project:
- Project ID: `cvbuilder-13804`

Files:
- `firebase-config.js`
- `firestore.rules`

Publish the Firestore rules from `firestore.rules` in Firebase Console.

For Google Login, enable Google under Firebase Authentication → Sign-in method and add your Vercel domain under Authorized domains.

## Deployment

Upload these files to your GitHub repository and deploy the repository with Vercel.

Recommended entry:
- `index.html`

No Node.js server is required for this version.

## Important design decision

The builder intentionally uses standard CV section names and a clean A4 structure. ATS systems commonly extract job titles, skills, experience and education, and complex graphics/columns can create parsing problems. The app therefore keeps the actual CV content readable while allowing different visual template families.

## Updating the app

The main role catalogue is inside `templates.html`.
Role-specific form definitions are inside `cv-form.html`.
The CV rendering and PDF download are inside `cv-preview.html`.

If you add a new role, add it to:
1. `CATEGORIES`
2. `templateSets`
3. `roleConfig`

## Firebase Firestore structure

`users/{uid}/cvs/{cvId}`

Each CV stores:
- category
- role
- template
- personal/contact information
- roleData
- experience
- projects
- education
- certifications
- achievements
- skills
- languages
- createdAt
- updatedAt

## International / Global CV Templates

The template selector now includes three universal international-ready options for every job role:
- Global ATS Professional — clean single-column, standard-heading structure for online applications.
- Global Executive — polished leadership/corporate presentation.
- Global Modern — contemporary professional layout with readable hierarchy.

Use the Global ATS option when the employer uses an ATS or the application portal emphasizes resume parsing. Use Global Executive or Global Modern when a recruiter-facing PDF is appropriate. Country-specific requirements can vary, so the candidate should follow the employer's application instructions.

## International CV standard
The builder includes Global ATS Professional, Global Executive and Global Modern templates. Use Global ATS for online applications where ATS parsing is important; use Executive or Modern when a recruiter-facing visual presentation is appropriate. The builder keeps role-specific sections, standard headings, readable typography, A4 PDF output and separate label/value styling.


## Professional Product Features
- Global ATS Professional, Global Executive and Global Modern CV templates
- Universal role-detail rendering with semi-bold labels and normal values
- ATS readiness checker with optional job-description keyword matching
- Job Description → Tailor My CV recommendations
- Honest, non-generative recommendations: the system never invents qualifications or experience

### Recommended public launch flow
1. User creates account.
2. User selects category, job role and template.
3. User completes role-specific CV information.
4. User previews and saves the CV.
5. User runs ATS Checker.
6. User optionally pastes a target job description into Tailor My CV.
7. User updates the CV truthfully and downloads the final PDF.
