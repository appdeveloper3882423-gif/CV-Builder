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
