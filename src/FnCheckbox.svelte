<script>
	import { writable } from "svelte/store";
	import { onMount } from "svelte";
	
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
	/** @type {Function} */	export let onResizeWidth = null;
	/** @type {Function} */	export let onMouseEnter = null;
	/** @type {Function} */ export let safeOnDataChange = null;
	
	/* BEGIN: check boolean event */
	const checkValue = event => {
		if(onSubmit && typeof(onSubmit) == "function") {
			onSubmit(event.target.checked);
		}
		safeOnDataChange(dataItem);
	};
	/* END: check boolean event */

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
<div class="{isHeader? "fn_body_cell": "fn_header_cell"} fn_cell{$mouseEnterColumn == columnItem.key? " fn_mouseenter_column": ""}{$mouseEnterData == dataIndex? " fn_mouseenter_data": ""}{$safeCellClass? (" " + $safeCellClass(columnItem, dataItem)): ""}" 
		data-columnKey="{columnItem.key}" data-columnIndex="{columnIndex}" 
		style="width:{$width}px;height:{rowHeight}px;display:flex;{onResizeWidth && typeof(onResizeWidth) == "function"? "resize:horizontal;": ""}" 
		bind:this={$cell} on:mouseenter={() => onMouseEnter(columnItem.key, dataIndex)}>
	{#if columnItem?.format && typeof(columnItem?.format) == "function"}
	<span class="fn_content fn_truncate{dataItem["columnItem.key"] === Number(dataItem["columnItem.key"])? " fn_right_align": ""}" style="width:{$width}px;height:{rowHeight}px;">{columnItem.format(dataItem[columnItem.key]) || ""}</span>
	{:else}
	<input type="checkbox" id="fn_checkbox_{columnItem.key}_{dataIndex}" class="fn_checkbox" value={dataItem[columnItem.key]} disabled={!isEditable || (columnItem.format && typeof(columnItem.format) == "function")} checked={dataItem[columnItem.key]} on:click={checkValue} />
	{/if}
</div>