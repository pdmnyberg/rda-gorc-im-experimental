import "./ErrorMessage.css";

export const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div className="error-container">
      <p>Oh no!</p>
      <p>
        We couldn't fetch data from the chosen repository. <br></br> Please
        choose a different one.
      </p>
      <pre>{message}</pre>
    </div>
  );
};
