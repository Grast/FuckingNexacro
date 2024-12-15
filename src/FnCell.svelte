<script>
	import { writable } from "svelte/store";
	import { onMount } from "svelte";
	
	import { formatter, parser, valuate } from "./util";

	export let columnItem;
	export let columnIndex;
	export let dataItem;
	export let dataIndex;
	export let safeCellClass = null;
	export let isHeader = false;
	export let mouseEnterColumn;
	export let mouseEnterData;
	export let width;
	export let rowHeight;
	export let isEditable = false;
	/** @type {Function} */	export let onSubmit = null;
	/** @type {Function} */ export let onDoubleClick = null;
	/** @type {Function} */	export let onResizeWidth = null;
	/** @type {Function} */	export let onMouseEnter = null;
	/** @type {Function} */ export let safeOnDataChange = null;

	const editMode = writable(null);
	const rollbackValue = writable(null);
	let onCtrlPressed = false;
	let onShiftPressed = false;
	let onAltPressed = false;
	
	/* BEGIN: data edit event */
	let inputElement;
	let inputValue;
	let step;

	const typeMap = {
		"datetime": "datetime-local", 
		"time": "time", 
		"date": "date", 
		"number": "number", 
		"string": "text" 
	};
	const stepMap = {
		"datetime": 1, 
		"time": 1, 
		"date": 0, 
		"number": 0.001, 
		"string": null
	};
	const startEdit = event => {
		if(!isEditable || $editMode) {
			return;
		}

		if(isEditable && !event.shiftKey && !(event.ctrlKey || event.metaKey)) {
			editMode.set(columnItem.type);
			rollbackValue.set(dataItem[columnItem.key]);
			if(inputElement) {
				inputElement.type = typeMap[columnItem.type];
			}
			inputValue = 
					dataItem[columnItem.key] && columnItem.type == "datetime"? formatter.datetime(dataItem[columnItem.key]): 
					dataItem[columnItem.key] && columnItem.type == "time"? formatter.time(dataItem[columnItem.key]): 
					dataItem[columnItem.key] && columnItem.type == "date"? formatter.date(dataItem[columnItem.key]): 
					dataItem[columnItem.key];
			step = stepMap[columnItem.type];
			setTimeout(() => {
				if(inputElement) {
					inputElement.focus();
					inputElement.select();
				}
			}, 0);
		}
	};
	const onKeydown = event => {
		const { keyCode } = event;

		onCtrlPressed = event.ctrlKey || event.metaKey;
		onShiftPressed = event.shiftKey;
		onAltPressed = event.altKey;

		if(keyCode == 13) { // Enter
			event.stopPropagation();
			submitEdit();
		} else if(keyCode == 27) { // Escape
			event.stopPropagation();
			cancelEdit();
		} else if(keyCode == 32) { // Space
			event.stopPropagation();
		} else if(keyCode == 37) { // ArrowLeft
			event.stopPropagation();
		} else if(keyCode == 38) { // ArrowUp
			event.stopPropagation();
		} else if(keyCode == 39) { // ArrowRight
			event.stopPropagation();
		} else if(keyCode == 40) { // ArrowDown
			event.stopPropagation();
		} else if(keyCode == 45) { // Insert
			event.stopPropagation();
		} else if(keyCode == 46) { // Delete
			event.stopPropagation();
		} else if(event.ctrlKey && !event.altKey && !event.shiftKey && keyCode == 65) { // Ctrl + A
			event.stopPropagation();
		} else if(event.ctrlKey && !event.altKey && !event.shiftKey && keyCode == 67) { // Ctrl + C
			event.stopPropagation();
		} else if(event.ctrlKey && !event.altKey && !event.shiftKey && keyCode == 86) { // Ctrl + V
			event.stopPropagation();
		}
	};
	const submitEdit = () => {
		if($editMode) {
			editMode.set(null);
			rollbackValue.set(null);
			if(onSubmit && typeof(onSubmit) == "function") {
				onSubmit(
						columnItem.type == "datetime"? parser.datetime(inputValue): 
						columnItem.type == "time"? parser.time(inputValue): 
						columnItem.type == "date"? parser.date(inputValue): 
						columnItem.type == "number"? parser.numeric(inputValue): 
						inputValue
				);
			}
			safeOnDataChange(dataItem);
			if(inputElement) {
				inputElement.type = "text";
			}
			inputValue = null;
		}
	};
	const cancelEdit = () => {
		if($editMode) {
			editMode.set(null);
			rollbackValue.set(null);
			if(inputElement) {
				inputElement.type = "text";
			}
			inputValue = null;
		}
	};
	/* END: data edit event */

	/* BEGIN: resize width && intersection event */
	const cell = writable(null);
	onMount(() => {
		let resizeObserver = null;

		if(onResizeWidth && typeof(onResizeWidth) == "function") {
			resizeObserver = new ResizeObserver(([entry]) => {
				if(onResizeWidth != null && typeof(onResizeWidth) == "function") {
					onResizeWidth(entry.contentRect.width);
				}
			});
			resizeObserver.observe($cell);
		}

		return () => {
			resizeObserver?.disconnect();
		};
	});
	/* END: resize width && intersection event */
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="{isHeader? "fn_body_cell": "fn_header_cell"} fn_cell fn_truncate{$editMode != null? " fn_body_cell_input": ""}{$mouseEnterColumn == columnItem.key? " fn_mouseenter_column": ""}{$mouseEnterData == dataIndex? " fn_mouseenter_data": ""}{$safeCellClass? (" " + $safeCellClass(columnItem, dataItem)): ""}" 
		data-columnKey="{columnItem.key}" data-columnIndex="{columnIndex}" 
		style="width:{$width}px;height:{rowHeight}px;display:flex;{onResizeWidth && typeof(onResizeWidth) == "function"? "resize:horizontal;overflow-x:auto;": ""}" 
		bind:this={$cell} on:dblclick={event => onDoubleClick && typeof(onDoubleClick) == "function"? onDoubleClick(columnItem): startEdit(event)} on:mouseenter={() => onMouseEnter(columnItem.key, dataIndex)}>
	{#if columnItem?.format && typeof(columnItem?.format) == "function"}
	<span class="fn_content fn_truncate{columnItem?.type == "number"? " fn_right_align": ""}" style="width:{$width}px;height:{rowHeight}px;">{valuate(columnItem.format(dataItem[columnItem.key]))}</span>
	{:else}
	<input class="fn_input" type="text" bind:value={inputValue} bind:this={inputElement} style="width:{$width}px;height:{rowHeight}px;{$editMode != null? "display:block;": "display:none;"}" step={step} on:keydown={onKeydown} on:blur={submitEdit} />
	<span class="fn_content fn_truncate{columnItem?.type == "number"? " fn_right_align": ""}" style="width:{$width}px;height:{rowHeight}px;{$editMode == null? "display:block;": "display:none;"}">
		{
			dataItem[columnItem.key] && columnItem.type == "datetime"? (formatter.datetime(dataItem[columnItem.key])): 
			dataItem[columnItem.key] && columnItem.type == "time"? (formatter.time(dataItem[columnItem.key])): 
			dataItem[columnItem.key] && columnItem.type == "date"? (formatter.date(dataItem[columnItem.key])): 
			dataItem[columnItem.key] && columnItem.type == "number"? (formatter.numeric(dataItem[columnItem.key] || 0)): 
			valuate(dataItem[columnItem.key])
		}
	</span>
	{/if}
</div>