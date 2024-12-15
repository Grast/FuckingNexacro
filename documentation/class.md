# class
## 시작하기에 앞서 (Attention)
FuckingNexacro 는 아무런 디자인이 되어있지 않은 raw html 형태로 제공됩니다.<br/>
이는 class 를 통해 구획 및 이벤트를 나누어놓음으로 사용자측에서 얼마든지 자유롭게 디자인할 수 있게 하기 위함입니다.

~~원래 개발자는 디자이너랑 퍼블리셔한테 깝치는거 아니랬음 깝치다 촌스러운디자인 나오면 등짝맞음~~ ~~개발자 업무도 아닌데 개발자 커리어 깎여나감~~<br/><br/><br/>
## 기본 설정 (Default)
컴포넌트 개발 과정에서 배포자가 사용한 임의 CSS 목록은 다음과 같습니다.
```css
.fn_header_cell:not(.fn_unresizable) { resize: horizontal; overflow-x: auto; }
.fn_header { background-color: #77F; }
.fn_header_colgroup_fixed, .fn_header_colgroup_suffixed { background-color: #77F; }
.fn_body_colgroup_fixed, .fn_body_colgroup_suffixed { background-color: #BBF; }
.fn_row { display: flex; visibility: visible; }
.fn_row.fn_hidden, .fn_row.fn_hidden * { visibility: hidden; }
.fn_cell { box-shadow: inset 0px 0px 0px 1px black; }
.fn_cell.fn_truncate { display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fn_cell span { margin-left: 4px; margin-right: 4px; }
.fn_cell.fn_hidden, .fn_cell.fn_hidden * { visibility: hidden; }
.fn_cell_button { text-align: center; }
.fn_button { width: 100%; height: 100%; border: none; background-color: transparent; }
.fn_gone { display: none; }
.fn_content { align-content: center; }
.fn_input { align-content: center; }
.fn_select_item span.fn_select_item_text { margin-left: 4px; margin-right: 4px; }
.fn_right_align { text-align: right; }

.fn_root ::-webkit-scrollbar { width: 4px; height: 4px; }
.fn_root .no-scrollbar::-webkit-scrollbar { width: 0px; height: 0px; }
.fn_root ::-webkit-scrollbar-track { background-color: lightgray; }
.fn_root ::-webkit-scrollbar-thumb {  background-color: gray; }
.fn_root ::-webkit-scrollbar-button { display: none; }
```
~~이거 제가 왜 이렇게 짰는지 알려주실분...?~~
<br/><br/><br/>

## 샘플 css 디자인 (Sample CSS Style)
```css
.fn_body_row.fn_row.fn_row_unsaved .fn_cell { font-style: italic; color: #F33 }
.fn_body_row.fn_row.fn_row_selected .fn_cell { background-color: #55B; }
.fn_row.fn_row_invalid .fn_cell { background-color: #919; }
.fn_row span, .fn_cell span, .fn_cell .fn_button { user-select: none; }
.fn_select_list { background-color: #DDF; padding: 0px; }
.fn_select_list, .fn_select_item { background-color: #DDF; box-shadow: inset 0px 0px 0px 1px black; align-content: center;}
.fn_select_list, .fn_select_item:hover { background-color: #BBF; }
.fn_select_list, .fn_select_item.fn_select_selected { background-color: #09F; }
.fn_select_list, .fn_select_item.fn_select_selected:hover { background-color: #07D; }

.fn_body_row.fn_row.custom { background-color: #CFC; }
.fn_body_row.fn_row.custom.custom_low_discount { background-color: #9F9; }
.fn_body_row.fn_row.custom.custom_mid_discount { background-color: #6F6; }
.fn_body_row.fn_row.custom.custom_high_discount { background-color: #3F3; }

.custom.custom_long_description { background-color: #F77; }
.custom.custom_short_description { background-color: #BBB; }
```
개발 과정에서 시각화 및 확인용도로 사용한 CSS 입니다. ~~개발자의 미적 감각을 신용하시면 안됩니다...~~<br/><br/><br/>
## 구획 클래스
```css
.fn_root /* 컴포넌트 클래스 */
  .fn_viewport /* 뷰포트 클래스 */
    .fn_wrapper /* 데이터를 감싸는 컨텐츠 컨테이너 클래스. 데이터 분량에 따라 리사이징 */
      .fn_header /* 정보를 표시하기 위한 클래스 */
        .fn_header_row.fn_row /* 헤더 행 클래스, fn_row 는 header 와 body 공통 */
          .fn_header_colgroup_fixed.fn_header_colgroup.fn_colgroup /* 고정열 출력을 위한 분리 클래스 */
            .fn_header_cell.fn_cell.fn_content.fn_truncate /* 고정열 셀 클래스 */
          .fn_header_colgroup_unfixed.fn_header_colgroup.fn_colgroup /* 비고정열 출력을 위한 바탕 클래스 */
            .fn_header_cell.fn_cell.fn_content.fn_truncate /* 비고정열 셀 클래스 */
          .fn_header_colgroup_suffixed /* 버튼전용 고정열 출력을 위한 분리 클래스 */
            .fn_header_cell.fn_cell.fn_content.fn_truncate.fn_cell_button.fn_unresizable /* 버튼전용 고정열 셀 클래스 */
              .fn_content.fn_truncate /* 버튼전용 고정열 span 클래스 */
      .fn_body /* 데이터를 표시하기 위한 클래스 */
        .fn_body_row.fn_row /* 바디 행 클래스, fn_row 는 header 와 body 공통 */
          .fn_body_colgroup_fixed.fn_body_colgroup.fn_colgroup /* 고정열 출력을 위한 분리 클래스 */
            .fn_body_cell.fn_cell.fn_content.fn_truncate /* 고정열 셀 클래스 */
              .fn_input /* 수정용 input 클래스 */
          .fn_body_colgroup_unfixed.fn_body_colgroup.fn_colgroup /* 비고정열 출력을 위한 바탕 클래스 */
            .fn_body_cell.fn_cell.fn_content.fn_truncate /* 비고정열 셀 클래스 */
              .fn_input /* 수정용 input 클래스 */
          .fn_body_colgroup_suffixed.fn_body_colgroup.fn_colgroup /* 버튼전용 고정열 출력을 위한 분리 클래스 */
            .fn_body_cell.fn_cell.fn_content.fn_truncate.fn_cell_button /* 버튼전용 고정열 셀 클래스 */
              .fn_button /* 버튼 클래스 */
```
```css
/* 설명 제거버전(깔끔) */
.fn_root
  .fn_viewport
    .fn_wrapper
      .fn_header
        .fn_header_row.fn_row
          .fn_header_colgroup_fixed.fn_header_colgroup.fn_colgroup
            .fn_header_cell.fn_cell.fn_content.fn_truncate
          .fn_header_colgroup_unfixed.fn_header_colgroup.fn_colgroup
            .fn_header_cell.fn_cell.fn_content.fn_truncate
          .fn_header_colgroup_suffixed
            .fn_header_cell.fn_cell.fn_content.fn_truncate.fn_cell_button.fn_unresizable
              .fn_content.fn_truncate
      .fn_body
        .fn_body_row.fn_row
          .fn_body_colgroup_fixed.fn_body_colgroup.fn_colgroup
            .fn_body_cell.fn_cell.fn_content.fn_truncate
              .fn_input
          .fn_body_colgroup_unfixed.fn_body_colgroup.fn_colgroup
            .fn_body_cell.fn_cell.fn_content.fn_truncate
              .fn_input
          .fn_body_colgroup_suffixed.fn_body_colgroup.fn_colgroup
            .fn_body_cell.fn_cell.fn_content.fn_truncate.fn_cell_button
              .fn_button
```
<br/><br/><br/>

## 구분 및 이벤트 클래스
### 고정행 및 고정열 구분 클래스 (fixed column & row class)
```css
.fn_header { background-color: white; }
.fn_header_colgroup_fixed, .fn_body_colgroup_fixed { background-color: white; }
.fn_header_colgroup_suffixed, .fn_body_colgroup_suffixed { background-color: white; }

/* background-color: ... 는 예시입니다. */
```
상단 고정 행에는 .fn_header, 좌측 고정 열에는 .fn_header_colgroup_fixed, .fn_body_colgroup_fixed 클래스가 활성화됩니다.<br/>
아무런 클래스가 부여되지 않을 경우 스크롤되는 일반데이터가 고정행 및 고정열 뒤로 겹쳐지므로(오버랩) 고정행 및 고정열에 배경을 불투명으로 지정할 필요가 있습니다.<br/><br/><br/>
### 마우스진입 하이라이트 클래스 (mouseenter highlight class)
```css
.fn_mouseenter_column, .fn_mouseenter_data { background-color: lightgray; }
.fn_mouseenter_column.fn_mouseenter_data { background-color: darkgray; }

/* background-color: ... 는 예시입니다. */
```
마우스가 진입한 셀에는 각각 행과 열을 구분할 수 있는 .fn_mouseenter_row, .fn_mouseenter_column 클래스가 활성화됩니다.<br/>
사용자의 요구사항 및 취향에 따라 행 또는 열만을 하이라이팅할 수 있으며, 둘 다 적용하면 마우스가 위치한 단독 셀 강조 또한 가능합니다.<br/><br/><br/>
### 체크박스 클래스 (checkbox class)
```css
.fn_cell.fn_cell_checkbox { background-color: lightblue; }
.fn_cell.fn_cell_checkbox.fn_cell_checkbox_checked { background-color: lightskyblue; }

/* background-color: ... 는 예시입니다. */
```
체크박스를 위한 셀에는 별개의 엘리먼트와 클래스가 활성화됩니다.<br/>
체크박스가 있는 경우에만 .fn_cell_checkbox 가 제공되며, 체크까지 된 경우에는 .fn_cell_checkbox_checked 클래스가 활성화됩니다.
```css
.fn_cell.fn_cell_checkbox input[type=checkbox].fn_checkbox
```
체크박스에는 .fn_checkbox 클래스가 제공됩니다. 불필요 시 숨기는 작업을 위한 용도로 사용됩니다.<br/><br/><br/>
### 선택된 행 클래스 (selected row class)
```css
.fn_body_row.fn_row.fn_row_selected .fn_cell { background-color: lightgreen; }

/* background-color: ... 는 예시입니다. */
```
선택한 행에는 .fn_row_selected 클래스가 활성화됩니다. 열 정보를 표기하는 .fn_header 영역은 해당사항이 없습니다.<br/>
행 선택은 마우스 클릭으로 이루어지나, Ctrl 키를 누른 상태에서 다중 행 선택 및 선택 행 제외 기능도 포함됩니다.<br/>
Shift 키를 통한 연속 선택은 베타테스트(???)입니다.<br/><br/><br/>
### 클릭된 행 클래스 (clicked row class)
```css
.fn_body_row.fn_row.fn_row_clicked .fn_cell { background-color: lightblue; }
```
마지막으로 클릭을 통해 선택한 데이터 행에는 .fn_row_clicked 클래스가 부여됩니다. 그다지 실용적인 클래스는 아니며, 무시하는것이 더 좋을 수도 있습니다.<br/>
다수 선택 시에는 첫번째 항목에만 유지됩니다. 2개 이상의 다수의 행을 선택하더라도 첫번째 선택한 행에만 적용되며, 다중선택을 유지하는 경우에는 첫번째 선택한 항목에만 그대로 유지됩니다.<br/><br/><br/>
### 유효하지 않은 데이터 레코드 클래스 (invalid data record class)
```css
.fn_body_row.fn_row.fn_row_invalid { background-color: red; }

/* background-color: ... 는 예시입니다. */
```
setCommitValidator 를 통해 데이터 제약조건이 지정되었을 경우, 데이터가 제약조건을 충족하지 못하면 .fn_row_invalid 클래스가 활성화됩니다.<br/>
setCommitValidator 를 지정하지 않았거나 setCommitValidator(null) 을 실행했을 경우 .fn_row_invalid 가 활성화되지 않으므로 참고바랍니다.<br/>
※ setCommitValidator 는 디자인 기능이 아닌 개발자 기능입니다. 개념 문의 및 적용 요청은 개발자에게 문의 바랍니다.<br/><br/><br/>
### 뷰포트를 이탈한 엘리먼트를 숨김처리하는 클래스 (hidden row element class)
```css
.fn_row { display: flex; visibility: visible; }
.fn_row.fn_hidden, .fn_row.fn_hidden * { visibility: hidden; }
.fn_cell.fn_hidden, .fn_cell.fn_hidden * { visibility: hidden; }
```
.fn_hidden 클래스는 뷰포트를 이탈하여 렌더링될 필요가 없는 행 데이터를 숨김처리하여 성능을 꾀하기 위한 용도로 사용됩니다.<br/><br/><br/>
### 수정이력이 있는 데이터 레코드 클래스 (unsaved data record class)
```css
.fn_body_row.fn_row.fn_row_unsaved .fn_cell { font-style: italic; color: #F33 }

/* font-style: ..., color: ... 는 예시입니다. */
```
원본 데이터 기준으로 값이 일치하지 않은 상태의 데이터를 파악하기 위한 용도로 사용됩니다.<br/><br/><br/>