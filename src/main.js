import "./FuckingNexacro.css";
import FuckingNexacro from "./FuckingNexacro.svelte";
import products from "./products.json";

Object.defineProperty(window, "eval", {
	value: () => { throw new Error("eval is blocked."); },
	writable: false,
	configurable: false
});

const groupCategory = [
	{ value: "beauty", text: "화장품" }, 
	{ value: "fragrances", text: "향수" }, 
	{ value: "furniture", text: "가구" }, 
	{ value: "groceries", text: "잡화" }
];
const groupShippingInformation = [
	{ value: 'Ships overnight', text: "익일 배송" }, 
	{ value: 'Ships in 1-2 business days', text: "영업일 1~2일 내 배송" }, 
	{ value: 'Ships in 3-5 business days', text: "영업일 3~5일 내 배송" }, 
	{ value: 'Ships in 1 week', text: "1주 내 배송" }, 
	{ value: 'Ships in 2 weeks', text: "2주 내 배송" }, 
	{ value: 'Ships in 1 month', text: "1개월 배송" }
];
const fuckingNexacro = new FuckingNexacro({
	target: document.querySelector("#fuckingNexacro"), 
	props: {
		column: [
			{ key: "id", 					text: "ID", 			width:  80, 	type: "number", 	fixed: true, 	group: null, 						format: null }, 
			{ key: "title", 				text: "제품명", 		width: 160, 	type: "string", 	fixed: true,	group: null, 						format: null }, 
			{ key: "description", 			text: "설명", 			width: 320, 	type: "string", 	fixed: false,	group: null, 						format: null }, 
			{ key: "category", 				text: "분류", 			width: 120, 	type: "string", 	fixed: false,	group: groupCategory, 				format: null }, 
			{ key: "price", 				text: "가격", 			width:  80, 	type: "number", 	fixed: false,	group: null, 						format: null }, 
			{ key: "discountPercentage", 	text: "할인율", 		width:  80, 	type: "number", 	fixed: false,	group: null, 						format: null }, 
			{ key: "rating", 				text: "평점", 			width:  80, 	type: "number", 	fixed: false,	group: null, 						format: null }, 
			{ key: "stock", 				text: "재고", 			width:  80, 	type: "number", 	fixed: false,	group: null, 						format: null }, 
			{ key: "sku", 					text: "SKU", 			width: 120, 	type: "string", 	fixed: false,	group: null, 						format: null }, 
			{ key: "weight", 				text: "가중치", 		width:  80, 	type: "number", 	fixed: false,	group: null, 						format: null }, 
			{ key: "warrantyInformation", 	text: "보증정보", 		width: 160, 	type: "string", 	fixed: false,	group: null, 						format: null }, 
			{ key: "shippingInformation", 	text: "배송정보", 		width: 160, 	type: "string", 	fixed: false,	group: groupShippingInformation,	format: null }, 
			{ key: "avilabilityStatus", 	text: "가용성상태", 	width: 160, 	type: "string", 	fixed: false,	group: null, 						format: null }, 
			{ key: "returnPolicy", 			text: "환불정책", 		width: 160, 	type: "string", 	fixed: false,	group: null, 						format: null }, 
			{ key: "minimumOrderQuantity", 	text: "최소주문갯수", 	width: 120, 	type: "number", 	fixed: false,	group: null, 						format: null }, 
			{ key: "thumbnail", 			text: "썸네일", 		width: 240, 	type: "string", 	fixed: false,	group: null, 						format: null }, 
			{ key: "activeYn", 				text: "활성화여부", 	width: 120, 	type: "boolean", 	fixed: false, 	group: null, 						format: null }, 
			{ key: "insertDate", 			text: "등록일", 		width: 160, 	type: "datetime", 	fixed: false,	group: null, 						format: null }
		], 
		data: products.map(item => ({ ...item, "insertDate": new Date(), "activeYn": false })), 
		keyColumn: "id", 
		width: "100%", 
		height: 640, 
		rowHeight: 30, 
		button: {
			header: "수정", 
			text: dataItem => "print", 
			class: dataItem => "btn_flat waves-effect waves-light", 
			width: 120, 
			fixed: true, 
			visible: dataItem => true, 
			enable: dataItem => dataItem.title != "Apple", 
			onclick: dataItem => { console.log(dataItem); } 
		}
	}
});

window["fuckingNexacro"] = fuckingNexacro;
export default fuckingNexacro;