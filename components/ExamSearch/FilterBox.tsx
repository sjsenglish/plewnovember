import React from 'react';
import { useRefinementList, useClearRefinements } from 'react-instantsearch';
import { Button } from '../ui/Button';
import './FilterBox.css';

const getFilterTitle = (subject: string) => {
  switch (subject.toLowerCase()) {
    case 'tsa':
      return 'TSA Thinking Skills Assessment';
    case 'bmat':
      return 'BMAT BioMedical Admissions Test';
    default:
      return 'Exam Questions';
  }
};

interface FilterBoxProps {
  onHideFilters: () => void;
  currentSubject?: string;
}

export const FilterBox: React.FC<FilterBoxProps> = ({ onHideFilters, currentSubject }) => {
  // Guard against undefined currentSubject
  if (!currentSubject) {
    return null;
  }

  // Dynamic attribute selection based on subject
  const getAttributes = (subject: string) => {
    const subjectLower = subject.toLowerCase();

    if (subjectLower === 'tsa' || subjectLower === 'bmat') {
      // TSA, BMAT use original structure
      return {
        questionType: 'question_type',
        subType: 'sub_types',
        year: 'year',
        questionTypeLabel: 'Question Type',
        subTypeLabel: 'Categories',
        yearLabel: 'Year'
      };
    } else {
      // Default fallback
      return {
        questionType: 'question_type',
        subType: 'sub_types',
        year: 'year',
        questionTypeLabel: 'Question Type',
        subTypeLabel: 'Sub Type',
        yearLabel: 'Year'
      };
    }
  };

  const attributes = getAttributes(currentSubject);

  // Refinement lists
  const questionTypeRefinement = useRefinementList({
    attribute: attributes.questionType,
  });

  const subTypesRefinement = useRefinementList({
    attribute: attributes.subType,
  });

  const yearRefinement = useRefinementList({
    attribute: attributes.year,
  });

  const { refine: clearAllFilters } = useClearRefinements();

  return (
    <div className="filter-box-container">
      <div className="filter-box">
        {/* Header */}
        <div className="filter-box-header">
          <h3>{getFilterTitle(currentSubject)}</h3>
        </div>

        {/* Filter Content Grid - Standard 3-column layout */}
        <div className="filter-grid">
          {/* Column 1 - Question Types */}
          <div className="filter-column">
            <div className="filter-category-title">
              <span>{attributes.questionTypeLabel}</span>
            </div>

            {questionTypeRefinement.items.map((item) => (
              <label key={item.value} className="filter-option">
                <input
                  type="checkbox"
                  className="filter-checkbox secondary"
                  checked={item.isRefined}
                  onChange={() => questionTypeRefinement.refine(item.value)}
                />
                <span>{item.label} ({item.count})</span>
              </label>
            ))}
          </div>

          {/* Column 2 - Sub Types / Categories */}
          <div className="filter-column">
            <div className="filter-category-title">
              <span>{attributes.subTypeLabel}</span>
            </div>

            {subTypesRefinement.items.map((item) => (
              <label key={item.value} className="filter-option">
                <input
                  type="checkbox"
                  className="filter-checkbox secondary"
                  checked={item.isRefined}
                  onChange={() => subTypesRefinement.refine(item.value)}
                />
                <span>{item.label} ({item.count})</span>
              </label>
            ))}
          </div>

          {/* Column 3 - Year */}
          <div className="filter-column">
            <div className="filter-category-title">
              <span>{attributes.yearLabel}</span>
            </div>

            {yearRefinement.items.map((item) => (
              <label key={item.value} className="filter-option">
                <input
                  type="checkbox"
                  className="filter-checkbox secondary"
                  checked={item.isRefined}
                  onChange={() => yearRefinement.refine(item.value)}
                />
                <span>{item.label} ({item.count})</span>
              </label>
            ))}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="filter-controls">
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>clear filters</Button>
          <Button variant="ghost" size="sm" onClick={onHideFilters}>hide filters</Button>
        </div>
      </div>
    </div>
  );
};
