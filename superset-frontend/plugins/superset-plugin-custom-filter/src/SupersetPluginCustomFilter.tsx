import React from 'react';
import { styled } from '@superset-ui/core';
import { SupersetPluginCustomFilterProps } from './types';

// Your existing styled components
const Styles = styled.div<{ height: number; width: number }>`
  padding: 16px;
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  overflow-y: auto; // Added for safety if there are many buttons
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  padding-top: 10px;
`;

export default function SupersetPluginCustomFilter(props: SupersetPluginCustomFilterProps) {
  // --- START CRITICAL DEBUGGING ---
  // The very first step is to log the entire props object and the type of 'setFilter'.
  // This will tell us exactly what your component is receiving from the dashboard.
  console.log('--- PLUGIN PROPS RECEIVED ---', props);
  console.log('The type of props.setFilter is:', typeof props.setFilter);
  // --- END CRITICAL DEBUGGING ---

  const { data, height, width, setFilter, formData } = props;

  // Dynamically get the column name from the 'Group by' control
  const columnName = formData?.cols?.[0] as string | undefined;

  if (!columnName) {
    return (
      <Styles height={height} width={width}>
        <p>Please select a column in the "Group by" control.</p>
      </Styles>
    );
  }

  const handleFilterClick = (filterValue: any) => {
    console.log(`Filter clicked: Column='${columnName}', Value='${filterValue}'`);
    if (typeof setFilter === 'function') {
      console.log(`Applying filter: Column='${columnName}', Value='${filterValue}'`);
      // The second argument MUST be an array.
      setFilter(columnName, [filterValue]);
    } else {
      console.error(
        'CRITICAL ERROR: "setFilter" is NOT a function. Check the console log for "PLUGIN PROPS RECEIVED" to see what it is.',
      );
      // Provide feedback to the user in the UI
      alert(
        'Error: This filter component is not working correctly. See the browser console for details.',
      );
    }
  };

  return (
    <Styles height={height} width={width}>
      <h3>Filter by {columnName}:</h3>
      <ButtonContainer>
        {data.map((row, index) => {
          const value = row[columnName];
          return (
            <button
              key={index}
              onClick={() => handleFilterClick(value)}
              // Disable the button if the value is null or undefined
              disabled={value === null || value === undefined}
            >
              {String(value ?? 'N/A')}
            </button>
          );
        })}
      </ButtonContainer>
    </Styles>
  );
}