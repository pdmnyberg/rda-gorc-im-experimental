import "./ErrorMessage.css";

export const ErrorMessage = () => {
  return (
    <div className="error-container">
      <p>Oh no!</p>
      <p>
        We couln't fetch data from the chosen repository. <br></br> Please
        choose a different one.
      </p>
    </div>
  );
};
