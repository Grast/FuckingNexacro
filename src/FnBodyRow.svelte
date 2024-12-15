<script>
	import { writable } from "svelte/store";
	
	import FnCell from "./FnCell.svelte";
    import FnCombobox from "./FnCombobox.svelte";
    import FnCheckbox from "./FnCheckbox.svelte";
	
	export let keyColumn;
	export let rowHeight;
	export let button;

	export let scrollLeft;
	export let scrollRight;
	export let mouseEnterColumn;
	export let mouseEnterData;
	export let readonly;
	export let columnList;
	export let columnShowList;
	export let columnWidthMap;
	export let pinColumnWidth;
	export let pinVisibility;
	export let buttonVisibility;
	export let dataItem;
	export let dataIndex;
	export let checkedDataList;
	export let selectedDataList;
	export let dataFilter;
	export let safeRowClass;
	export let safeCellClass;
	export let safeOnDataChange;
	export let commitValidator;
	export let safeCommitValidator;

	export let onItemClicked;
	export let clickedDataItem;
	export let mouseEnter;
	export let checkItem;
	export let getUnsavedTempDataList;

	/* BEGIN: check unsaved record function */
	const isSavedDataItem = dataItem => {
		let unsavedTempDataList = getUnsavedTempDataList();
		
		return unsavedTempDataList.length == 0 || !unsavedTempDataList.find(unsavedDataItem => unsavedDataItem[keyColumn] == dataItem[keyColumn]);
	};
	/* END: check unsaved record function */

	/* BEGIN: intersection event */
	const bodyRow = writable(null);
	/* END: intersection event */
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div bind:this={$bodyRow} class="fn_body_row fn_row{$selectedDataList.indexOf(dataItem) > -1? " fn_row_selected": ""}{clickedDataItem == dataItem? " fn_row_clicked": ""}{!dataFilter || typeof(dataFilter) != "function" || dataFilter(dataItem, dataIndex)? "": " fn_gone"}{commitValidator && typeof(commitValidator) == "function" && !safeCommitValidator(dataItem)? " fn_row_invalid": ""}{isSavedDataItem(dataItem)? "": " fn_row_unsaved"}{$safeRowClass? (" " + $safeRowClass(dataItem, dataIndex)): ""}" 
		data-keyColumn={dataItem[keyColumn]} data-index={dataIndex} 
		style="width:fit-content;height:{rowHeight}px;z-index:0;" on:click={event => onItemClicked(event, dataItem, dataIndex)}>
	<div class="fn_body_colgroup_fixed fn_body_colgroup fn_colgroup" style="width:fit-content;height:{rowHeight}px;display:flex;position:relative;{$scrollLeft > 0? `z-index:1;left:${$scrollLeft}px;`: `z-index:0;left:0px;`}">
		{#if $pinVisibility}
		<div class="fn_body_cell fn_cell fn_truncate fn_cell_checkbox{$mouseEnterColumn == "_"? " fn_mouseenter_column": ""}{$mouseEnterData == dataIndex? " fn_mouseenter_data": ""}{$checkedDataList.indexOf(dataItem) > -1? " fn_cell_checkbox_checked": ""}" 
				style="width:{$pinColumnWidth}px;height:{rowHeight}px;display:flex;" 
				on:mouseenter={() => mouseEnter("_", dataIndex)}>
			<input type="checkbox" id="fn_checkbox_{dataItem[keyColumn]}" class="fn_checkbox" value={dataItem} disabled={!dataItem[keyColumn] && Number(dataItem[keyColumn]) != 0} checked={$checkedDataList.find(checkedDataItem => checkedDataItem[keyColumn] == dataItem[keyColumn])} on:click={() => checkItem(dataItem)} />
		</div>
		{/if}
		{#each $columnList.filter(columnItem => columnItem.fixed && $columnShowList.find(columnShowItem => columnShowItem.key == columnItem.key)) as columnItem, columnIndex}
		{#if columnItem.type == "boolean"}
		<FnCheckbox 
				columnItem={columnItem} 
				columnIndex={$columnList.indexOf(columnItem)} 
				dataItem={dataItem} 
				dataIndex={dataIndex} 
				mouseEnterColumn={mouseEnterColumn} 
				mouseEnterData={mouseEnterData} 
				width={$columnWidthMap[columnItem.key]} 
				rowHeight={rowHeight} 
				isEditable={!$readonly && columnItem.key != keyColumn && columnItem?.format == null} 
				onSubmit={value => dataItem[columnItem.key] = value} 
				onMouseEnter={mouseEnter} 
		/>
		{:else if columnItem?.group}
		<FnCombobox 
				columnItem={columnItem} 
				columnIndex={$columnList.indexOf(columnItem)} 
				dataItem={dataItem} 
				dataIndex={dataIndex} 
				mouseEnterColumn={mouseEnterColumn} 
				mouseEnterData={mouseEnterData} 
				width={$columnWidthMap[columnItem.key]} 
				rowHeight={rowHeight} 
				isEditable={!$readonly && columnItem.key != keyColumn && columnItem?.format == null} 
				onSubmit={value => dataItem[columnItem.key] = value} 
				onMouseEnter={mouseEnter} 
		/>
		{:else}
		<FnCell 
				columnItem={columnItem} 
				columnIndex={$columnList.indexOf(columnItem)} 
				dataItem={dataItem} 
				dataIndex={dataIndex} 
				mouseEnterColumn={mouseEnterColumn} 
				mouseEnterData={mouseEnterData} 
				width={$columnWidthMap[columnItem.key]} 
				rowHeight={rowHeight} 
				isEditable={!$readonly && columnItem.key != keyColumn && columnItem?.format == null} 
				onSubmit={value => dataItem[columnItem.key] = value} 
				onMouseEnter={mouseEnter} 
		/>
		{/if}
		{/each}
	</div>
	<div class="fn_body_colgroup_unfixed fn_body_colgroup fn_colgroup" style="width:fit-content;height:{rowHeight}px;display:flex;">
		{#each $columnList.filter(columnItem => !columnItem.fixed && $columnShowList.find(columnShowItem => columnShowItem.key == columnItem.key)) as columnItem, columnIndex}
		{#if columnItem.type == "boolean"}
		<FnCheckbox 
				columnItem={columnItem} 
				columnIndex={$columnList.indexOf(columnItem)} 
				dataItem={dataItem} 
				dataIndex={dataIndex} 
				mouseEnterColumn={mouseEnterColumn} 
				mouseEnterData={mouseEnterData} 
				width={$columnWidthMap[columnItem.key]} 
				rowHeight={rowHeight} 
				isEditable={!$readonly && columnItem.key != keyColumn && columnItem?.format == null} 
				onSubmit={value => dataItem[columnItem.key] = value} 
				onMouseEnter={mouseEnter} 
				safeCellClass={safeCellClass} 
				safeOnDataChange={safeOnDataChange} 
		/>
		{:else if columnItem?.group}
		<FnCombobox 
				columnItem={columnItem} 
				columnIndex={$columnList.indexOf(columnItem)} 
				dataItem={dataItem} 
				dataIndex={dataIndex} 
				mouseEnterColumn={mouseEnterColumn} 
				mouseEnterData={mouseEnterData} 
				width={$columnWidthMap[columnItem.key]} 
				rowHeight={rowHeight} 
				isEditable={!$readonly && columnItem.key != keyColumn && columnItem?.format == null} 
				onSubmit={value => dataItem[columnItem.key] = value} 
				onMouseEnter={mouseEnter} 
				safeCellClass={safeCellClass} 
				safeOnDataChange={safeOnDataChange} 
		/>
		{:else}
		<FnCell 
				columnItem={columnItem} 
				columnIndex={$columnList.indexOf(columnItem)} 
				dataItem={dataItem} 
				dataIndex={dataIndex} 
				mouseEnterColumn={mouseEnterColumn} 
				mouseEnterData={mouseEnterData} 
				width={$columnWidthMap[columnItem.key]} 
				rowHeight={rowHeight} 
				isEditable={!$readonly && columnItem.key != keyColumn && columnItem?.format == null} 
				onSubmit={value => dataItem[columnItem.key] = value} 
				onMouseEnter={mouseEnter} 
				safeCellClass={safeCellClass} 
				safeOnDataChange={safeOnDataChange} 
		/>
		{/if}
		{/each}
	</div>
	{#if button && $buttonVisibility}
	<div class="fn_body_colgroup_suffixed fn_body_colgroup fn_colgroup" style="width:fit-content;height:{rowHeight}px;display:flex;{button?.fixed && $scrollRight > 0? `position:relative;z-index:1;right:${$scrollRight}px;`: `position:relative;z-index:0;right:0px;`}">
		<div class="fn_body_cell fn_cell fn_content fn_truncate fn_cell_button{$mouseEnterColumn == "/"? " fn_mouseenter_column": ""}{$mouseEnterData == dataIndex? " fn_mouseenter_data": ""}" style="width:{button?.width}px;height:{rowHeight}px;" 
				on:mouseenter={() => mouseEnter("/", dataIndex)}>
			{#if button?.visible(dataItem)}
			<button type="button" class="fn_button {button?.class(dataItem) || ""}" disabled={!button?.enable(dataItem)} on:click={() => button?.onclick(dataItem)} style="line-height:0.5;">{button?.text(dataItem) || ""}</button>
			{/if}
		</div>
	</div>
	{/if}
</div>