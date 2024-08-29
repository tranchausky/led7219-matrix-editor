// script.js

document.addEventListener("DOMContentLoaded", function() {
    const addTableButton = document.getElementById("add-table");
    const exportTablesButton = document.getElementById("export-tables");
    const playexportButton = document.getElementById("playexport");
    const tablesContainer = document.getElementById("tables-container");
    const exportedDataPre = document.getElementById("exported-data");

    function createTable() {
        const tableContainer = document.createElement("div");
        tableContainer.style.position = "relative";

        const table = document.createElement("table");

        for (let i = 0; i < 8; i++) {
            const row = document.createElement("tr");

            for (let j = 0; j < 8; j++) {
                const cell = document.createElement("td");
                cell.textContent = `${i + 1},${j + 1}`;
                cell.addEventListener("click", function () {
                    cell.classList.toggle("active");
                });
                row.appendChild(cell);
            }
            table.appendChild(row);
        }

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove Table";
        removeButton.className = "remove-table";
        removeButton.addEventListener("click", function () {
            tablesContainer.removeChild(tableContainer);
        });

        tableContainer.appendChild(removeButton);
        tableContainer.appendChild(table);
        tablesContainer.appendChild(tableContainer);
    }
var playInterval;
var timeplay = 500;
    function playExports() {
        console.log('play')
        const length = document.querySelectorAll('#exported-data > div').length;
        if(length <=1){
            return;
        }

         if (playInterval) {
            //$('#play-button-stop').hide();
            //$('#play-button-play').show();
            playexportButton.innerHTML = 'Play Export';
            clearInterval(playInterval);
            playInterval = null;
        } else {
            playexportButton.innerHTML = 'Stop';
            playInterval = setInterval(function () {
                var indexActiveNow = findActiveIndexExport();
                
                var nexIndex = indexActiveNow+1;
                if(nexIndex >=length){
                    nexIndex = 0;
                }
                const exportedDataDivs = document.querySelectorAll('#exported-data > div');
                exportedDataDivs.forEach(div => {
                    div.classList.remove('active');
                });
                console.log(nexIndex);
                exportedDataDivs[nexIndex].classList.add('active');
                //return;
                showAtExportActive();
                // if(indexActiveNow <0){
                //     indexActiveNow = 0;
                // }
                
                
                //console.log(indexActive)

            },timeplay);
        }
    }
    function showAtExportActive(){
        // const importBinaryElements = document.querySelectorAll('#exported-data > div.active > .import-binary');
        // const importBinaryElementsAtParent = document.querySelectorAll('#exported-data > div.active');
        // Process each element
        //importBinaryElements.forEach(element => {
            //console.log("Import binary element found:", element);
            //at one
         //   importData(element.textContent,importBinaryElementsAtParent);
       // });
       var content =document.querySelectorAll('#exported-data > div.active > .import-binary')[0].textContent;
       var atActive = document.querySelectorAll('#exported-data > div.active')[0];
      importData(content,atActive);
    }

    // function activePlay(){
    //     const importBinaryElements = document.querySelectorAll('.import-binary');
    //     importBinaryElements.forEach(element => {
    //         console.log(element.textContent); // Example: Log the text content of each element
    //     });
    // }
 

    function exportTables() {
        const tables = tablesContainer.querySelectorAll("table");
        let exportData = "";
        const tableCount = tables.length;
        const rowCount = 8; // Number of rows per table
        const colCount = 8; // Number of columns per table

        for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
            let rowData = "";
            tables.forEach((table, tableIndex) => {
                const rows = table.querySelectorAll("tr");
                const cells = rows[rowIndex].querySelectorAll("td");
                const rowValues = Array.from(cells).map(cell => cell.classList.contains("active") ? "1" : "0");
                rowData += rowValues.join(",") + (tableIndex < tableCount - 1 ? "," : "");
            });
            exportData += rowData + "\n";
        }

        const newLine = document.createElement("div");
        // newLine.textContent = exportData;
        newLine.draggable = true; // Make div draggable

        const importspanContent = document.createElement("span");
        importspanContent.textContent = exportData;
        importspanContent.className = "import-binary";
        importspanContent.setAttribute('title', "Binary row");
        importspanContent.addEventListener("click", function () {
            copyTextToClipboard(importspanContent.textContent);
        });

        const importHexContent = document.createElement("span");
        importHexContent.textContent = binaryToHex_RowData(exportData);
        importHexContent.className = "import-hex";
        importHexContent.setAttribute('title', "Hex row birnary");
        importHexContent.addEventListener("click", function () {
            copyTextToClipboard(importHexContent.textContent);
        });

        const importHexContentCol = document.createElement("span");
        importHexContentCol.textContent = dataToHex_ColData(exportData);
        importHexContentCol.className = "import-hex-col";
        importHexContentCol.setAttribute('title', "Hex col birnary");
        importHexContentCol.addEventListener("click", function () {
            copyTextToClipboard(importHexContentCol.textContent);
        });

        var hex = binaryToHex_RowData(removeLineComma(exportData));
        console.log(hex)


        const importButton = document.createElement("span");
        importButton.textContent = " [Import]";
        importButton.className = "import-line";
        importButton.addEventListener("click", function () {
            importData(exportData, newLine);
        });

        const removeLink = document.createElement("span");
        removeLink.textContent = " [Remove]";
        removeLink.className = "remove-line";
        removeLink.addEventListener("click", function () {
            exportedDataPre.removeChild(newLine);
        });

        newLine.appendChild(importspanContent);
        newLine.appendChild(importHexContent);
        newLine.appendChild(importHexContentCol);
        newLine.appendChild(importButton);
        newLine.appendChild(removeLink);
        exportedDataPre.appendChild(newLine);

        // Add drag and drop event listeners
        addDragAndDropHandlers(newLine);

        const elements = document.querySelectorAll('.import-hex-col');
        const htmlString = Array.from(elements)
        .map(element => element.innerHTML)
        .join(',');
        document.getElementById('export-hex-col').value = htmlString;
    }

    function copyTextToClipboard(text) {
        // Use the Clipboard API to copy the text
        navigator.clipboard.writeText(text)
            .then(() => {
                // Show the toast notification
                showToast('Text copied to clipboard!');
            })
            .catch(err => {
                // If an error occurs
                console.error('Failed to copy text: ', err);
            });
    }

    // Function to show toast notification
    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');

        // Hide the toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    function addDragAndDropHandlers(line) {
        line.addEventListener("dragstart", function (e) {
            e.target.classList.add("dragging");
        });

        line.addEventListener("dragend", function (e) {
            e.target.classList.remove("dragging");
        });

        line.addEventListener("dragover", function (e) {
            e.preventDefault();
            const draggingElement = document.querySelector(".dragging");
            const afterElement = getDragAfterElement(exportedDataPre, e.clientY);
            if (afterElement == null) {
                exportedDataPre.appendChild(draggingElement);
            } else {
                exportedDataPre.insertBefore(draggingElement, afterElement);
            }
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll("div:not(.dragging)")];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function importData(data, newLine) {
        const exportedDataDivs = document.querySelectorAll('#exported-data > div');
        // Iterate over each div and remove the 'active' class
        exportedDataDivs.forEach(div => {
            div.classList.remove('active');
        });
        
        newLine.className = "active";
        tablesContainer.innerHTML = ""; // Clear existing tables

        const lines = data.trim().split("\n");
        if (lines.length === 0) return;

        // Calculate number of tables needed
        const rowCount = 8; // Number of rows per table
        const colCount = 8; // Number of columns per table
        const cellsPerTable = rowCount * colCount;
        const totalCells = lines.reduce((sum, line) => sum + (line ? line.split(",").length : 0), 0);
        const tableCount = Math.ceil(totalCells / cellsPerTable);

        // console.log(tableCount)
        for (let tableIndex = 0; tableIndex < tableCount; tableIndex++) {
            createTable();
        }
    // console.log(lines);
        for (let line = 0; line < lines.length; line++) {
            const rowData = lines[line].split(",");
            // console.log(rowData)
            var atindexTable;
            var atvalue;
            for (let col = 0; col < rowData.length; col++) {
                atindexTable = Math.ceil((col+1)/8)-1;
                atvalue = rowData[col];
                // console.log(atindexTable,atvalue,line,col)
                if(atvalue == '1'){
                    var atline = line;
                    var atcol = col-(8*atindexTable)
                    triggerCellClick(atindexTable,atline,atcol)
                }
            }
        }
        return;

        let cellIndex = 0;

        for (let tableIndex = 0; tableIndex < tableCount; tableIndex++) {
            const table = document.createElement("table");

            for (let row = 0; row < rowCount; row++) {
                const tableRow = document.createElement("tr");

                for (let col = 0; col < colCount; col++) {
                    const cell = document.createElement("td");
                    let cellValue = "0"; // Default value
                    if (lines[cellIndex]) {
                        const rowData = lines[cellIndex].split(",");
                        cellValue = rowData[col] || "0"; // Get value or default to "0"
                    }
                    cell.classList.toggle("active", cellValue === "1");
                    cell.textContent = `${row + 1},${col + 1}`; // Example content
                    tableRow.appendChild(cell);
                    cellIndex++;
                }

                table.appendChild(tableRow);
            }

            tablesContainer.appendChild(table);
        }
    }

    addTableButton.addEventListener("click", createTable);
    exportTablesButton.addEventListener("click", exportTables);
    playexportButton.addEventListener("click", playExports);

    // Initial table
    createTable();
});

function triggerCellClick(atindexTable,rowIndex, colIndex) {
    console.log(atindexTable,rowIndex, colIndex)
    // Find the cell based on row and column indices
    const tables = document.querySelectorAll("table");
    var attable = 0;
    for (let table of tables) {
        if(atindexTable == attable){
            const rows = table.querySelectorAll("tr");
            if (rowIndex < rows.length) {
                const cells = rows[rowIndex].querySelectorAll("td");
                if (colIndex < cells.length) {
                    const cell = cells[colIndex];
                    cell.click(); // Trigger the click event
                    return; // Exit the function after triggering the click
                }
            }
        }
        
        attable++;
    }
}

function findActiveIndexExport() {
    // Select all div elements within #exported-data
    const exportedDataDivs = document.querySelectorAll('#exported-data > div');
    
    // Iterate over each div to find the index of the one with 'active' class
    let index = -1; // Default to -1 if no active class is found
    exportedDataDivs.forEach((div, idx) => {
        if (div.classList.contains('active')) {
            index = idx;
        }
    });
    
    return index;
}

function hexToBinary(hexString) {
    let binaryString = "";

    // Loop through the hex string in steps of 2 to process each byte
    for (let i = 0; i < hexString.length; i += 2) {
        // Extract a byte (2 hex characters)
        let hexByte = hexString.substring(i, i + 2);
        // Convert the hex byte to a decimal number
        let decimalValue = parseInt(hexByte, 16);
        // Convert the decimal number to an 8-bit binary string
        let binaryValue = decimalValue.toString(2).padStart(8, '0');
        // Append the 8-bit binary string to the result
        binaryString += binaryValue;
    }

    return binaryString;
}

function binaryToHex_RowData(binary) {
    binary = removeLineComma(binary);
    let hex = '';

    // Loop through each group of 8 bits in the binary string
    for (let i = 0; i < binary.length; i += 8) {
        // Get the binary byte (8 characters)
        const binaryByte = binary.substring(i, i + 8);
        // Convert binary byte to decimal
        const decimalValue = parseInt(binaryByte, 2);
        // Convert decimal to hexadecimal and pad with a leading zero if necessary
        const hexByte = decimalValue.toString(16).toUpperCase().padStart(2, '0');
        // Append to the hex string
        hex += hexByte;
    }

    return hex;
}
function dataToHex_ColData(inputData){
    console.log(inputData)
    const rows = inputData.split('\n').map(row => row.split(',').map(Number));
    console.log(rows)
    // Initialize an array for the columns
    const cols = Array.from({ length: rows[0].length }, () => []);

    // Fill the columns array by transposing the rows array
    for (let i = 0; i < rows.length; i++) {
        if(rows[i].length >1){
            for (let j = 0; j < rows[i].length; j++) {
                cols[j][i] = rows[i][j];
            }
        }
    }
console.log(cols)
    // Convert each column to a binary string and then to a hexadecimal value
const hexValues = cols.map(col => {
    // Convert column array to binary string
    const binaryString = col.join('');
    console.log(binaryString)
    // Ensure the binary string is interpreted as an 8-bit number
    const hexValue = parseInt(binaryString, 2).toString(16).toUpperCase().padStart(2, '0');
    
    return hexValue;
});
    console.log(hexValues)
    var str = hexValues.join('');
    return str;
}
function removeLineComma(inputString){
    return inputString.replace(/[\n\r,]/g, '');
}
