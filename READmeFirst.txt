

#READmeFIRST.txt  

Welcome to the **Event Browsing App** project! 
This file explains exactly how to set up and how each team member should proceed with their assigned tasks.  

---

#1. Getting Started  

#Clone the Repo  
Clone Anson’s fork (not upstream):  
git clone https://github.com/an5onc/event-browsing-app.git
cd event-browsing-app
```

#Install Dependencies  
npm install
```

#Run the Dev Server  
npm run dev
```
The app will run at: http://localhost:5173

#2. Branch Workflow  
- The shared development branch is **`frontend`**.  
- Switch to it:  
git checkout frontend
```

- Always make a **feature branch** for your task:  
git checkout -b feat/<task-name>
```

Example:  
git checkout -b feat/rsvp-button
```

- Push your work:  
git push origin feat/rsvp-button
``` 

- Open a Pull Request (PR) into `frontend`.  

❌ Do not push directly to `main`.  
❌ Do not open PRs against `less2179`.

#3. Assigned Tasks  

### Ashtyn  
- **Create Events in a Chosen Category**  
  - File: `EventForm.tsx`  
  - Add event form fields, validation, and hook it into the fake API (`EventsAPI.create`).  

### Ximena  
- **RSVP to Certain Events**  
  - File: `RSVPButton.tsx` and inside `EventCard.tsx`.  
  - Implement RSVP toggle and connect it with the fake API (`EventsAPI.rsvp`).  

### AJ  
- **Like button to like events**  
  - File: `LikeButton.tsx` and inside `EventCard.tsx`.  
  - Implement like/unlike logic with `EventsAPI.like`.  

### Lanetta  
- **Filter and Sort Categories of Events**  
  - File: `EventFilters.tsx`.  
  - Add dropdown filters for categories, dates, and integrate with `EventsPage.tsx`.  

### Ruth - 
- **Make events public/private**  
  - File: `VisibilityToggle.tsx` and `EventForm.tsx`.  
  - Add UI to toggle visibility and integrate with `EventsAPI.toggleVisibility`.  

### Aaron C.
- **

### Unassigned (pick up later)  
- **Display Chronological List of Events** → `EventList.tsx`  
- **Create User Accounts** → `SignIn.tsx`, `SignUp.tsx`  
- **Delete Events** → in `EventCard.tsx` with a delete button (`EventsAPI.remove`)  
- **Modify/Edit/Update Events** → reuse `EventForm.tsx` for editing mode  
- **Search for Events** → `SearchBar.tsx` + `EventsPage.tsx`  
- **List of events a user plans to attend** → `MyEvents.tsx`  
- **Provide a link to ticketing website** → add a link area in `EventCard.tsx`  
- **Upload Images** → `ImageUploader.tsx`  
- **Select events posted by a given user** → new `AuthorPage.tsx`

# The following names have not chosen a section and needs to choose one immediately or they will be automatically assigned by the end of the week 9/21/25.

Diego C.

## 4. Notes  

- All components are scaffolded in `src/components/`, `src/pages/`, `src/lib/`.  
- The fake backend is in `src/lib/api.ts` — I will replace with real API calls later once they start.  
- If you break something, communicate early so it can be fixed quickly.  
- Always pull the latest `frontend` before starting work:  

```
git checkout frontend
git pull origin frontend
```

---
*Questions should go through Anson. Several options:
    -I will create a questions.txt you can list your questions. You will have to save, commit, then push to project.
    -Post your questions on discord under frontend 