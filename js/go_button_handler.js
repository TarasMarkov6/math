document.addEventListener("DOMContentLoaded", fillInputs);

const btn = document.querySelector("button");
btn.addEventListener('click', () => {
    if ( checkAndSaveInputsData() ) window.open('./html/test.html','_self');
});

function checkAndSaveInputsData () {
    let radios = [...document.querySelectorAll('input')];
    let optionsData = {};
    while (radios.length != 0) {
        const inputName = radios[0].name;
        const value = getInputValue(radios, inputName);
        
        if (value == undefined) return false;

        writeInputValue (inputName, value, optionsData);
        radios = radios.filter(item => item.name != inputName);
    }
    
    let json = createJSON(optionsData);
    localStorage.setItem('optionsData', json);
    
    return true;
}

function getInputValue (radios, inputName) {
    let value;
    const currentNameRadioArray = radios.filter(item => item.name == inputName);
    currentNameRadioArray.forEach(item => {
        if (item.checked) value = item.value;
    });

    return value;
}

function writeInputValue (inputName, value, optionsData) {
    optionsData[inputName] = value;
}

function createJSON (optionsData) {
    const json = JSON.stringify(optionsData);
    return json;
}

function fillInputs () {
    const jsonFromStorage = localStorage.getItem('optionsData');
    if (jsonFromStorage) {
        const dataFromStorage = JSON.parse(jsonFromStorage);
        const radios = [...document.querySelectorAll('input')];
        for (let key in dataFromStorage) {
            const currentRadio = radios.filter(item => item.name == key && item.value == dataFromStorage[key]);
            currentRadio[0].checked = "true";
        }
    }
}


