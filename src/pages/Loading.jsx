import Container from "../components/Loading/Container";
import Spinner from "../components/Loading/Spinner";
import "./Loading.scss";

const Loading = () => {
  return (
    <div className="Loading">
      <div className="LoadingContainer">
        <Container>
          <h1 className="title">Loading...</h1>
          <Spinner />
        </Container>
      </div>
    </div>
  );
};

export default Loading;
