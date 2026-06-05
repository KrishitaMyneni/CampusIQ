# CampusIQ — Find the right campus

🌐 **Live Demo:** [CampusIQ-live website](https://campus-iq-six.vercel.app/)

📂 **GitHub:** https://github.com/KrishitaMyneni/CampusIQ

---

## Overview

CampusIQ is a full-stack web application that helps students discover, compare, and shortlist engineering colleges across India.

Students can search colleges by location, fees, rating, and courses, compare institutions side-by-side, save favorites, receive personalized recommendations, and participate in community discussions to make informed educational decisions.

---

## Highlights

* Built a production-ready full-stack application using Next.js, TypeScript, Prisma, PostgreSQL, and NextAuth
* Implemented secure authentication with JWT-based sessions and password hashing
* Designed relational database models with Prisma ORM
* Developed discussion forums with questions and answers
* Created a recommendation engine based on budget, rating, location, and course preferences
* Built college comparison tools with placement statistics and fee analysis
* Deployed on Vercel with Neon PostgreSQL

---

## Features

### College Search

* Search colleges by name
* Filter by location
* Filter by minimum rating
* Filter by maximum fees
* Live search experience

### Top Colleges

* Ranked list of top-rated colleges
* Quick access from homepage

### College Profiles

Each college includes:

* Name
* Location
* Fees
* Rating
* Description
* Available courses
* Highest package
* Average package
* Placement rate
* Review summary

### College Comparison

Compare colleges side-by-side using:

* Fees
* Rating
* Location
* Placement rate
* Highest package
* Average package
* Courses offered

### Personalized Recommendations

Recommend colleges using:

* Budget
* Preferred location
* Minimum rating
* Desired course

### Saved Colleges

Authenticated users can:

* Save colleges
* Remove saved colleges
* Revisit saved colleges later

### Saved Comparisons

Authenticated users can:

* Save comparisons
* Remove saved comparisons
* Reopen saved comparison pages

### Discussions & Q&A

Users can:

* Ask questions
* Answer questions
* Browse discussions
* View discussion threads
* Discuss specific colleges

### User Profile

Profile includes:

* Account information
* Saved college count
* Questions asked
* Answers posted

### Authentication

* Sign Up
* Login
* Logout
* Password hashing with bcryptjs
* Protected routes

---

## Tech Stack

| Layer            | Technology              |
| ---------------- | ----------------------- |
| Framework        | Next.js 16 (App Router) |
| Language         | TypeScript              |
| Styling          | Tailwind CSS v4         |
| Database         | PostgreSQL              |
| ORM              | Prisma 7                |
| Authentication   | NextAuth.js             |
| Notifications    | React Hot Toast         |
| Password Hashing | bcryptjs                |
| Hosting          | Vercel                  |
| Database Hosting | Neon                    |

---

## Screenshots

### Home Page

<img width="2531" height="1384" alt="image" src="https://github.com/user-attachments/assets/26c4213e-bde7-4969-a4d0-2c966497d365" />


### College Details

<img width="2527" height="1362" alt="image" src="https://github.com/user-attachments/assets/09869702-861f-48c9-8c44-604a29f872b4" />


### College Comparison

<img width="2527" height="1365" alt="image" src="https://github.com/user-attachments/assets/849a11b7-235a-425d-9920-cab2211cd690" />

### Discussions

<img width="2525" height="1381" alt="image" src="https://github.com/user-attachments/assets/2803783b-7546-4b3e-a21c-e707055aed5d" />


### Recommendations

<img width="2515" height="1394" alt="image" src="https://github.com/user-attachments/assets/f6467fdc-275f-42c3-82f9-7ec7ebb2d17f" />


---

## Getting Started

### Clone Repository

```bash
git clone https://github.com/KrishitaMyneni/CampusIQ.git

cd CampusIQ
```

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL="your_postgresql_connection_string"

AUTH_SECRET="your_secret_key"

NEXTAUTH_URL="http://localhost:3000"
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Apply Database Migrations

```bash
npx prisma migrate deploy
```

### Seed Database

```bash
npx tsx prisma/seed.ts
```

### Run Development Server

```bash
npm run dev
```

Visit:

```txt
http://localhost:3000
```

---

## Project Structure

```txt
campus-iq
│
├── prisma
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations
│
├── src
│   ├── app
│   │   ├── api
│   │   ├── college
│   │   ├── compare
│   │   ├── discussions
│   │   ├── login
│   │   ├── signup
│   │   ├── profile
│   │   ├── recommend
│   │   ├── saved
│   │   └── page.tsx
│   │
│   ├── components
│   ├── lib
│   └── auth.ts
│
├── public
├── package.json
└── README.md
```

---

## API Endpoints

| Endpoint             | Method       | Purpose         |
| -------------------- | ------------ | --------------- |
| /api/colleges        | GET          | Search colleges |
| /api/colleges/[id]   | GET          | College details |
| /api/top-colleges    | GET          | Top colleges    |
| /api/recommend       | GET          | Recommendations |
| /api/save-college    | POST, DELETE | Save college    |
| /api/save-comparison | POST, DELETE | Save comparison |
| /api/saved-colleges  | GET          | User saved data |
| /api/questions       | GET, POST    | Questions       |
| /api/questions/[id]  | GET          | Single question |
| /api/answers         | POST         | Create answer   |
| /api/auth/signup     | POST         | Register user   |

---

## Database Models

### User

Stores:

* Name
* Email
* Password

### College

Stores:

* College information
* Placement statistics
* Courses
* Reviews

### SavedCollege

User ↔ College relationship

### SavedComparison

User ↔ Comparison relationship

### Question

Discussion questions

### Answer

Discussion replies

---

## Deployment

### Vercel + Neon PostgreSQL

1. Create a Neon PostgreSQL database
2. Add environment variables in Vercel
3. Import repository into Vercel
4. Deploy

Production environment variables:

```env
DATABASE_URL=
AUTH_SECRET=
NEXTAUTH_URL=
```

---

## Future Improvements

* College rankings based on multiple factors
* AI-powered recommendations
* College reviews with ratings
* Discussion upvotes
* Admin dashboard
* College image galleries

---

## Author

### Krishita Myneni

* GitHub: https://github.com/KrishitaMyneni
* LinkedIn: https://www.linkedin.com/in/krishita-myneni-2b74ab326/

---

⭐ If you found this project useful, consider starring the repository.
