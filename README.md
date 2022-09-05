## 1. 프로젝트 소개

스트리밍 아카이브 링크로부터 영상을 분석하고 하이라이트 포인트의 후보군을 추출해주는 웹서비스

## 2. 프로젝트 진행 기간

2022.02 ~ 2022.03 (5주)

## 3. 주제 선정 배경
- 연속된 긴 스트림 영상 속에서 무의미한 부분을 제외한 유의미한 부분 Point set 압축 필요
- 실시간 스트리밍 방송은 최소 1시간 최대 7~8시간 방송 단, 하이라이트 구간은 단 몇 분으로 편집
- 서비스 타겟 : 스트리머 방송 편집자

## 4. 아이디어
- 화면이 급변하거나, 소리가 커지거나, 댓글의 flow가 빨라지거나 큰 금액의 후원이 들어오는 등의 조건들을 탐색의 factor로 두어 하이라이트 포인트를 탐색 가능

1. 라이브 스트림의 아카이브 링크로부터 영상을 추출해 **video frame, audio, chat data 등을 분석**
2. 위 factor들의 numerical data를 **chart로 시각화하여 제공**
3. **사용자의 필터 쿼리에 맞는 하이라이트 포인트를 추천**
    - 예 : “채팅 속도가 급증한 부분 보여줘”
4. User-Friendly UI
    - 타겟이 편집자인 만큼, 편집자들이 많이 사용하는 편집 에디터 툴의 UI를 비슷하게 하여 편리성 증대
    - 단축키를 구현하여 User-Action 제공
    - 차트 위 썸네일 이미지를 보여줌으로써, 편집점을 찾기 위한 UX 활용성 증대
    
## 5. 와이어프레임
- [와이어프레임 보기](https://axiomatic-bunny-1ec.notion.site/835c6ef48a77432396f753179c824c11)

## 5. 서비스 화면
<img width="1433" alt="1" src="https://user-images.githubusercontent.com/87474789/188503442-33c916da-72b5-4af6-b093-a7909acb5874.png">
<img width="1433" alt="2" src="https://user-images.githubusercontent.com/87474789/188503578-8a91399c-364f-4508-ac69-a1b4fd709166.png">

- 연속된 긴 스트림 영상 속에서 무의미한 부분을 제외한 유의미한 부분 Point set 압축 필요
- 실시간 스트리밍 방송은 최소 1시간 최대 7~8시간 방송 단, 하이라이트 구간은 단 몇 분으로 편집
- 서비스 타겟 : 스트리머 방송 편집자

## 6. 포스터
![하이라이팅 포스터](https://user-images.githubusercontent.com/87474789/188504121-fd07d437-b02d-4b79-95bc-da6e2f1a90d0.png)

## 7. 데모영상
[![Video Label](http://img.youtube.com/vi/59USvjy2toI/0.jpg)](https://youtu.be/59USvjy2toI)

## 8. 프로젝트 구조

```
src
 ┣ components
 ┃ ┣ Header
 ┃ ┃ ┣ auth
 ┃ ┃ ┃ ┣ Image
 ┃ ┃ ┃ ┃ ┣ facebook.png
 ┃ ┃ ┃ ┃ ┣ icon.png
 ┃ ┃ ┃ ┃ ┗ kakaotalk.png
 ┃ ┃ ┃ ┣ LoginPage.js
 ┃ ┃ ┃ ┣ LoginPage.scss
 ┃ ┃ ┃ ┣ SigninPage.js
 ┃ ┃ ┃ ┗ SigninPage.scss
 ┃ ┃ ┣ Guide.js
 ┃ ┃ ┣ Guide.scss
 ┃ ┃ ┣ Header.jsx
 ┃ ┃ ┣ Header.scss
 ┃ ┃ ┣ Modal.jsx
 ┃ ┃ ┗ Modal.scss
 ┃ ┣ Loading
 ┃ ┃ ┣ Container.js
 ┃ ┃ ┣ Container.scss
 ┃ ┃ ┗ Spinner.jsx
 ┃ ┗ editor
 ┃ ┃ ┣ in_VideoPlayer
 ┃ ┃ ┃ ┣ Duration.js
 ┃ ┃ ┃ ┣ Player.jsx
 ┃ ┃ ┃ ┗ Player.scss
 ┃ ┃ ┣ BookMarker.jsx
 ┃ ┃ ┣ BookMarker.scss
 ┃ ┃ ┣ BookMarkerCopy.jsx
 ┃ ┃ ┣ ChatViewer.jsx
 ┃ ┃ ┣ ChatViewer.scss
 ┃ ┃ ┣ ControllerButtonBox.jsx
 ┃ ┃ ┣ ControllerButtonBox.scss
 ┃ ┃ ┣ DataChart.jsx
 ┃ ┃ ┣ DataChart.scss
 ┃ ┃ ┣ DataChartController.jsx
 ┃ ┃ ┣ DataChartController.scss
 ┃ ┃ ┣ VideoPlayer.jsx
 ┃ ┃ ┣ VideoPlayer.scss
 ┃ ┃ ┗ cardbox.scss
 ┣ contexts
 ┃ ┣ AppStateContext.jsx
 ┃ ┣ EditorTimePointerContext.jsx
 ┃ ┗ FFmpegContext.jsx
 ┣ hooks
 ┃ ┣ useResult.js
 ┃ ┗ useRoute.js
 ┣ pages
 ┃ ┣ image
 ┃ ┃ ┣ Step0.png
 ┃ ┃ ┣ background.png
 ┃ ┃ ┣ icon.png
 ┃ ┃ ┣ 그림1.png
 ┃ ┃ ┣ 그림2.png
 ┃ ┃ ┣ 그림3.png
 ┃ ┃ ┣ 그림4.png
 ┃ ┃ ┣ 그림5.png
 ┃ ┃ ┣ 다시보기1.png
 ┃ ┃ ┣ 다시보기2.png
 ┃ ┃ ┗ 배경.png
 ┃ ┣ Editor.jsx
 ┃ ┣ Editor.scss
 ┃ ┣ Home.jsx
 ┃ ┣ Home.scss
 ┃ ┣ Loading.jsx
 ┃ ┣ Loading.scss
 ┃ ┗ NotFound.jsx
 ┣ providers
 ┃ ┣ AppStateProvider.jsx
 ┃ ┗ EditorTimePointerProvider.jsx
 ┣ App.css
 ┣ App.js
 ┗ index.js
```
