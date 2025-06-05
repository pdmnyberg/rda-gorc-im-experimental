import React from 'react';
import './MultiSelect.css';


export type SelectItem = {
    id: string;
    label: string;
    info: string;
}

type SelectProps = {
    items: SelectItem[];
    noItemsText?: string;
}

type MultiSelectProps = SelectProps & {
    onChange?: (id: string[]) => void;
    selection?: string[];
}

type SingleSelectProps = SelectProps & {
    onChange?: (id: string) => void;
    selection?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({items, onChange, selection, noItemsText}) => {
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
        <div className="select">
            {items.length > 0 ? (
                items.map((item) => (
                    <SelectButton
                        key={item.id}
                        type={"checkbox"}
                        groupId={groupId}
                        {...item}
                        selected={selectionSet.has(item.id)}
                        onChange={handleSelect}
                    />
                ))
            ) : (
                <NoOptions text={noItemsText}/>
            )}
        </div>
    );
};

export const SingleSelect: React.FC<SingleSelectProps> = ({items, onChange, selection, noItemsText}) => {
    const groupId = React.useId();
    const handleSelect = (id: string) => {
        if (onChange) {
            onChange(id);
        }
      }
    return (
        <div className="select">
            {items.length > 0 ? (
                items.map((item) => (
                    <SelectButton
                        key={item.id}
                        type={"radio"}
                        groupId={groupId}
                        {...item}
                        selected={selection === item.id}
                        onChange={handleSelect}
                    />
                ))
            ) : (
                <NoOptions text={noItemsText}/>
            )}
        </div>
    );
};

type SelectButtonProps = SelectItem & {
    groupId: string;
    selected: boolean;
    onChange: (id: string) => void;
    type: "radio" | "checkbox";
}

const SelectButton: React.FC<SelectButtonProps> = ({groupId, label, info, id, selected, type, onChange}) => {
    const elementId = React.useId();
    return (
        <div className="select-button">
            <input id={elementId} type={type} name={groupId} value={id} onChange={() => onChange(id)} checked={selected}/>
            <label className="select-label"  htmlFor={elementId}>
                <span className="text">{label}</span>
                <span className="info">{info}</span>
            </label>
        </div>
    );
};


const NoOptions: React.FC<{text?: string}> = ({text}) => {
    return <div className="no-options">{text ? text : "There are currently no options available."}</div>
}
