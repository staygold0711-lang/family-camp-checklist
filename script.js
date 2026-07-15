const checklistElement = document.getElementById("checklist");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const resetButton = document.getElementById("resetButton");

const STORAGE_KEY = "family-camp-checklist";
const NOTE_KEY = "family-camp-notes";

let checkedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
let noteState = JSON.parse(localStorage.getItem(NOTE_KEY) || "{}");

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedState));
    localStorage.setItem(NOTE_KEY, JSON.stringify(noteState));
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

            if (checkedState[key]) {
                row.classList.add("checked");
                completed++;
            }

            // チェックボックス
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = checkedState[key] || false;

            checkbox.addEventListener("click", (e) => {
                e.stopPropagation();
            });

            checkbox.addEventListener("change", () => {
                checkedState[key] = checkbox.checked;
                save();
                render();
            });

            // 右側
            const content = document.createElement("div");
            content.className = "item-content";

            const header = document.createElement("div");
            header.className = "item-header";

            const name = document.createElement("div");
            name.className = "item-name";
            name.textContent = item.name;

            // 編集ボタン
            const editButton = document.createElement("button");
            editButton.className = "edit-button";
            editButton.textContent = "✏️";

            editButton.addEventListener("click", (e) => {

                e.stopPropagation();

                const current =
                    noteState[key] ??
                    item.note ??
                    "";

                const result = prompt("備考を編集してください", current);

                if (result !== null) {

                    noteState[key] = result.trim();

                    save();

                    render();

                }

            });

            header.appendChild(name);
            header.appendChild(editButton);

            content.appendChild(header);

            const note = document.createElement("div");
            note.className = "item-note";

            const noteText =
                noteState[key] ??
                item.note;

            if (noteText && noteText.length > 0) {

                note.textContent = noteText;

                content.appendChild(note);

            }

            row.appendChild(checkbox);
            row.appendChild(content);

            // 行全体でチェック
            row.addEventListener("click", () => {

                checkedState[key] = !checkedState[key];

                save();

                render();

            });

            section.appendChild(row);

        });

        checklistElement.appendChild(section);

    });

    progressText.textContent =
        `${completed} / ${total} (${Math.round(completed / total * 100)}%)`;

    progressFill.style.width =
        `${completed / total * 100}%`;

}

// リセット
resetButton.addEventListener("click", () => {

    if (!confirm("チェックをすべて解除しますか？")) {

        return;

    }

    checkedState = {};

    save();

    render();

});

render();