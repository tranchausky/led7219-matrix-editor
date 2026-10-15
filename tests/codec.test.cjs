const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({ document: { addEventListener() {} } });
vm.runInContext(fs.readFileSync('script.js', 'utf8'), context);
for (const [width, height, panels] of [[8,8,4],[32,16,1],[32,16,2],[13,9,2],[1,1,1],[1,65,1],[128,128,1]]) {
    context.matrixWidth = width;
    context.matrixHeight = height;
    const data = Array.from({length: height}, (_, y) => Array.from({length: width * panels}, (_, x) => (x * 7 + y * 3) % 11 < 4 ? '1' : '0').join(',')).join('\n');
    const hex = context.dataToHex_ColData(data);
    assert.equal(hex.length, width * panels * Math.ceil(height / 8) * 2);
    assert.equal(context.hexToData_ColData(context.reverseConvertString(context.convertString(hex))), data);
}
context.matrixWidth = 8;
context.matrixHeight = 8;
assert.equal(context.dataToHex_ColData(context.hexToData_ColData('2141FF0101000000')), '2141FF0101000000');
assert.throws(() => context.hexToData_ColData('invalid'));
assert.throws(() => context.hexToData_ColData('FF'));
assert.throws(() => context.reverseConvertString('y999999999y'));
console.log('PASS: pixel round trips, multiple panels, legacy 8x8, odd sizes, 128x128, invalid links');
