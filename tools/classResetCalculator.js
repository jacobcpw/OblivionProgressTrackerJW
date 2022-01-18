"use strict";

const ATTRIBUTES = {
    "strength"    : "Strength",
    "intelligence": "Intelligence",
    "willpower"   : "Willpower",
    "agility"     : "Agility",
    "speed"       : "Speed",
    "endurance"   : "Endurance",
    "personality" : "Personality",
    "luck"        : "Luck"
};

var favoredAttribute1Name = ATTRIBUTES.strength;
var favoredAttribute2Name = ATTRIBUTES.speed;
var resetLevel = 1;

async function init(){
    //make sure skill names n stuff are loaded first
    await loadJsonData("..");

    initCharacterFields();
    initAttributes();

    initSkills();
    

    //finally, after setup is done, update for the first time.
    onUpdate();
}

/**
 * Initialize the values in the "character" section of the calculator.
 */
function initCharacterFields(){
    const resetLevelField = document.getElementById("inputResetLevel");
    resetLevelField.addEventListener('change',()=>{
        resetLevel = resetLevelField.value;
        onUpdate();
    });
    //...and update initial value from html:
    resetLevel = resetLevelField.value;
}

/**
 * Populate attribute names in favored attribute dropdowns and add rows to base/leveled stats.
 * Additionally set up onChange formats for attributes.
 */
function initAttributes(){
    //attributes need to be populated in 3 places: favored attribute 1, favored attribute 2, and base/lvld stats.
    const favoredAttribute1Element = document.getElementById("inputAttr1");
    const favoredAttribute2Element = document.getElementById("inputAttr2");
    const attributeTable = document.getElementById("attributeTable");
    for(const attribName in ATTRIBUTES){
        const attrib = ATTRIBUTES[attribName];
        let e = document.createElement("OPTION");
        e.value = attrib;
        e.innerText = attrib;
        favoredAttribute1Element.appendChild(e);

        let f = document.createElement("OPTION");
        f.value = attrib;
        f.innerText = attrib;
        favoredAttribute2Element.appendChild(f);

        //for the table, we ahve to create more framework stuff.
        let tableRow = document.createElement("TR");

        let cellAttributeName = document.createElement("TD");
        cellAttributeName.innerText = attrib;
        tableRow.appendChild(cellAttributeName);

        let cellAttributeBase = document.createElement("TD");
        cellAttributeBase.id = attrib + "_base";
        cellAttributeBase.innerText = 0;
        tableRow.appendChild(cellAttributeBase);

        let cellAttributeLeveled = document.createElement("TD");
        cellAttributeLeveled.id = attrib + "_leveled";
        cellAttributeLeveled.innerText = 0;
        tableRow.appendChild(cellAttributeLeveled);

        attributeTable.appendChild(tableRow);
    }
    //while we're here, set up onChange() handlers to update favoredAttribute variables when they are changed in the html.
    favoredAttribute1Element.addEventListener('change', ()=>{
        favoredAttribute1Name = favoredAttribute1Element.value;
        onUpdate();
    });
    favoredAttribute2Element.addEventListener('change', ()=>{
        favoredAttribute2Name = favoredAttribute2Element.value;
        onUpdate();
    });
    //finally, set the default values of the skill elements.
    favoredAttribute1Element.value = favoredAttribute1Name;
    favoredAttribute2Element.value = favoredAttribute2Name;
}

//put skill checkboxes here first so we can sort them alphabetically
var skillCheckboxContainers = [];
var skillTableRows = [];

function initSkills(){
    //populate 'major skill' checkboxes
    runOnTree(jsondata.skill, initSingleSkill);
    //children[1] is the label, so we can sort on that
    skillCheckboxContainers.sort((a,b)=>a.children[1].innerText > b.children[1].innerText);

    let majorSkillsCheckboxesElement = document.getElementById("majorSkillsCheckboxes");
    for(var container of skillCheckboxContainers){
        majorSkillsCheckboxesElement.appendChild(container);
    }

    //first sort by governing attrib, then by specialization
    skillTableRows.sort((a,b)=>a.children[0].innerText > b.children[0].innerText);
    //TODO: uncomment after we add specialization
    //skillTableRows.sort((a,b)=>a.children[1].innerText > b.children[1].innerText);

    const skillTable = document.getElementById("skillTable");
    for(var row of skillTableRows){
        skillTable.appendChild(row);
    }
}


function initSingleSkill(skill){
    //the checkbox and its text aren't associated, so we have to wrap them in another element so they're next to each other
    let skillCheckboxWrapper = document.createElement("DIV");

    //create the actual checkbox that can be clicked.
    let skillCheckbox = document.createElement("INPUT");
    skillCheckbox.type = "checkbox";
    //to reference this checkbox later, do document.getElementById with this ID
    skillCheckbox.id = "skill"+skill.formId;
    skillCheckboxWrapper.appendChild(skillCheckbox);

    //create the label for the checkbox.
    let skillName = document.createElement("LABEL");
    skillName.for = "skill"+skill.formId;
    skillName.innerText = skill.name;
    skillCheckboxWrapper.appendChild(skillName);

    //finally, put the label+checkbox combination in the majorSkillsCheckboxes section
    skillCheckboxContainers.push(skillCheckboxWrapper);

    //TODO: update the "skills" table with elements
    //other things you can get from the 'skill' object: skill.parent.name for specialization, skill.attribute for attribute.
    let skillRow = document.createElement("TR");
    let skillGov = document.createElement("TD");
    skillGov.innerText = skill.attribute.substring(0,3);
    skillRow.appendChild(skillGov);
    //TODO: create other cells in the skill table

    //as with the checkboxes, we want to sort these by governing attribute, so put them in an array and then sort them later.
    skillTableRows.push(skillRow);
}

// called when user updates a value
function onUpdate(){
    //update all attribute calculations
    for(let attribute in ATTRIBUTES){
        updateAttribute(ATTRIBUTES[attribute]);
    }
}

function updateAttribute(attributeName){
    let baseValue = 40;
    if(favoredAttribute1Name == attributeName || favoredAttribute2Name == attributeName){
        baseValue +=5;
    }
    //TODO: other value stuff

    //TODO: leveled stuff
    let leveledValue = baseValue + (1 * resetLevel);

    document.getElementById(attributeName+"_base").innerText = baseValue;
    document.getElementById(attributeName+"_leveled").innerText = leveledValue;
    
}