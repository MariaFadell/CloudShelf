# 📚 CloudShelf – Book Discovery Platform

## 👩‍💻 Author  
**Maria Youssef Fadel**

---

## 🔌 API Used  
This project uses the **Open Library API** to dynamically fetch rich book data including titles, covers, authors, and detailed descriptions.  
🔗 [https://openlibrary.org/developers/api](https://openlibrary.org/developers/api)

---

## 📖 Project Description  

**CloudShelf** is a responsive and interactive web application designed to help book lovers discover and explore books with ease. Key features include:

- Browse **New Releases**, **Top Books**, and **Genres**  
- Switch between **Grid (3-column)** and **List** views for flexible browsing  
- Search books by keywords, titles, or authors  
- Read detailed book info in modal popups  
- Navigate through books with intuitive pagination  
- Toggle between light and dark modes for comfortable viewing  
- Enjoy a modern UI with interactive elements such as a hero carousel and author spotlight  
- Responsive navigation and footer with social icons  
- Contact form for user feedback and communication  

---

## 🧾 Sections Overview

CloudShelf includes the following main sections, all thoughtfully designed and implemented:

- **Hero Section:** Eye-catching carousel featuring calls to action  
- **About Section:** Introduces the purpose and mission of CloudShelf  
- **Benefits Section:** Highlights the advantages and user benefits of the platform  
- **New Releases:** Displays trending new books in a responsive 3-column Flexbox gallery with pagination  
- **Top Books:** Showcases popular titles, also with toggles between grid and list views  
- **Explore by Genre:** Allows users to filter books by genre, rendered in the required 3-column Flexbox layout  
- **Author Spotlight:** Focus on featured authors with visual emphasis  
- **Contact Section:** Includes a functional form and social media icons for easy communication  
- **Footer:** Contains navigation links and copyright information  

---

## 🛠️ Custom Requirement Explanation

**Custom Requirement:**  
> _"Create a responsive 3-column layout using Flexbox for a gallery."_

This requirement is fully implemented using pure CSS Flexbox, without relying on frameworks, and appears across the following sections of the website:

- 📚 **New Releases**  
- 📈 **Top Books** (Grid View)  
- 📂 **Explore by Genre**

### 💡 Flexbox Implementation

Each section uses a container (`.gallery-list`) that applies:

- `display: flex`
- `flex-wrap: wrap`
- `gap` for spacing between items
- `justify-content: center` to center the content

Each individual book card (`.chapter-card`) is styled with:

- `max-width: 200px` to limit width per item  
- `margin: 0 auto` for centering  
- `display: flex` and `flex-direction: column` for vertical alignment of image and text  

### 📐 How 3 Columns Are Achieved

Flexbox does not declare “3 columns” explicitly like CSS Grid. Instead, this layout achieves a **natural 3-column effect** by:

- Setting a fixed `max-width: 200px` for each card  
- Allowing Flexbox to wrap items based on available container width  
- On large screens (≈900px and up), the layout comfortably fits **3 cards per row**

### 📱 Responsive Behavior

The layout adapts to screen sizes using media queries:

- **≤ 900px:** Cards resize to `calc(50% - 24px)` for a **2-column layout**  
- **≤ 600px:** Cards switch to `width: 100%` for a **1-column layout**  

This ensures a clean and readable experience across desktop, tablet, and mobile views.

### ✨ Visual & Interactive Enhancements

- Cards include subtle hover animations (`translateY`) for interactivity  
- Book covers feature rounded corners and soft shadows  
- CSS variables and semantic HTML structure are used for consistency and maintainability  

✅ This layout was built manually using Flexbox and media queries, demonstrating a solid understanding of responsive design principles and fulfilling the custom UI requirement.

---

## 🗂️ Pages & Navigation

CloudShelf includes at least three main pages:

- **Home** (`index.html`)  
- **Books** (`books.html`)  
- **Contact** (`contact.html`)  

A consistent navigation bar is displayed on all pages for easy routing. Navigation is implemented using standard anchor links (`<a href="...">`).

---

## 🧠 JavaScript Functionality

All JavaScript is written using **ES6 class-based structure**. Core interactive features include:

- Dynamic content loading from the API  
- Grid/List view toggle  
- Modal book detail popups  
- Search functionality  
- Pagination controls  
- Responsive menu toggling and form interactivity  

---

## 🎨 CSS Transitions

The platform includes smooth and subtle CSS transitions, such as:

- Hover effects on book cards (e.g., translateY)  
- Modal fade-in and fade-out animations  

---

## 🧩 Layout & Styling

- Uses **semantic HTML5** throughout  
- Styled with **CSS3**, **Flexbox**, and optional **Bootstrap 5** where needed  
- Follows responsive design principles using media queries  
- Supports both **light and dark mode**  

---

## 🚀 How to Run

1. Clone or download the repository  
2. Open `index.html` in any modern browser  
3. Make sure you're connected to the internet to access the Open Library API  

---

## 📫 Contact  

For questions or feedback, reach out via [mariakfadel@gmail.com](mailto:mariakfadel@gmail.com)

---

© 2025 All rights reserved – Maria Fadel  
Full Stack Development – Final Project  
Due: July 1, 2025  
