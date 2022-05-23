let getTreeFromHTML = () => {
    let result = [];
    const group = 'jobs_index-search-widgets-profession_name-'
    for (let i = 0; i < 16; i++) {
        const parent = document.querySelector(`span[data-testid=${group}${i}-trigger`).innerText;
        const children = Array.from(document.querySelectorAll(`div[data-testid=${group}${i}-results] span.ais-RefinementList-labelText`)).map(child => child.innerText); 
        result.push({ label: parent, children: children });
    }
    console.log(JSON.stringify(result,null,2));
}
getTreeFromHTML();