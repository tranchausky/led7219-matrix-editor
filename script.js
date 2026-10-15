
// script.js
var isMouseDown = false;
var matrixWidth = 8;
var matrixHeight = 8;
document.addEventListener("DOMContentLoaded", function() {
    const addTableButton = document.getElementById("add-table");
    const exportTablesButton = document.getElementById("export-tables");
    const playexportButton = document.getElementById("playexport");
    const tablesContainer = document.getElementById("tables-container");
    const exportedDataPre = document.getElementById("exported-data");
    const zoomOutButton = document.getElementById('zoom-out');
    const zoomInButton = document.getElementById('zoom-in');
    const zoomLevel = document.getElementById('zoom-level');
    let tableZoom = 100;
    function setTableZoom(percent) {
        const viewport = document.getElementById('tables-viewport');
        const previousZoom = tableZoom;
        tableZoom = Math.max(25, Math.min(200, percent));
        tablesContainer.style.zoom = tableZoom / 100;
        viewport.scrollLeft *= tableZoom / previousZoom;
        zoomLevel.textContent = tableZoom + '%';
        zoomOutButton.disabled = tableZoom === 25;
        zoomInButton.disabled = tableZoom === 200;
    }
    zoomOutButton.addEventListener('click', () => setTableZoom(tableZoom - 25));
    zoomInButton.addEventListener('click', () => setTableZoom(tableZoom + 25));
    document.getElementById('zoom-reset').addEventListener('click', () => setTableZoom(100));

    function createTable() {
        const tableContainer = document.createElement("div");
        tableContainer.style.position = "relative";

        const table = document.createElement("table");

        for (let i = 0; i < matrixHeight; i++) {
            const row = document.createElement("tr");

            for (let j = 0; j < matrixWidth; j++) {
                const cell = document.createElement("td");
                cell.textContent = `${i + 1},${j + 1}`;
                cell.addEventListener("click", function () {
                    cell.classList.toggle("active");
                    // isMouseDown = !isMouseDown;
                });
                cell.addEventListener("dblclick", function () {
                    // cell.classList.toggle("active");
                    isMouseDown = !isMouseDown;
                });
                // cell.addEventListener('mouseover', function () {
                //     cell.classList.toggle("active");
                // });
                cell.addEventListener('mousedown', function (event) {
                    if (event.button === 0) { // Check if the left mouse button (button 0) is pressed
                        //isMouseDown = true; // Set mouse down state to true
                        // cell.classList.toggle("active");
                    }
                });
                cell.addEventListener('mouseenter', function () {
                    if (isMouseDown) { // If mouse button is still held down, toggle 'active' class
                        cell.classList.toggle('active');
                    }
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

        const emptyButton = document.createElement("button");
        emptyButton.textContent = "Empty";
        emptyButton.className = "empty-table";
        emptyButton.addEventListener("click", function () {
            // tablesContainer.removeChild(tableContainer);
            const cells = tableContainer.querySelectorAll('td');
            cells.forEach(cell => {
                cell.classList.remove('active'); // Remove 'active' class if present
            });
        });

        tableContainer.appendChild(removeButton);
        tableContainer.appendChild(emptyButton);
        tableContainer.appendChild(table);
        tablesContainer.appendChild(tableContainer);

        // addToggleEffect();
    }
    var playInterval;
    var timeplay = 500;
    function playExports() {
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
        if (!tables.length) return;
        let exportData = "";
        const tableCount = tables.length;
        const rowCount = matrixHeight; // Number of rows per table
        const colCount = matrixWidth; // Number of columns per table

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

        elementForExport(exportData);
    }
    function elementForExport(exportData){
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
            stopPlayback();
            getToLink();
        });

        newLine.appendChild(importspanContent);
        newLine.appendChild(importHexContent);
        newLine.appendChild(importHexContentCol);
        newLine.appendChild(importButton);
        newLine.appendChild(removeLink);
        exportedDataPre.appendChild(newLine);

        // Add drag and drop event listeners
        addDragAndDropHandlers(newLine);

        
        getToLink();
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
            getToLink();
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
        const rowCount = matrixHeight; // Number of rows per table
        const colCount = matrixWidth; // Number of columns per table
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
                atindexTable = Math.floor(col / matrixWidth);
                atvalue = rowData[col];
                // console.log(atindexTable,atvalue,line,col)
                if(atvalue == '1'){
                    var atline = line;
                    var atcol = col-(matrixWidth*atindexTable)
                    triggerCellClick(atindexTable,atline,atcol)
                }
            }
        }
    }

    /**
     * with v set content for view restore
     */
    function getLinkVersion(){
        const urlParams = new URLSearchParams(window.location.search);
        var atV = urlParams.get('v');
        const w = Number(urlParams.get('w') || 8);
        const h = Number(urlParams.get('h') || 8);
        if (!validSize(w, h)) throw new Error('Invalid matrix size in link');
        matrixWidth = w;
        matrixHeight = h;
        updateSizeInputs();
        if(atV){
            //console.log(reverseConvertString(atV));
            var listHexCol = reverseConvertString(atV);
            const lines = listHexCol.trim().split(",");

            const decodedFrames = lines.map(hexToData_ColData);
            decodedFrames.forEach(elementForExport);
            //click import to view first
            const importLines = document.querySelectorAll('.import-line');
            if (importLines.length > 0) {
                const firstImportLine = importLines[0];
                firstImportLine.click();
            }
        }
    }

    addTableButton.addEventListener("click", createTable);
    exportTablesButton.addEventListener("click", exportTables);
    playexportButton.addEventListener("click", playExports);

    function validSize(w, h) {
        return Number.isInteger(w) && Number.isInteger(h) && w >= 1 && w <= 128 && h >= 1 && h <= 128;
    }
    function updateSizeInputs() {
        document.getElementById('matrix-width').value = matrixWidth;
        document.getElementById('matrix-height').value = matrixHeight;
    }
    function stopPlayback() {
        clearInterval(playInterval);
        playInterval = null;
        playexportButton.textContent = 'Play Export';
    }
    function resizeData(data, oldWidth, width, height) {
        const rows = data.trim().split('\n').map(row => row.split(','));
        const count = Math.ceil(rows[0].length / oldWidth);
        return Array.from({length: height}, (_, y) => Array.from({length: count * width}, (_, x) => {
            const localX = x % width;
            return localX < oldWidth ? (rows[y]?.[Math.floor(x / width) * oldWidth + localX] || '0') : '0';
        }).join(',')).join('\n');
    }
    function applySize() {
        const width = Number(document.getElementById('matrix-width').value);
        const height = Number(document.getElementById('matrix-height').value);
        if (!validSize(width, height)) return;
        stopPlayback();
        const current = Array.from(tablesContainer.querySelectorAll('table')).map(table =>
            Array.from(table.querySelectorAll('tr')).map(row => Array.from(row.children).map(cell => cell.classList.contains('active') ? '1' : '0')));
        const frames = Array.from(exportedDataPre.querySelectorAll('.import-binary')).map(el => resizeData(el.textContent, matrixWidth, width, height));
        matrixWidth = width;
        matrixHeight = height;
        tablesContainer.innerHTML = '';
        current.forEach(rows => {
            createTable();
            const table = tablesContainer.lastElementChild.querySelector('table');
            Array.from(table.querySelectorAll('tr')).forEach((row, y) => Array.from(row.children).forEach((cell, x) => cell.classList.toggle('active', rows[y]?.[x] === '1')));
        });
        exportedDataPre.innerHTML = '';
        frames.forEach(elementForExport);
        getToLink();
    }
    document.getElementById('matrix-size').addEventListener('submit', event => { event.preventDefault(); applySize(); });
    document.getElementById('preset-p10').addEventListener('click', () => {
        document.getElementById('matrix-width').value = 32;
        document.getElementById('matrix-height').value = 16;
        applySize();
    });
    document.getElementById('share-link').addEventListener('click', () => {
        // Include the current drawing if it differs from the exported frames.
        const before = exportedDataPre.children.length;
        exportTables();
        if (exportedDataPre.children.length > before) {
            const last = exportedDataPre.lastElementChild;
            const duplicate = Array.from(exportedDataPre.children).slice(0, -1).some(frame => frame.querySelector('.import-binary').textContent === last.querySelector('.import-binary').textContent);
            if (duplicate) last.remove();
        }
        getToLink();
        copyTextToClipboard(window.location.href);
    });

    // Initial table
    createTable();
    createTable();
    createTable();
    createTable();
    // addToggleEffect();

    try {
        getLinkVersion();
        if (!exportedDataPre.children.length) {
            tablesContainer.innerHTML = "";
            for (let i = 0; i < 4; i++) createTable();
        }
    } catch (error) {
        showToast('Cannot open this link: ' + error.message);
    }
});

function triggerCellClick(atindexTable,rowIndex, colIndex) {
    // Find the cell based on row and column indices
    const tables = document.querySelectorAll("table");
    var attable = 0;
    for (let table of tables) {
        if(atindexTable == attable){
            const rows = table.querySelectorAll("tr");
            // console.log(rows);
            if (rowIndex < rows.length) {
                const cells = rows[rowIndex].querySelectorAll("td");
                // console.log(cells);
                if (colIndex < cells.length) {
                    const cell = cells[colIndex];
                    // console.log(cell);
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
function dataToHex_ColData(inputData) {
    const rows = inputData.trim().split('\n').map(row => row.split(','));
    return rows[0].map((_, x) => {
        const bits = rows.map(row => row[x]).join('');
        return BigInt('0b' + bits).toString(16).toUpperCase().padStart(Math.ceil(rows.length / 8) * 2, '0');
    }).join('');
}
function removeLineComma(inputString){
    return inputString.replace(/[\n\r,]/g, '');
}

function hexToData_ColData(hexString) {
    const digits = Math.ceil(matrixHeight / 8) * 2;
    if (!/^[0-9a-f]+$/i.test(hexString) || hexString.length % (digits * matrixWidth) !== 0 || hexString.length > 1048576) {
        throw new Error('Invalid frame data');
    }
    const columns = [];
    for (let i = 0; i < hexString.length; i += digits) {
        columns.push(BigInt('0x' + hexString.slice(i, i + digits)).toString(2).padStart(matrixHeight, '0').slice(-matrixHeight));
    }
    return Array.from({length: matrixHeight}, (_, y) => columns.map(col => col[y]).join(',')).join('\n');
}

//////////////////////////
//hex to mini
function convertString(input) {
    let result = '';
    let countF = 0;
    let count0 = 0;

    for (let i = 0; i < input.length; i++) {
        if (input[i] === 'F') {
            if (count0 > 0) {
                // Process '0' sequence
                result += count0 > 4 ? `y${count0}y` : '0'.repeat(count0);
                count0 = 0;
            }
            countF++;
        } else if (input[i] === '0') {
            if (countF > 0) {
                // Process 'F' sequence
                result += countF > 4 ? `u${countF}u` : 'F'.repeat(countF);
                countF = 0;
            }
            count0++;
        } else {
            // Handle any other characters
            if (countF > 0) {
                result += countF > 4 ? `u${countF}u` : 'F'.repeat(countF);
                countF = 0;
            }
            if (count0 > 0) {
                result += count0 > 4 ? `y${count0}y` : '0'.repeat(count0);
                count0 = 0;
            }
            result += input[i];
        }
    }

    // Process any remaining 'F' or '0' sequences
    if (countF > 0) {
        result += countF > 4 ? `u${countF}u` : 'F'.repeat(countF);
    }
    if (count0 > 0) {
        result += count0 > 4 ? `y${count0}y` : '0'.repeat(count0);
    }

    return result;
}

//mini to hex
function reverseConvertString(input) {
    let result = '';
    let i = 0;

    while (i < input.length) {
        if (input[i] === 'u' || input[i] === 'y') {
            let char = input[i];
            let j = i + 1;
            // Find the end of the number sequence
            while (j < input.length && !isNaN(input[j])) {
                j++;
            }
            if (j < input.length && input[j] === char) {
                // Extract the number and repeat the character
                const count = parseInt(input.slice(i + 1, j), 10);
                if (!Number.isSafeInteger(count) || count > 1048576 || result.length + count > 1048576) throw new Error('Link is too large');
                result += char === 'u' ? 'F'.repeat(count) : '0'.repeat(count);
                i = j + 1;
            } else {
                // Handle invalid format
                result += char;
                i++;
            }
        } else {
            result += input[i];
            i++;
        }
    }

    return result;
}

function getToLink(){
    const elements = document.querySelectorAll('.import-hex-col');
    const htmlString = Array.from(elements)
    .map(element => element.innerHTML)
    .join(',');
    document.getElementById('export-hex-col').value = htmlString;
    //htmlString = htmlString.replace(/,/g, ''); //xoa cac phay
    var mini = convertString(htmlString);
    document.getElementById('export-hex-mini').value = mini;

    // var linkat = window.location.href;
    // var newLink = linkat+'&v='+mini
    // console.log(newLink);

    var baseUrl = window.location.href;
    let url = new URL(baseUrl);
    let params = new URLSearchParams(url.search);
    params.set('v', mini);
    params.set('w', matrixWidth);
    params.set('h', matrixHeight);
    url.search = params.toString();
    let updatedUrl = url.toString();

    //const newUrl = 'https://code.home3w.com/viewhtml/?code=cBFugrwWTpx9&v=8y15y111';
    window.history.replaceState({ path: updatedUrl }, '', updatedUrl);
}


