import Image from "next/image";
import Link from "next/link";
import { useCallback, useId, useState } from "react";

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
  const navId = useId();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, [setIsExpanded])
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
        <button className="navbar-toggler" onClick={toggleExpanded} type="button" aria-controls={navId} aria-expanded={isExpanded} aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isExpanded ? "show" : ""}`} id={navId}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {items.map((item) => {
              const ariaCurrent = item.id === activeId ? "page" : undefined;
              const linkClass = `nav-link ${item.id === activeId ? "active" : ""}`;
              return (
                <li className="nav-item" key={item.id}>
                  {"href" in item ? (
                    <Link className={linkClass} aria-current={ariaCurrent} href={item.href}>{item.label}</Link>
                  ) : (
                    <a className={linkClass} onClick={item.action} aria-current={ariaCurrent} role="button">{item.label}</a>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </nav>
  )
}