import "./Button.css";

type Button = {
  label: string;
  onClick: () => void;
};

export function Button({ label, onClick }: Button) {
  return (
    <button className="button" title={label} onClick={onClick}>
      <span className="label">{label}</span>
    </button>
  );
}
