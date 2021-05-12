document.addEventListener('DOMContentLoaded', () => {
    loadUI()
});

const loadUI = () => {
    chrome.runtime.sendMessage({action:"getList", value: "doNotSuspends"},(response) => {
        doNotSuspends = response
        
        const filtersHTML = doNotSuspends.map( filter => {
            return ` <li class="filter-item">
                <button class="btn" value="${filter}">remove</button>
                ${filter}
            </li>
            `
        }).join('');

        const filterList = document.getElementById('filterList');
        
        filterList.innerHTML = filtersHTML;
    
        const filterEntr = [... document.querySelectorAll('.filter-item')];
        
        filterEntr.forEach((entry) => {
            entry.addEventListener('click',remove)
        });
    
        const filterButton = document.getElementById('filterButton');
        const inputFire = () => {
            add(document.getElementById('filterInput').value);
        }
        filterButton.addEventListener('click',inputFire);

        filterInput.addEventListener("keydown",event => {
            if (event.isComposing || event.keyCode === 13) {
                inputFire()
                return
            }
          }
        );
    });
}

const remove = (elem) => {
    chrome.runtime.sendMessage({action:"remove", value: elem.target.value},() => {});
    loadUI()
    location.reload();
}

const add = (elem) => {
    chrome.runtime.sendMessage({action:"add", value: elem},() => {});
    loadUI();
    location.reload();
}