var SBpath = './assets/lib/';
var SBtheme = 'default';
var SBGridProperties = {
  width : '100%',
  fixedrowheight : '44',
  rowheight : '44',
  explorerbar : 'sort',
  extendlastcol : 'scroll',
  emptyrecords : '조회 결과가 없습니다.',
  checkboximage : true,
  radioimage : true,
};

var SBCustomFunction = {
  aftersort : function(datagrid){
    var sortingInfo = datagrid.getSortingInfo();
    var rowsLength = datagrid.getRows();
    var colsLength = datagrid.getCols();
    var rowIndex = 0;
    var colIndex = 0;
    var cellElement = null;
    var columns = datagrid.getColumns();
    var currentColIndex = -1;

    if (sortingInfo.length){
      for(var columnIndex = 0; columnIndex < columns.length; columnIndex++){
        if (columns[columnIndex].ref === sortingInfo[0]){
          currentColIndex = columnIndex;
        }
      }
    }

    for(rowIndex = 0; rowIndex < rowsLength; rowIndex++){
      for(colIndex = 0; colIndex < colsLength; colIndex++){
        cellElement = datagrid.getCellHTML(rowIndex, colIndex);
        if (cellElement){
          cellElement.className = cellElement.className.replace(/ is-(sort|desc|asc)/g, '');
          if (
            colIndex === currentColIndex
            && !(
              columns[0].caption.length > 1
              && rowIndex === 0
              && cellElement.getAttribute('colspan')
              && !cellElement.getAttribute('rowspan')
            )
          ){
            cellElement.className += ' is-sort'+' is-'+sortingInfo[1];
          }
        }
      }
    }
  },
};