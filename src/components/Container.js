// components/Container/index.js
import React from "react";
import styled from "styled-components";

// App.css에서 container class에 적용되던 CSS 가져옴
const FlexBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

// App.css에서 app class에 적용되던 CSS 가져옴
const ContainerWrapper = styled.div`
  width: 400px;
  margin-top: 72px;
`;

const Container = (props) => (
  <FlexBox>
    <ContainerWrapper>{props.children}</ContainerWrapper>
  </FlexBox>
);
export default Container;
