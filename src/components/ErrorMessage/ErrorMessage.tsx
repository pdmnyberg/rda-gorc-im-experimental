import "./ErrorMessage.css";

export const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div className="error-content">
        <h2>Oh no!</h2>
        <p>
            We couldn't fetch data from the chosen repository. <br></br> Please
            choose a different one.
        </p>
        <pre>{message}</pre>
    </div>
  );
};
