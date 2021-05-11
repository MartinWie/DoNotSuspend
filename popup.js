document.addEventListener('DOMContentLoaded', () => {

    //var doNotSuspends = ["troy", "music", "ikaros"]
    
    chrome.runtime.sendMessage({action:"getList", value: "doNotSuspends"},(response) => {
        doNotSuspends = response
        console.log(`Answereto getList : ${doNotSuspends}`)

        const filtersHTML = doNotSuspends.map( filter => {
            return ` <li class="filter-item">
                <button class="btn" value="${filter}">remove</button>
                ${filter}
            </li>
            `
        }).join('');
        
        filterList.innerHTML = filtersHTML;
    
        const filterEntr = [... document.querySelectorAll('.filter-item')];
        
        filterEntr.forEach((entry) => {
            entry.addEventListener('click',remove)
        });
    
    
        const filterButton = document.getElementById('filterButton');
        const inputFire = () => {
            addToDoNotSuspendList(document.getElementById('filterInput').value);
            location.reload();
        }
        filterButton.addEventListener('click',inputFire)
        
      });

    const filterList = document.getElementById('filterList');
    const remove = (elem) => {
        chrome.runtime.sendMessage({action:"remove", value: elem.target.value},() => {
            console.log("Trigered remove")
            location.reload();
          });
    }
});