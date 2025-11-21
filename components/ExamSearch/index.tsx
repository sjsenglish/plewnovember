'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { InstantSearch, useSearchBox, Hits, useStats, Configure } from 'react-instantsearch';
import { searchClient, INDEX_NAME } from '@/lib/algolia';
import { getSubjectConfig } from '@/lib/subjectConfig';
import Navbar from '@/app/components/Navbar';
import { Button } from '@/components/ui/Button';
import { QuestionCard } from './QuestionCard';
import { FilterBox } from './FilterBox';
import './ExamSearch.css';

const SearchBar: React.FC = () => {
  const { query, refine } = useSearchBox();

  return (
    <input
      type="text"
      className="search-bar"
      placeholder="Search for past exam questions..."
      aria-label="Search questions"
      value={query}
      onChange={(e) => refine(e.target.value)}
    />
  );
};

const ResultsCount: React.FC = () => {
  const { nbHits } = useStats();
  return <span className="results-count">{nbHits.toLocaleString()} results found</span>;
};

const ExamSearch: React.FC = () => {
  const [selectedAdmissionsTest, setSelectedAdmissionsTest] = useState('');
  const [showAdmissionsDropdown, setShowAdmissionsDropdown] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Only TSA and BMAT admissions tests
  const admissionsTests = ['TSA', 'BMAT'];

  const showTSAResults = selectedAdmissionsTest === 'TSA';
  const showBMATResults = selectedAdmissionsTest === 'BMAT';

  // Get the appropriate index name based on selection
  const getCurrentIndexName = () => {
    if (showTSAResults) {
      const config = getSubjectConfig('TSA');
      return config?.indexName || 'copy_tsa_questions';
    }
    if (showBMATResults) {
      const config = getSubjectConfig('BMAT');
      return config?.indexName || 'bmat_search_backup';
    }

    // Default to TSA index when nothing is selected
    return 'copy_tsa_questions';
  };

  // Get current subject for filter context
  const getCurrentSubject = () => {
    if (showTSAResults) return 'TSA';
    if (showBMATResults) return 'BMAT';
    return null;
  };

  const currentIndexName = getCurrentIndexName();
  const currentSubject = getCurrentSubject();
  const showResults = showTSAResults || showBMATResults;

  // Get default filters based on subject
  const getDefaultFilters = () => {
    if (showTSAResults) {
      // Exclude Problem Solving questions and specific sub types from TSA
      return 'NOT question_type:"Problem Solving" AND NOT sub_types:"Rates" AND NOT sub_types:"Ratio/Proportion/Percentage"';
    }
    return undefined;
  };

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={currentIndexName}
      key={selectedAdmissionsTest}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <Configure hitsPerPage={20} filters={getDefaultFilters()} />
      <div className="exam-search-wrapper">
        {/* Navbar */}
        <Navbar />

        <div className="exam-search-container" style={{
          paddingTop: '60px',
          minHeight: '100vh',
          overflow: showResults ? 'auto' : 'hidden'
        }}>
        {/* Cloud Icons */}
        <div className="cloud-icons-container">
          <img src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fisland-cloud-medium.svg?alt=media&token=5ba656af-b1c6-4a77-89e3-210fcfa78e12" alt="Cloud" className="cloud-icon cloud-left" />
          <img src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fisland-cloud-medium.svg?alt=media&token=5ba656af-b1c6-4a77-89e3-210fcfa78e12" alt="Cloud" className="cloud-icon cloud-center" />
          <img src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2Fisland-cloud-medium.svg?alt=media&token=5ba656af-b1c6-4a77-89e3-210fcfa78e12" alt="Cloud" className="cloud-icon cloud-right" />
        </div>

        {/* Page Title */}
        <header className="page-title-section">
          <h1 className="page-main-title">search and solutions</h1>
        </header>

        {/* Search Bar */}
        <section className="search-section">
          <SearchBar />
        </section>

        {/* Admissions Tab with Dropdown */}
        <nav className="tabs-container">
          <div
            className="tab-wrapper"
            onMouseEnter={() => setShowAdmissionsDropdown(true)}
            onMouseLeave={() => setShowAdmissionsDropdown(false)}
          >
            <button
              className={`tab svg-tab ${selectedAdmissionsTest ? 'tab-active' : ''}`}
              onClick={() => {}}
              aria-label="Admissions tab"
            >
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/plewcsat1.firebasestorage.app/o/icons%2FGroup%20610.svg?alt=media&token=a8b52250-03aa-4149-8ef5-95661a14b81b"
                alt="Admissions"
                width={249}
                height={45}
                className="svg-icon"
              />
            </button>

            {/* Admissions Dropdown */}
            {showAdmissionsDropdown && (
              <div className="dropdown-menu">
                {admissionsTests.map((test) => (
                  <button
                    key={test}
                    className="dropdown-item"
                    onClick={() => {
                      setSelectedAdmissionsTest(test);
                      setShowAdmissionsDropdown(false);
                    }}
                  >
                    {test}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Filter Box */}
        {showResults && showFilters && currentSubject && (
          <FilterBox
            onHideFilters={() => {
              setShowFilters(false);
            }}
            currentSubject={currentSubject}
          />
        )}

        {/* Results Section */}
        {showResults && (
          <section className="results-section">
            <div className="results-header">
              <ResultsCount />
              {!showFilters && (
                <Button variant="ghost" size="sm" onClick={() => {
                  setShowFilters(true);
                }}>
                  show filters
                </Button>
              )}
            </div>

            <Hits hitComponent={({ hit }) => <QuestionCard hit={hit as any} />} />
          </section>
        )}
        </div>
      </div>
    </InstantSearch>
  );
};

export default ExamSearch;
