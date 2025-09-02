# 🎓 CGPA Calculator

A web-based tool to calculate your **Cumulative Grade Point Average (CGPA)** from semester-wise SGPAs and credits. The app also shows your performance trend on a graph and allows you to **set a target CGPA** to plan your academic goals.

---

## ✨ Features

* ➕ **Dynamic Semester Addition**

  * Add as many semesters as you want.
  * Remove semesters (after the first two).

* 📊 **Accurate CGPA Calculation**

  * Weighted average calculation using SGPAs and credit hours.
  * Percentage conversion using formula:

    ```
    Percentage = (CGPA - 0.5) × 10
    ```

* 📈 **Performance Visualization**

  * Line chart showing SGPA trend across semesters (powered by Chart.js).

* 🎯 **Target CGPA Planner**

  * Input a target CGPA and select a future semester (up to 8).
  * App calculates the **required average SGPA** in remaining semesters.
  * Shows warnings if the target is mathematically impossible.

* ⚡ **User-Friendly**

  * Responsive UI with validation for SGPA (0–10) and credits (>0).
  * Default 20 credits per semester (can be adjusted).

---

## 🛠️ Tech Stack

* **HTML5** – Structure
* **CSS3** – Styling
* **JavaScript (Vanilla)** – Functionality
* **Chart.js** – Graph plotting

---

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/Sannidhipopshetwar/CGPA-CALCULATOR.git
   cd CGPA-CALCULATOR
   ```

2. **Run locally**
   Just open `index.html` in your browser.

   Or, serve with a local server:

   ```bash
   npx http-server .
   ```

   Visit: `http://localhost:8080`

---
## 📂 File Structure

```
CGPA-CALCULATOR/
├── index.html        # Main UI
├── style.css         # Styling
├── script.js         # Logic for CGPA, graph, and planner
└── assets/           # (Optional) icons, images, etc.
```

---

## 📐 Formulae

* **CGPA**

  ```
  CGPA = Σ(SGPA × Credits) / Σ(Credits)
  ```
* **Percentage Conversion**

  ```
  Percentage = (CGPA - 0.5) × 10
  ```
* **Target CGPA Requirement**

  ```
  Required SGPA = (TargetCGPA × TotalCredits - CompletedWeightedSum) / FutureCredits
  ```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork this repo
2. Create a feature branch (`git checkout -b feature-new`)
3. Commit your changes (`git commit -m "Added new feature"`)
4. Push (`git push origin feature-new`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.
