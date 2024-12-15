<script>
	import { writable } from "svelte/store";
	import { onMount } from "svelte";
	
	import { valuate } from "./util";

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
	
	/* BEGIN: select item event */
	let selectElement;
	let selectValue;

	const startSelect = event => {
		if(!isEditable || $editMode) {
			return;
		}

		if(isEditable && !event.shiftKey && !(event.ctrlKey || event.metaKey)) {
			editMode.set(columnItem.type);
			rollbackValue.set(dataItem[columnItem.key]);
			selectValue = dataItem[columnItem.key];
			setTimeout(() => {
				if(selectElement) {
					selectElement.focus();
				}
			}, 0);
		}
	};
	const submitSelect = value => {
		if($editMode) {
			editMode.set(null);
			rollbackValue.set(null);
			if(onSubmit && typeof(onSubmit) == "function") {
				onSubmit(value);
			}
			safeOnDataChange(dataItem);
			selectValue = null;
			selectElement.blur();
		}
	};
	const cancelSelect = event => {
		if($editMode) {
			editMode.set(null);
			rollbackValue.set(null);
			selectValue = null;
		}
	};
	/* END: select item event */

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
<div class="{isHeader? "fn_body_cell": "fn_header_cell"} fn_cell{$editMode == null? " fn_truncate": ""}{$mouseEnterColumn == columnItem.key? " fn_mouseenter_column": ""}{$mouseEnterData == dataIndex? " fn_mouseenter_data": ""}{$safeCellClass? (" " + $safeCellClass(columnItem, dataItem)): ""}" 
		data-columnKey="{columnItem.key}" data-columnIndex="{columnIndex}" 
		style="width:{$width}px;height:{rowHeight}px;display:flex;{onResizeWidth && typeof(onResizeWidth) == "function"? "resize:horizontal;": ""}" 
		bind:this={$cell} on:dblclick={event => onDoubleClick && typeof(onDoubleClick) == "function"? onDoubleClick(columnItem): startSelect(event)} on:mouseenter={() => onMouseEnter(columnItem.key, dataIndex)}>
	<div class="fn_select_list" style="width:100%;height:fit-content;max-height:{rowHeight * 5}px;position:relative;z-index:4;{$editMode != null? "display:block;": "display:none;"}" tabindex="-1" bind:this={selectElement} on:blur={cancelSelect}>
		<div class="fn_select_viewport" style="width:100%;height:fit-content;min-height:{rowHeight}px;max-height:calc({rowHeight * 32}px);overflow-x:hidden;overflow-y:auto;">
			<div class="fn_select_body" style="width:100%;height:fit-content;">
				{#each columnItem.group as groupItem, groupIndex}
				<div class="fn_select_item fn_truncate{groupItem.value == selectValue? " fn_select_selected": ""}" style="width:100%;height:calc({rowHeight}px + 8px);" on:click={event => submitSelect(groupItem.value)}>
					<span class="fn_select_item_text fn_truncate" style="width:auto;display:block;white-space:nowrap;">{valuate(groupItem?.text)}</span>
				</div>
				{/each}
			</div>
		</div>
	</div>
	<span class="fn_content fn_truncate{columnItem?.type == "number"? " fn_right_align": ""}" style="width:{$width}px;height:{rowHeight}px;{$editMode == null? "display:block;": "display:none;"}">
		{valuate(columnItem.group.find(groupItem => groupItem.value == dataItem[columnItem.key])?.text)}
	</span>
</div>