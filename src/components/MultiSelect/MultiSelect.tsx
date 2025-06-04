import React from 'react';
import './MultiSelect.css';


export type SelectItem = {
    id: string;
    label: string;
    info: string;
}

type MultiSelectProps = {
    items: SelectItem[];
    onChange?: (id: string[]) => void;
    selection?: string[];
}

const MultiSelect: React.FC<MultiSelectProps> = ({items, onChange, selection}) => {
    const groupId = React.useId();
    const selectionSet = new Set(selection);
    const handleSelect = (id: string) => {
        const newSelection = new Set<string>((selection || []));
        if (newSelection.has(id)) {
            newSelection.delete(id);
        } else {
            newSelection.add(id);
        }
        if (onChange) {
            onChange(Array.from(newSelection));
        }
      }
    return (
        <div className="multi-select">
            {items.map((item) => (
                <SelectButton
                    key={item.id}
                    groupId={groupId}
                    {...item}
                    selected={selectionSet.has(item.id)}
                    onChange={handleSelect}
                />
            ))}
        </div>
    );
};

type SelectButtonProps = SelectItem & {
    groupId: string;
    selected: boolean;
    onChange: (id: string) => void;
}

const SelectButton: React.FC<SelectButtonProps> = ({groupId, label, info, id, selected, onChange}) => {
    const elementId = React.useId();
    return (
        <div className="select-button">
            <input id={elementId} type="checkbox" name={groupId} value={id} onChange={() => onChange(id)} checked={selected}/>
            <label className="select-label"  htmlFor={elementId}>
                <span className="text">{label}</span>
                <span className="info">{info}</span>
            </label>
        </div>
    );
};

export default MultiSelect;
