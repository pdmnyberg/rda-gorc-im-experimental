type Button = {
  label: string;
  color?: (
    "primary" |
    "secondary" |
    "success" |
    "danger" |
    "warning" |
    "info" |
    "light" |
    "dark"
  );
  onClick: () => void;
};

export function Button({ label, color, onClick }: Button) {
  color = color ? color : "primary";
  return (
    <button className={`btn btn-${color}`} title={label} onClick={onClick}>{label}</button>
  );
}
