<script>
	import FnCell from "./FnCell.svelte";

	export let rowHeight;
	export let button;

	export let scrollLeft;
	export let scrollRight;
	export let mouseEnterColumn;
	export let mouseEnterData;
	export let columnMetaMap;
	export let columnMetaList;
	export let columnShowList;
	export let columnWidthMap;
	export let pinColumn;
	export let pinColumnWidth;
	export let pinVisibility;
	export let buttonVisibility;
	export let dataList;
	export let checkedDataList;
	export let safeOnColumnDoubleClick;

	export let mouseEnter;
	export let checkAll;
</script>

<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="fn_header_row fn_row" style="width:fit-content;height:{rowHeight}px;z-index:2;">
	<div class="fn_header_colgroup_fixed fn_header_colgroup fn_colgroup" style="width:fit-content;height:{rowHeight}px;display:flex;position:relative;{$scrollLeft > 0? `z-index:3;left:${$scrollLeft}px;`: `z-index:2;left:0px;`}">
		{#if $pinVisibility}
		<div class="fn_header_cell fn_cell fn_content fn_truncate fn_cell_checkbox{$mouseEnterColumn == "_"? " fn_mouseenter_column": ""}{$mouseEnterData == -1? " fn_mouseenter_data": ""}{$dataList?.length > 0 && $checkedDataList.length == $dataList.length? " fn_cell_checkbox_checked": ""}" 
				style="width:{$pinColumnWidth}px;height:{rowHeight}px;" 
				bind:this={$pinColumn} on:mouseenter={() => mouseEnter("_", -1)}>
			<input type="checkbox" id="fn_checkbox_" class="fn_checkbox" checked={$dataList?.length > 0 && $checkedDataList.length == $dataList.length} on:click={checkAll} />
		</div>
		{/if}
		{#each $columnMetaList.filter(columnMetaItem => columnMetaItem.fixed && $columnShowList.find(columnShowItem => columnShowItem.key == columnMetaItem.key)) as columnMetaItem, columnMetaIndex}
		<FnCell 
				columnItem={columnMetaItem} 
				columnIndex={$columnMetaList.indexOf(columnMetaItem)} 
				dataItem={$columnMetaMap} 
				dataIndex={-1} 
				mouseEnterColumn={mouseEnterColumn} 
				mouseEnterData={mouseEnterData} 
				width={$columnWidthMap[columnMetaItem.key]} 
				rowHeight={rowHeight} 
				isEditable={false} 
				onSubmit={null} 
				onDoubleClick={safeOnColumnDoubleClick} 
				onResizeWidth={value => $columnWidthMap[columnMetaItem.key].set(value)} 
				onMouseEnter={mouseEnter} 
		/>
		{/each}
	</div>
	<div class="fn_header_colgroup_unfixed fn_header_colgroup fn_colgroup" style="width:fit-content;height:{rowHeight}px;display:flex;">
		{#each $columnMetaList.filter(columnMetaItem => !columnMetaItem.fixed && $columnShowList.find(columnShowItem => columnShowItem.key == columnMetaItem.key)) as columnMetaItem, columnMetaIndex}
		<FnCell 
				columnItem={columnMetaItem} 
				columnIndex={$columnMetaList.indexOf(columnMetaItem)} 
				dataItem={$columnMetaMap} 
				dataIndex={-1} 
				mouseEnterColumn={mouseEnterColumn} 
				mouseEnterData={mouseEnterData} 
				width={$columnWidthMap[columnMetaItem.key]} 
				rowHeight={rowHeight} 
				isEditable={false} 
				onSubmit={null} 
				onDoubleClick={safeOnColumnDoubleClick} 
				onResizeWidth={value => $columnWidthMap[columnMetaItem.key].set(value)} 
				onMouseEnter={mouseEnter} 
		/>
		{/each}
	</div>
	{#if button && $buttonVisibility}
	<div class="fn_header_colgroup_suffixed fn_header_colgroup fn_colgroup" style="width:fit-content;height:{rowHeight}px;display:flex;{button?.fixed && $scrollRight > 0? `position:relative;z-index:3;right:${$scrollRight}px;`: `position:relative;z-index:2;right:0px;`}">
		<div class="fn_header_cell fn_cell fn_unresizable fn_content fn_truncate fn_cell_button{$mouseEnterColumn == "/"? " fn_mouseenter_column": ""}{$mouseEnterData == -1? " fn_mouseenter_data": ""}" style="width:{button?.width}px;height:{rowHeight}px;" 
				on:mouseenter={() => mouseEnter("/", -1)}>
			<span class="fn_content fn_truncate" style="width:{button?.width}px;height:{rowHeight}px;">{button?.header || ""}</span>
		</div>
	</div>
	{/if}
</div>