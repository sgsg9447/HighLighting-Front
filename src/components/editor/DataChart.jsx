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

const CHANNELS = 3;
// const DATA_PER_CHANNEL = 5 * 1000 * 1000

// 각 차트별로 x개수와 간격이 다르지만, 같은 시간을 가리키도록 하자.
// STEP_X: X좌표 간격(1밀리초)
const STEP_X_CHAT = 1000;
const STEP_X_VIDEO = 1000;
const STEP_X_AUDIO = 500;

// 차트 제목 1,2,3
const TITLE1 = "chat flow";
const TITLE2 = "video frame";
const TITLE3 = "audio power";

// x축 확대축소 사용여부(boolean)
const AXIS_X_WHEEL_ZOOM = true;

const DataChart = (props) => {
  const { pointer, changePointer } = React.useContext(EditorTimePointerContext);

  const { dataSets, id, url } = props;
  const chartRef = useRef(undefined);
  const timeRef = useRef(undefined);
  const dragStartRef = useRef({isDrag: false, xValue: Number.MAX_SAFE_INTEGER});
  console.log("Charts received Data", dataSets);
  let TIMELINE = pointer;

  // 메인 차트 그리기
  useEffect(() => {
    // if (!dataSets) return
    console.log("main", timeRef.current);
    // if (timeRef.current === false) return

    const lcjs = lightningChart({
      overrideInteractionMouseButtons: {
        chartXYPanMouseButton: 0, // LMB
        chartXYRectangleZoomFitMouseButton: 2, // RMB
        axisXYZoomMouseButton: 2, //줌 드래그: RMB
      },
    });

    const dashboard = lcjs
      .Dashboard({
        container: id,
        numberOfColumns: 1,
        numberOfRows: CHANNELS,
        disableAnimations: true,
        theme: Themes.darkMagenta,
      })
      // 차트 높이 (최소, 최대)
      .setHeight(500, 1000);

    // 플레이 바가 지나갈 시간축 담을 리스트 생성
    const timeList = new Array(CHANNELS);

    // 메인 차트 리스트 생성
    const chartList = new Array(CHANNELS).fill(0).map((_, i) => {
      const chart = dashboard
        .createChartXY({
          columnIndex: 0,
          rowIndex: i,
        })
        // 차트 오른쪽 패딩
        .setPadding({ right: 20 });

      // 각 차트 상단 타이틀 비우기
      chart.setTitleFillStyle(emptyFill);

      // 첫번째 차트에만 대표 타이틀 넣기
      // if (i > 0) {
      // 	chart.setTitleFillStyle(emptyFill)
      // } else {
      // 	chart.setTitle(`3 stock price trends with 1 microsecond data resolution (total ${DATA_PER_CHANNEL * CHANNELS} values)`)
      // }

      let name = whichChart(i);
      chart
        .getDefaultAxisX()
        .setThickness({ min: 30 })
        .setTickStrategy(AxisTickStrategies.Time);
      chart.getDefaultAxisY().setTitle(`${name}`).setThickness({ min: 50 });
      const axisTime = chart
        .getDefaultAxisX()
        .setThickness({ min: 30 })
        .setTickStrategy(AxisTickStrategies.Time);

      // 시간축 리스트에 생성된 시간축 담기
      timeList[i] = axisTime;

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
      uiLayout
        .addElement(UIElementBuilders.TextBox)
        // which name ?
        .setText("< small name >")
        .setTextFont((font) => font.setSize(0));

      return chart;
    });

    // ref 안에 플레이 막대 리스트 담기
    chartRef.current = timeList;

    // charlist의 index를 통해 차트 이름을 구분하자.
    function whichChart(index) {
      // 마우스 결과박스 내용 차트 이름 넣기
      // 입력받은 데이터 순서, 현재 [ 채팅, 비디오, 오디오 ]
      let name;
      switch (index) {
        case 0:
          name = TITLE1;
          return name;
        case 1:
          name = TITLE2;
          return name;
        case 2:
          name = TITLE3;
          return name;
        default:
          console.log("here is chart name");
      }
    }

    const seriesList = chartList.map((chart, i) => {
      const name = whichChart(i);
      const series = chart
        .addLineSeries({
          dataPattern: {
            pattern: "ProgressiveX",
          },
          automaticColorIndex: i * 2,
        })
        // .setName('< Stock name >')
        .setName(`${name}`)
        .setCursorInterpolationEnabled(false);
      return series;
    });

    synchronizeAxisIntervals(
      ...chartList.map((chart) => chart.getDefaultAxisX())
    );

    // 차트별로 STEP_X 값 다르게 하기
    function whichStepX(index) {
      let step;
      switch (index) {
        case 0:
          step = STEP_X_CHAT;
          return step;
        case 1:
          step = STEP_X_VIDEO;
          return step;
        case 2:
          step = STEP_X_AUDIO;
          return step;
        default:
          console.log("here is no chart step x");
      }
    }

    console.log("beforePromise", dataSets);
    Promise.all(
      dataSets.map((data, i) => {
        // console.log('inPromise', data)
        const STEP_X = whichStepX(i);
        // Map generated XY trace data set into a more realistic trading data set.
        const baseLine = 10 + Math.random() * 2000;
        const variationAmplitude = baseLine * 0.03;
        const yMin = data.reduce(
          (min, cur) => Math.min(min, cur.y),
          Number.MAX_SAFE_INTEGER
        );
        const yMax = data.reduce(
          (max, cur) => Math.max(max, cur.y),
          -Number.MAX_SAFE_INTEGER
        );
        const yIntervalHalf = (yMax - yMin) / 2;
        const yTraceBaseline = yMin + yIntervalHalf;
        return data.map((xy) => ({
          x: xy.x * STEP_X,
          y:
            baseLine +
            ((xy.y - yTraceBaseline) / yIntervalHalf) * variationAmplitude,
        }));
      })
    ).then((receivedDataSets) => {
      // console.log(dataSets2)
      if (receivedDataSets && receivedDataSets[0]) {
        seriesList.forEach((series, i) => {
          series.add(receivedDataSets[i]);
          console.log("receivedDataSets", receivedDataSets[i]);
        });
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

        // 해당 축에 x위치 표시해주는 틱 생성하고 감추기
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
            // console.log('onSeriesBackgroundMouseDrag', event, 'button', button, 'startLocation', startLocation, 'delta', delta)
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
              if (Math.abs(event.clientX - startLocation.x) > 10) {
                // 드래그 하고 있는 밴드(범위)을 표현하기
                band
                  .restore()
                  .setValueStart(xAxisLocationStart)
                  .setValueEnd(xAxisLocationNow);
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
            dragStartRef.current.isDrag = true
          }
        );
        chart.onSeriesBackgroundMouseDragStop(
          (_, event, button, startLocation) => {
            if (button !== 0 || xBandList[0].isDisposed()) return;

            // 마우스 드래그 시작과 끝 시간 값
            const xDragStart = xBandList[0].getValueStart();
            const xDragEnd = xBandList[0].getValueEnd();

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
                  const dp = receivedDataSets[i][Math.round(x / STEP_X)];
                  if (dp !== undefined) {
                    yMin = Math.min(yMin, dp.y);
                    yMax = Math.max(yMax, dp.y);
                  }
                }
                nChart.getDefaultAxisY().setInterval(yMin, yMax, false, true);
                band.dispose();
              });
              console.log("mouse drag", "xStart", xStart, "xEnd", xEnd);
              xTicksStart.forEach((xTick) => xTick.dispose());
              xTicksEnd.forEach((xTick) => xTick.dispose());
            }
            // 위와 반대방향으로 드래그
            else {
              // xTicks1.forEach((xTick) => xTick.restore().setValue(xDragEnd))
              const startTime = Math.round(xDragStart / 1000);
              const endTime = Math.round(xDragEnd / 1000);
              console.log(
                "mouse drag",
                "startTime",
                startTime,
                "endTime",
                endTime
              );
              resultTable.dispose();
              xTicksStart.forEach((xTick) => xTick.dispose());
              xTicksEnd.forEach((xTick) => xTick.dispose());
            }
          }
        );

        // 차트 전체 보기 전환, x축 클릭
        chart.getDefaultAxisX().onAxisInteractionAreaMouseClick((_, event) => {
          if (event.button !== 0) return;

          fitActive = true;
          chartList.forEach((nChart) => {
            nChart.getDefaultAxisX().fit(false);
            nChart.getDefaultAxisY().fit(false);
          });
          fitActive = false;
          // setXTicksStart(xTicksStart.map((xTick) => xTick.dispose()))
          // setXTicksEnd(xTicksEnd.map((xTick) => xTick.dispose()))
        });

        // 차트 x값 인식 onSeriesBackgroundMouseClick: 클릭
        // chart.setMouseInteractionsWhileZooming(true).MouseClickEventType = 2;
        chart.onSeriesBackgroundMouseClick((_, event, button) => {
          event.preventDefault();
          console.log('isDrag?', dragStartRef.current)

          // 마우스 드래그할 때는 작동되지 않도록 lock-unlock
          if (dragStartRef.current.isDrag) {
            dragStartRef.current.isDrag = false
            return;
          }

          const mouseLocationEngine = chart.engine.clientLocation2Engine(
            event.clientX,
            event.clientY
          );
          const mouseLocationAxisX = translatePoint(
            mouseLocationEngine,
            chart.engine.scale,
            { x: chart.getDefaultAxisX(), y: chart.getDefaultAxisY() }
          ).x;
          const playBarTime = Math.round(mouseLocationAxisX / 1000);
          changePointer(playBarTime);
        });
      });

      let fitActive = false;
      // When X Axis interval is changed, automatically fit Y axis based on visible data.
      chartList.forEach((chart, i) => {
        chart.getDefaultAxisX().onScaleChange((xStart, xEnd) => {
          if (fitActive) return;

          const STEP_X = whichStepX(i);
          let yMin = 999999;
          let yMax = -999999;
          // let x = xStart < 0 ? 0 : xStart
          for (let x = xStart; x < xEnd; x += STEP_X) {
            const dp = receivedDataSets[i][Math.round(x / STEP_X)];
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

    // Setup custom data cursor.
    const resultTable = dashboard
      .addUIElement(UILayoutBuilders.Column, dashboard.engine.scale)
      .setMouseInteractions(false)
      .setOrigin(UIOrigins.LeftBottom)
      .setMargin(5);
    // const resultTableRows = new Array(1 + CHANNELS).fill(0).map(_ => resultTable.addElement(UIElementBuilders.TextBox))
    const resultTableRows = new Array(1)
      .fill(0)
      .map((_) => resultTable.addElement(UIElementBuilders.TextBox));
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
        // 	const series = seriesList[i]
        // 	const nearestDataPoint = series.solveNearestFromScreen(mouseLocationEngine)
        // 	// 마우스 커서창에 뜨는 레전드 박스 텍스트 값
        // 	resultTableRows[1 + i].setText(series.getName() + ': ' + (nearestDataPoint ? chart.getDefaultAxisY().formatValue(nearestDataPoint.location.y) + ' €?' : ''))
        // }
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

    return () => {
      // Destroy chart.
      console.log("before destroy chart", chartList);
      chartList.forEach((chart) => chart.dispose());
      resultTable.dispose();
      dashboard.dispose();
      console.log("after destroy chart", chartList);
      chartRef.current = undefined;
      // timeRef.current = false
    };
  }, [url]);
  // 렌더링 후 변화 안 줄만한 값은 url
  // url는 로컬에서 오는 듯??

  // 차트 플레이 바 나타내기 시도
  useEffect(() => {
    console.log("playerbar_useEffect");
    if (!chartRef.current) return;
    console.log("chartRef", chartRef.current);

    // ref 담긴 이전 막대 지우기
    if (timeRef.current) {
      // console.log(timeRef.current)
      timeRef.current.forEach((playBar) => playBar.dispose());
    }

    const axisTimeList = chartRef.current;
    // Add a Constantline to the X Axis
    const playBarList = axisTimeList.map((axisTime, index) =>
      axisTime
        .addConstantLine()
        // Position the Constantline in the Axis Scale
        .setValue(TIMELINE * 1000)
        // The name of the Constantline will be shown in the LegendBox
        .setName("X Axis Constantline")
        // Style the Constantline
        .setStrokeStyle(
          new SolidLine({
            thickness: 8,
            fillStyle: new SolidFill({
              color: ColorHEX("#ffcc00"),
            }),
          })
        )
        .setStrokeStyleHighlight(
          new SolidLine({
            thickness: 10,
            fillStyle: new SolidFill({
              color: ColorHEX("#F00"),
            }),
          })
        )
        .setHighlightOnHover(true)
    );

    timeRef.current = playBarList;

    // // Add a Band to the X Axis
    // const xAxisBand = axisX.addBand()
    // // Set the start and end values of the Band.
    // xAxisBand
    // 	.setValueStart(1800)
    // 	.setValueEnd(100)
    // 	// Set the name of the Band
    // 	.setName('X Axis Band')

    // 지울 때 보여주기
    return () => {
      timeRef.current.forEach((playBar) => playBar.restore());
    };
  }, [id, url, TIMELINE]);

  useEffect(() => {
    const components = chartRef.current;
    if (!components) return;
    const { seriesList } = components;
    if (!seriesList) return;

    // Set chart data.
    seriesList.forEach((series, i) => series.clear().add(dataSets[i]));
    console.log("set chart dataSets", seriesList);
  }, [dataSets, chartRef, timeRef]);

  return (
    <div className="DataChartContainer">
      <h1>데이터 차트 영역</h1>
      <div id={id} className="TrippleChart"></div>
    </div>
  );
};

export default DataChart;
