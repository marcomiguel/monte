export const fileSize = (size) => {
  var cutoff, i, selectedSize, selectedUnit, unit, units, _i, _len, filesizeBase;
  filesizeBase = 1024;
  selectedSize = 0;
  selectedUnit = "b";
  size = parseFloat(size) || 0;
  if (size > 0) {
    units = ['TB', 'GB', 'MB', 'KB', 'b'];
    for (i = _i = 0, _len = units.length; _i < _len; i = ++_i) {
      unit = units[i];
      cutoff = Math.pow(filesizeBase, 4 - i) / 10;
      if (size >= cutoff) {
        selectedSize = size / Math.pow(filesizeBase, 4 - i);
        selectedUnit = unit;
        break;
      }
    }
    selectedSize = Math.round(10 * selectedSize) / 10;
  }
  return selectedSize + " " + selectedUnit;
};