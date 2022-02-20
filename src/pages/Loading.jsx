import Container from "../components/Container";
import Spinner from "../components/Spinner";
import styled from "styled-components";

const Title = styled.h1`
  font-size: 64px;
  font-weight: bold;
  margin: 8px;
  margin-bottom: 96px;
  text-align: center;
`;

const Loading = () => {
  return (
    <Container>
      <Title>Loading</Title>
      <Spinner></Spinner>
    </Container>
  );
};

export default Loading;
