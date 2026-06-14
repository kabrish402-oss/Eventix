# 📑 Capstone Project Submission | Web Technologies SP26
### 🔮 GlowTicketing — Premium Event Ticket Booking & Seat Selector

---

## 👤 Student Information
* **Name:** [Abrish Khan]  
* **Roll Number:** [F24BDOCS1M01030]  
* **Class Section:** BSCS 4th Semester (Section 1M)  

---

## 📖 Project Overview
**GlowTicketing** is a highly interactive, client-focused event ticket booking system tailored with a premium, boutique, pastel-dream aesthetic. Built completely using plain vanilla JavaScript, Bootstrap 5, and custom styling overrides, the application provides an end-to-end interface for searching events, making real-time interactive seat selections, validating customer records, and handling persistent client states with a local mock REST API server.

The project is structured strictly according to the architecture guidelines, partitioning the application into a user-facing booking interface (`index.html`) and a distinct, metric-driven administrative management dashboard (`admin.html`).

---

## ✨ Features Checklist & Implementation Log

### 🌸 1. User Panel (`index.html`)
* **Dynamic Content Extraction (GET):** Synchronizes instantly with the `json-server` database to pull the active live event configurations, title headers, and real-time ticket pricing metrics.
* **Interactive Matrix Seating Chart:** Dynamically maps out rows and seating coordinates from the backend database array. Color-coded nodes cleanly illustrate available, selected, and occupied positions.
* **5-Field Booking Form with Inline Validation:** Collects Full Name, Email, Phone Number, Selected Seats, and Theme Customization preferences. Implements customized inline error handling indicators while explicitly bypassing bad browser `alert()` popups.
* **Automatic Live Re-Rendering:** After a successful ticket reservation payload is submitted via a POST request, the UI automatically updates, locking in seats instantly without requiring a hard reload.
* **Loading and Network Failure Handlers:** Features visual loading elements during transactions and provides clean, descriptive UI banners if the database server becomes completely unreachable.

### 🔮 2. Administrative Panel (`admin.html`)
* **Visual Theme Separation:** Swaps the soft pastel theme for a deep corporate administrative layout featuring an explicit "Admin Control" alert label to provide immediate structural contrast.
* **3-Tier Real-Time Aggregated Metrics:** Calculates and displays **Gross Revenue ($)**, **Reserved Positions Count**, and **Remaining Open Seats** based on database states.
* **Full CRUD Management Panel:** * Displays a full ledger table containing all current guest information.
  * Extracted modification flow **(PATCH)** utilizing interactive Bootstrap Overlay Modals for changing guest information cleanly.
  * Destructive cancellation pathway **(DELETE)** tied to confirmation prompts to purge records.

---

## 🛠️ Technology Stack Breakdown
* **Markup:** Semantic HTML5 (`<nav>`, `<main>`, `<section>`, `<form>`) optimized for layout cleanliness and clear form structural hierarchy.
* **Styling:** Bootstrap 5 Framework core grid structure coupled with an aesthetic Custom CSS variables palette.
* **JavaScript Engine:** Plain Vanilla JavaScript ONLY (No external frameworks, libraries, or compilers used).
* **Backend Database Protocol:** Local Mock REST API via `json-server` running over `fetch` architecture wrapped in modern `async/await` and `try/catch` syntax blocks.

---

## 🚀 Step-by-Step Setup & Installation Guide

Follow these steps exactly to execute the system in your local workspace environment:

### Step 1: Initialize Project Directory Space
Ensure your active project folder structure matches the layout specified in the guidelines:
```text
glow-ticketing/
├── index.html
├── admin.html
├── style.css
├── app.js
├── admin.js
├── db.json
└── README.md