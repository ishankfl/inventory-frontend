// UnitSelector.js

import React from 'react';

// Exported list of product units
export const productUnits = [
  // Weight-based units
  "mg",   // Milligram
  "cg",   // Centigram
  "dg",   // Decigram
  "g",    // Gram
  "dag",  // Dekagram
  "hg",   // Hectogram
  "kg",   // Kilogram
  "q",    // Quintal
  "MT",   // Metric Ton
  "T",    // Metric Ton (alternative)
  "lb",   // Pound
  "oz",   // Ounce

  // Piece/count-based units
  "piece", // Single item
  "pc",    // Piece (abbreviation)
  "unit",  // General unit
  "pkt",   // Packet
  "box",   // Box
  "bag",   // Bag
  "btl",   // Bottle

  // Volume-based units (often used for weight-sale)
  "ml",    // Milliliter
  "l",     // Liter
  "L"      // Liter (capital form)
];

// React component to render a dropdown of units
const UnitSelector = ({ onChange, selectedUnit }) => {
  return (
    <div>
      <label htmlFor="unit">Select Unit:</label>
      <select
        id="unit"
        value={selectedUnit}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- Select Unit --</option>
        {productUnits.map((unit, index) => (
          <option key={index} value={unit}>
            {unit.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UnitSelector;
