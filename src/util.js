export const formatter = {
	"numeric": (/** @type {Number} */ numeric) => new Intl.NumberFormat().format(numeric), 
	"date": (/** @type {Date} */ date) => `${zerofill(date.getFullYear(), 4)}-${zerofill(date.getMonth() + 1, 2)}-${zerofill(date.getDate(), 2)}`, 
	"time": (/** @type {Date} */ time) => `${zerofill(time.getHours(), 2)}:${zerofill(time.getMinutes(), 2)}:${zerofill(time.getSeconds(), 2)}`, 
	"datetime": (/** @type {Date} */ datetime) => `${zerofill(datetime.getFullYear(), 4)}-${zerofill(datetime.getMonth() + 1, 2)}-${zerofill(datetime.getDate(), 2)} ${zerofill(datetime.getHours(), 2)}:${zerofill(datetime.getMinutes(), 2)}:${zerofill(datetime.getSeconds(), 2)}` 
};
export const parser = {
	"numeric": (/** @type {any | String} */ value) => Number(value) == value? Number(value): (() => { throw new Error("양식이 올바르지 않습니다. 허용되는 실수를 입력해주세요."); })(), 
	"date": (/** @type {String} */ value) => /([1-2]?[0-9]{3})-((1[0-1])|(0[0-9]))-((3[0-1])|([0-2][0-9]))/.test(value)? new Date(value): (() => { throw new Error("양식이 올바르지 않습니다. 허용되는 양식은 yyyy-MM-dd 입니다."); })(), 
	"time": (/** @type {String} */ value) => /((2[0-3])|([0-1][0-9])):([0-5][0-9]):([0-5][0-9])/.test(value)? new Date("1970-01-01 " + value): (() => { throw new Error("양식이 올바르지 않습니다. 허용되는 양식은 HH:mm:ss 입니다."); })(), 
	"datetime": (/** @type {String} */ value) => /([1-2]?[0-9]{3})(-|(.\s?))((1[0-1])|(0[0-9]))(-|(.\s?))((3[0-1])|([0-2][0-9]))([T\s])((2[0-3])|([0-1][0-9])):([0-5][0-9])(:([0-5][0-9]))?/.test(value)? new Date(value): (() => { throw new Error("양식이 올바르지 않습니다. 허용되는 양식은 yyyy-MM-dd HH:mm:ss 입니다."); })()
};

export const truthy = value => value? true: false;
export const valuate = value => value || (value === Number(0)? 0: "");
export const distinct = array => [ ...new Set(...array) ];
export const zerofill = (value, length, letter) => ("" + value).length >= length? ("" + value): zerofill((letter || "0") + "" + value, length, letter);

export const getIntegratedKeyList = (...objList) => objList
		.map(objItem => Object.getOwnPropertyNames(objItem))
		.reduce((acc, cur) => [ ...new Set([ ...acc, ...cur ]) ], []);
export const getScopedDataItem = (dataItem, keyList) => {
	let result = {};

	for(let keyItem of keyList) {
		if(dataItem && dataItem[keyItem]) {
			result[keyItem] = dataItem[keyItem];
		}
	}

	return result;
};

export const similar = (obj1, obj2) => {
	if(typeof(obj1) != typeof(obj2) || Array.isArray(obj1) || typeof(obj1) != "object") {
		return false;
	}

	const keyList = getIntegratedKeyList(obj1, obj2);
	let result = true;

	const keyListObj1 = Object.getOwnPropertyNames(obj1);
	const keyListObj2 = Object.getOwnPropertyNames(obj2);
	if(keyListObj1.length != keyListObj2.length) {
		return false;
	}

	for(const keyItem of keyList) {
		result = result && (keyListObj1.indexOf(keyItem) > -1) && (keyListObj2.indexOf(keyItem) > -1);

		if(!result) {
			return result;
		}
	}

	return result;
};

export const same = (value1, value2) => {
	if(typeof(value1) != typeof(value2)) {
		return false;
	} else if(value1 == null) {
		return value2 == null;
	} else if(Array.isArray(value1)) {
		return sameArray(value1, value2);
	} else if(value1 instanceof Date) {
		return value1.getTime() == value2.getTime();
	} else if(typeof(value1) == "object") {
		return sameObject(value1, value2);
	} else {
		return value1 == value2;
	}
};
export const sameArray = (arr1, arr2) => {
	let result = arr1 != null && arr2 != null && Array.isArray(arr1) && Array.isArray(arr2) && arr1.length == arr2.length;
	if(result == false) {
		return result;
	}

	for(let index in arr1) {
		result = result && (arr1[index] == arr1? arr2[index] == arr2: same(arr1[index], arr2[index]));

		if(!result) {
			return result;
		}
	}

	return result;
};
export const sameObject = (obj1, obj2) => {
	if(obj1 == null || obj2 == null) {
		return obj1 == obj2;
	}

	const keyList = [ ...new Set([ ...Object.getOwnPropertyNames(obj1), ...Object.getOwnPropertyNames(obj2) ]) ];

	let result = (Object.getOwnPropertyNames(obj1).length == keyList.length) && (Object.getOwnPropertyNames(obj2).length == keyList.length);
	if(!result) {
		return false;
	}

	for(let key of keyList) {
		result = result && (obj1[key] == obj1? obj2[key] == obj2: same(obj1[key], obj2[key]));

		if(!result) {
			return result;
		}
	}

	return result;
};

Array.prototype["grouping"] = function(keyFunction, valueFunction) {
	const keyList = [ ...new Set(this.map(item => keyFunction(item))) ];
	let result = {};

	for(let keyItem of keyList) {
		result[keyItem] = this.filter(item => keyFunction(item) == keyItem).map(item => valueFunction && typeof(valueFunction) == "function"? valueFunction(item): item);
	}

	return result;
};

export const getEachDifferenceKeyList = (obj1, obj2) => getIntegratedKeyList(obj1, obj2).filter(keyItem => !same(obj1[keyItem], obj2[keyItem]));

window["fuckingNexacroUtil"] = () => {
	delete window["fuckingNexacroUtil"];

	window["formatter"] = formatter;
	window["parser"] = parser;
	window["truthy"] = truthy;
	window["distinct"] = distinct;
	window["zerofill"] = zerofill;
	window["getIntegratedKeyList"] = getIntegratedKeyList;
	window["getScopedDataItem"] = getScopedDataItem;
	window["similar"] = similar;
	window["same"] = same;
	window["sameArray"] = sameArray;
	window["sameObject"] = sameObject;
	window["getEachDifferenceKeyList"] = getEachDifferenceKeyList;
};