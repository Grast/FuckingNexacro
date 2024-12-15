<script>
	import { onMount } from "svelte";
	import { writable, derived, get } from "svelte/store";

	import { formatter, parser, same, truthy } from "./util";
	
	import FnContainer from "./FnContainer.svelte";

	export let column;
	export let data;
	export let keyColumn;
	export let width;
	export let height;
	export let rowHeight;
	export let button;
	
	if(!Array.isArray(column)) {
		throw new Error("column 정보가 배열([])의 형태로 전달되지 않았습니다.");
	} else if(!column.length) {
		throw new Error("column 정보가 없습니다. 빈 배열로 전달된 것인지 확인해주세요.");
	} else if(!keyColumn) {
		throw new Error("keyColumn 이 명시되지 않았습니다. 필수정보입니다.");
	} else if(!column.find(item => item["key"] == keyColumn)) {
		throw new Error("column 목록 중에서 keyColumn 을 key 값으로 가지는 요소가 없습니다. keyColumn 은 column 에 포함되어있는 key 값 중 하나여야 합니다.");
	} else if(column.length != [ ...new Set(column.map(columnItem => columnItem.key)) ].length) {
		throw new Error("중복된 key 를 가진 다수의 열이 존재합니다.");
	} else if(column.length != [ ...new Set(column.map(columnItem => columnItem.text)) ].length) {
		throw new Error("중복된 text 를 가진 다수의 열이 존재합니다.");
	}

	try {
		column.filter(columnItem => columnItem["format"] && typeof(columnItem["format"]) == "function").map(columnItem => columnItem["format"](null));
	} catch(e) {
		throw new Error("열의 format 에 지정되는 모든 함수는 어떠한 열이라도 null 을 입력받았을 때 예외를 발생시키지 않아야 합니다.");
	}

	const uuid = "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16));
	let widthPxValue;
	const readonly = writable(false);
	const readonlyErrorMessage = "데이터그리드의 상태가 \"읽기전용\" 상태입니다.";
	const isTransactionEnabled = writable(false);
	const transactionErrorMessage = "트랜잭션 관리 상태가 아닙니다.";
	const columnList = writable(column);
	const columnWidthMap = derived(columnList, columnList => columnList.reduce((acc, cur) => {
		acc[cur.key] = writable(cur.width);

		return acc;
	}, {}));
	const columnMetaMap = derived(columnList, columnList => columnList.reduce((acc, cur) => {
		acc[cur.key] = cur.text;

		return acc;
	}, { "key": "_" }));
	const columnMetaList = derived(columnList, columnList => columnList.map(columnItem => ({ ...columnItem, "type": "string", "group": null, "format": value => value })));
	const columnShowList = writable(column);
	const pinVisibility = writable(true);
	const headerVisibility = writable(true);
	const buttonVisibility = writable(truthy(button));
	const dataList = writable([ ...data.map(dataItem => ({ ...dataItem })) ]);
	const checkedDataList = writable([]);
	const selectedDataList = writable([]);
	const rollbackDataList = writable([]);

	const pinColumn = writable(null);
	const pinColumnWidth = writable(50);
	const totalColumnWidth = derived([ columnShowList, columnWidthMap, pinColumnWidth ], ([ columnShowList, columnWidthMap, pinColumnWidth ]) => columnShowList.map(item => get(columnWidthMap[item.key])).reduce((acc, cur) => acc = acc + cur, 0) + pinColumnWidth + (button?.width || 0));
	onMount(() => {
		let resizeObserver = new ResizeObserver(([entry]) => {
			if($pinColumn) {
				pinColumnWidth.set(entry.contentRect.width);
			}
		});
		resizeObserver.observe($pinColumn);

		return () => resizeObserver?.disconnect();
	});

	/* BEGIN: data change event */
	let onDataChange = null;
	const safeOnDataChange = dataItem => {
		try {
			if(onDataChange && typeof(onDataChange) == "function") {
				onDataChange(dataItem);
			}
		} catch(e) {
			throw new Error("setOnDataChange 를 통해 전달된 함수에서 오류가 발생했습니다. setOnDataChange 을 통해 올바른 dataItem => void 함수로 재지정해주세요.", e);
		}
	};
	/* END: data change event */

	/* BEGIN: data check event */
	let onDataCheck = null;
	checkedDataList.subscribe(value => {
		try {
			if(onDataCheck && typeof(onDataCheck) == "function") {
				onDataCheck(value);
			}
		} catch(e) {
			throw new Error("setOnDataChecked 를 통해 전달된 함수에서 오류가 발생했습니다. setOnDataChecked 을 통해 올바른 dataList => void 함수로 재지정해주세요.", e);
		}
	});
	/* END: data check event */

	/* BEGIN: data select event */
	let onDataSelect = null;
	selectedDataList.subscribe(value => {
		try {
			if(onDataSelect && typeof(onDataSelect) == "function") {
				onDataSelect(value);
			}
		} catch(e) {
			throw new Error("setOnDataSelected 를 통해 전달된 함수에서 오류가 발생했습니다. setOnDataSelected 을 통해 올바른 dataList => void 함수로 재지정해주세요.", e);
		}
	});
	/* END: data select event */

	/* BEGIN: scroll event */
	const reportConfirmedWidth = value => {
		widthPxValue = value;
		scrollTop.set(0);
		scrollLeft.set(1);
		scrollLeft.set(0);
	};
	const scrollTop = writable(0);
	const scrollLeft = writable(0);
	const scrollRight = derived([ totalColumnWidth, scrollLeft ], ([ totalColumnWidth, scrollLeft ]) => totalColumnWidth - (Number(width) || widthPxValue) - scrollLeft + 4);
	const onScroll = event => {
		scrollTop.set(event.target.scrollTop);
		scrollLeft.set(event.target.scrollLeft);
	};
	/* END: scroll event */

	/* BEGIN: mouse enter & leave event */
	const mouseEnterColumn = writable(null);
	const mouseEnterData = writable(null);
	const mouseEnter = (columnKey, dataIndex) => {
		mouseEnterColumn.set(columnKey);
		mouseEnterData.set(dataIndex);
	};
	/* END: mouse enter & leave event */

	/* BEGIN: check all && select all function */
	const checkAll = event => checkedDataList.set(event.target.checked? $dataList: []);
	const checkItem = dataItem => {
		checkedDataList.set($checkedDataList.find(checkedDataItem => checkedDataItem[keyColumn] == dataItem[keyColumn])? $checkedDataList.filter(checkedDataItem => checkedDataItem[keyColumn] != dataItem[keyColumn]): [ ...$checkedDataList, dataItem ]);
	};
	const selectAll = () => selectedDataList.set($dataList);
	const deselectAll = () => {
		selectedDataList.set([]);
		clickedDataIndex = -1;
		clickedDataItem = null;
		multipleDataIndex = -1;
		multipleDataItem = null;
	};
	let clickedDataIndex = -1;
	let clickedDataItem = null;
	let multipleDataIndex = -1;
	let multipleDataItem = null;
	/* END: check all && select all function */

	/* BEGIN: key down & multiple select/deselect event */
	let onCtrlPressed = false;
	let onShiftPressed = false;
	let onAltPressed = false;
	const onKeydown = event => {
		if(!focused) {
			return false;
		}

		const { keyCode } = event;
		// Backspace: 8, Tab: 9
		// Enter: 13
		// Shift: 16, Ctrl: 17, Alt: 18, Escape: 27
		// Space: 32
		// PageUp: 33, PageDn: 34
		// End: 35, Home: 36
		// Left: 37, Up: 38, Right: 39, Down: 40
		// Insert: 45, Delete: 46
		// A: 65, C: 67, V: 86
		onCtrlPressed = event.ctrlKey || event.metaKey;
		onShiftPressed = event.shiftKey;
		onAltPressed = event.altKey;

		if(keyCode == 27) { // ESC
			event.preventDefault();
			checkAll({ target: { "checked": false }});
			deselectAll();
		} else if(keyCode == 32) { // Space
			event.preventDefault();
			$selectedDataList.forEach(selectedDataItem => checkItem(selectedDataItem));
			clickedDataIndex = -1;
			clickedDataItem = null;
			multipleDataIndex = -1;
			multipleDataItem = null;
		} else if(keyCode == 37) { // ArrowLeft
			event.preventDefault();

			if(onCtrlPressed) { // Ctrl + ArrowLeft
				event.preventDefault();
				document.querySelector(".fn_viewport").scrollTo({ "left": 0 });
			}
		} else if(keyCode == 38) { // ArrowUp
			event.preventDefault();

			if($dataList.length == 0) {
				return;
			}
			
			if(onCtrlPressed && onShiftPressed) { // Ctrl + Shift + ArrowUp
				const firstDataIndex = 0;
				const firstDataItem = $dataList[firstDataIndex];
				document.querySelector(".fn_viewport").scrollTo({ "top": 0 - ($headerVisibility? rowHeight: 0), "behavior": "smooth" });
				multipleDataIndex = firstDataIndex;
				multipleDataItem = firstDataItem;
				onItemClicked(event, firstDataItem, firstDataIndex);
			} else if(onCtrlPressed) { // Ctrl + ArrowUp
				const firstDataIndex = 0;
				document.querySelector(".fn_viewport").scrollTo({ "top": 0 - ($headerVisibility? rowHeight: 0), "behavior": "auto" });
				selectedDataList.set([ $dataList[firstDataIndex] ]);
				clickedDataIndex = firstDataIndex;
				clickedDataItem = $dataList[firstDataIndex];
				multipleDataIndex = clickedDataIndex;
				multipleDataItem = clickedDataItem;
			} else if(onShiftPressed) { // Shift + ArrowUp
				multipleDataIndex = Math.max(0, multipleDataIndex - 1);
				multipleDataItem = $dataList[multipleDataIndex];
				onItemClicked(event, multipleDataItem, multipleDataIndex);

				/** @type {HTMLElement} */ const el = document.querySelector("div.fn_row[data-index=\"" + multipleDataIndex + "\"]");
				if(el.offsetTop < $scrollTop + ($headerVisibility? rowHeight: 0)) {
					document.querySelector(".fn_viewport").scrollTo({ "top": el.offsetTop - ($headerVisibility? rowHeight: 0), "behavior": "auto" });
				}
			} else { // ArrowUp Only
				event.preventDefault();
				clickedDataIndex = Math.max(clickedDataIndex - 1, 0);
				clickedDataItem = $dataList[clickedDataIndex];
				multipleDataIndex = clickedDataIndex;
				multipleDataItem = clickedDataItem;
				selectedDataList.set([ clickedDataItem ]);
				
				/** @type {HTMLElement} */ const el = document.querySelector("div.fn_row[data-index=\"" + clickedDataIndex + "\"]");
				if(el.offsetTop < $scrollTop + ($headerVisibility? rowHeight: 0)) {
					document.querySelector(".fn_viewport").scrollTo({ "top": el.offsetTop - ($headerVisibility? rowHeight: 0), "behavior": "auto" });
				}
			}
		} else if(keyCode == 39) { // ArrowRight
			event.preventDefault();

			if(onCtrlPressed) { // Ctrl + ArrowRight
				event.preventDefault();
				document.querySelector(".fn_viewport").scrollTo({ "left": $totalColumnWidth - width + 4 });
			}
		} else if(keyCode == 40) { // ArrowDown
			event.preventDefault();

			if($dataList.length == 0) {
				return;
			}

			if(onCtrlPressed && onShiftPressed) { // Ctrl + Shift + ArrowDown
				const lastDataIndex = $dataList.length - 1;
				const lastDataItem = $dataList[lastDataIndex];
				document.querySelector("div.fn_row[data-index=\"" + lastDataIndex + "\"]")?.scrollIntoView({ "behavior": "smooth" });
				multipleDataIndex = lastDataIndex;
				multipleDataItem = multipleDataItem;
				onItemClicked(event, lastDataItem, lastDataIndex);
			} else if(onCtrlPressed) { // Ctrl + ArrowDown
				const lastDataIndex = $dataList.length - 1;
				document.querySelector("div.fn_row[data-index=\"" + lastDataIndex + "\"]")?.scrollIntoView({ "behavior": "auto" });
				selectedDataList.set([ $dataList[lastDataIndex] ]);
				clickedDataIndex = lastDataIndex;
				clickedDataItem = $dataList[lastDataIndex];
				multipleDataIndex = clickedDataIndex;
				multipleDataItem = clickedDataItem;
			} else if(onShiftPressed) { // Shift + ArrowDown
				multipleDataIndex = Math.min($dataList.length - 1, multipleDataIndex + 1);
				multipleDataItem = $dataList[multipleDataIndex];
				onItemClicked(event, multipleDataItem, multipleDataIndex);

				/** @type {HTMLElement} */ const el = document.querySelector("div.fn_row[data-index=\"" + multipleDataIndex + "\"]");
				if(el.offsetTop + rowHeight > height + $scrollTop) {
					document.querySelector(".fn_viewport").scrollTo({ "top": el.offsetTop - height + rowHeight, "behavior": "auto" });
				}
			} else { // ArrowDown Only
				event.preventDefault();
				clickedDataIndex = Math.min(clickedDataIndex + 1, $dataList?.length - 1);
				clickedDataItem = $dataList[clickedDataIndex];
				multipleDataIndex = clickedDataIndex;
				multipleDataItem = clickedDataItem;
				selectedDataList.set([ clickedDataItem ]);
				
				/** @type {HTMLElement} */ const el = document.querySelector("div.fn_row[data-index=\"" + clickedDataIndex + "\"]");
				if(el.offsetTop + rowHeight > height + $scrollTop) {
					document.querySelector(".fn_viewport").scrollTo({ "top": el.offsetTop - height + rowHeight, "behavior": "auto" });
				}
			}
		} else if(keyCode == 45) { // Insert
			event.preventDefault();
			if($readonly) {
				throw new Error(readonlyErrorMessage);
			}

			dataList.set([ ...$dataList, {} ]);
			
			setTimeout(() => {
				const lastIndex = $dataList.length - 1;
				document.querySelector("div.fn_row[data-index=\"" + lastIndex + "\"]")?.scrollIntoView();
				selectedDataList.set([ $dataList[lastIndex] ]);
			}, 0);
		} else if(keyCode == 46) { // Delete
			event.preventDefault();
			if($readonly) {
				throw new Error(readonlyErrorMessage);
			}

			deleteDataList($selectedDataList);
		} else if(onCtrlPressed && !onAltPressed && !onShiftPressed && keyCode == 65) { // Ctrl + A
			event.preventDefault();
			selectAll();
		} else if(onCtrlPressed && !onAltPressed && !onShiftPressed && keyCode == 67) { // Ctrl + C
			event.preventDefault();
			copyToClipboard();
		} else if(onCtrlPressed && !onAltPressed && !onShiftPressed && keyCode == 86) { // Ctrl + V
			event.preventDefault();
			if($readonly) {
				throw new Error(readonlyErrorMessage);
			}

			navigator.clipboard.readText().then(text => pasteFromClipboard(text));
		}
	};
	const onKeyup = event => {
		onCtrlPressed = event.ctrlKey || event.metaKey;
		onShiftPressed = event.shiftKey;
		onAltPressed = event.altKey;
	};
	const onItemClicked = (event, dataItem, dataIndex) => {
		if(onShiftPressed) {
			event.preventDefault();

			if(clickedDataItem) {
				const itemIndex0 = $dataList.indexOf(clickedDataItem);
				const itemIndex1 = dataIndex;

				const firstIndex = Math.min(itemIndex0, itemIndex1);
				const lastIndex = Math.max(itemIndex0, itemIndex1);

				selectedDataList.set($dataList.slice(firstIndex, lastIndex + 1));
			} else {
				selectedDataList.set([dataItem]);
				clickedDataIndex = dataIndex;
				clickedDataItem = dataItem;
				multipleDataIndex = clickedDataIndex;
				multipleDataItem = clickedDataItem;
			}
		} else if(onCtrlPressed) {
			selectedDataList.set($selectedDataList.indexOf(dataItem) > -1? $selectedDataList.filter(selectedDataItem => selectedDataItem[keyColumn] != dataItem[keyColumn]): [ ...$selectedDataList, dataItem ]);
			clickedDataIndex = dataIndex;
			clickedDataItem = dataItem;
			multipleDataIndex = clickedDataIndex;
			multipleDataItem = clickedDataItem;
		} else {
			selectedDataList.set([ dataItem ]);
			clickedDataIndex = dataIndex;
			clickedDataItem = dataItem;
			multipleDataIndex = clickedDataIndex;
			multipleDataItem = clickedDataItem;
		}
	};
	/* END: key down & multiple select/deselect event */

	/* BEGIN: copy datalist to clipboard event */
	let onDataCopy;
	const safeOnDataCopy = (columnList, selectedDataList) => {
		try {
			if(!(onDataCopy && typeof(onDataCopy) == "function") || onDataCopy(columnList, selectedDataList)) {
				const tsvTextList = columnList
						.filter(columnItem => (!columnItem.group) && (!columnItem.format || typeof(columnItem.format) != "function"))
						.map(columnItem => columnItem.text)
						.join("\t");
				const tsvDataList = selectedDataList
						.map(selectedDataItem => columnList
								.filter(columnItem => (!columnItem.group) && (!columnItem.format || typeof(columnItem.format) != "function"))
								.map(columnItem => 
										columnItem.type == "datetime"? (selectedDataItem[columnItem.key]? formatter.datetime(selectedDataItem[columnItem.key]): null): 
										columnItem.type == "time"? (selectedDataItem[columnItem.key]? formatter.time(selectedDataItem[columnItem.key]): null): 
										columnItem.type == "date"? (selectedDataItem[columnItem.key]? formatter.date(selectedDataItem[columnItem.key]): null): 
										columnItem.type == "number"? (selectedDataItem[columnItem.key]? Number(selectedDataItem[columnItem.key]): selectedDataItem[columnItem.key] === Number(0)? 0: null): 
										selectedDataItem[columnItem.key] || (selectedDataItem[columnItem.key] === Number(0)? 0: "")
								)
								.join("\t")
						);
				const tsvDataText = tsvDataList.join("\n");

				navigator.clipboard.writeText(tsvTextList + "\n" + tsvDataText);
			}
		} catch(e) {
			throw new Error("setOnDataCopy 를 통해 전달된 함수에서 오류가 발생했습니다. setOnDataCopy 를 통해 올바른 (columnList, dataList) => boolean 함수로 재지정해주세요.", e);
		}
	};
	const copyToClipboard = () => {
		if($columnList.length == 0 || $selectedDataList.length == 0) {
			throw new Error("열 정보가 잘못되었거나 선택된 데이터가 없습니다.");
		}

		safeOnDataCopy($columnList, $selectedDataList);
	};
	/* END: copy datalist to clipboard event */

	/* BEGIN: paste datalist from clipboard event */
	let onDataPaste;
	const safeOnDataPaste = paramDataList => {
		if($readonly) {
			throw new Error(readonlyErrorMessage);
		}

		try {
			if(!(onDataPaste && typeof(onDataPaste) == "function") || onDataPaste(paramDataList)) {
				selectedDataList.set([]);
				clickedDataIndex = -1;
				clickedDataItem = null;
				multipleDataIndex = -1;
				multipleDataItem = null;
				mergeDataList(paramDataList);
			}
		} catch(e) {
			throw new Error("setOnDataPaste 를 통해 전달된 함수에서 오류가 발생했습니다. setOnDataPaste 를 통해 올바른 dataList => boolean 함수로 재지정해주세요", e);
		}
	};
	const pasteFromClipboard = text => {
		if($readonly) {
			throw new Error(readonlyErrorMessage);
		} else if(!text || !text.trim()) {
			throw new Error("클립보드의 데이터가 없거나 읽어올 수 없습니다.");
		}

		const tsvTotal = text.trim().split("\n");
		const tsvKeyCells = tsvTotal[0].split("\t").map(cellItem => cellItem.trim());
		const tsvValueRows = tsvTotal.filter((data, index) => index);
		const tsvPairList = tsvValueRows.map(tsvValueRow => {
			const tsvValueCells = tsvValueRow.split("\t").map(cellItem => cellItem.trim());
			
			if(tsvKeyCells.length != tsvValueCells.length) {
				throw new Error("열 정보가 열 헤더와 일치하지 않는 데이터가 있습니다. 특정 행의 데이터가 열이 누락되었거나 과잉상태인지 확인해주세요.");
			}

			let result = {};
			for(let index=0 ; index<tsvKeyCells.length ; index++) {
				const tsvKey = tsvKeyCells[index];
				const columnItem = $columnList.find(columnItem => ((!columnItem.group) && !(columnItem.format && typeof(columnItem.format) == "function")) && columnItem.text == tsvKey);
				if(!columnItem) {
					continue;
				}
				const tsvValue = tsvValueCells[index];

				result[columnItem.key] = 
						columnItem.type == "datetime"? (tsvValue? parser.datetime(tsvValue): null): 
						columnItem.type == "time"? (tsvValue? parser.time(tsvValue): null): 
						columnItem.type == "date"? (tsvValue? parser.date(tsvValue): null): 
						columnItem.type == "number"? (tsvValue? parser.numeric(tsvValue): null): 
						tsvValue;
			}

			return result;
		});

		safeOnDataPaste(tsvPairList);
	};
	/* END: paste datalist from clipboard event */

	/* BEGIN: focus && blur event */
	let focused;
	const onDatagridFocus = () => focused = true;
	const onDatagridBlur = () => focused = false;
	/* END: focus && blur event */

	/* BEGIN: sort datalist function */
	const sortColumn = writable($columnList.find(columnItem => columnItem.key == keyColumn));
	const sortOrder = writable("asc");
	/* END: sort datalist function */

	/* BEGIN: column double click function */
	let onColumnDoubleClick = null;
	const safeOnColumnDoubleClick = columnItem => {
		try {
			if(onColumnDoubleClick && typeof(onColumnDoubleClick) == "function") {
				onColumnDoubleClick(columnItem);
			}
		} catch(e) {
			throw new Error("setOnColumnDoubleClick 을 통해 전달된 함수에서 오류가 발생했습니다. setOnColumnDoubleClick 을 통해 올바른 columnItem => void 함수로 재지정해주세요.", e);
		}
	};
	/* END: column double click function */

	/* BEGIN: set datafilter, rowClass, cellClass callback function */
	let dataFilter = (dataItem, dataIndex) => true;
	const rowClass = writable((dataItem, dataIndex) => [ "" ]);
	const safeRowClass = derived(rowClass, rowClass => {
		return (dataItem, dataIndex) => {
			try {
				if(rowClass && typeof(rowClass) == "function") {
					return rowClass(dataItem, dataIndex).join(" ");
				}

				return "";
			} catch(e) {
				throw new Error("setRowClass 을 통해 전달된 함수에서 오류가 발생했습니다. setRowClass 을 통해 올바른 (dataItem, dataIndex) => Array<string> 함수로 재지정해주세요.", e);
			}
		}
	});
	const cellClass = writable((columnItem, dataItem) => [ "" ]);
	const safeCellClass = derived(cellClass, cellClass => {
		return (columnItem, dataItem) => {
			try {
				if(cellClass && typeof(cellClass) == "function") {
					return cellClass(columnItem, dataItem).join(" ");
				}
			} catch(e) {
				throw new Error("setCellClass 을 통해 전달된 함수에서 오류가 발생했습니다. setCellClass 을 통해 올바른 (columnItem, dataItem) => Array<string> 함수로 재지정해주세요.", e);
			}
		}
	});
	/* END: set datafilter callback function */

	/* BEGIN: data capture function */
	const capturePredicate = writable(dataItem => true);
	const capturedDataList = derived([dataList, capturePredicate], ([dataList, capturePredicate]) => dataList.filter(capturePredicate));
	const captureCounter = writable(-1);
	const captureIndex = derived([capturedDataList, captureCounter], ([capturedDataList, captureCounter]) => captureCounter == -1 || !capturedDataList || capturedDataList.length == 0? -1: $dataList.indexOf(capturedDataList[captureCounter % capturedDataList.length]));
	/* END: data capture function */

	/* BEGIN: data validation function */
	let commitValidator = dataItem => true;
	const safeCommitValidator = dataItem => {
		try {
			return commitValidator && typeof(commitValidator) == "function"? commitValidator(dataItem): dataItem;
		} catch(e) {
			throw new Error("setCommitValidator 를 통해 전달된 함수가 올바르지 못한 값을 반환했습니다. setCommitValidator 를 통해 올바른 dataItem => boolean 함수로 재지정해주세요.", e);
		}
	};
	/* END: data validation function */

	/* BEGIN: datagrid function */
	export const setEditable = () => readonly.set(false);
	export const setReadonly = () => {
		const unsavedTempDataList = getUnsavedTempDataList();

		if(unsavedTempDataList && unsavedTempDataList.length > 0) {
			throw new Error("편집중이거나 수정된 데이터가 존재합니다.");
		}

		readonly.set(true);
		return;
	};
	export const setTransactionEnabled = () => {
		isTransactionEnabled.set(true);
		rollbackDataList.set([ ...data.map(dataItem => ({ ...dataItem })) ]);
	};
	export const setTransactionDisabled = () => {
		isTransactionEnabled.set(false);
		rollbackDataList.set([]);
	};
	/* END: datagrid function */

	/* BEGIN: column function */
	export const getColumnList = () => $columnList;
	export const setFixed = function(item, fixed) {
		if(arguments.length == 0 || !$columnList.find(columnItem => columnItem["key"] == (item?.key || item))) {
			throw new Error("열 정보를 찾을 수 없습니다. 생성 시 전달된 column 범위 내에서 찾을 수 있도록 적합한 인자를 전달해주세요.");
		}
		
		columnList.set($columnList.map(columnItem => {
			if(columnItem["key"] == (item?.key || item)) {
				columnItem["fixed"] = arguments.length >= 2? (fixed == true): (!columnItem["fixed"]);
			}

			return columnItem;
		}));
	};
	export const unsetFixedAll = () => columnList.set($columnList.map(item => { item["fixed"] = false; return item; }));
	export const hideHeader = () => headerVisibility.set(false);
	export const showHeader = () => headerVisibility.set(true);
	export const hideColumn = columnItem => columnShowList.set($columnShowList.filter(item => item.key != columnItem.key));
	export const showColumn = columnItem => columnShowList.set([ ...new Set([ ...$columnShowList, $columnList.find(item => item.key == columnItem.key) ]) ]);
	export const hideCheckboxColumn = () => pinVisibility.set(false);
	export const showCheckboxColumn = () => pinVisibility.set(true);
	export const hideButtonColumn = () => buttonVisibility.set(false);
	export const showButtonColumn = () => buttonVisibility.set(true);
	export const getColumnGroup = (paramColumnItem) => $columnList.find(columnItem => columnItem.key == paramColumnItem?.key)?.group;
	export const setColumnGroup = (paramColumnItem, paramGroup) => {
		if($readonly) {
			throw new Error(readonlyErrorMessage);
		} else if(!$columnList.find(columnItem => columnItem.key == paramColumnItem?.key)) {
			throw new Error("검색된 열이 없습니다. 검색 조건을 다시 확인해주세요.");
		}

		columnList.set($columnList.map(columnItem => {
			if(columnItem.key == paramColumnItem?.key) {
				columnItem.group = paramGroup;
			}

			return columnItem;
		}));
	};
	/* END: column function */

	/* BEGIN: column event function */
	export const setOnColumnDoubleClick = callback => {
		if(callback && typeof(callback) != "function") {
			throw new Error("올바른 함수식이 아닙니다. dataItem => void 함수를 지정해주세요.");
		}

		onColumnDoubleClick = callback;
	};
	/* END: column event function */

	/* BEGIN: data function */
	export const getDataList = () => $dataList;
	export const setDataList = paramDataList => {
		if($readonly) {
			throw new Error(readonlyErrorMessage);
		} else if(!paramDataList || !Array.isArray(paramDataList)) {
			throw new Error("배열 형식이 아닙니다. [{}, ...] 형식으로 지정해주세요.");
		}

		dataList.set([ ...paramDataList.map(paramDataItem => ({ ...paramDataItem })) ]);
		if($isTransactionEnabled) {
			(async () => rollbackDataList.set([ ...paramDataList.map(paramDataItem => ({ ...paramDataItem })) ]))();
		}
	};
	export const addDataList = paramDataList => {
		if($readonly) {
			throw new Error(readonlyErrorMessage);
		} else if(!paramDataList || !Array.isArray(paramDataList)) {
			throw new Error("배열 형식이 아닙니다. [{}, ...] 형식으로 지정해주세요.");
		}

		dataList.set([ ...$dataList, ...paramDataList ]);
	};
	export const mergeDataList = paramDataList => {
		if($readonly) {
			throw new Error(readonlyErrorMessage);
		}

		if(!Array.isArray(paramDataList)) {
			paramDataList = [ paramDataList ];
		}
		
		const capturedDataList = $dataList;
		const echo = value => value;

		dataList.set([
			...capturedDataList.map(dataItem => echo({ ...dataItem, ...paramDataList.find(paramDataItem => paramDataItem[keyColumn] == dataItem[keyColumn]) }) || dataItem), 
			...paramDataList.filter(paramDataItem => !capturedDataList.find(dataItem => dataItem[keyColumn] == paramDataItem[keyColumn]))
		]);
	};
	export const bulkEdit = bulkEditor => {
		if($readonly) {
			throw new Error(readonlyErrorMessage);
		} else if(!bulkEditor || typeof(bulkEditor) != "function") {
			throw new Error("올바른 함수식이 아닙니다. dataItem => dataItem 함수를 지정해주세요.");
		} else if(!bulkEditor({})) {
			throw new Error("반환값이 없는 수정조건식입니다. return 을 지정해주세요.");
		}

		dataList.set($dataList.map(bulkEditor));
	};
	export const deleteDataList = paramDataList => {
		if($readonly) {
			throw new Error(readonlyErrorMessage);
		} else if(!paramDataList || !Array.isArray(paramDataList)) {
			throw new Error("배열 형식이 아닙니다. [{}, ...] 형식으로 지정해주세요.");
		}

		const paramDataKeyList = paramDataList.map(paramDataItem => paramDataItem[keyColumn]);

		dataList.set($dataList.filter(dataItem => (dataItem[keyColumn] || dataItem[keyColumn] == Number(0))? (paramDataKeyList.indexOf(dataItem[keyColumn]) == -1): (paramDataList.indexOf(dataItem) == -1)));
	};
	export const deleteInvalidAllDataList = () => {
		if($readonly) {
			throw new Error(readonlyErrorMessage);
		} else if(!commitValidator) {
			return;
		}

		deleteDataList($dataList.filter(dataItem => {
			try {
				return !safeCommitValidator(dataItem);
			} catch(e) {
				return true;
			}
		}));
	};
	export const dropDataList = () => {
		if($readonly) {
			throw new Error(readonlyErrorMessage);
		}

		dataList.set([])
	};
	export const commit = () => {
		if($readonly) {
			throw new Error(readonlyErrorMessage);
		} else if(!$isTransactionEnabled) {
			throw new Error(transactionErrorMessage);
		}
		
		if(commitValidator && typeof(commitValidator) == "function") {
			for(let dataItem of $dataList) {
				try {
					if([ ...new Set($dataList.filter(dataItem => dataItem[keyColumn]).map(dataItem => dataItem[keyColumn])) ].length != $dataList.filter(dataItem => dataItem[keyColumn]).length) {
						throw new Error("keyColumn 이 중복인 다수의 레코드가 발견되었습니다. keyColumn 값의 충돌 여부를 확인해주세요.");
					}
				} catch(e) {
					throw new Error("commitValidator 에서 Nullsafe 하지 못한 결과가 반환된 것으로 추정됩니다.", e);
				}

				if(!commitValidator(dataItem)) {
					throw new Error("데이터 제약조건을 충족하지 못한 데이터가 존재합니다. 제약조건 충족 후 커밋을 다시 시도해주세요.");
				}
			}
		}

		(async () => rollbackDataList.set([ ...$dataList.map(dataItem => ({ ...dataItem })) ]))();
		setDataList($rollbackDataList);

		return $rollbackDataList;
	};
	export const rollback = () => {
		if($readonly) {
			throw new Error(readonlyErrorMessage);
		} else if(!$isTransactionEnabled) {
			throw new Error(transactionErrorMessage);
		}
		
		dataList.set([ ...$rollbackDataList.map(rollbackDataItem => ({ ...rollbackDataItem })) ]);
	};
	export const getCheckedDataList = () => $checkedDataList;
	export const setCheckedDataList = paramCheckedDataList => {
		if(!paramCheckedDataList || !Array.isArray(paramCheckedDataList)) {
			throw new Error("배열 형식이 아닙니다. [{}, ...] 형식으로 지정해주세요.");
		}

		checkedDataList.set(paramCheckedDataList.map(paramCheckedDataItem => $dataList.find(dataItem => dataItem[keyColumn] == paramCheckedDataItem[keyColumn])));
	};
	export const getSelectedDataList = () => $selectedDataList;
	export const setSelectedDataList = paramSelectedDataList => {
		if(!paramSelectedDataList || !Array.isArray(paramSelectedDataList)) {
			throw new Error("배열 형식이 아닙니다. [{}, ...] 형식으로 지정해주세요.");
		}

		selectedDataList.set(paramSelectedDataList.map(paramSelectedDataItem => $dataList.find(dataItem => dataItem[keyColumn] == paramSelectedDataItem[keyColumn])));
	};
	export const sort = (column, order) => {
		if($readonly) {
			throw new Error(readonlyErrorMessage);
		} else if(column && !$columnList.find(columnItem => columnItem.key == column.key)) {
			throw new Error("열 정보를 찾을 수 없습니다. 생성 시 전달된 column 범위 내에서 찾을 수 있도록 적합한 인자를 전달해주세요.");
		}

		sortOrder.set(order && [ "asc", "desc" ].indexOf(order) > -1? order: (column?.key == $sortColumn?.key && $sortOrder == "asc"? "desc": "asc"));
		sortColumn.set(column? $columnList.find(columnItem => columnItem.key == column.key) || $columnList.find(columnItem => columnItem.key == keyColumn): $columnList.find(columnItem => columnItem.key == keyColumn));

		dataList.set($dataList.sort((left, right) => {
			return ($sortOrder == "asc"? 1: -1) * 
					($sortColumn.type == "number"? (left[$sortColumn.key] - right[$sortColumn.key]): ((left[$sortColumn.key] + "").localeCompare(right[$sortColumn.key] + "")));
		}));
	};
	export const setDataFilter = callback => {
		if(callback && (typeof(callback) != "function")) {
			throw new Error("올바른 함수식이 아닙니다. dataItem => boolean 함수를 지정해주세요.");
		}

		dataFilter = callback;

		return {
			"visible": $dataList.filter((dataItem, dataIndex) => callback? callback(dataItem, dataIndex): true), 
			"hidden": $dataList.filter((dataItem, dataIndex) => callback? !callback(dataItem, dataIndex): false)
		};
	};
	export const findFirst = predicate => {
		if(predicate && typeof(predicate) != "function") {
			throw new Error("올바른 함수식이 아닙니다. dataItem => boolean 함수를 지정해주세요.");
		} else if(predicate && typeof(predicate) == "function") {
			capturePredicate.set(predicate);
		} else {
			capturePredicate.set(dataItem => true);
		}
		
		captureCounter.set(-1);
		if(!$capturedDataList || $capturedDataList.length == 0) {
			throw new Error("검색된 데이터 목록이 없습니다. 검색조건을 확인해주세요.");
		}

		return $capturedDataList;
	};
	export const findNext = () => {
		if($captureCounter == -1 && (!$capturedDataList || $capturedDataList.length == 0)) {
			throw new Error("검색된 데이터 목록이 없습니다. findFirst(dataItem => boolean) 메소드를 통해 올바른 검색조건을 지정해주세요.");
		}

		captureCounter.update(value => (value + 1) % $capturedDataList.length);
		goToScroll($captureIndex);
		mouseEnterData.set($captureIndex);

		return $dataList[$captureIndex];
	};
	export const goToScroll = index => {
		/** @type {HTMLElement} */ const el = document.querySelector("div.fn_row[data-index=\"" + index + "\"]");
		
		if(el.offsetTop < $scrollTop + ($headerVisibility? rowHeight: 0)) {
			document.querySelector("div#_" + uuid + ".fn_root .fn_viewport").scrollTo({ "top": el.offsetTop - ($headerVisibility? rowHeight: 0), "behavior": "auto" });
		} else if(el.offsetTop + rowHeight > height + $scrollTop) {
			document.querySelector("div#_" + uuid + ".fn_root .fn_viewport").scrollTo({ "top": el.offsetTop - height + rowHeight, "behavior": "auto" });
		}
	};
	export const setRowClass = callback => {
		if(callback && (typeof(callback) != "function")) {
			throw new Error("올바른 함수식이 아닙니다. (dataItem, dataIndex) => Array<string> 함수를 지정해주세요.");
		}

		rowClass.set(callback);
	};
	export const setCellClass = callback => {
		if(callback && (typeof(callback) != "function")) {
			throw new Error("올바른 함수식이 아닙니다. (columnItem, dataItem) => Array<string> 함수를 지정해주세요.");
		}

		cellClass.set(callback);
	};
	export const getInsertedTempDataList = () => $isTransactionEnabled? $dataList.filter(dataItem => $rollbackDataList.filter(rollbackDataItem => rollbackDataItem[keyColumn] == dataItem[keyColumn]).length == 0): [];
	export const getUpdatedTempDataList = () => $isTransactionEnabled? $dataList.filter(dataItem => $rollbackDataList.filter(rollbackDataItem => rollbackDataItem[keyColumn] == dataItem[keyColumn]).length > 0).filter(dataItem => !same(dataItem, $rollbackDataList.find(rollbackDataItem => rollbackDataItem[keyColumn] == dataItem[keyColumn]))): [];
	export const getDeletedTempDataList = () => $isTransactionEnabled? $rollbackDataList.filter(rollbackDataItem => $dataList.filter(dataItem => dataItem[keyColumn] == rollbackDataItem[keyColumn]).length == 0): [];
	export const getUnsavedTempDataList = () => $isTransactionEnabled? [ ...getInsertedTempDataList(), ...getUpdatedTempDataList(), ...getDeletedTempDataList() ]: [];
	/* END: data function */
	
	/* BEGIN: data event function */
	export const setOnDataChange = callback => {
		if($readonly) {
			throw new Error(readonlyErrorMessage);
		} else if(callback && (typeof(callback) != "function")) {
			throw new Error("올바른 함수식이 아닙니다. dataItem => void 함수를 지정해주세요.");
		}

		onDataChange = callback;
	};
	export const setOnDataCheck = callback => {
		if($readonly) {
			throw new Error(readonlyErrorMessage);
		} else if(callback && (typeof(callback) != "function")) {
			throw new Error("올바른 함수식이 아닙니다. dataList => void 함수를 지정해주세요.");
		}

		onDataCheck = callback;
	};
	export const setOnDataSelect = callback => {
		if(callback && (typeof(callback) != "function")) {
			throw new Error("올바른 함수식이 아닙니다. dataList => void 함수를 지정해주세요.");
		}

		onDataSelect = callback;
	};
	export const setCommitValidator = validator => {
		if(validator && (typeof(validator) != "function")) {
			throw new Error("올바른 함수식이 아닙니다. dataItem => boolean 함수를 지정해주세요.");
		}
		
		commitValidator = validator;
	};
	export const setOnDataCopy = callback => {
		if(callback && typeof(callback) != "function") {
			throw new Error("올바른 함수식이 아닙니다. (columnList, dataList) => boolean 함수를 지정해주세요.");
		}
		
		onDataCopy = callback;
	};
	export const setOnDataPaste = callback => {
		if($readonly) {
			throw new Error(readonlyErrorMessage);
		} else if(callback && typeof(callback) != "function") {
			throw new Error("올바른 함수식이 아닙니다. (dataList) => boolean 함수를 지정해주세요.");
		}

		onDataPaste = callback;
	};
	/* END: event function */
</script>

<svelte:window on:keydown={onKeydown} on:keyup={onKeyup} />

<FnContainer 
		keyColumn={keyColumn} 
		rowHeight={rowHeight} 
		width={width} 
		height={height} 
		button={button} 
		uuid={uuid} 
		scrollTop={scrollTop} 
		scrollLeft={scrollLeft} 
		scrollRight={scrollRight} 
		mouseEnterColumn={mouseEnterColumn} 
		mouseEnterData={mouseEnterData} 
		readonly={readonly} 
		columnList={columnList} 
		columnMetaMap={columnMetaMap} 
		columnMetaList={columnMetaList} 
		columnShowList={columnShowList} 
		columnWidthMap={columnWidthMap} 
		pinColumn={pinColumn} 
		pinColumnWidth={pinColumnWidth} 
		pinVisibility={pinVisibility} 
		headerVisibility={headerVisibility} 
		buttonVisibility={buttonVisibility} 
		dataList={dataList} 
		checkedDataList={checkedDataList} 
		selectedDataList={selectedDataList} 
		dataFilter={dataFilter} 
		safeRowClass={safeRowClass} 
		safeCellClass={safeCellClass} 
		safeOnDataChange={safeOnDataChange} 
		safeOnColumnDoubleClick={safeOnColumnDoubleClick} 
		commitValidator={commitValidator} 
		safeCommitValidator={safeCommitValidator} 
		reportConfirmedWidth={reportConfirmedWidth}

		onDatagridFocus={onDatagridFocus} 
		onDatagridBlur={onDatagridBlur} 
		mouseEnter={mouseEnter} 
		checkAll={checkAll} 
		checkItem={checkItem} 
		onItemClicked={onItemClicked} 
		clickedDataItem={clickedDataItem} 
		onScroll={onScroll} 
		getUnsavedTempDataList={getUnsavedTempDataList}
/>