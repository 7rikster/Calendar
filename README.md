# 🗓️ Premium Interactive Calendar 

A production-grade, highly polished interactive Calendar built specifically for modern SaaS dashboard interfaces. It fully implements advanced event handling, date range selections, localized state-persistence, and Google Calendar-styled UI representations.

![Demo](./public/demo.gif)

## 🎯 What Problem this Solves
Developers often rely on heavy, inflexible, generic calendar packages that lack deep UI customization or struggle to adapt to modern design trends (glassmorphism, organic bounding, dynamic layouts) natively within Tailwind. 

This standalone module serves as a natively integrated, robust interactive calendar providing complete granular control over rendering event slotting geometries, multi-day visual continuity, and complex state management without needing external dependency bloat.

---

## 💡 Key Features 

### Advanced Interactivity
* **Google-Style Multi-Day Spans**: Events spanning multiple days are elegantly mapped intelligently into continuous, solid horizontal bars stretching across the Grid's dynamic slots.
* **Intelligent Conflict Detection**: When scheduling a new memo or event, the calendar aggressively tests time overlays against cached items, warning users intuitively via an amber dropdown system while offering "Proceed Anyway" or "Edit Time" options.
* **Range Selection Handling**: Features active native drag-and-drop cell highlighting—perfect for generating multi-day spans seamlessly.

### Premium UI/UX 
* **Dynamic Content Expansion**: The CSS Grid perfectly tracks array depths, uniformly stretching Calendar Cell heights row-by-row preventing awkward, jumpy text overlapping.
* **Monthly Context Notes**: An aggressively debounced `localStorage` synced notepad integrated tightly into the Agenda Panel for users to jot down high-level Monthly to-do's dynamically. 
* **Swipe Navigation & Animation**: Completely animated `framer-motion` sliding headers combined with native touch-event mobile swiping for smooth month transitioning.

---

## 🧠 Core Architecture Decisions
- **Decoupled Grid Slotting Mechanism**: Calculating the vertical stack-order of multi-day event bars *per day* notoriously leads to broken "zig-zag" visualizations. We mitigated this by mathematically resolving an event's `Array Slot` locally for the *entire slice boundary* globally from the Grid controller itself before distributing `paddedSlot` proxies to the generic Cells. 
- **Persisted Caching Hooks**: We utilized custom `useEvents` and `useNotes` React hooks bound aggressively against `localStorage`. By checking overlapping mockup UUIDs within initialization, we allow the calendar to natively host mock-demos while continuing to retain the user's previously built manual tasks effortlessly.
- **Framer Motion Syncing**: Relegated standard CSS transitions to strict property interpolations (like background gradients), but bound all element-flow DOM transitions (such as month changes and note expand/collapse states) efficiently to `AnimatePresence`. 

---

## ⚙️ Tech Stack
* **Framework**: React 19 (Next.js / Vite Context compatible)
* **Styling**: TailwindCSS (Utility-first, Dark Mode Tailored)
* **Animations**: Framer Motion
* **Icons**: Lucide-React
* **Architecture**: Typescript + Custom Context Hooks

---

## 🚀 How to Run Locally

1. **Clone the Repository**
```bash
git clone https://github.com/your-username/Calendar.git
cd Calendar
```

2. **Install Dependencies**
You can use `npm`, `yarn`, or `pnpm`.
```bash
pnpm install
```

3. **Start the Development Server**
```bash
pnpm dev
```

4. **Boot it up**
Navigate to `http://localhost:3000` in your browser. 
Create an event, drag a date range, or toggle Dark Mode to test out the logic!
