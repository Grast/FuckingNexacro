# 자주 묻는 질문
## 제작자 정보
Grast, 2024.10.03 제작시작, 2024.xx.xx 배포시작<br/><br/><br/>
## 오픈소스 라이선스
Link: [오픈 소스 라이선스](./open_source_license.md) 파일을 확인해주시기 바랍니다.<br/><br/><br/>
## 사용
### 오프라인 환경에서도 사용할 수 있나요?
데이터그리드 자체는 온라인을 요구하는 기능을 사용하지 않았습니다. 라이선스 체크 조건도 오픈소스로 제공되기 때문에 불필요하며, 따라서 오프라인 환경에서도 번들 .js 파일만 구비된다면 그냥 바로 사용할 수 있습니다.<br/><br/><br/>
### 요금이 어떻게 되나요?
요금은 됐고, 혹시나 제가 ~~퇴비~~투비소프트한테 고소당하면 그때 커피나 사주세요(???)<br/>
~~맹물에 토끼똥 우려놓고 루왁커피라고 우기면 나도 맹물에 퇴비 우려서 무안단물이라고 우겨버린다~~<br/><br/><br/>
### 프로젝트를 포크 떠서 개인(기업)이 따로 개별로 수정해서 사용할 수도 있나요?
사용 가능합니다. 구현 환경은 Node.js + Svelte (SvelteKit 아님) 환경이며, svelte 의 store 기능(Writable/Derived) 개념만 알고 있다면 난이도는 Pure Javascript 수준으로 낮아집니다.<br/>
원하시는 기능이 있다면 얼마든지 추가하셔서 다시 번들링하셔도 되고, 새롭게 추가된 기능을 누군가가 원한다면 본인이 직접 배포하셔도 됩니다.

※ 단, 혹시 모를 업데이트를 대비해 개인(기업)이 추가할 기능은 원본파일이 아닌 별개의 .js 파일, 또는 별개의 .svelte 파일로 따로 관리하시기 바랍니다.<br/>
※ 개인(기업)이 새로운 기능을 추가해서 번들링을 하더라도 원본 기능을 제거하지 않는한 사용할 수 있는 모든 원본 기능의 저작권은 Grast 에게 있습니다.<br/><br/><br/>
### 버그가 발생하면 어떻게 해야 하나요?
프로젝트 개발자에게 문의바랍니다. 사용자가 개발자를 건너뛰고 배포자에게 직접 연락 및 문의를 넣는것을 금합니다.<br/><br/><br/>
### 사후지원이 제공되나요?
${\textsf{\color{red}(매우 중요)}}$ 사후지원이 제공되지 않습니다.<br/>
사후지원이 요구되는 프로젝트일 경우에는 해당 데이터그리드를 사용하시는것을 반드시 재검토해주시기 바랍니다.<br/><br/><br/>
## 개발
### 라이선스 정책이 어떻게 되나요?
MIT 라이선스입니다. 사용으로 인한 사건 및 사고 발생 시 책임지지 않는 대신 무료 및 임의사용이 무제한으로 허가됩니다. 단, 저작권까지 무시하셔도 된다는 것은 아닙니다.<br/><br/><br/>
### 버그가 발생하면 어떻게 해야 하나요?
Link: [이슈게시판](https://github.com/Grast/FuckingNexacro/issues)을 이용해주시기 바랍니다. 배포자가 아직~~5년 넘게~~ GitHub 이용에 익숙치 않습니다.<br/><br/><br/>
### 기존에 제공되었던 기능들이 제거되거나 마이그레이션이 강제될 수 있나요?
어지간하면 그렇게 될 일은 없는데 HTML 및 JavaScript 레벨에서 치명적인 문제가 생기게 된다면 그때는 따로 업데이트가 강제될 수도 있습니다. 이 경우가 아니라면 어지간해선 개발 및 사용자에게 강제되는 사항은 거의 없습니다.<br/><br/><br/>
### 리액트, 뷰 등의 프로젝트와 병행해서 사용이 가능하나요?
배포자가 리액트와 뷰를 사용하지 않아서 타 환경까지는 사용을 테스트해본 적은 없습니다. 아마 테스트를 했더라도 스벨트가 호환되는것은 아니라서 제대로 된 작동은 하지 않았을 겁니다.<br/><br/><br/>
### 기타
IE 에서는 지원하지 않습니다. Node.js 번들링 특성 상 컴포넌트 내부의 소스코드와 상관없이 번들링에서 무조건 화살표함수가 쓰이므로 사용할 수 없습니다. (가능하더라도 제가 막았을것입니다.)

배포자의 테스트 환경은 크롬 기준에서 이루어졌으며, 타 브라우저에서의 정상작동 테스트는 완전히 이루어지지 않았습니다.<br/><br/><br/>
## 디자인
### 신규 엘리먼트나 기능의 추가가 필요해요. 어디에 건의하면 되나요?
Link: [이슈게시판](https://github.com/Grast/FuckingNexacro/issues)을 이용해주시기 바랍니다. 단, 한번만 배포되고 지속적으로 기능개선 및 유지보수가 될 가능성은 희박합니다.<br/>
※ 주의: 배포자가 퍼블리셔였던 적이 없는 코더이기 때문에 추가되길 원하는 엘리먼트의 구조를 알려주셔야 합니다.<br/><br/><br/>
### 인라인 스타일 때문에 원하는 스타일을 적용할 수 없어요. 수정해주실 수 있나요?
Link: [이슈게시판](https://github.com/Grast/FuckingNexacro/issues)을 이용해주시기 바랍니다. 단, 한번만 배포되고 지속적으로 기능개선 및 유지보수가 될 가능성은 희박합니다.<br/>
가능하면 HTML 에서 엘리먼트가 어떻게 보여지는지, 문제가 되는 엘리먼트가 어떤것인지를 캡쳐해서 같이 보내주세요.
당연히 문제가 되는 inline style 이 무엇인지도 같이 말씀해주셔야 합니다.

※ 주의: 해결되지 않거나 조치를 거부할 수도 있습니다.<br/><br/><br/>
## 저작권
### 라이선스는 어떻게 되나요?
MIT 라이선스이긴 한데 까놓고 말해서 솔직히 투비소프트의 자회사, 계열사, 협력사는 양심이 있으면 사용하지 맙시다.

현대오토에버도 양심이 있으면 쓰지 말아야지? 정몽규도 존나 짜증나던데 현대계열과 축협 및 대한양궁협회(연대책임)도 양심적 사용금지<br/><br/><br/>
### 저작권을 무조건 오픈소스 라이선스에 표기해야하나요?
어차피 기업서비스같은데서 쓰면 내부망이라서 다른사람들이 쓰지도 않잖아요...? 저작권 해치지만 않게 크레딧 표기 없이 자유롭게 쓰세요.<br/>
~~애초에 나부터 크레딧이나 오픈소스 라이선스 작성하는거 귀찮아서 싫음~~<br/><br/><br/>
### 프로젝트를 포크 떠서 개인(기업)이 따로 개별로 수정해서 사용하는 경우 라이선스는 어떻게 되나요?
신규로 추가된 기능인 경우 신규로 추가된 기능의 저작권은 추가자가 가집니다.
기존에 존재했던 기능의 개선 또는 성능향상의 경우 해당 작업분만큼만 추가자가 가집니다.

수정된 기능일 지라도 원본 기능의 저작권 및 컴포넌트 자체의 저작권은 Grast 에게 있습니다.<br/><br/><br/>
## 기타
### 기타 문의
Link: [이슈게시판](https://github.com/Grast/FuckingNexacro/issues)을 이용하여 기타 다른 질문을 문의할 수도 있습니다.<br/><br/><br/>