---
"@tonaljs/chart": minor
---

`Chart.fromForm(sections, form)` builds a chart from named sections and a form: `Chart.fromForm({ A: "| C | G |", B: "| F |" }, "A A B A")`. The form is names separated by spaces, with `*n` to play one n times (`"Intro A*2 B A"`), or letters (`"AABA"`). Each section keeps its own meter, repeats and jumps, and starts with its name; an unknown name gives an empty chart, and `Chart.problems` says which.
