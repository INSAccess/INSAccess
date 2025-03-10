import React, { useState, useEffect } from "react";

const DynamicSelect = ({ enumType, label }) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedValue, setSelectedValue] = useState("");

    useEffect(() => {
        fetch(`http://localhost:5000/api/enums/${enumType}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${enumType}`);
                }
                return response.json();
            })
            .then((data) => {
                setOptions(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [enumType]);

    if (loading) return <p>Loading {label}...</p>;
    if (error) return <p>Error loading {label}: {error}</p>;

    return (
        <div>
            <label htmlFor={`select-${enumType}`}>{label}:</label>
            <select
                id={`select-${enumType}`}
                value={selectedValue}
                onChange={(e) => setSelectedValue(e.target.value)}
            >
                <option value="">-- Choose {label} --</option>
                {options.map(({ value, label }) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>
        </div>
    );
};


ReactDOM.render(
    <div>
    <h2>Select Enums</h2>
    <DynamicSelect enumType="type" label="Association Type" />
    <DynamicSelect enumType="sector" label="Sector" />
    <DynamicSelect enumType="color" label="Color" />
    </div>,
    document.getElementById('select')
);
