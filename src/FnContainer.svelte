<script>
    import { onMount } from "svelte";
	
	import FnHeaderRow from "./FnHeaderRow.svelte";
	import FnBodyRow from "./FnBodyRow.svelte";

	export let keyColumn;
	export let rowHeight;
	export let width;
	export let height;
	export let button;
	
	export let uuid;
	export let scrollTop;
	export let scrollLeft;
	export let scrollRight;
	export let mouseEnterColumn;
	export let mouseEnterData;
	export let readonly;
	export let columnList;
	export let columnMetaMap;
	export let columnMetaList;
	export let columnShowList;
	export let columnWidthMap;
	export let pinColumn;
	export let pinColumnWidth;
	export let pinVisibility;
	export let headerVisibility;
	export let buttonVisibility;
	export let dataList;
	export let checkedDataList;
	export let selectedDataList;
	export let dataFilter;
	export let safeRowClass;
	export let safeCellClass;
	export let safeOnDataChange;
	export let safeOnColumnDoubleClick;
	export let commitValidator;
	export let safeCommitValidator;
	export let reportConfirmedWidth;

	export let onDatagridFocus;
	export let onDatagridBlur;
	export let mouseEnter;
	export let checkAll;
	export let checkItem;
	export let onItemClicked;
	export let clickedDataItem;
	export let onScroll;
	export let getUnsavedTempDataList;

	let root;
	const resizeObserver = new ResizeObserver(([entry]) => {
		reportConfirmedWidth(entry.contentRect.width);
	});

	onMount(() => {
		resizeObserver.observe(root);
		
		return () => {
			resizeObserver?.disconnect();
		};
	});
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="_{uuid}" class="fn_root" bind:this={root} style="width:{width + (width === Number(width)? "px": "")};height:{height}px;" tabindex="-1" on:focus={() => onDatagridFocus()} on:blur={() => onDatagridBlur()}>
	<div class="fn_viewport" style="width:{width}px;height:{height}px;overflow:auto;position:relative;" on:scroll={onScroll}>
		<div class="fn_wrapper" style="width:fit-content;height:{height}px;display:block;" on:mouseleave={() => mouseEnter(null, null)}>
			{#if $headerVisibility}
			<div class="fn_header" style="display:block;{$scrollTop > 0? `position:relative;z-index:2;top:${$scrollTop}px;`: `position:relative;z-index:0;top:0px;`}">
				<FnHeaderRow 
						rowHeight={rowHeight} 
						button={button} 
						scrollLeft={scrollLeft} 
						scrollRight={scrollRight} 
						mouseEnterColumn={mouseEnterColumn} 
						mouseEnterData={mouseEnterData} 
						columnMetaMap={columnMetaMap} 
						columnMetaList={columnMetaList} 
						columnShowList={columnShowList} 
						columnWidthMap={columnWidthMap} 
						pinColumn={pinColumn} 
						pinColumnWidth={pinColumnWidth} 
						pinVisibility={pinVisibility} 
						buttonVisibility={buttonVisibility} 
						dataList={dataList} 
						checkedDataList={checkedDataList} 
						safeOnColumnDoubleClick={safeOnColumnDoubleClick} 
						mouseEnter={mouseEnter} 
						checkAll={checkAll} 
				/>
			</div>
			{/if}
			<div class="fn_body">
				{#if !$dataList || !$dataList.length}
				<div class="fn_body_row fn_row" style="width:100%;height:{rowHeight}px;">
					<div class="fn_body_colgroup fn_colgroup" style="width:100%;height:{rowHeight}px;">
						<div class="fn_body_cell fn_cell fn_content fn_truncate" style="width:100%;height:{rowHeight}px;">
							<span class="fn_card fn_card_nodata">데이터가 없습니다.</span>
						</div>
					</div>
				</div>
				{/if}
				{#each $dataList as dataItem, dataIndex}
				<FnBodyRow
						keyColumn={keyColumn} 
						rowHeight={rowHeight} 
						button={button} 
						scrollLeft={scrollLeft} 
						scrollRight={scrollRight} 
						mouseEnterColumn={mouseEnterColumn} 
						mouseEnterData={mouseEnterData} 
						readonly={readonly} 
						columnList={columnList} 
						columnShowList={columnShowList} 
						columnWidthMap={columnWidthMap} 
						pinColumnWidth={pinColumnWidth} 
						pinVisibility={pinVisibility} 
						buttonVisibility={buttonVisibility} 
						dataItem={dataItem} 
						dataIndex={dataIndex} 
						checkedDataList={checkedDataList} 
						selectedDataList={selectedDataList} 
						dataFilter={dataFilter} 
						safeRowClass={safeRowClass} 
						safeCellClass={safeCellClass} 
						safeOnDataChange={safeOnDataChange} 
						commitValidator={commitValidator} 
						safeCommitValidator={safeCommitValidator} 
						onItemClicked={onItemClicked} 
						clickedDataItem={clickedDataItem} 
						mouseEnter={mouseEnter} 
						checkItem={checkItem} 
						getUnsavedTempDataList={getUnsavedTempDataList} 
				/>
				{/each}
			</div>
		</div>
	</div>
</div>