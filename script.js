const checklistElement = document.getElementById("checklist");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const STORAGE_KEY = "family-camp-checklist";

let checkedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedState));
}

function render() {

    checklistElement.innerHTML = "";

    let total = 0;
    let completed = 0;

    checklistData.forEach((category, categoryIndex) => {

        const section = document.createElement("section");
        section.className = "category";

        const title = document.createElement("h2");
        title.textContent = category.category;

        section.appendChild(title);

        category.items.forEach((item, itemIndex) => {

            total++;

            const key = `${categoryIndex}-${itemIndex}`;

            const row = document.createElement("div");
            row.className = "item";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";

            checkbox.checked = checkedState[key] || false;

            if (checkbox.checked) {
                completed++;
            }

            checkbox.addEventListener("change", () => {
                checkedState[key] = checkbox.checked;
                save();
                render();
            });

            const text = document.createElement("div");

            const name = document.createElement("div");
            name.className = "item-name";
            name.textContent = item.name;

            text.appendChild(name);

            if (item.note) {
                const note = document.createElement("div");
                note.className = "item-note";
                note.textContent = item.note;
                text.appendChild(note);
            }

            row.appendChild(checkbox);
            row.appendChild(text);

            section.appendChild(row);

        });

        checklistElement.appendChild(section);

    });

    progressText.textContent = `${completed} / ${total}`;

    const percent = total === 0 ? 0 : completed / total * 100;

    progressFill.style.width = `${percent}%`;

}

render();