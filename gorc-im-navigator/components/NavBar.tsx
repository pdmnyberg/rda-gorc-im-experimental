import Image from "next/image";
import Link from "next/link";

type NavItem = ({
  id: string;
  label: string;
}) & (
  {href: string} |
  {action: () => void}
)

type NavBarProps = {
  title: string;
  subtitle?: string;
  logo?: {
    width: number,
    height: number,
    src: string,
  };
  items: NavItem[],
  activeId?: string;
}

export function NavBar({title, subtitle, logo, items, activeId}: NavBarProps) {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary flex-grow-0 flex-shrink-0">
      <div className="container-fluid">
        <a className="navbar-brand d-flex flex-row" href="#">
          {logo ? <Image src={logo.src} className="me-2" alt={title} width={(logo.width / logo.height) * 50} height={50} /> : <></>}
          <span className="d-flex flex-column align-self-center">
            <span>{title}</span>
            {subtitle ? <span className="fs-6">{subtitle}</span> : <></>}
          </span>
        </a>
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {items.map((item) => (
            <li className="nav-item" key={item.id}>
              {"href" in item ? (
                <Link className="nav-link" aria-current={item.id === activeId ? "page" : undefined} href={item.href}>{item.label}</Link>
              ) : (
                <a className="nav-link" onClick={item.action} aria-current={item.id === activeId ? "page" : undefined} role="button">{item.label}</a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}