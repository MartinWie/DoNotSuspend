document.addEventListener('DOMContentLoaded', () => {
    loadUI();
});

const loadUI = () => {
    chrome.runtime.sendMessage({ action: "getList", value: "doNotSuspends" }, (response) => {
        doNotSuspends = response;

        const filtersHTML = doNotSuspends.map(filter => {
            return `
                <li class="filter-item flex justify-between items-center p-3 bg-white rounded-lg shadow mb-2 min-w-[320px]">
                    <div class="filter-item-keyword text-gray-800 font-medium truncate">
                        <b>${filter}</b>
                    </div>
                    <button class="btn bg-indigo-600 text-white px-3 py-2 rounded hover:bg-red-600 transition" value="${filter}">Remove</button>
                </li>
            `;
        }).join('');

        const filterList = document.getElementById('filterList');
        filterList.innerHTML = filtersHTML;

        const filterEntr = [...document.querySelectorAll('.filter-item')];
        filterEntr.forEach((entry) => {
            entry.addEventListener('click', remove);
        });

        const filterButton = document.getElementById('filterButton');
        const inputFire = () => {
            add(document.getElementById('filterInput').value);
        };

        filterButton.addEventListener('click', inputFire);

        const filterInput = document.getElementById('filterInput');
        filterInput.addEventListener("keydown", event => {
            if (event.isComposing || event.keyCode === 13) {
                inputFire();
                return;
            }
        });
    });
};

const remove = (elem) => {
    chrome.runtime.sendMessage({ action: "remove", value: elem.target.value }, () => {});
    loadUI();
    location.reload();
};

const add = (elem) => {
    chrome.runtime.sendMessage({ action: "add", value: elem }, () => {});
    loadUI();
    location.reload();
};