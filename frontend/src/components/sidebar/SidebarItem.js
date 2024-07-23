import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SidebarItem({ item }) {
    const [open, setOpen] = useState(false);

    const handleMouseEnter = () => setOpen(true);
    const handleMouseLeave = () => setOpen(false);
    const handleFocus = () => setOpen(true);
    const handleBlur = () => setOpen(false);

    const renderItem = () => (
        <div className="sidebar-title d-flex justify-content-between m-2">
            <span className='headline-5-medium'>
                {item.icon && <i className={item.icon}></i>}
                {item.title}
            </span>
            {item.childrens && (
                <i className={`bi bi-chevron-compact-down toggle-btn`}></i>
            )}
        </div>
    );

    if (item.childrens) {
        return (
            <div
                className={`sidebar-item ${open ? 'open' : ''}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onFocus={handleFocus}
                onBlur={handleBlur}
                tabIndex={0} // For keyboard focus
            >
                {renderItem()}
                <div className='sidebar-content'>
                    {item.childrens.map((child, index) => (
                        <SidebarItem key={index} item={child} />
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <Link to={item.path} className="d-flex sidebar-item no-decoration text-dark sidebar-clickable-item">
                {renderItem()}
            </Link>
        );
    }
}