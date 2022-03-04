import React from "react";

import {
  AxisTickStrategies,
  emptyFill,
  emptyLine,
  synchronizeAxisIntervals,
  translatePoint,
  lightningChart,
  UIOrigins,
  UIElementBuilders,
  UILayoutBuilders,
  AutoCursorModes,
  Themes,
  SolidLine,
  SolidFill,
  ColorHEX,
} from "@arction/lcjs";

import EditorTimePointerContext from "../../contexts/EditorTimePointerContext";
import "./DataChart.scss";
import { useEffect, useRef } from "react";
import useResult from "../../hooks/useResult";

const CHANNELS = 3;
// const DATA_PER_CHANNEL = 5 * 1000 * 1000

// 리플레이 재생 시 1회만 재생
let REPLAY_ONLE_ONCE = true;

// 각 차트별로 x개수와 간격이 다르지만, 같은 시간을 가리키도록 하자.
// STEP_X: X좌표 간격(1밀리초)
const STEP_X_CHAT_DISTRIBUTION = 30 * 1000; // 30초
const STEP_X_VIDEO = 1000; // 1초
const STEP_X_AUDIO = 500;  // 0.5초
const STEP_X_CHAT_SUPER = 1000;  // 1초
const STEP_X_CHAT_KEYWORDS = 60 * 1000;   // 1분

// 차트 제목; 데이터리스트 인덱스 0,1,2,3,4
const TITLE0 = "Chat Flow";
const TITLE1 = "Video Frame";
const TITLE2 = "Audio Power";
const TITLE3 = "Super Chat";
const TITLE4 = "Keyword Flow";

// x축 확대축소 사용여부(boolean)
const AXIS_X_WHEEL_ZOOM = true;

// 차트 그래프 컬러 임의 조합 NUMBER
const GRAPH_COLOR_NUMBER = 999

// 차트 플레이 바의 컬러 조합
const YELLOW = "#ffcc00"
const RED = "#F00"
const BLUE = "0075ff"
const playBarColor = { basic: YELLOW, hover: RED }
const jumpBarColor = { basic: YELLOW, hover: BLUE }


/* 데이터 차트 컴포넌트 시작 */
const DataChart = (props) => {
  const { dataList, id, url, duration } = props;
  const { pointer, callSeekTo, setPlayed, setIsplaying, seeking, setSeeking, changePointer, setReplayRef, setDataChangeRef } = React.useContext(EditorTimePointerContext);
  const { relay, setRelay, markers, setMarkers, chatKeywords, isChatSuper, isChatKeywords, isKeywordsDownload, receivedDataSetList, setReceivedDataSetList } = useResult();

  const axisListRef = useRef({ x: undefined, y: undefined, time: undefined });
  const playBarListRef = useRef(undefined);
  const chartListRef = useRef(undefined);
  const seriesListRef = useRef(undefined);
  const dragStartRef = useRef({ isDrag: false, xValue: Number.MAX_SAFE_INTEGER });
  const clickToJumpRef = useRef({ isJump: false, jumpTime: undefined });
  const replayRef = useRef({ 
    isReplay: false, startTime: undefined, endTime: undefined, duration: undefined,
    replay: replayBand, 
    saveMarker: undefined,
    playingId: undefined, isPlayOnce: REPLAY_ONLE_ONCE,
    subKey: {isShiftKey: false, isCtrlKey: false},
    wordKey: {isS: false},
    isTyping: undefined,
  });
  const dataDataRef = useRef({ isChange: false, dashboard: undefined, chartList: undefined, seriesList: undefined, change: changeChartData });
  const onBarChangeRef = useRef(false);
  const dragBandList = useRef(undefined);
  const whichChartRef = useRef(undefined);
  const fitActiveRef = useRef(false);
  const yMaxRef = useRef([]);
  const markerInfoRef = useRef({interruption: false, playingId: undefined, playingIndex: undefined, selectedMarkerList: []})

  // console.log('id, url', id, url)
  // console.log("Charts received Data", dataList);

  // 현재 재생 시간
  let TIMELINE = pointer;

  // 차트별로 STEP_X 값 다르게 하기
  function whichStepX(index) {
    let step;
    switch (index) {
      case 0:
        step = STEP_X_CHAT_DISTRIBUTION;
        return step;
      case 1:
        step = STEP_X_VIDEO;
        return step;
      case 2:
        step = STEP_X_AUDIO;
        return step;
      case 3:
        step = STEP_X_CHAT_SUPER;
        return step;
      case 4:
        step = STEP_X_CHAT_KEYWORDS;
        return step;
      default:
        console.log("here is no chart step x");
    }
  }

  /* 리플레이 키트 Ref 전역으로 보내기, 북마커 사용 */
  useEffect(() => {
    setReplayRef(replayRef);
  }, []);

  /* 데이터 차트 변수, 함수 전역으로 보내기 dataChartRef */
  useEffect(() => {
    // if (!dataDataRef) return;
    setDataChangeRef(dataDataRef);
  }, [])

  /* 키워드 데이터 도착할 떄, 데이터리스트에 추가 */
  useEffect(() => {
    if (chatKeywords) {
      dataList[4] = chatKeywords
      // console.log('chatKeyword into dataList')
    }
  }, [isKeywordsDownload, chatKeywords])

  /* 메인 차트 그리기 */
  useEffect(() => {
    // lcjs 생성
    const lcjs = lightningChart({
      overrideInteractionMouseButtons: {
        chartXYPanMouseButton: 0, // LMB
        chartXYRectangleZoomFitMouseButton: 2, // RMB
        axisXYZoomMouseButton: 1, //줌 드래그: RMB
        axisXYPanMouseButton: 0, // x축 좌우 이동 드래그: LMB
      },
    });

    // 대쉬보드 생성
    const dashboard = lcjs
      .Dashboard({
        container: id,
        numberOfColumns: 1,
        numberOfRows: CHANNELS,
        disableAnimations: true,
        theme: Themes.darkMagenta,
      })
      .setHeight(500, 1000);

    // 대쉬보드 ref 담기
    dataDataRef.current.dashboard = dashboard;

    // 기본 축 x, y 리스트
    const axisYList = new Array(CHANNELS);
    const axixXList = new Array(CHANNELS);

    // 차트 만드는 함수
    function makeChart(i, title = undefined, padding = 30, xThickness = 30, yThickness = 80) {
      let name = title;
      const chart = dashboard
        .createChartXY({
          columnIndex: 0,
          rowIndex: i,
        })
        .setPadding({ right: padding });

      // 각 차트 상단 타이틀 비우기
      chart.setTitleFillStyle(emptyFill);

      // 인덱스 따른 차트 이름 설정
      if (!title) {
        name = whichChart(i);
      }

      // 축 생성
      const axisX = chart
        .getDefaultAxisX()
        .setThickness({ min: xThickness })
        .setTickStrategy(AxisTickStrategies.Time);
      const axisY = chart.getDefaultAxisY().setTitle(`${name}`).setThickness({ min: yThickness });

      // 차트마다 축리스트에 생성된 축 담기
      axixXList[i] = axisX;
      axisYList[i] = axisY;

      // 차트 레이아웃
      const uiLayout = chart
        .addUIElement(UILayoutBuilders.Column, {
          x: chart.getDefaultAxisX(),
          y: chart.getDefaultAxisY(),
        })
        .setOrigin(UIOrigins.LeftTop)
        .setPosition({
          x: chart.getDefaultAxisX().getInterval().start,
          y: chart.getDefaultAxisY().getInterval().end,
        })
        .setMouseInteractions(false)
        .setBackground((background) => background.setStrokeStyle(emptyLine));
      chart
        .getDefaultAxisX()
        .onScaleChange((start, end) =>
          uiLayout.setPosition({
            x: start,
            y: chart.getDefaultAxisY().getInterval().end,
          })
        );
      chart
        .getDefaultAxisY()
        .onScaleChange((start, end) =>
          uiLayout.setPosition({
            x: chart.getDefaultAxisX().getInterval().start,
            y: end,
          })
        );

      return chart;
    }

    // 메인 차트 리스트 생성
    const chartList = new Array(CHANNELS).fill(0).map((_, i) => makeChart(i));

    // 차트 리스트 ref 담기
    chartListRef.current = chartList;
    dataDataRef.current.chartList = chartList;

    // axisTimeRef = 플레이 바가 담긴 리스트
    axisListRef.current.x = axixXList;
    axisListRef.current.y = axisYList;

    // charlist의 index를 통해 차트 이름을 구분하자.
    function whichChart(index) {
      // 마우스 결과박스 내용 차트 이름 넣기
      // 입력받은 데이터 순서, 현재 [ 채팅, 비디오, 오디오 ]
      let name;
      switch (index) {
        case 0:
          name = TITLE0;
          return name;
        case 1:
          name = TITLE1;
          return name;
        case 2:
          name = TITLE2;
          return name;
        case 3:
          name = TITLE3;
          return name;
        case 4:
          name = TITLE4;
          return name;
        default:
        // console.log("here is chart name");
      }
    }
    whichChartRef.current = whichChart;

    const seriesList = chartList.map((chart, i) => {
      const name = whichChart(i);
      const series = chart
        .addLineSeries({
          dataPattern: {
            pattern: "ProgressiveX",
          },
          automaticColorIndex: i * GRAPH_COLOR_NUMBER,
        })
        // 차트 y축 타이틀
        .setName(`${name}`)
        .setCursorInterpolationEnabled(false);
      return series;
    });

    synchronizeAxisIntervals(
      ...chartList.map((chart) => chart.getDefaultAxisX())
    );

    // seriesListRef = series가 담긴 리스트
    seriesListRef.current = seriesList;
    dataDataRef.current.seriesList = seriesList;
  }, [url, id, chatKeywords]);


  /* 데이터 받아서 차트 렌더링 */
  useEffect(() => {
    const chartList = chartListRef.current;
    const seriesList = seriesListRef.current;

    Promise.all(dataList.map((data, i) => { 
      const STEP_X = whichStepX(i);

      const yMin = data.reduce(
        (min, cur) => Math.min(min, cur.y),
        Number.MAX_SAFE_INTEGER
      );
      const yMax = data.reduce(
        (max, cur) => Math.max(max, cur.y),
        -Number.MAX_SAFE_INTEGER
      );

      yMaxRef.current[i] = yMax;
      
      // 1번 차트 데이터들은 y 고유값으로 유지
      if (i === 0 || i === 3 || i === 4) {
        return data.map((xy) => ({
          x: xy.x * STEP_X,
          y: xy.y
        }))
      }
      
      // Map generated XY trace data set into a more realistic trading data set.
      const baseLine = 50;  // 최소값을 0, 최대값을 100으로 놓았을 때를 그래프로 그리도록 설정함.
      // const baseLine = 10 + Math.random() * 2000;
      const variationAmplitude = baseLine;
      const yIntervalHalf = (yMax - yMin) / 2;
      const yTraceBaseline = yMin + yIntervalHalf;
      return data.map((xy) => ({
        x: xy.x * STEP_X,
        y:
          baseLine +
          ((xy.y - yTraceBaseline) / yIntervalHalf) * variationAmplitude,
      }))
    })  
  ).then((receivedDataSet) => {
    if (receivedDataSet && receivedDataSet[0]) {
      seriesList.forEach((series, i) => {
        series.add(receivedDataSet[i]);
      });
      setReceivedDataSetList(receivedDataSet);
    }

    // Customize chart interactions. x축 마우스인터렉션 휠 설정 여부
    chartList.forEach((chart) => {
      chart.setMouseInteractions(false);
      chart.getDefaultAxisX().setMouseInteractions(AXIS_X_WHEEL_ZOOM);
      chart
        .setMouseInteractionRectangleFit(false)
        .setMouseInteractionRectangleZoom(false);
    });

    // Create custom chart interaction for mouse dragging inside chart area.
    const xBandList = chartList.map((chart) =>
      chart.getDefaultAxisX().addBand().dispose()
    );
    chartList.forEach((chart) => {
      // 각 차트에 축 생성
      const axisX = chart.getDefaultAxisX();
      const axisY = chart.getDefaultAxisY();

      // 해당 축에 x위치 표시해주는 틱 생성
      const xTicksStart = chartList.map((chart) =>
        chart.getDefaultAxisX().addCustomTick().dispose()
      );
      const xTicksEnd = chartList.map((chart) =>
        chart.getDefaultAxisX().addCustomTick().dispose()
      );

      // chart.setMouseInteractionRectangleFit(false).setMouseInteractionRectangleZoom(false)
      chart.onSeriesBackgroundMouseDrag(
        (_, event, button, startLocation, delta) => {
          // event: 이벤트, button: 입력됨 0, startLocation: 시작좌표, delta: 드래그변화량
          // console.log('event', event, 'startLocation', startLocation, 'delta', delta);
          if (button !== 0) return;

          xBandList.forEach((band, i) => {
            const bandChart = chartList[i];

            const xAxisLocationStart = translatePoint(
              bandChart.engine.clientLocation2Engine(
                startLocation.x,
                startLocation.y
              ),
              bandChart.engine.scale,
              { x: axisX, y: axisY }
            ).x;
            const xAxisLocationNow = translatePoint(
              bandChart.engine.clientLocation2Engine(
                event.clientX,
                event.clientY
              ),
              bandChart.engine.scale,
              { x: axisX, y: axisY }
            ).x;
            // console.log('xAxisLocationStart.x', xAxisLocationStart, 'xAxisLocationNow.x', xAxisLocationNow)
            if (Math.abs(event.clientX - startLocation.x) > 10) {
              // 드래그 하고 있는 밴드(범위)을 표현하기
              band
                .restore()
                .setValueStart(xAxisLocationStart)
                .setValueEnd(xAxisLocationNow)
              // .onValueChange((band, start, end)=>console.log('band is changing', band, start, end));
              // 드래그로 확대되어 바뀐 클릭 시작 시간 값과 클릭 끝 값 3차트에서 확인
              // console.log('start', xAxisLocationStart, 'end', xAxisLocationNow)
              xTicksStart.forEach((xTick) =>
                xTick.restore().setValue(xAxisLocationStart)
              );
              xTicksEnd.forEach((xTick) =>
                xTick.restore().setValue(xAxisLocationNow)
              );
              dragStartRef.current.xValue = Math.round(
                Math.min(xAxisLocationStart, xAxisLocationNow) / 1000
              );
            } else {
              band.dispose();
            }
          });
          dragBandList.current = xBandList;
          dragStartRef.current.isDrag = true;
        }
      );
      chart.onSeriesBackgroundMouseDragStop(
        (_, event, button, startLocation) => {
          if (button !== 0 || xBandList[0].isDisposed()) return;

          // 마우스 드래그 시작과 끝 시간 값
          const xDragStart = xBandList[0].getValueStart();
          const xDragEnd = xBandList[0].getValueEnd();

          // 시작과 끝 시간 초 단위 변환
          const startTime = Math.round(xDragStart / 1000);
          const endTime = Math.round(xDragEnd / 1000);

          // 마우스 드래그 시작이 끝보다 작으면 좌->우 드래그
          if (xDragStart > xDragEnd) {
            // 마우스드래그 좌우방향 무관하게 시작과 끝 값을 크기 순으로 설정
            const xStart = Math.min(xDragStart, xDragEnd);
            const xEnd = Math.max(xDragStart, xDragEnd);

            chartList[0]
              .getDefaultAxisX()
              .setInterval(xStart, xEnd, false, true);
            xBandList.forEach((band, i) => {
              const nChart = chartList[i];
              const STEP_X = whichStepX(i);
              let yMin = 999999;
              let yMax = -999999;
              for (let x = xStart; x < xEnd; x += STEP_X) {
                const dp = receivedDataSet[i][Math.round(x / STEP_X)];
                if (dp !== undefined) {
                  yMin = Math.min(yMin, dp.y);
                  yMax = Math.max(yMax, dp.y);
                }
              }
              nChart.getDefaultAxisY().setInterval(yMin, yMax, false, true);
              band.dispose();

              console.log(
                "R->L mouse drag",
                "startTime", startTime,
                "endTime", endTime,
                "yMax", yMax,
              );
            });
            // console.log("mouse drag", "xStart", xStart, "xEnd", xEnd);
            xTicksStart.forEach((xTick) => xTick.dispose());
            xTicksEnd.forEach((xTick) => xTick.dispose());

          }
          // 위와 반대방향으로 드래그 (현재 L->R)
          else {
            // xTicks1.forEach((xTick) => xTick.restore().setValue(xDragEnd))
            console.log(
              "L->R mouse drag",
              "startTime",
              startTime,
              "endTime",
              endTime
              );
              
            // 키보드 SHIFT가 눌린 상태는 자동재생 막고 드래그만 하기
            if (replayRef.current.subKey.isShiftKey) {
              // 드래그 시, 드래그 시작으로 재생 시작, 드래그 구간 반복
              replayRef.current.isReplay = true;
              replayRef.current.startTime = startTime;
              replayRef.current.endTime = endTime;

              // 드래그 종료 시, 시간 표시 삭제
              resultTable.dispose();
              xTicksStart.forEach((xTick) => xTick.dispose());
              xTicksEnd.forEach((xTick) => xTick.dispose());
              // 북마크 재생중 벗어나도 relay 유지
            }
            // 키보드 SHIFT가 안 눌린 상태
            else {
              // 드래그 시, 드래그 시작지점에서 재생 시작, 드래그 구간 리플레이(REPLAY_ONLY_ONCE: false 일 때)
              setSeeking(true);
              const startTimeRatio = startTime / duration;
              replayRef.current.isReplay = true;
              replayRef.current.startTime = startTime;
              replayRef.current.endTime = endTime;
              // console.log('callSeekTo', playerRef, 'playTimeRatio', playTimeRatio, 'playTime', playTime)
              callSeekTo(startTimeRatio)
              setPlayed(parseFloat(startTimeRatio));
              changePointer(startTime);
              setSeeking(false) 
              // 드래그 종료 시, 시간 표시 삭제
              resultTable.dispose();
              xTicksStart.forEach((xTick) => xTick.dispose());
              xTicksEnd.forEach((xTick) => xTick.dispose());
              // 북마크 재생중 벗어나면 markers의 isPlaying 체크, relay 해제
              markerInfoRef.current.interruption = true;
              setRelay(false);
            }
          }        
        }
      );

      // 차트 전체 보기 전환, x축 더블 클릭
      chart.getDefaultAxisX().onAxisInteractionAreaMouseDoubleClick((_, event) => {
        if (event.button !== 0) return;

        fitActiveRef.current = true;
        chartList.forEach((nChart) => {
          nChart.getDefaultAxisX().fit(false);
          nChart.getDefaultAxisY().fit(false);
        });
        fitActiveRef.current = false;
        // setXTicksStart(xTicksStart.map((xTick) => xTick.dispose()))
        // setXTicksEnd(xTicksEnd.map((xTick) => xTick.dispose()))
      });

      // 차트 x값 인식 onSeriesBackgroundMouseClick: 클릭
      // chart.setMouseInteractionsWhileZooming(true).MouseClickEventType = 2;
      chart.onSeriesBackgroundMouseClick((_, event, button) => {
        event.preventDefault();

        // 마우스 드래그할 때는 작동되지 않도록 lock-unlock
        if (dragStartRef.current.isDrag) {
          dragStartRef.current.isDrag = false
          return;
        }

        // 클릭 점핑, seeking 준비: clickRef 또는 pointer 둘 다 설정해서 먼저 변하는 값 빠르게 갱신
        clickToJumpRef.current.isJump = true
        // console.log(clickRef.current)
        // console.log('isDrag?', dragStartRef.current)

        const mouseLocationEngine = chart.engine.clientLocation2Engine(
          event.clientX,
          event.clientY
        );
        const mouseLocationAxisX = translatePoint(
          mouseLocationEngine,
          chart.engine.scale,
          { x: chart.getDefaultAxisX(), y: chart.getDefaultAxisY() }
        ).x;

        const playTime = Math.round(mouseLocationAxisX / 1000)
        const playTimeRatio = mouseLocationAxisX / 1000 / duration;
        clickToJumpRef.current.jumpTime = playTime;
        // console.log('callSeekTo', playerRef, 'playTimeRatio', playTimeRatio, 'playTime', playTime)
        setSeeking(true);
        callSeekTo(playTimeRatio)
        setPlayed(parseFloat(playTimeRatio));
        changePointer(playTime);
        setSeeking(false)

        // 구간 반복 있다면 제거
        replayRef.current.isReplay = false;
        // 북마크 재생 있다면 제거
        markerInfoRef.current.interruption = true;
      });
    });

    fitActiveRef.current = false;
    // X축 범위가 바뀌면 Y축 상태 갱신
    chartList.forEach((chart, i) => {
      chart.getDefaultAxisX().onScaleChange((xStart, xEnd) => {
        if (fitActiveRef.current) return;

        const STEP_X = whichStepX(i);
        let yMin = 999999;
        let yMax = -999999;
        // let x = xStart < 0 ? 0 : xStart
        for (let x = xStart; x < xEnd; x += STEP_X) {
          const dp = receivedDataSet[i][Math.round(x / STEP_X)];
          if (dp !== undefined) {
            yMin = Math.min(yMin, dp.y);
            yMax = Math.max(yMax, dp.y);
          }
        }
        if (yMin < 999999) {
          chart.getDefaultAxisY().setInterval(yMin, yMax, false, true);
        }
      });
    });
  });

    // 커서 창 상태
    const dashboard = dataDataRef.current.dashboard;
    const resultTable = dashboard
      .addUIElement(UILayoutBuilders.Column, dashboard.engine.scale)
      .setMouseInteractions(false)
      .setOrigin(UIOrigins.LeftBottom)
      .setMargin(5);
    // const resultTableRows = new Array(1 + CHANNELS).fill(0).map(_ => resultTable.addElement(UIElementBuilders.ButtonBox))
    const resultTableRows = new Array(4 + CHANNELS)
      .fill(0)
      .map((_) => resultTable.addElement(UIElementBuilders.ButtonBox));
    resultTable.dispose();
    const xTicks = chartList.map((chart) =>
      chart.getDefaultAxisX().addCustomTick().dispose()
    );

    chartList.forEach((chart) => {
      chart.setAutoCursorMode(AutoCursorModes.disabled);
      chart.onSeriesBackgroundMouseMove((_, event) => {
        const mouseLocationEngine = chart.engine.clientLocation2Engine(
          event.clientX,
          event.clientY
        );
        const mouseLocationAxisX = translatePoint(
          mouseLocationEngine,
          chart.engine.scale,
          { x: chart.getDefaultAxisX(), y: chart.getDefaultAxisY() }
        ).x;
        resultTableRows[0].setText(
          chart.getDefaultAxisX().formatValue(mouseLocationAxisX)
        );
        // for (let i = 0; i < CHANNELS; i += 1) {
        //   const series = seriesList[i]
        //   const nearestDataPoint = series.solveNearestFromScreen(mouseLocationEngine)
        //   // 마우스 커서창에 뜨는 레전드 박스 텍스트 값
        //   resultTableRows[1 + i].setText(series.getName() + ': ' + (nearestDataPoint ? chart.getDefaultAxisY().formatValue(nearestDataPoint.location.y) + ' €?' : ''))
        // }
        for (let i = 0; i < 3 + CHANNELS; i += 1) {
          // 마우스 커서창에 뜨는 레전드 박스 텍스트 값
          resultTableRows[1 + i].setText(
            i === 0 ? '클릭: 이동'
              : (i === 1 ? 'L->R드래그: 구간반복'
                : (i === 2 ? 'R->L드래그: 구간확대'
                  : (i === 3 ? '시간축 휠: 구간확대'
                    : (i === 4 ? '시간축 드래그: 좌우이동'
                      : '시간축 더블클릭: 초기화')))))
        }
        resultTable.restore().setPosition(mouseLocationEngine);
        xTicks.forEach((xTick) => xTick.restore().setValue(mouseLocationAxisX));
      });
      chart.onSeriesBackgroundMouseDragStart((_, event) => {
        resultTable.dispose();
        xTicks.forEach((xTick) => xTick.dispose());
      });
      chart.onSeriesBackgroundMouseLeave(() => {
        resultTable.dispose();
        xTicks.forEach((xTick) => xTick.dispose());
      });
    });

    chartListRef.current = chartList;

    return () => {
      // Destroy chart.
      seriesList.forEach((series) => {
        series.dispose();
        series = undefined;
      });
      chartList.forEach((chart) => {
        chart.dispose();
        chart = undefined;
      });
      resultTable.dispose();
      dashboard.dispose();
      chartListRef.current = undefined
      seriesListRef.current = undefined
      // receivedDataSetListRef.current = undefined
    };    
  }, [url, chatKeywords]);


  // 차트 전환하는 함수(몇 번 차트(charNum)를 몇 번 데이터 인덱스(toIndex)로 교체하겠다.)
  function changeChartData(chartNum, toIndex) {
    const seriesList = seriesListRef.current;
    seriesList[chartNum].dispose();
    seriesList[chartNum] = undefined;
    const chartList = chartListRef.current;
    const chart = chartList[chartNum];
    const yMax = yMaxRef.current[toIndex];
    // console.log('chartList', chartList)
    // console.log('yMaxRef.current', yMaxRef.current, yMax)

    if (toIndex === 0 || toIndex === 3 || toIndex === 4) {
      // 차트 0번 y축 한계를 각 고유값으로 셋팅한다.
      chart.getDefaultAxisY().setInterval(0, yMax, false, true)
    }
    else {
      // 그 외에는 상대지수 100으로 셋팅한다.
      chart.getDefaultAxisY().setInterval(0, 100, false, true)
    }
    // 바뀌도록 차트를 돌며 갱신한다.
    fitActiveRef.current = true;
    chartList.forEach((nChart) => {
      nChart.getDefaultAxisX().fit(false, true);
      nChart.getDefaultAxisY().fit(false);
    });
    fitActiveRef.current = false;

    const name = whichChartRef.current(toIndex)
    chart.getDefaultAxisY().setTitle(`${name}`).setThickness({ min: 80 });

    seriesList[chartNum] = chart
      .addLineSeries({
        dataPattern: {
          pattern: "ProgressiveX",
        },
        automaticColorIndex: toIndex * GRAPH_COLOR_NUMBER,
      })
      .setName('Super Chat')
      .setCursorInterpolationEnabled(false)
      .clear().add(receivedDataSetList[toIndex]);
    
      return seriesList[0]
  }

  /* 슈퍼챗으로 데이터 차트 전환하는 렌더링 */
  useEffect(() => {
    if (isChatSuper === -1) return;
    // console.log('receivedDataSetList', receivedDataSetList)
    if (!receivedDataSetList) return;

    // SuperChat 데이터는 데이터리스트 인덱스 3, false일 때 전환
    let series;
    if (!isChatSuper) {
      series = changeChartData(0, 3);
    }
    else {
      if (!isChatKeywords)
      series = changeChartData(0, 4);
      else
      series = changeChartData(0, 0);
    }
    return () => {
      series.dispose()
    }
  }, [isChatSuper]);

  /* 특정 키워드 검색으로 데이터 차트 전환하는 렌더링 */
  useEffect(() => {
    if (isChatKeywords === -1) return;
    if (receivedDataSetList.length === 3) return;
    // console.log('Keywords Chart arrived', isChatKeywords, isKeywordsDownload, receivedDataSetList)
    let series;
    // keywords 데이터는 데이터리스트 인덱스 4, isChatKeywords false일 떄 전환
    if (!isChatKeywords) {
      series = changeChartData(0, 4);
    }
    else {
      if (!isChatSuper)
        series = changeChartData(0, 3);
      else
        series = changeChartData(0, 0);
    }

    return () => {
      series.dispose()
    }
  }, [isChatKeywords, isKeywordsDownload, receivedDataSetList]);


  // 구간 반복 재생 함수(pointer, 시작 시간, 종료 시간, 옵션: markers)
  function replayBand(pointer, startTime, endTime, playingId = undefined, markerList = undefined) {
    console.log('replayBand', startTime, endTime, playingId, markerList)
    if (pointer === endTime + 1) {
      // id, markers 안 받았으면 start로 돌아가기
      if (!playingId || !markerList) {
        const playTime = startTime
        const playTimeRatio = playTime / duration
        setSeeking(true)
        callSeekTo(playTimeRatio)
        setPlayed(parseFloat(playTimeRatio));
        changePointer(playTime);
        setSeeking(false)
      }
      
      // id, markers를 받았다면, 다음 marker 탐색이동
      else {
        const selectedMarkers = findSelectedMarkers(markerList);
        // 선택된 리스트 없으면 중지
        if (selectedMarkers.length === 0) {
          setIsplaying(false);
          return; 
        }

        // 재생할 다음 북마크 찾기
        const nowPlayingId = playingId;
        // const nowIndex = markerInfoRef.current.playingIndex;
        const nowIndex = selectedMarkers.findIndex((marker, i) => marker.id === nowPlayingId);
        const totalIndex = selectedMarkers.length - 1;
        let nextMarker, firstMarker, playTime;

        // 다음 북마크가 있다면
        if (nowIndex < totalIndex) {
          nextMarker = selectedMarkers[nowIndex+1];
          playTime = nextMarker.startPointer;

          // 다음 북마크로 리플레이 상태 저장
          replayRef.current.startTime = nextMarker.startPointer;
          replayRef.current.endTime = nextMarker.endPointer;
          replayRef.current.playingId = nextMarker.id;
          // replayBand(pointer, nextMarker.startPointer, nextMarker.endPointer, markers);
        }

        // 마지막 북마크였다면
        else {
          // '리플레이 1회 재생'이 켜졌다면 중지
          if (replayRef.current.isPlayOnce) {
            setIsplaying(false);
            return;
          }
          // 그 외 반복
          else {
            firstMarker = selectedMarkers[0];
            playTime = firstMarker.startPointer;

            // 첫 북마크로 리플레이 상태 저장
            replayRef.current.startTime = firstMarker.startPointer;
            replayRef.current.endTime = firstMarker.endPointer;
            replayRef.current.playingId = firstMarker.id;
            // replayBand(pointer, firstMarker.startPointer, firstMarker.endPointer, markers);
          }
        }
        // 공통: 재생 지점으로 이동, 1회만 재생이었어도 중지상태로 시작지점으로 이동
        console.log('nowPlayingId', nowPlayingId, 'nowIndex', nowIndex, 'totalIndex', totalIndex, 'nextMarker', nextMarker, 'firstMarker', firstMarker);
        const playTimeRatio = playTime / duration
        setSeeking(true)
        callSeekTo(playTimeRatio)
        setPlayed(parseFloat(playTimeRatio));
        changePointer(playTime);
        setSeeking(false)
      }
    }
  }

  // 선택된 북마크 선별해서 리스트로 반환하는 함수
  function findSelectedMarkers(markers) {
    // console.log('markers', markers)
    const selectedMarkerList = markers.filter((marker) => marker.completed === true);
    markerInfoRef.current.selectedMarkerList = selectedMarkerList;
    // console.log('selectedMarkerList', selectedMarkerList)
    return selectedMarkerList
  }

  /* 구간 반복 기능: isReplay true이면 L->R 드래그 되었거나, 북마크를 선택해서 재생했다는 뜻 */
  useEffect(() => {
    if (!replayRef.current.isReplay) return;

    console.log('relay', relay,'replay', replayRef.current.isReplay, replayRef.current.startTime, pointer, replayRef.current.endTime)
    // 일반 구간 반복
    if (!relay) {
      replayBand(pointer, replayRef.current.startTime, replayRef.current.endTime)
    }

    // 북마크 릴레이 반복
    else {
      replayBand(pointer, replayRef.current.startTime, replayRef.current.endTime, replayRef.current.playingId, markers)
    }
  }, [pointer])

  /* 드래그 되었거나 점프했다면 북마크 재생 중 표시 초기화 */
  useEffect(() => {
    if (!markers.length) return;
    // if (!markerInfoRef.current.interruption) return;

    if (!seeking) {
      let playCnt = 0;
      const updateMarkers = [...markers].map((marker, index) => {
        if (marker.startPointer <= pointer && pointer <= marker.endPointer+1) {
          marker.isPlaying = true;
          playCnt += 1;
          markerInfoRef.current.playingId = marker.id;
          markerInfoRef.current.playingIndex = index;
        }
        else {
          marker.isPlaying = false;
        }
        return marker;
      });

      setMarkers(updateMarkers);
      if (!playCnt) {
        markerInfoRef.current.playingId = undefined;
        markerInfoRef.current.playingIndex = undefined;
      }
      // markerInfoRef.current.interruption = false;
    }

  }, [pointer])


  /* 북마크가 체크되면 해당 범위 밴드로 보여주기 */
  useEffect(() => {
    // chartListRef 값이 없으면 리턴
    if (!chartListRef.current) return;

    // 밴드 생성해서 리스트 담기
    function addBookMarkBand(startTime, endTime) {
      const chartList = chartListRef.current;
      const newBandList = chartList.map((chart) =>
        chart.getDefaultAxisX().addBand().dispose()
      );
      newBandList.forEach((band, i) => {
        band
        .restore()
        .setValueStart(startTime * 1000)
        .setValueEnd(endTime * 1000)
      });      
    return newBandList;
    };

    const selectedMarkerList = findSelectedMarkers(markers);
    const selectedBandsListSet = selectedMarkerList.map((marker) => addBookMarkBand(marker.startPointer, marker.endPointer));
    // console.log('markerBandsList', selectedBandsListSet)

    // 선택 해제시 삭제
    return (() => {
      selectedBandsListSet.forEach(markerBandList => (markerBandList.forEach(band => band.dispose())));
    });
  }, [markers])


  /* 차트 플레이 바 나타내기 */
  useEffect(() => {
    // axisListRef 값이 없으면 리턴
    if (!axisListRef.current.x) return;

    // 다음 시간을 표현할 플레이바 만들기(시간, 컬러)
    function makePlayBarList(time, barColor) {
      const axisTimeList = axisListRef.current.x;
      const playBarList = axisTimeList.map((axisTime) =>
        axisTime
          .addConstantLine()
          // 바 생성 축에 붙힘
          .setValue(time)
          // 만약 테이블 사용시 이름표기
          .setName("playBar")
          // 바 스타일
          .setStrokeStyle(
            new SolidLine({
              thickness: 8,
              fillStyle: new SolidFill({
                color: ColorHEX(barColor.basic),
              }),
            })
          )
          // 호버 하이라이트
          .setStrokeStyleHighlight(
            new SolidLine({
              thickness: 10,
              fillStyle: new SolidFill({
                color: ColorHEX(barColor.hover),
              }),
            })
          )
          .setHighlightOnHover(true))
      
      // 사용자가 재생 포인트 임의지정했다면 상태 해제
      clickToJumpRef.current.isJump = false
      return playBarList
    }

    let playBarList
    if (!onBarChangeRef.current) {
      if (clickToJumpRef.current.isJump) {
        playBarList = makePlayBarList(clickToJumpRef.current.jumpTime * 1000, jumpBarColor)
      }
      else {
        playBarList = makePlayBarList(TIMELINE * 1000, playBarColor)
      }
    }

    // timeRef에 새로운 막대리스트 넣기
    playBarListRef.current = playBarList;
    playBarListRef.current.forEach((playBar) => playBar.restore());
    // playBarListRef.current.forEach((playBar) => playBar.restore().onValueChange((handlePlayBarChange)));

    // 플레이바 조정 핸들러 (시도 중)
    // function handlePlayBarChange(playBar, end) {
    //   onChangeBarRef.current = true;
    //   makeChartRef.current(end, jumpBarColor);
    //   // playBar.setValue(end)
    //   console.log('handlePlayBar', playBar, end);
    //   onChangeBarRef.current = false;
    // }

    // 이전 막대는 삭제
    return () => {
      playBarListRef.current.forEach((playBar) => playBar.dispose());
      playBarListRef.current.forEach((playBar) => playBar = undefined);
    };
  }, [id, url, TIMELINE]);

  return (
    <div id={id} className="TrippleChart"></div>
  );
};

export default React.memo(DataChart);