# api
## 시작하기에 앞서 (Attention)
가급적 화살표 함수를 사용해주세요. 아직도 남아있는 IE 를 완전히 박멸하는데 도움이 됩니다.

~~???: 저는 넥사크로를 깔 때는 돌아이가 돼요~~<br/>
~~이거 가짜광기 아닌데... 진심인데...~~<br/><br/><br/>
## 초기화
Link: [시작하기](./getting_started.md) 문서를 참고해주세요. ~~내용이 너무 길어져서 별도의 항목으로 분리~~<br/><br/><br/>
## 데이터그리드 관련 메소드
### 수정가능/읽기전용 지정하기 (setEditable, setReadonly)
```js
void setEditable();
void setReadonly();
```
데이터그리드의 모드를 설정합니다. 모드는 수정가능/읽기전용 2개이며, 프로퍼티를 받는 방식이 아닌 별개의 함수로 작동하는 구조임에 유의 바랍니다.<br/>
또한, 모든 셀의 데이터 수정 또한 불가능해집니다.

> readonly 설정 시 아래 메소드가 모두 실행이 차단됩니다. 주의바랍니다.<br/><br/>
> 키보드 Insert 키 입력 이벤트<br/>
> 키보드 Delete 키 입력 이벤트<br/>
> 키보드 Ctrl + V 키 입력 이벤트<br/>
> setColumnGroup 메소드<br/>
> setDataList 메소드<br/>
> addDataList 메소드<br/>
> mergeDataList 메소드<br/>
> bulkEdit 메소드<br/>
> deleteDataList 메소드<br/>
> deleteInvalidAllDataList 메소드<br/>
> dropDataList 메소드<br/>
> commit 메소드<br/>
> rollback 메소드<br/>
> sort 메소드<br/>
> setOnDataChange 메소드<br/>
> setOnDataCheck 메소드<br/>
> setOnDataPaste 메소드

setEditable 은 해당사항이 없으나 setReadonly 는 편집중이거나 수정된 데이터가 존재할 경우 메소드 호출이 차단됩니다. rollback() 을 통해 수정된 데이터를 되돌린 후 읽기전용으로 지정해주세요.<br/><br/><br/>
### 트랜잭션 모드 활성화/비활성화하기 (setTransactionEnabled, setTransactionDisabled)
```js
void setTransactionEnabled();
void setTransactionDisabled();
```
데이터그리드의 트랜잭션 모드를 활성화/비활성화 합니다. 커밋(commit())/롤백(rollback()) 관련 기능이 모두 사용가능/차단되며, 전문적인 데이터 수정이 필요할 경우에는 트랜잭션 모드를 활성화할 수 있습니다.<br/>
디폴트는 비활성화(disabled) 이며, 트랜잭션 기능을 활성화시키면 커밋/롤백 기능을 위한 추가기능이 제공되는 대신 약간의 성능저하가 따를 수 있습니다.<br/>
${\textsf{\color{red}(setTransactionEnabled 한정으로, 반드시 데이터 수정 중에 호출하지 마세요. 데이터 수정 중에 호출할 경우 수정중인 데이터가 원본으로 취급됩니다. 트랜잭션 관리 모드에서 권장되는 취급데이터 갯수는 100개입니다.)}}$<br/><br/><br/>
## 열 관련 메소드
### 열 목록 조회 (getColumnList)
```js
Array<{ key, text, width, type, fixed, group?, format? }> fuckingNexacro.getColumnList();
```
현재 적용된 열 목록을 가져옵니다. 읽기전용이며, 객체생성 시 1회 지정 후 수정은 불가능합니다.<br/><br/><br/>
### 특정 열 고정 (setFixed)
```js
void fuckingNexacro.setFixed({0}, {1});
    {0}: { "key": ... } 형태의 columnItem: object
    {1}: boolean
```
특정된 열의 고정여부를 변경합니다. 고정 및 비고정 열의 순서는 columnList 를 따릅니다.
```js
// columnList 에 속한 아이템 그대로 0번째 인자에 넣는것을 추천합니다. 간략화된 방식으로 { "key": "고정/비고정 변경 열의 key 값" } 으로 전달되어도 괜찮습니다.
fuckingNexacro.setFixed({ "key": "description" }, true);

// 비추천
fuckingNexacro.setFixed("description", true);
```
<br/><br/><br/>

### 전체 열 고정 해제 (unsetFixedAll)
```js
void fuckingNexacro.unsetFixedAll();
```
고정 열을 모두 해제합니다. 초기 객체를 생성할 때 설정된 고정여부도 모두 해제됩니다. 고정 열의 폭이 컴포넌트의 width 를 초과해 제대로된 출력이 불가능할 경우 사용합니다.<br/><br/><br/>
### 헤더 숨기기/보이기 (hideHeader, showHeader)
```js
void fuckingNexacro.hideHeader();
void fuckingNexacro.showHeader();
```
열을 표시하는 헤더의 가시성 유무를 결정합니다. 헤더를 숨기거나 표시할 수 있으나, 숨길 경우 열 더블클릭 이벤트 기능을 사용할 수 없게 됩니다.<br/><br/><br/>
### 특정 열 숨기기/보이기 (hideColumn, showColumn)
```js
void fuckingNexacro.hideColumn({0});
void fuckingNexacro.showColumn({0});
    {0}: { "key": ... } 형태의 columnItem: object
```
지정된 열의 가시성 유무를 결정합니다. 특정 열이 보여져선 안되거나 표시되어야 할 데이터가 너무 방대해 가시성 결정이 필요할 경우 사용합니다. 이 역시 숨길 경우 열 더블클릭 이벤트 기능을 사용할 수 없게 됩니다.<br/><br/><br/>
### 체크박스 열 숨기기/보이기 (hideCheckboxColumn, showCheckboxColumn)
```js
void fuckingNexacro.hideCheckboxColumn();
void fuckingNexacro.showCheckboxColumn();
```
체크박스가 등장하는 가장 좌측의 열의 가시성 유무를 결정합니다. 체크박스 기능을 사용하지 않을때는 디자인 관점에서 숨기는 것도 가능합니다.<br/><br/><br/>
### 버튼 열 숨기기/보이기 (hideButtonColumn, showButtonColumn)
```js
void fuckingNexacro.hideButtonColumn();
void fuckingNexacro.showButtonColumn();
```
버튼이 등장하는 가장 우측의 열의 가시성 유무를 결정합니다. 버튼 기능을 사용하지 않을때는 디자인 관점에서 숨기는것도 가능합니다.<br/><br/><br/>
### 특정된 열의 group 정보 가져오기 (group: 컴포넌트 생성 시에 column 마다 지정했었던 group 데이터)
```js
Array<any> fuckingNexacro.getColumnGroup({0});
    {0}: { "key": ... } 형태의 columnItem: object, 열 group 데이터를 조회하기 위한 기준정보
```
데이터그리드 생성자 호출 시 전달되었던 열의 group 정보를 조회하기 위한 메소드입니다. key를 통해 하나의 열을 특정할 수 있어야 합니다.<br/><br/><br/>
### 특정한 열의 group 정보 수정하기 (group: 컴포넌트 생성 시에 column 마다 지정했었던 group 데이터)
```js
void fuckingNexacro.setColumnGroup({0}, {1});
    {0}: { "key": ... } 형태의 columnItem: object, 열 group 데이터를 수정하기 위한 기준정보
    {1}: 수정하고자 하는 Array<any> 형식의 배열 정보
```
열 하나를 특정하여 그 열의 group 정보를 새로 지정합니다. 기존에 지정되었던 group 기반으로 선택되었던 데이터는 그대로 유지되나 유효성을 상실했을 가능성이 있으니 별개의 처리가 필요하신 경우에는 하단의 bulkEdit(데이터 관련 함수) 를 이용하여 유효성을 만족하지 못한 데이터들을 일괄 수정하시기 바랍니다.
```js
// 초기에 지정된 열의 group 상태가 아래와 같다고 가정을 할 경우
fuckingNexacro.setColumnGroup({ "key": "rank" }, [
    { "value": "A", "text": "A급" }, 
    { "value": "B", "text": "B급" }, 
    { "value": "C", "text": "C급" }
]);

// 아래와 같이 새로운 group 지정이 발생할 경우, C 값을 가지고 있는 데이터 레코드는 그 즉시 데이터 유효성을 상실하는것과 같음
fuckingNexacro.setColumnGroup({ "key": "rank" }, [
    { "value": "S", "text": "S급" }, 
    { "value": "A", "text": "A급" }, 
    { "value": "B", "text": "B급" }
]);

// 기존에 가지고 있던 랭크를 일괄 1단계씩 상향하여 A->S, B->A, C->B 방식으로 업데이트를 하고자 할 경우, 전체 데이터가 대상이라면 bulkEdit(아래에 후술) 메소드를 이용할 수 있음
fuckingNexacro.bulkEdit(dataItem => {
    switch(dataItem.rank) {
        case "A": dataItem.rank = "S"; break;
        case "B": dataItem.rank = "A"; break;
        case "C": dataItem.rank = "B"; break;
        default: throw new Error("대충 강호동이 해맑게 \"실패\" 외치는 짤");
    }

    return dataItem;
});
```
※ 주의: 사용중인 유효값을 제거하는 경우 셀에서는 어떠한 데이터도 표기되지 않습니다. 잘못된 그룹 데이터를 지정하는 순간부터 시각적으로 분별할 방법이 없으니 동적으로 그룹 데이터를 변경해야 할 상황 또는 그러한 기능이 요구되는 경우에는 개발 시 주의 바랍니다.<br/>
※ 주의: 데이터와는 달리 열 정보(즉, 헤더)를 수정하는 기능이기 때문에 commit, rollback 의 범위를 벗어납니다. 잘못된 그룹 데이터를 지정할 경우 되돌릴 방법이 없으므로 주의바라며, 그룹 데이터로 사용하고자 하는 데이터는 group: [] 가 아닌 따로 변수로 관리하여 group: groupArray 형태로 사용하도록 추천합니다.
<br/><br/><br/>

## 열 관련 이벤트
### 열 더블클릭 콜백이벤트 지정 (setOnColumnDoubleClick)
```js
void fuckingNexacro.setOnColumnDoubleClick({0});
    {0}: columnItem 를 인자로 제공받는 콜백함수 (Consumer<columnItem> arg0 => void)
```
헤더 열 정보를 더블클릭할 경우의 콜백함수를 지정합니다. 인자 1개를 넘겨받는 함수 형태여야 합니다. 콜백인자 arg0 은 columnList 를 통해 전달된 인자목록 중 더블클릭한 열 인자 정보 1건만을 제공받습니다.
```js
// 헤더의 열 정보를 더블클릭할 때 마다 데이터의 정렬이 해당 열을 기준으로 오름차순/내림차순으로 정렬됩니다.
fuckingNexacro.setOnColumnDoubleClick(columnItem => fuckingNexacro.sort(columnItem));

// 열 더블클릭 이벤트를 제거합니다. 더블클릭을 해도 더이상 어떤 상호작용도 하지 않게 됩니다. 열 더블클릭 이벤트가 필요하지 않을 경우 null 을 전달하여 기능을 해제할 수 있습니다.
fuckingNexacro.setOnColumnDoubleClick(null); 
```
<br/><br/><br/>

## 데이터 관련 메소드
### 데이터 목록 조회 및 데이터 입력 (getDataList, setDataList)
```js
Array<any> fuckingNexacro.getDataList();
void fuckingNexacro.setDataList({0});
    {0}: 데이터 배열, [{ ... }, ...] 처럼 자유 object 형식
```
getDataList 는 데이터 목록을 배열로 가져옵니다. 자유 object 형식이며 어떤 제한도 없습니다.
setDataList 는 데이터 목록을 덮어씁니다. 기존의 데이터는 일절 획득하지 않고 덮어쓰므로 저장되지 않은 데이터의 유실에 주의해야 합니다. set 된 데이터를 기반으로 아래의 rollback 메소드가 작동합니다.<br/><br/><br/>
### 데이터 추가 (addDataList)
```js
void fuckingNexacro.addDataList({0});
    {0}: 데이터 배열, [{ ... }, ...] 처럼 자유 object 형식
```
데이터 목록을 가장 맨 뒷순번에 이어붙입니다. 빈 아이템 1건만 추가할 경우에는 [{}] 처럼 배열로 감싸셔야 합니다.
데이터 삽입의 위치가 맨 뒤가 아닌 맨 앞일 경우에는 [ {}, ...fuckingNexacro.getDataList() ] 의 형태가 되어야 하지만 이 경우에는 setDataList 를 사용해야하며, rollback 데이터 유실 및 변형에 유의 바랍니다.<br/><br/><br/>
### 데이터 병합 (mergeDataList)
```js
void fuckingNexacro.mergeDataList({0});
    {0}: 데이터 배열, [{ ... }, ...] 처럼 자유 object 형식
```
데이터 목록을 병합합니다. 기존에 가지고 있는 데이터목록 중 keyColumn 을 기준으로 이미 데이터가 존재할 경우에는 update 로 처리되며, keyColumn 기준으로 존재하지 않는 데이터는 최하단에 신규로 추가됩니다.<br/><br/><br/>
### 데이터 일괄 수정 (bulkEdit)
```js
void fuckingNexacro.bulkEdit({0});
    {0}: map 함수식, dataItem 을 받아 dataItem 을 반환하는 함수식을 전달

// 모든 제품 이름의 앞에 "ㅋㅋㅋ" 을 붙이는 방법
fuckingNexacro.bulkEdit(dataItem => {
    dataItem.title = "ㅋㅋㅋ " + dataItem.title;
    // 조건부로 한번 더 (단, 사용하고자 하는 데이터의 특성을 개발자가 파악하고 있어야 함)
    if(dataItem.id == "10") {
        dataItem.title = "ㅋㅋㅋ " + dataItem.title;
    }
    
    return dataItem;
});
```
모든 데이터들을 일괄 수정합니다. 조건부 데이터 수정이 필요한 경우 아규먼트로 전달될 함수식에서 개발자가 직접 if 또는 switch 등을 이용해 조건부 수정을 지정할 수도 있습니다.<br/>
수정된 데이터는 롤백이 가능하지만 사용 시 주의가 필요합니다.<br/><br/><br/>
### 데이터 삭제 (deleteDataList)
```js
void fuckingNexacro.deleteDataList({0});
    {0}: 데이터 배열, [{ ... }, ...] 처럼 자유 object 형식
```
데이터 목록에서 전달된 패러미터 데이터와 keyColumn 이 동일한 데이터를 삭제합니다. [{ 객체생성 시 지정한 keyColumn: 1 }, { 객체생성 시 지정한 keyColumn: 2 }] 와 같이 keyColumn 정보만을 가지는 축약형 object 를 전달해도 괜찮습니다.
```js
// 체크박스가 선택된 데이터들을 모두 삭제합니다. getCheckedDataList 는 아래에 설명되어있습니다.
fuckingNexacro.deleteDataList(fuckingNexacro.getCheckedDataList());
```
<br/><br/><br/>

### 유효성을 만족하지 못한 모든 데이터 삭제 (deleteInvalidAllDataList)
```js
void fuckingNexacro.deleteInvalidAllDataList();
```
데이터 목록 중 유효성 조건을 만족하지 못한 모든 데이터를 삭제합니다. 유효성 조건은 setCommitValidator(아래에 나옴) 메소드를 통해 지정하며, 유효성 접근이 지정되지 않은 상태에서 호출 시 무시됩니다.<br/>
유효성 접근이 지정되지 않은 상태에서는 아무런 에러도 알림도 없이 호출이 무시되므로 반드시 참고바랍니다.<br/><br/><br/>
### 데이터 전체 삭제 (dropDataList)
```js
void fuckingNexacro.dropDataList();
```
데이터그리드를 통해 사용 및 접근 가능한 모든 데이터를 삭제합니다. 자동 커밋이 아니기 때문에 롤백이 가능합니다. 선택 및 체크 유무에 상관없이 모든 데이터를 제거하고자 할 때 사용합니다.<br/><br/><br/>
### 커밋, 롤백 (commit, rollback)
```js
Array<any> fuckingNexacro.commit();
void fuckingNexacro.rollback();
```
데이터그리드의 자체적인 커밋 롤백입니다. 마지막으로 setDataList 를 통해 전달된 데이터를 기준으로 수정된 데이터를 덮어쓰거나 수정된 정보를 저장하지 않고 기존 정보로 되돌립니다. 데이터그리드 자체의 기능이므로 백엔드와의 상호작용 및 관계는 일절 없습니다.<br/>
rollback() 은 아무런 반환데이터가 없지만 commit() 은 커밋이 성공한 최종데이터를 반환합니다. 백엔드와 통신할 경우에는 getDataList 보다는 commit 을 통해 반환되는 데이터배열을 이용하는 방법도 있습니다.<br/><br/><br/>
### 체크된 데이터 목록 조회 및 지정 (getCheckedDataList, setCheckedDataList)
```js
Array<any> fuckingNexacro.getCheckedDataList();
void fuckingNexacro.setCheckedDataList({0});
    {0}: 데이터 배열, [{ ... }, ...] 처럼 자유 object 형식
```
아이템의 체크여부를 조회하거나 지정합니다. 체크박스 항목을 setCheckedDataList 로 지정할 때는 keyColumn 을 통해 지정하되 { 객체 생성시 지정한 keyColumn: "1" } 처럼 keyColumn 만 포함하는 축약형 object 도 사용할 수 있습니다.<br/><br/><br/>
### 선택된 데이터 목록 조회 및 지정 (getSelectedDataList, setSelectedDataList)
```js
Array<any> fuckingNexacro.getSelectedDataList();
void fuckingNexacro.setSelectedDataList({0});
    {0}: 데이터 배열, [{ ... }, ...] 처럼 자유 object 형식
```
아이템의 선택여부를 조회하거나 지정합니다. 선택 항목을 setSelectedDataList 로 지정할 때는 keyColumn 을 통해 지정하되 { 객체 생성시 지정한 keyColumn: "1" } 처럼 keyColumn 만 포함하는 축약형 object 도 사용할 수 있습니다.<br/>
.fn_row_selected 클래스가 css 로 디자인되어있지 않을 경우 setSelectedDataList 를 하더라도 화면상 아무런 변화도 없습니다.<br/><br/><br/>
### 데이터의 정렬기준을 지정 (sort)
```js
void fuckingNexacro.sort({ ... }, "asc"/"desc");
```
데이터의 정렬기준을 지정합니다. 열 key 와 asc/desc 플래그값을 전달합니다. 열 key 와 asc/desc 플래그값이 모두 없을 경우 keyColumn 오름차순(기본 정렬기준)으로 초기화(정렬해제)됩니다.<br/>
단, 커밋되지 않은 데이터 중 keyColumn 이 부여되지 않아 insert 대상이 될 데이터는 asc/desc 여부에 상관없이 무조건 최하단에 강제 배치됩니다.
```js
// title 열을 기준으로 오름차순(작은값부터 큰값 방향으로) 정렬
void fuckingNexacro.sort({ "key": "title" }, "asc");

// description 열을 기준으로 내림차순(큰값부터 작은값 방향으로) 정렬
void fuckingNexacro.sort({ "key": "description" }, "desc");

// 정렬방법을 언급하지 않고 열만 전달해서 정렬하는 방법, 홀수째 시행 시에는 asc 로, 짝수째 시행 시에는 desc 로 자동 적용
void fuckingNexacro.sort({ "key": "title" });

// 정렬 해제, keyColumn asc 기본값으로 정렬
void fuckingNexacro.sort();
```
<br/><br/><br/>

### 데이터의 보이기/숨기기 기준을 지정 (setDataFilter)
```js
any fuckingNexacro.setDataFilter({0});
    {0}: 콜백함수 (Predicate<dataItem: any, dataIndex: number> arg0 => boolean)
```
데이터 중에서 표시될 데이터와 숨길 데이터의 기준을 지정합니다. 각 데이터 건을 기준으로 인자로 전달된 콜백함수의 기준을 true 로 통과한 데이터만 출력되며 이외의 데이터는 모두 .fn_gone 클래스를 가짐으로써 숨김처리 됩니다. 콜백인자 arg0 은 목록에 있는 모든 데이터를 1건씩 전달받습니다.

또한, 이벤트 지정 메소드 중에서 리턴값이 있는 이벤트 지정 함수이며, 이벤트 지정과 동시에 결과값이 전달됩니다. 결과값은 <code>{ "visible": [ 보여지는 데이터 목록 ], "hidden": [ 숨겨지는 데이터 목록 ] }</code> 형식으로 제공됩니다. 이는 다른 이벤트 지정 메소드와 달리 setDataFilter 메소드에서만 지원된다는 특징이 있습니다. ~~제발 여기서 리턴값 준다고 다른 이벤트에도 리턴값 붙여달라고 하지마...~~
```js
// 가격이 5 이상인 데이터만 보여지고 나머지는 모두 숨김처리
const filterResult = fuckingNexacro.setDataFilter((dataItem, dataIndex) => dataItem.price > 5); // filterResult.visible 은 조건(가격이 5 이상)을 만족하는 데이터 목록이, filterResult.hidden 은 조건을 만족하지 못하는 나머지 데이터들이 포함됨

// 제목에 "fuckingNexacro"를 포함하는 데이터만 보여지고 나머지는 모두 숨김처리
fuckingNexacro.setDataFilter((dataItem, dataIndex) => dataItem.title.includes("fuckingNexacro"));

// 짝수 데이터만 보이고 나머지는 모두 숨김처리 (0번 데이터 포함)
fuckingNexacro.setDataFilter((dataItem, dataIndex) => dataIndex % 2 == 0);

// 모든 필터링 지정조건을 해제하여 모든 데이터가 보여지도록 처리
fuckingNexacro.setDataFilter(dataItem => true);
fuckingNexacro.setDataFilter(null);
```
<br/><br/><br/>

### 데이터 찾기 (firstFirst)
```js
Array<any> fuckingNexacro.findFirst({0});
    {0}: dataItem: object 를 인자로 제공받는 검색조건식 (Predicate<dataItem> arg0 => boolean)
```
데이터를 캡쳐합니다. setDataFilter 가 데이터그리드에서 레코드의 보임/숨김을 결정한다면 findFirst/findNext 는 검색조건에 합치하는 데이터 레코드를 한번씩 순회합니다. 검색조건을 만족하는 마지막 레코드에 도달하면 첫번째 데이터레코드로 되돌아가서 순회를 반복합니다.
```js
// ID 가 짝수인 데이터만 검색
fuckingNexacro.findFirst(dataItem => dataItem.id % 2 == 0);
// 제목(title)에 알파벳 "a" 가 없는 데이터만 검색
fuckingNexacro.findFirst(dataItem => dataItem.title.indexOf("a") == -1);
// 결과적으로 어떤 캡쳐 조건식이든 캡쳐된 데이터가 한 건도 없을 경우에는 예외를 반환
fuckingNexacro.findFirst(dataItem => false); // 예외 발생, exception thrown
```
findFirst 를 통해 반환되는 데이터는 캡쳐 조건을 만족하는 모든 데이터를 반환합니다. 캡쳐된 데이터가 단 한 건도 없을 경우에는 예외를 발생며, 한 건이라도 캡쳐된 경우 배열 형태로 반환됩니다.

<br/><br/><br/>

### 다음 데이터 찾기 (findNext)
```js
any fuckingNexacro.findNext();
```
findFirst 를 통해 캡쳐된 데이터를 첫번째부터 마지막 아이템까지 순차적으로 조회합니다. 순서는 dataList 에서 정렬된 순서를 따르며, 캡쳐된 데이터가 없을 경우에는 실행되지 않고 예외를 반환합니다. 한 건씩 데이터를 반환하며, 데이터그리드에서 해당되는 데이터 레코드의 위치로 자동으로 스크롤링 됩니다.
```js
// 최초 findFirst
fuckingNexacro.findFirst(dataItem => dataItem.title.indexOf("a") > -1);
// 최초 findFirst 에서 정상적으로 1건 이상의 데이터가 캡쳐되었다고 가정할 경우
fuckingNexacro.findNext(); // 캡쳐된 첫번째 데이터를 반환하며, 데이터그리드는 첫번째 캡쳐된 데이터의 위치로 자동 스크롤됨
fuckingNexacro.findNext(); // 다음 캡쳐된 데이터를 반환하며, 데이터그리드는 다음 캡쳐된 데이터의 위치로 자동 스크롤됨
fuckingNexacro.findNext(); // 다음 캡쳐된 데이터를 반환하며, 데이터그리드는 다음 캡쳐된 데이터의 위치로 자동 스크롤됨
...
...
...
// 고만해 미친놈들아
...
fuckingNexacro.findNext(); // 캡쳐된 마지막 데이터까지 도달할 경우
fuckingNexacro.findNext(); // 캡쳐된 첫번째 데이터로 돌아가 다시 순회를 반복하며, 자동 스크롤링 또한 캡쳐된 첫번째 데이터의 위치로 스크롤됨
```
간단하게, 크롬/엣지 등에서 Ctrl+F 페이지에서 찾기 기능을 데이터그리드 버전으로 구현했다고 이해하시면 됩니다.
<br/><br/><br/>

### 데이터의 인덱스를 기반으로 강제스크롤 (goToScroll)
```js
void fuckingNexacro.goToScroll({0});
    {0}: 스크롤하고자 하는 데이터의 인덱스, 숨겨져있는 경우 작동하지 않을 수 있음
```
데이터의 인덱스를 알고 있다는 가정 하에 인덱스와 일치하는 데이터레코드의 위치로 바로 이동합니다.

```js
// 첫번째 항목으로 이동
fuckingNexacro.goToScroll(0);
// 마지막 항목으로 이동
const lastIndex = fuckingNexacro.getDataList().length - 1;
fuckingNexacro.goToScroll(lastIndex);
```
<br/><br/><br/>

### 데이터의 열 단위 조건부 서식을 지정 (setRowClass)
```js
void fuckingNexacro.setRowClass({0});
    {0}: 콜백함수 (BiConsumer<dataItem: any, dataIndex: number> arg0 => Array<string>)
```
데이터의 현재 입력값에 따라 row 에 사용자가 직접 클래스 부여를 지정할 수 있습니다. commitValidator 와는 달리 데이터에 따라 커스텀으로 클래스를 부여하기 때문에 조건부 서식을 구현할 수 있습니다.
```js
// 할인율이 5 이하인 제품은 .custom, 5~10 인 제품은 .custom.custom_low_discount, 10~20 인 제품은 .custom.custom_mid_discount, 20 이상인 제품은 .custom.custom_high_discount 클래스를 적용
fuckingNexacro.setRowClass((dataItem, dataIndex) => {
    const discountPercentage = dataItem?.discountPercentage;

    return 20 <= discountPercentage? [ "custom", "custom_high_discount" ]: 
            10 <= discountPercentage && discountPercentage < 20? [ "custom", "custom_mid_discount" ]: 
             5 <= discountPercentage && discountPercentage < 10? [ "custom", "custom_low_discount" ]: 
            [ "custom" ];
    // 문자열 배열로 반환을 하도록 하면 데이터그리드 내부에서 이를 [].join(" ") 을 통해 클래스로 사용할 수 있도록 조치해줌 (개꿀)
// 짝수 열 줄무늬를 디자인하기 위한 클래스 부여 예시
fuckingNexacro.setRowClass((dataIndex, dataIndex) => {
    const isDarkRow = dataIndex % 2 == 0;
    
    return isDarkRow? [ "custom_dark_row" ]: [];
});
// 행 서식을 취소
fuckingNexacro.setRowClass(null);
});
```
```css
/* 사용자가 임의로 지정한 클래스명을 부여하는것이기 때문에 스타일 처리는 별도 */
.fn_body_row.fn_row.custom { background-color: #CFC; }
.fn_body_row.fn_row.custom.custom_low_discount { background-color: #9F9; }
.fn_body_row.fn_row.custom.custom_mid_discount { background-color: #6F6; }
.fn_body_row.fn_row.custom.custom_high_discount { background-color: #3F3; }
```
<br/><br/><br/>

### 데이터의 셀 단위 조건부 서식을 지정 (setCellClass)
```js
void fuckingNexacro.setCellClass({0});
    {0}: 콜백함수 (BiConsumer<columnItem: any, dataItem: any> arg0 => Array<string>)
```
데이터의 현재 입력값에 따라 사용자가 직접 클래스 부열르 지정할 수 있습니다. commitValidator 와는 달리 필요시 행 단위가 아닌 셀 단위의 클래스 지정 및 부여가 가능합니다.
```js
// 설명의 길이가 20자를 넘어가는 경우 .custom.custom_long_data, 설명의 길이가 5자를 넘지 않는 경우 .custom.custom_short_data 클래스를 적용
fuckingNexacro.setCellClass((columnItem, dataItem) => {
    return columnItem.key == "description" && dataItem[columnItem.key].length >= 20? [ "custom", "custom_long_description" ]: 
            columnItem.key == "description" && dataItem[columnItem.key].length < 5? [ "custom", "custom_short_description" ]: 
            [ "" ];
    // 문자열 배열로 반환을 하도록 하면 데이터그리드 내부에서 이를 [].join(" ") 을 통해 클래스로 사용할 수 있도록 조치해줌
    // 셀 단위 스타일을 지정하는것이긴 하나 어느 셀을 지정할 것인지 조건문으로 명확하게 명시해야 합니다.
});
// 이 방식으로 사용하는 경우 발생하는 모든 문제에 일절 책임지지 않음. 나중가서 하드코딩 하나하나 수정하는거 완전 질색임
fuckingNexacro.setCellClass((columnItem, dataItem) => {
    return dataItem["description"].length >= 20? [ "custom", "custom_long_description" ]: 
            dataItem["description"].length < 5? [ "custom", "custom_short_description" ]: 
            [ "" ];
    // 위 예시와 동일한 로직
});
// 열 서식을 취소
fuckingNexacro.setCellClass(null);
```
```css
/* 사용자가 임의로 지정한 클래스명을 부여하는것이기 때문에 스타일 처리는 별도 */
.custom.custom_long_description { background-color: #F77; }
.custom.custom_short_description { background-color: #BBB; }
```
<br/><br/><br/>

### 마지막 호출된 데이터 기준 신규로 추가삽입된 데이터만 추출하기 (getInsertedTempDataList)
```js
Array<any> fuckingNexacro.getInsertedTempDataList();
```
setDataList 를 통해 초기화된 데이터를 기준으로, 신규로 추가된 데이터만을 조회합니다. 조회 시 데이터그리드에 존재하는 수정된 버전의 데이터 형태로 제공됩니다.<br/><br/><br/>
### 마지막 호출된 데이터 기준 값이 하나라도 수정된 데이터만 추출하기 (getUpdatedTempDataList)
```js
Array<any> fuckingNexacro.getUpdatedTempDataList();
```
setDataList 를 통해 초기화된 데이터를 기준으로, 초기화값과 현재 수정중인 값 모두에 존재하나 데이터가 하나라도 수정된 데이터만을 조회합니다. 조회 시 데이터그리드에 존재하는 수정된 버전의 데이터 형태로 제공됩니다.<br/><br/><br/>
### 마지막 호출된 데이터 기준 이미 삭제된 데이터만 추출하기 (getDeletedTempDataList)
```js
Array<any> fuckingNexacro.getDeletedTempDataList();
```
setDataList 를 통해 초기화된 데이터를 기준으로, 이미 삭제되어 더이상 데이터그리드에 노출되지 않고있는 데이터만을 조회합니다. 이미 데이터그리드에서 사라졌기 때문에 수정되지 않은 원본 데이터 형태로 제공됩니다.<br/><br/><br/>
### 마지막 호출된 데이터 기준 저장대상 데이터만 추출하기 (getUnsavedTempDataList)
```js
Array<any> fuckingNexacro.getUnsavedTempDataList();
```
getInsertedTempDataList, getUpdatedTempDataList, getDeletedTempDataList 를 통합한 전체 데이터를 조회합니다. 변경된 건 수가 1개 이상이 있을 때 저장되지 않은 정보는 손실될 수 있음을 경고창으로 띄울 때 이 메소드를 통한 반환값으로 판단할 수 있습니다.<br/><br/><br/>
## 데이터 관련 이벤트
### 데이터 변경 시점을 추적 (setOnDataChange)
```js
void setOnDataChange({0});
    {0}: dataItem 을 인자로 제공받는 콜백함수 (Consumer<dataItem> arg0 => void)
```
데이터 목록의 변경이 발생했을 때 변경된 데이터를 제공합니다. 인자를 무시하고 데이터의 변경시점만을 추적해도 상관없으며, 즉시 변경된 데이터 단건만을 콜백으로 제공하므로 사용시 참고 바랍니다.

주의하셔야 할 사항은 호출 시점이 "데이터가 변경된 이후"이기 때문에 콜백이벤트를 블로커 함수로 지정해 특정한 상황에 수정을 차단하는 용도로 사용하실 수 없습니다. 또한, 데이터의 레코드 단위로만 감지되는 이벤트이며, 필드값(각 셀 단위의 데이터)의 변화는 감지대상이 아닙니다.

또한, "데이터가 변경된 이후" 의 데이터 정보만 제공할 뿐, "데이터가 변경되기 이전"의 상태 및 값을 확인할 방법은 없기 때문에 아무런 수정 없이 편집을 마쳐도 콜백함수가 실행되며, 이를 논리적으로 차단할 방법이 없음을 인지하시어 사용하셔야 합니다.
```js
// 데이터 변경이 발생했을 때 실행될 콜백함수를 지정
fuckingNexacro.setOnDataChange(dataItem => { alert("데이터가 바뀌긴 했는데 뭐가 바뀌었는지는 몰?루"); }); // dataItem => void 타입이기 때문에 별도의 리턴타입을 지정하는것은 불가능
fuckingNexacro.setOnDataChange(dataItem => { console.log("데이터가 바뀌긴 했는데 뭐가 바뀌었는지는 몰?루"); }); // 이벤트 교체 시 이전의 이벤트는 등록취소됨.
fuckingNexacro.setOnDataChange(dataItem => {
    const unsavedTempDataList = fuckingNexacro.getUnsavedTempDataList();
    console.log("unsavedTempDataList: ", unsavedTempDataList);
}); // 변경이벤트 감지 시 저장되지 않은 데이터만 추적하는 방법 예시
// 이벤트 지정을 해제
fuckingNexacro.setOnDataChange(null);
```
<br/><br/><br/>

### 데이터 제약조건을 커밋 검사기에 추가 (setCommitValidator)
```js
void fuckingNexacro.setCommitValidator({0})
    {0}: dataItem 를 인자로 제공받는 제약조건 함수 (Predicate<dataItem> arg0 => boolean)
```
commit 메소드를 실행할 경우 커밋하기에 앞서 모든 데이터를 검사하는 함수를 지정합니다. 인자 1개를 넘겨받는 함수 형태여야 합니다. 콜백인자 arg0 은 데이터그리드에 존재하는 데이터를 1건씩 제공받습니다.<br/>
commitValidator 가 지정된 이후부터는 데이터그리드에서 저장할 수 없는 데이터에 .fn_row_invalid 가 활성화됩니다. css 를 통해 시각적으로 표시할 수 있습니다. .fn_row_invalid 스타일이 지정되지 않은 상태에서는 setCommitValidator 를 통해 제약조건을 등록해도 시각적으로 차이가 없습니다.<br/>
데이터 제약조건을 해제하기 위해서는 setCommitValidator(null) 처럼 null 을 전달하면 됩니다. 데이터 제약조건은 commitValidator 가 정상적인 함수일 때에만 작동하도록 디자인되어있습니다.
```js
// 모든 데이터의 가격이 숫자로 파싱 및 비교가 가능한 데이터일 경우 저장가능
fuckingNexacro.setCommitValidator(dataItem => dataItem.price == parseInt(dataItem.price));
// 모든 데이터의 제품명이 기재되어있어야 함 (Not Null)
fuckingNexacro.setCommitValidator(dataItem => dataItem.title);
// 모든 제약조건을 취소
fuckingNexacro.setCommitValidator(null);
```
<br/><br/><br/>

### 데이터 복사 단축키 이벤트 (setOnDataCopy)
```js
void fuckingNexacro.setOnDataCopy({0});
    {0}: columnList, selectedDataList 를 인자로 제공받는 이벤트 함수 (Consumer<columnList, selectedDataList> arg0 => boolean)
```
Windows: Ctrl + C, Mac: Command + C 입력 시 데이터가 복사되는 경우 실행될 함수를 지정합니다. 인자 2개를 넘겨받는 함수 형태여야 합니다. 콜백인자 arg0 은 복사 직전 데이터그리드에 선택된 모든 데이터를 열 목록과 함께 배열로 제공받습니다.<br/>
복사 이벤트가 지정된 경우 복사 단축키를 통한 선택데이터가 클립보드로 등록되기 이전에 실행되며, return false 를 포함할 경우 기존의 이벤트가 차단됩니다. 기존 클립보드 복사 이벤트를 유지하기 위해서는 return true 로 명시적으로 콜백함수를 구성해야 할 필요가 있으며, return; 과 같이 undefined 로 반환되는 경우는 실행되지 않는 것을 기준으로 합니다.
```js
// 간단한 이벤트 작동 결과 확인용 콘솔로그 출력
fuckingNexacro.setOnDataCopy((columnList, selectedDataList) => {
    console.log("columnList: ", columnList);
    console.log("selectedDataList: ", selectedDataList);

    return true; // 데이터를 복사하기 이전에 console.log 를 수행함, return true 를 통해 기존 Ctrl + C 이벤트를 이어나감, return false 시 데이터 복사 기능을 차단함
});
// 이벤트 지정을 해제
fuckingNexacro.setOnDataCopy(null);
fuckingNexacro.setOnDataCopy(selectedDataList => true); // ... => true 는 function(...) { return true; } 와 동일함
```
<br/><br/><br/>

### 데이터 붙여넣기 단축키 이벤트 (setOnDataPaste)
```js
void fuckingNexacro.setOnDataPaste({0});
    {0}: dataList 를 인자로 제공받는 이벤트 함수 (Consumer<dataList> arg0 => boolean)
```
Windows: Ctrl + V, Mac: Command + V 입력 시 데이터를 붙여넣는 경우 실행될 함수를 지정합니다. 인자 1개를 넘겨받는 함수 형태여야 합니다. 콜백인자 arg0 은 클립보드에 저장되어있었던 데이터를 객체 형태로 파싱한 배열 형태로 제공받습니다.<br/>
붙여넣기 이벤트가 지정된 경우 붙여넣기 단축키를 통한 데이터가 데이터그리드에 붙여넣기 이전에 실행되며, return false 를 포함할 경우 기존의 이벤트가 차단됩니다. 기존 클립보드 붙여넣기 이벤트를 유지하기 위해서는 return true 로 명시적으로 콜백함수를 구성해야 할 필요가 있으며, return; 과 같이 undefined 로 반환되는 경우는 실행되지 않는 것을 기준으로 합니다.
```js
// 간단한 이벤트 작동 결과 확인용 콘솔로그 출력
fuckingNexacro.setOnDataPaste(dataList => {
    console.log("dataList: ", dataList);

    return true; // 데이터를 복사하기 이전에 console.log 를 수행함, return true 를 통해 기존 Ctrl + V 이벤트를 이어나감, return false 시 데이터 붙여넣기 기능을 차단함
});
// 붙여넣기 이전 데이터와 붙여넣기 데이터의 비교대조를 검토한 후 확인/취소 묻기
fuckingNexacro.setOnDataPaste(dataList => {
    const pastedDataList = dataList;
    const originDataList = fuckingNexacro.getDataList();
    const targetDataList = originDataList.filter(originDataItem => pastedDataList.find(pastedDataItem => pastedDataItem[keyColumn] == originDataItem[keyColumn]));

    /* 대충 "정말 이 데이터를 덮어쓰시겠습니까" 이벤트 */
    return confirm("" + targetDataList?.length + " 건의 데이터가 수정됩니다. 계속하시겠습니까?");
});
// 이벤트 지정을 해제
fuckingNexacro.setOnDataPaste(null);
fuckingNexacro.setOnDataPaste(dataList => true); // ... => true 는 function(...) { return true; } 와 동일함
```
<br/><br/><br/>

### 선택된 데이터 구독 이벤트 (setOnDataSelect)
```js
void fuckingNexacro.setOnDataSelect({0});
    {0}: dataList 를 인자로 제공받는 이벤트 함수 (Consumer<dataList> arg0 => void)
```
데이터의 선택사항이 변경되거나 초기화될 때 실행될 함수를 지정합니다. 인자 1개를 넘겨받는 함수 형태여야 합니다. 콜백인자 arg0 은 선택된 데이터를 배열 형태로 제공받습니다.<br/>
콜백함수의 실행시점은 선택여부가 종료된 이후이며, 레코드 선택을 무효로 돌리기 위해 이벤트 실행 시점을 데이터레코드 선택 이전으로 임의로 변경할 수 없습니다.
```js
// 데이터가 선택될 때마다 선택된 데이터를 획득하도록 이벤트 지정
fuckingNexacro.setOnDataSelect(dataList => console.log("setOnDataSelect: ", dataList));
// 이벤트 지정을 해제
fuckingNexacro.setOnDataSelect(null);
```
<br/><br/><br/>

### 체크된 데이터 구독 이벤트 (setOnDataCheck)
```js
void fuckingNexacro.setOnDataCheck({0});
    {0}: dataList 를 인자로 제공받는 이벤트 함수 (Consumer<dataList> arg0 => void)
```
단일 데이터(레코드)의 체크박스가 선택/해제될 때 실행될 함수를 지정합니다. 인자 1개를 넘겨받는 함수 형태여야 합니다. 콜백인자 arg0 은 체크된 데이터를 배열 형태로 제공받습니다.<br/>
콜백함수의 실행시점은 체크 이벤트가 종료된 이후이며, 체크박스의 선택을 무효로 돌리기 위해 이벤트 실행 시점을 체크박스 선택 이전으로 임의로 변경할 수 없습니다. 이는 체크박스마다 할당되는 이벤트가 아닌 데이터의 특이사항이 발생했을 때 실행되는 개념의 함수입니다.

## 유틸 관련 메소드
### 개요
```js
fuckingNexacroUtil();
window.fuckingNexacroUtil();
```
위 두가지 메소드는 동일합니다. fuckingNexacroUtil() 은 아래와 같은 구조를 가집니다.
```js
window["fuckingNexacroUtil"] = () => {
    delete window["fuckingNexacroUtil"]; // 들어올땐 마음대로였겠지만 나갈때는 이 드립도 10년이 넘었구나...

    window["formatter"] = formatter;
    window["parser"] = parser;
    window["echo"] = echo;
    window["truthy"] = truthy;
    window["distinct"] = distinct;
    window["zerofill"] = zerofill;
    window["getIntegratedKeyList"] = getIntegratedKeyList;
    window["similar"] = similar;
    window["same"] = same;
    window["sameArray"] = sameArray;
    window["sameObject"] = sameObject;
    window["getEachDifferenceKeyList"] = getEachDifferenceKeyList;
};
```
fuckingNexacroUtil() 을 한번 호출하면 그 다음부터는 동일한 이름의 함수가 작동되지 않습니다.<br/>
fuckingNexacro 라이브러리와 무관하게 해당 메소드를 사용하시려면 [util.js](../src/util.js) 파일의 메소드 정의에서 export 를 제거하신 다음 javascript 에서 원본처럼 사용하시면 됩니다.<br/><br/><br/>
### 포매터 (formatter)
```js
String formatter.datetime({0});
    {0}: Date 객체
String formatter.time({0});
    {0}: Date 객체
String formatter.date({0});
    {0}: Date 객체
String formatter.numeric({0});
    {0}: Number 객체
```
전달된 패러미터를 지정된 양식의 문자열로 치환합니다.<br/><br/><br/>
### 파서 (parser)
```js
Date parser.datetime({0});
    {0}: 문자열 패턴이 적용된 DateTime 정보
Date parser.time({0});
    {0}: 문자열 패턴이 적용된 Time 정보
Date parser.date({0});
    {0}: 문자열 패턴이 적용된 Date 정보
Number parser.numeric({0});
    {0}: 문자열 패턴이 적용된 Number 정보
```
전달된 문자열을 지정된 형태의 객체로 변환합니다.<br/><br/><br/>
### truthy 를 문법이 아닌 함수형으로 체크 (truthy)
```js
boolean truthy({0});
    {0}: 아무 값

console.log(1); // 1
console.log(truthy(1)); // true
```
truthy 판별식을 문법이 아닌 함수로 체크합니다.<br/>
3항 연산자를 사용할 때 값으로 truthy(문법)을 사용하는것이 불명확하거나 모호한 기준이라고 판단될 때 truthy(함수) 를 사용하는것이 가능합니다. truthy(함수) 의 반환값은 truthy(문법) 의 결과값과 동일하게 판단하되 true/false 로 명시적으로 반환합니다.<br/><br/><br/>
### 중복제거 (distinct)
```js
Array<any> distinct({0});
    {0}: 아무 배열
```
배열을 받은 다음 중복된 값을 제거해서 반환합니다. 아래에서 서술할 same 시리즈로 비교하는 것이 아니기 때문에 object 의 중복체크는 기존의 javascript 중복판단기준을 따라갑니다.<br/><br/><br/>
### 특정길이에 도달할때까지 값의 왼쪽에 지정문자 채워넣기 (zerofill)
```js
any zerofill({0}, {1}, {2});
    {0}: 원본 데이터
    {1}: 목표 길이, 1 값을 "00000001" 값으로 만들기 위해서는 목표 값의 길이인 8을 입력
    {2}: 목표 길이까지 채울 문자, "" 와 같이 문자가 없는 경우에는 자동으로 "0" 으로 대체해서 처리
```
value 의 길이가 length 에 도달할 때 까지 value 의 왼쪽에 letter 를 반복적으로 채웁니다.
```js
console.log(zerofill(360, 8)); // "00000360"
console.log(zerofill(1, 8, " ")); // "       1"
console.log(zerofill(1234, 1)); // "1234", // 채우기도 전에 이미 조건길이를 초과한 문자열을 받은 경우 조치없이 바로 반환
console.log(zerofill(1, 8, "")); // "00000001", letter 가 채우기 용도로 사용할 수 없는 문자열인 경우 자동으로 "0" 으로 재지정되어 자동실행
console.log(zerofill(1, -1)); // "1", 음수길이는 소스코드 로직 구조 상 조치없이 즉시 반환
```
<br/><br/><br/>

### 주어진 모든 객체의 key 값을 통합하여 배열로 반환 (getIntegratedKeyList)
```js
Array<any> getIntegratedKeyList({0});
    {0}: 객체배열, 객체의 형태 및 구조는 따지지 않음

// 사용은 갯수제한 없이 object 를 패러미터로 전달
getIntegratedKeyList({});
getIntegratedKeyList({}, {});
getIntegratedKeyList({}, {}, {});
getIntegratedKeyList({}... /* 갯수제한은 뭐 브라우저나 운영체제가 알아서 컷 하겠지 뭐... */);
```
주어진 객체의 키만을 추출하여 하나의 배열로 통합합니다. 중복된 키는 distinct 되어 1개씩만 포함됩니다. 중복 기준은 기존 javascript 의 기준을 따라갑니다.<br/><br/><br/>

### 특정 항목에서 필요한 키-값 쌍만 추출하기 (getScopedDataItem)
```js
any getScopedDataItem({0}, {1});
    {0}: dataItem: object 타입의 대상 객체, object 타입이어야하며, 그러지 않을 경우 정상적인 값 반환이 이루어지지 않습니다.
    {1}: dataItem 에서 추출하고자 하는 key 값의 배열, 이 배열에서 명시되지 않은 나머지 key-value 쌍은 모두 반환값에서 제외됩니다.
```
객체에서 필요한 값만을 획득하고 나머지 값은 모두 제거하는 메소드입니다.
<br/><br/><br/>

### object 의 key값 구조 유사여부 판단 (similar)
```js
boolean similar({0}, {1});
    {0}: 아무 객체
    {1}: 아무 객체
```
소스코드는 [util.js](../src/util.js) 파일을 직접 참고해주시길 바랍니다.<br/>
두 object 간 가지고 있는 key 목록이 서로 동일할 경우 true 를 반환합니다. 이 때, key 에 대응되는 값이 다르더라도 무시되고, 양측 모두에 해당 key의 값이 존재한다면 true 로 취급됩니다.<br/><br/><br/>
### value 의 값 일치여부 판단 (same)
```js
boolean same({0}, {1});
    {0}: 아무 값
    {1}: 아무 값
```
소스코드는 [util.js](../src/util.js) 파일을 직접 참고해주시길 바랍니다.<br/>
두 값이 서로 일치하는지를 판단합니다. 동일한 객체가 아니더라도 동일한 값을 가지고 있다고 판단되면 true 를 반환합니다.<br/><br/><br/>
### Array 의 요소 일치여부 판단 (sameArray)
```js
boolean sameArray({0}, {1});
    {0}: 아무 배열
    {1}: 아무 배열
```
소스코드는 [util.js](../src/util.js) 파일을 직접 참고해주시길 바랍니다.<br/>
두 배열 간 서로 동일한 값을 순번에 맞게 가지고 있는지 판단합니다. 동일한 객체가 아니더라도 동일한 값을 가지고 있다고 판단되면 true 를 반환합니다.<br/><br/><br/>
### object 의 키와 값 쌍의 일치여부 판단 (sameObject)
```js
boolean sameObject({0}, {1});
    {0}: 아무 값
    {1}: 아무 값
```
소스코드는 [util.js](../src/util.js) 파일을 직접 참고해주시길 바랍니다.<br/>
두 객체간 서로 동일한 키와 값 쌍을 누락없이 동일하게 가지고 있는지 판단합니다. 동일한 객체가 아니더라도 동일한 키와 값 쌍을 가지고 있다고 판단되면 true 를 반환합니다.<br/><br/><br/>
### 주어진 2개의 객체에서 값이 다른 key 만 뽑아서 반환 (getEachDifferenceKeyList)
```js
Array<any> getEachDifferenceKeyList({0}, {1});
    {0}: 아무 값
    {1}: 아무 값
```
주어진 2개의 객체에서 서로 다른 값을 가지고있는 key 목록을 추출하여 제공합니다.<br/><br/><br/>