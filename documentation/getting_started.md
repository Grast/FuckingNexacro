# 시작하기
# 시작하기에 앞서 (Warm up)
~~뇌사크로인가 퇴사크로인가 암튼 그것보다 문서가 잘 작성되었다고 생각하시는 분들은 이 문서를 읽기 전에 기립박수~~<br/><br/><br/>
# 목차
- [사용 형태](#사용-형태)<br/>
- [column](#column)<br/>
  - [key](#column-key)<br/>
  - [text](#column-text)<br/>
  - [width](#column-width)<br/>
  - [type](#column-type)<br/>
  - [fixed](#column-fixed)<br/>
  - [group](#column-group)<br/>
  - [format](#column-format)<br/>
- [data](#data)<br/>
- [keyColumn](#keyColumn)<br/>
- [width](#width)<br/>
- [height](#height)<br/>
- [rowHeight](#rowHeight)<br/>
- [button](#button)<br/>
  - [header](#button-header)<br/>
  - [text](#button-text)<br/>
  - [class](#button-class)<br/>
  - [width](#button-width)<br/>
  - [fixed](#button-fixed)<br/>
  - [visible](#button-visible)<br/>
  - [enable](#button-enable)<br/>
  - [onclick](#button-onclick)<br/>
- [완성 예시](#완성-예시)<br/>
<br/><br/><br/>
# 사용 형태
다음과 같이 생성자를 호출합니다. 강력히 당부드리는 점은 생성자의 호출 위치가 페이지가 완전히 로드된 이후여야 한다는 점입니다.
```html
<!-- 데이터그리드를 배치할 위치를 지정, id 또는 class 를 통해 특정할 수 있도록 선조치 필요 -->
<div id="fuckingNexacro"></div>

<script src="준비된_번들_js파일"></script>
<script>
    // 반드시 페이지가 완전히 로드된 이후에 호출해야 합니다.
    window.addEventListener("DOMContentLoaded", () => {
        // 기본형
        const fuckingNexacro = new FuckingNexacro({
            target: document.querySelector("#fuckingNexacro"), 
            props: {
                column: [ // 표시하고자 하는 열 정보
                    { key: "idx", text: "일련번호", width: 80, type: "number", fixed: true, format: null }, 
                    { key: "username", text: "사용자명", width: 200, type: "string", fixed: false, format: value => value }
                ], 
                data: [ // 사용하고자 하는 데이터 배열, 테스트 삼아 7개만 작성
                    { idx: 0, username: "username000" }, 
                    { idx: 1, username: "username001" }, 
                    { idx: 2, username: "username010" }, 
                    { idx: 3, username: "username011" }, 
                    { idx: 4, username: "" }, 
                    { idx: 5, username: "username101" }, 
                    { idx: 6, username: "username110" }, 
                    { idx: 7, username: "username111" } 
                ], 
                keyColumn: "idx", // 존재하는 열 중 개인키가 되는 열의 key 값
                width: 1200, // 기본 입력은 Number 타입이며 "px" 단위, "1280px" 또는 "100%" 지원
                height: 768, // 기본 입력은 Number 타입이며 "px" 단위, "1280px" 또는 "100%" 지원
                rowHeight: 20 // 각 행(데이터 레코드 단건) 당 높이 지정, 무조건 "px" 단위만 가능
            }
        });
    });
</script>
```

기본형 설명은 아래와 같습니다.
```js
const fuckingNexacro = new FuckingNexacro({
    target: document.querySelector("#fuckingNexacro"), 
    props: {
        column: [ ... ], // 보여져야 할 열 정보를 배열로 전달
        data: [ ... ], 
        keyColumn: "idx", // 존재하는 열 중 개인키가 되는 열의 key 값
        width: 1200, // "1280px" 또는 "100%" 지원
        height: 768, // "1280px" 또는 "100%" 지원
        rowHeight: 20 // 각 행 당 높이를 픽셀로 지정, 무조건 "px" 단위 고정이며 다른 단위 사용 불가
    }
});
```
~~한줄로 하는게 더 이쁠것 같은데 그렇게 못만들겠음...~~<br/><br/><br/>
## column
데이터그리드에서 열 별 정보 및 서식을 지정합니다.
```js
{ key: "idx", text: "일련번호", width: 80, type: "number", fixed: true, format: null }, 
{ key: "username", text: "사용자명", width: 200, type: "string", fixed: true, format: value => ("" + value).toUpperCase() }, ...
```
반드시 주의하셔야하는 점은 column 프로퍼티는 데이터그리드를 생성할 때에만 등록이 가능하며, 데이터그리드가 생성된 이후에는 변경을 일절 허용하지 않습니다.<br/><br/><br/>
### column key
각 열 별 값을 획득하기 위한 키 값입니다. 중복 키가 포함되어서는 안됩니다.<br/><br/><br/>
### column text
데이터그리드에서 표시될 텍스트 값입니다. 다른 데이터그리드와는 다르게 FuckingNexacro 에서는 텍스트 또한 다른 열의 텍스트와 중복이 발생해서는 안됩니다.<br/><br/><br/>
### column width
각 열 별 가로폭을 지정합니다. 데이터그리드의 width/height 와는 다르게 Number 타입으로 지정받습니다.<br/><br/><br/>
### column type
[ "datetime", "time", "date", "number", "string", "boolean" ] 중에서 하나 지정하시면 됩니다. type("test") = "string" 인 만큼 소문자로 작성하시는 것을 원칙으로 합니다.<br/><br/><br/>
### column fixed
순서에 상관없이 데이터그리드의 맨 좌측 고정열로 등록할 것인지를 결정합니다. true 일 경우 스크롤에 상관없이 고정 열로 등록되며 얼마든지 고정여부는 해제가 가능합니다.<br/><br/><br/>
### column group
데이터를 input 이 아닌 select 로 지정해서 받고자 하는 경우에는 [{ value: "1", text: "1학년" }, ...] 과 같은 방식으로 지정합니다. 필요할 경우에만 사용하는 선택사항이며, 사용 시 Ctrl+C / Ctrl+V 클립보드 기능에서 해당 열은 제외됩니다.<br/><br/><br/>
### column format
실제 값이 아닌 보여져야 하는 값이 다를 경우에는 format 을 통해 표기형식을 지정할 수 있습니다. 숫자 3자리 당 콤마(,) 를 찍어야 할 경우에는 value => new Intl.NumberFormat().format(value) 와 같이 사용할 수 있습니다. 사용 시 Ctrl+C / Ctrl+V 클립보드 기능에서 해당 열은 제외됩니다.<br/><br/><br/>
## data
데이터그리드를 통해 취급하고자 하는 데이터 집합입니다. 단건이라도 반드시 배열로 감싸서 전달이 되어야 합니다.<br/>
column 프로퍼티와는 다르게 데이터그리드가 생성이 된 이후라도 얼마든지 데이터를 수정하거나 획득할 수 있기 때문에 취급 및 사용방법에 제약이 없이 자유롭게 다룰 수 있습니다.<br/><br/><br/>
## keyColumn
column 목록 중 개인키로 사용되는 열의 key 값을 단독으로 입력합니다. 개인키를 취급하지 않는 데이터는 사용할 수 없습니다.<br/>
또한, 입력된 keyColumn 과 동일한 key 를 가진 열이 column 프로퍼티에 없는 경우에는 생성 단계에서 오류를 반환합니다.

${\textsf{\color{red}(중요)}}$ 다중 keyColumn 이 요구되는 데이터 구조는 사용할 수 없습니다. keyColumn 은 오로지 1개의 열만을 특정해야하며, 이 구조에서 벗어나는 데이터를 취급할 수 없습니다. 이는 기술적 한계가 아닌 개발방침입니다.<br/><br/><br/>
## width
데이터그리드의 가로 폭을 지정합니다. number 타입으로 입력할 경우 자동으로 px 단위로 지정되며, 문자형으로 직접 1200px 와 같이 입력할 수도 있으며, "100%" 처럼 백분위로도 입력이 가능합니다.<br/><br/><br/>
## height
데이터그리드의 세로 높이를 지정합니다. width 와 동일한 사용법 및 특성을 가집니다.<br/><br/><br/>
## rowHeight
데이터 레코드 1건 당 행의 높이를 차지할 높이 픽셀을 지정합니다. 무조건 px 단위로만 지정이 되며, number 타입으로 입력해야 합니다.<br/><br/><br/>
## button
데이터그리드의 가장 우측에 고정적으로 보여지도록 하는 기능버튼을 정의합니다.
```js
button: {
    header: "수정", 
    text: dataItem => "print", 
    class: dataItem => "btn_flat waves-effect waves-light", 
    width: 120, 
    fixed: true, 
    visible: dataItem => false, 
    enable: dataItem => false, 
    onclick: dataItem => { console.log(dataItem); } 
}
```
다수 버튼은 지원하지 않으며, 무조건 단일 버튼만을 제공하기 때문에 다수의 기능이 필요할 경우에는 별도의 콜백 처리를 이용하시기 바랍니다.<br/><br/><br/>
### button header
데이터그리드의 열 리스트에서 보여질 텍스트를 지정합니다.<br/><br/><br/>
### button text
각 데이터레코드 별 버튼에 보여질 텍스트를 지정합니다. 문자 리터럴이 아닌 데이터를 받는 함수식을 통해 작성함에 유의하세요.<br/><br/><br/>
### button class
버튼에 부여할 클래스를 문자열로 미리 지정합니다. 데이터의 정보에 따라 별개의 클래스를 부여하는것도 가능하나 이 역시 데이터를 받는 함수식으로 작성함에 유의하세요.<br/><br/><br/>
### button width
버튼 열의 폭을 지정합니다. 모든 데이터레코드에 동일한 폭이 지정됩니다.<br/><br/><br/>
### button fixed
좌우 스크롤에 상관없이 데이터그리드의 무조건 우측에 고정되어 보여질 것인지를 지정합니다.<br/><br/><br/>
### button visible
버튼의 가시성 유무를 지정합니다. 버튼을 보이지 않게 할 수 있습니다.<br/><br/><br/>
### button enable
버튼의 활성화 유무를 지정합니다. 버튼을 비활성화 시킬 수 있습니다. 가시성과 별개로 작동하며 따로 관리합니다.<br/><br/><br/>
### button onclick
버튼을 클릭했을 때 실행될 콜백함수를 지정합니다. dataItem 인자를 전달받습니다.<br/><br/><br/>
## 생성자 관련 기능 및 정의
### 그룹 설정 (column.group)
```js
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
            { key: "category", text: "분류", width: 120, type: "string", fixed: false, group: groupCategory, format: null }, 
            { key: "shippingInformation", text: "배송정보", width: 160, type: "string", fixed: false, group: groupShippingInformation, format: null }, ...
        ], ... // 이하 생략
    }
});
```
위 예시 중에서 category, shippingInformation 열을 보시면 2개 열에 한해서만 group 프로퍼티가 정의되어있는것을 보실 수 있습니다.<br/>
<code>[{ "value": 실제 값, "text": 보여질 문구 }, ...]</code> 형태로 작성해서 부여하게 되면 해당 열은 select 선텍열로 적용됩니다.

주의하셔야할 것은 group 이 지정된, 한정된 데이터만 기입될 수 있는 열은 데이터그리드 <-> 엑셀 간 클립보드 복사/붙여넣기에서 제외됩니다.<br/>
또한, 데이터그리드에서 무조건 value 값이 아닌 text 값으로 출력되므로, value 값이 출력되어야하는 경우는 text 값을 value 와 동일하게 지정하셔야 합니다.</br></br></br>

### 포맷 설정 (column.format)
```js
const fuckingNexacro = new FuckingNexacro({
    target: document.querySelector("#fuckingNexacro"), 
    props: {
        column: [
            { key: "dimensions", text: "부피", width: 240, type: "string", fixed: false, group: null, format: value => `${value?.width || 0}w * ${value?.height || 0}h * ${value?.depth || 0}d` }
        ], ...
    }
});
```
사용자 화면에서 데이터그리드가 출력하고자 하는 형식을 지정합니다. 예를 들어 
```js
// 아리왜 같이 절대온도 데이터가 있는데
let 절대온도 = 300;
// 암만 봐도 절대온도가 화씨온도보다 덜 쓰인다. 이해하기 쉽게 섭씨온도로 바꿔서 표기해야겠다
format = value => value - 273;
```
와 같이 하나의 데이터이지만 문화권 또는 제도권에 따라 받아들이는 데이터가 다르거나, 취지에 따라 보여져야하는 형식이 다를 경우에는 format 프로퍼티를 지정할 수 있습니다. (단, 데이터그리드 초기화 시에 부여한 format 은 데이터그리드가 렌더링 된 이후 변경할 수 없으니 참고하세요.)<br/><br/><br/>

### 버튼 설정 (button)
```js
const fuckingNexacro = new FuckingNexacro({
    target: document.querySelector("#fuckingNexacro"), 
    props: {
        column: ..., 
        data: ..., 
        keyColumn: ..., 
        width: ..., 
        height: ..., 
        rowHeight: ..., 
        button: {
            header: "수정", 
            text: dataItem => "print", 
            class: dataItem => "btn_flat waves-effect waves-light", 
            width: 120, 
            fixed: true, 
            visible: dataItem => false, 
            enable: dataItem => false, 
            onclick: dataItem => { console.log(dataItem); } 
        }
    }
});
```
데이터를 출력하는 열이 아닌 각 데이터 레코드 당 기능을 담당하기 위한 버튼전용 열을 별도로 지정할 수 있습니다.<br/>
(단, 데이터그리드 초기화 시에만 지정이 가능하며, 생성된 이후에는 추가할 수 없습니다. 대신 버튼을 숨기고 보여지게 하는 기능은 제공됩니다.)

다중 버튼을 지원하지 않으므로 여러개의 버튼이 필요한 경우에는 버튼 클릭이벤트를 통해 여러 기능으로 분기처리가 가능한 별도의 이벤트를 지정하셔야 합니다.<br/><br/><br/>
# 완성 예시
```js
// 모든 기능을 사용할 경우
<script>
    window.addEventListener("DOMContentLoaded", () => {
        const fuckingNexacro = new FuckingNexacro({
            target: document.querySelector("#fuckingNexacro"), 
            props: {
                column: [
                    { key: "id",                    text: "ID",             width:  80,     type: "number",     fixed: true,    group: null,     format: null }, 
                    { key: "title",                 text: "제품명",         width: 160,     type: "string",     fixed: true,    group: null,     format: null }, 
                    { key: "description",           text: "설명",           width: 320,     type: "string",     fixed: false,   group: null,     format: null }, 
                    { key: "category",              text: "분류",           width: 120,     type: "string",     fixed: false,   group: null,     format: null }, 
                    { key: "price",                 text: "가격",           width:  80,     type: "number",     fixed: false,   group: null,     format: null }, 
                    { key: "discountPercentage",    text: "할인율",         width:  80,     type: "number",     fixed: false,   group: null,     format: null }, 
                    { key: "rating",                text: "평점",           width:  80,     type: "number",     fixed: false,   group: null,     format: null }, 
                    { key: "stock",                 text: "재고",           width:  80,     type: "number",     fixed: false,   group: null,     format: null }, 
                    { key: "tags",                  text: "태그",           width: 160,     type: "string",     fixed: false,   group: null,     format: null }, 
                    { key: "brand",                 text: "브랜드",         width: 160,     type: "string",     fixed: false,   group: null,     format: null }, 
                    { key: "sku",                   text: "SKU",            width: 120,     type: "string",     fixed: false,   group: null,     format: null }, 
                    { key: "weight",                text: "가중치",         width:  80,     type: "number",     fixed: false,   group: null,     format: null }, 
                    { key: "dimensions",            text: "부피",           width: 240,     type: "string",     fixed: false,   group: null,     format: value => `${value?.width || 0}w * ${value?.height || 0}h * ${value?.depth || 0}d` }, 
                    { key: "warrantyInformation",   text: "보증정보",       width: 160,     type: "string",     fixed: false,   group: null,     format: null }, 
                    { key: "shippingInformation",   text: "배송정보",       width: 160,     type: "string",     fixed: false,   group: null,     format: null }, 
                    { key: "avilabilityStatus",     text: "가용성상태",     width: 160,     type: "string",     fixed: false,   group: null,     format: null }, 
                    { key: "returnPolicy",          text: "환불정책",       width: 160,     type: "string",     fixed: false,   group: null,     format: null }, 
                    { key: "minimumOrderQuantity",  text: "최소주문갯수",   width: 120,     type: "string",     fixed: false,   group: null,     format: null }, 
                    { key: "images",                text: "이미지",         width: 240,     type: "string",     fixed: false,   group: null,     format: null }, 
                    { key: "thumbnail",             text: "썸네일",         width: 240,     type: "string",     fixed: false,   group: null,     format: null }
                ], 
                data: [{ ... }, ...], 
                keyColumn: "id", 
                width: 1280, 
                height: 768, 
                rowHeight: 24, 
                button: {
                    header: "수정", 
                    text: dataItem => "print", 
                    class: dataItem => "btn_flat waves-effect waves-light", 
                    width: 120, 
                    fixed: true, 
                    visible: dataItem => false, 
                    enable: dataItem => false, 
                    onclick: dataItem => { console.log(dataItem); } 
                }
            }
        });
    });
</script>
```
