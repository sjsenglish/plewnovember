'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/app/components/Navbar';
import { getUserPracticePacks } from '../../lib/supabaseQuestionPacks';
import { getAllSubjects, getAvailableSubjects } from '../../lib/subjectConfig';
import { createClient } from '@supabase/supabase-js';
import './practice.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * MAIN PRACTICE PAGE - Question Pack Management
 *
 * This is the STANDALONE practice page (/practice) that handles:
 * - Managing user's custom question packs
 * - Browsing practice packs by subject (TSA, A Level subjects)
 * - Launching practice sessions (/practice-session/[packId])
 * - Launching review sessions (/review/[packId])
 * - Creating new practice packs (/create-practice-pack)
 *
 * This is DIFFERENT from the "Lesson Practice" tab in /learn-lesson:
 * - /learn-lesson practice tab = practice questions embedded within lessons
 * - /practice page = standalone practice sessions with custom question packs
 */
export default function PracticePage() {
  const [activeTab, setActiveTab] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedAdmissionSubject, setSelectedAdmissionSubject] = useState('');
  const [showALevelDropdown, setShowALevelDropdown] = useState(false);
  const [showAdmissionDropdown, setShowAdmissionDropdown] = useState(false);
  const [questionPacks, setQuestionPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedPackIds, setSavedPackIds] = useState<Set<string>>(new Set());
  const [savingPack, setSavingPack] = useState<string | null>(null);

  // Available subjects for admissions dropdown
  const availableSubjects = getAvailableSubjects(); // This will include TSA
  const allSubjects = getAllSubjects(); // For A Level dropdown

  // Load saved packs for current user
  const loadSavedPacks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: savedPacks, error } = await supabase
        .from('saved_question_packs')
        .select('pack_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading saved packs:', error);
        return;
      }

      const savedIds = new Set(savedPacks.map(sp => sp.pack_id));
      setSavedPackIds(savedIds);
    } catch (error) {
      console.error('Error loading saved packs:', error);
    }
  };

  // Toggle save state for a pack
  const toggleSavePack = async (packId: string) => {
    try {
      setSavingPack(packId);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Silently skip saving if user not logged in - practice is still accessible
        console.log('User not logged in - skipping pack save');
        return;
      }

      const isSaved = savedPackIds.has(packId);

      if (isSaved) {
        // Unsave the pack
        const { error } = await supabase
          .from('saved_question_packs')
          .delete()
          .eq('user_id', user.id)
          .eq('pack_id', packId);

        if (error) {
          console.error('Error unsaving pack:', error);
          alert('Failed to unsave pack');
          return;
        }

        const newSavedIds = new Set(savedPackIds);
        newSavedIds.delete(packId);
        setSavedPackIds(newSavedIds);
      } else {
        // Save the pack
        const { error } = await supabase
          .from('saved_question_packs')
          .insert({
            user_id: user.id,
            pack_id: packId
          });

        if (error) {
          console.error('Error saving pack:', error);
          alert('Failed to save pack');
          return;
        }

        const newSavedIds = new Set(savedPackIds);
        newSavedIds.add(packId);
        setSavedPackIds(newSavedIds);
      }
    } catch (error) {
      console.error('Error toggling save state:', error);
      alert('An error occurred');
    } finally {
      setSavingPack(null);
    }
  };

  // Fetch question packs from Supabase
  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const result = await getUserPracticePacks() as { success: boolean; packs?: any[]; error?: string };
        if (result.success) {
          setQuestionPacks(result.packs || [] as any[]);
        } else {
          console.error('Failed to fetch packs:', result.error);
          setQuestionPacks([] as any[]);
        }

        // Load saved packs
        await loadSavedPacks();
      } catch (error) {
        console.error('Error fetching packs:', error);
        setQuestionPacks([] as any[]);
      } finally {
        setLoading(false);
      }
    };

    fetchPacks();
  }, []);

  // Filter packs by category
  const getPacksByCategory = (category: string, subject?: string) => {
    return questionPacks.filter(pack => {
      if (category === 'A Level') {
        return subject ? pack.subject === subject : false;
      } else if (category === 'Admissions') {
        return availableSubjects.includes(pack.subject || '');
      } else if (category === 'Saved') {
        return savedPackIds.has(pack.id);
      }
      return false;
    });
  };

  return (
    <div className="page-background content-with-navbar-padding">
      <Navbar />

      {/* Back Button */}
      <Link href="/" className="back-button">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </Link>

      {/* Content */}
      <div className="main-content">

        {/* Your Practice Packs Header */}
        <div className="page-header">
          <div className="header-container">
            <h2 className="page-title">
              Your Practice Packs
            </h2>
          </div>
        </div>

        {/* Practice Icon - Bottom Left */}
        <div className="practice-icon">
          <Image
            src="/icons/practice.svg"
            alt="PRACTICE"
            width={138}
            height={138}
          />
        </div>

        {/* New Pack Button - Right Side */}
        <div className="new-pack-button-container">
          <button
            className="new-pack-button"
            onClick={() => window.location.href = '/create-practice-pack'}
          >
            <span className="new-pack-button-text">+</span>
            New Pack
          </button>
        </div>

        {/* Cloud Decorations */}
        <div className="cloud-decoration-left">
          <Image
            src="/svg/island-cloud-medium.svg"
            alt="Cloud"
            width={120}
            height={80}
          />
        </div>

        <div className="cloud-decoration-right">
          <Image
            src="/svg/island-cloud-medium.svg"
            alt="Cloud"
            width={120}
            height={80}
          />
        </div>

        {/* Search Bar */}
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search for practice packs by name ..."
            className="search-input"
          />
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <div className="tabs-flex">
            {/* A Level Tab with Dropdown */}
            <div
              className="tab-with-dropdown"
              onMouseEnter={() => setShowALevelDropdown(true)}
              onMouseLeave={() => setShowALevelDropdown(false)}
            >
              <button
                className={`tab-button ${activeTab === 'A Level' ? 'active' : 'inactive'}`}
                onClick={() => setActiveTab('A Level')}
                aria-label="A Level tab"
              >
                <span>A Level</span>
              </button>

              {/* A Level Dropdown */}
              {showALevelDropdown && (
                <div className="dropdown-menu">
                  {['Maths', 'Physics', 'English Lit', 'Biology', 'Chemistry'].map((subject) => (
                    <button
                      key={subject}
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedSubject(subject);
                        setActiveTab('A Level');
                        setShowALevelDropdown(false);
                      }}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Admissions Tab with Dropdown */}
            <div
              className="tab-with-dropdown"
              onMouseEnter={() => setShowAdmissionDropdown(true)}
              onMouseLeave={() => setShowAdmissionDropdown(false)}
            >
              <button
                className={`tab-button ${activeTab === 'Admissions' ? 'active' : 'inactive'}`}
                onClick={() => setActiveTab('Admissions')}
                aria-label="Admissions tab"
              >
                <span>Admissions</span>
              </button>

              {/* Admissions Dropdown */}
              {showAdmissionDropdown && (
                <div className="dropdown-menu">
                  {availableSubjects.map((subject) => (
                    <button
                      key={subject}
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedAdmissionSubject(subject);
                        setActiveTab('Admissions');
                        setShowAdmissionDropdown(false);
                      }}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Tab */}
            <button
              className={`tab-button-regular ${activeTab === 'Saved' ? 'active' : 'inactive'}`}
              onClick={() => setActiveTab('Saved')}
              aria-label="Saved tab"
            >
              <span>Saved</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="main-content-area">

          {/* Dynamic Content Based on Selected Tab and Subject */}
          {activeTab === 'A Level' && selectedSubject && (
            <div style={{ marginBottom: '40px' }}>
              <h3 className="section-title">
                A Level {selectedSubject} AQA
              </h3>

              {/* Question Packs List */}
              {getPacksByCategory('A Level', selectedSubject).map((pack) => (
                <div key={pack.id} className="pack-item">
                  {/* Share, Send, and Save options above each pack */}
                  <div className="pack-actions">
                    {/* Bookmark/Save icon */}
                    <div
                      onClick={() => toggleSavePack(pack.id)}
                      className="pack-action-icon"
                      style={{
                        cursor: savingPack === pack.id ? 'not-allowed' : 'pointer',
                        opacity: savingPack === pack.id ? 0.6 : 1
                      }}
                    >
                      {savedPackIds.has(pack.id) ? (
                        <span style={{ fontSize: '20px', color: '#FFA500' }}>🔖</span>
                      ) : (
                        <span style={{ fontSize: '20px', color: '#CCCCCC' }}>🔖</span>
                      )}
                    </div>
                    <Image
                      src="/icons/share-question-pack.svg"
                      alt="Share question pack"
                      width={20}
                      height={20}
                      className="pack-action-icon"
                    />
                    <Image
                      src="/icons/send-pack-to-friend.svg"
                      alt="Send pack to a friend"
                      width={20}
                      height={20}
                      className="pack-action-icon"
                    />
                  </div>

                  {/* Question Pack Rectangle */}
                  <div className="pack-rectangle">
                    <svg className="pack-svg" width="852" height="207" viewBox="0 0 852 207" xmlns="http://www.w3.org/2000/svg">
                      {/* Fill shapes without strokes */}
                      <polygon points="3,13 829,13 829,194 3,194" fill="#FFFFFF"/>
                      <polygon points="3,13 15,3 841,3 829,13" fill="#FFFFFF"/>
                      <polygon points="829,13 841,3 841,182 829,194" fill="#FFFFFF"/>

                      {/* Clean outline strokes */}
                      <path d="M 3,194 L 3,13 L 15,3 L 841,3 L 841,182 L 829,194 Z"
                            fill="none" stroke="#000000" strokeWidth="2"/>
                      <line x1="3" y1="13" x2="829" y2="13" stroke="#000000" strokeWidth="2"/>
                      <line x1="829" y1="13" x2="829" y2="194" stroke="#000000" strokeWidth="2"/>
                      <line x1="829" y1="13" x2="841" y2="3" stroke="#000000" strokeWidth="2"/>
                    </svg>
                    <div className="pack-content">
                      <div className="pack-info">
                        <div className="pack-title">
                          {pack.name}
                        </div>
                        <div className="pack-category">
                          {pack.subject} • Created {new Date(pack.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Practice/Review Mode Buttons */}
                      <div className="pack-buttons">
                        <Link href={`/view-pack/${pack.id}`} className="pack-button">
                          View Pack
                        </Link>

                        <Link href={`/practice-session/${pack.id}`} className="pack-button">
                          Practice
                        </Link>

                        <Link href={`/review/${pack.id}`} className="pack-button">
                          Review
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Admissions Content */}
          {activeTab === 'Admissions' && selectedAdmissionSubject && (
            <div style={{ marginBottom: '40px' }}>
              <h3 className="section-title">
                {selectedAdmissionSubject} Practice Packs
              </h3>

              {/* Real Question Packs List */}
              {getPacksByCategory('Admissions').filter(pack => pack.subject === selectedAdmissionSubject).map((pack) => (
                <div key={pack.id} className="pack-item">
                  {/* Share, Send, and Save options above each pack */}
                  <div className="pack-actions">
                    {/* Bookmark/Save icon */}
                    <div
                      onClick={() => toggleSavePack(pack.id)}
                      className="pack-action-icon"
                      style={{
                        cursor: savingPack === pack.id ? 'not-allowed' : 'pointer',
                        opacity: savingPack === pack.id ? 0.6 : 1
                      }}
                    >
                      {savedPackIds.has(pack.id) ? (
                        <span style={{ fontSize: '20px', color: '#FFA500' }}>🔖</span>
                      ) : (
                        <span style={{ fontSize: '20px', color: '#CCCCCC' }}>🔖</span>
                      )}
                    </div>
                    <Image
                      src="/icons/share-question-pack.svg"
                      alt="Share question pack"
                      width={20}
                      height={20}
                      className="pack-action-icon"
                    />
                    <Image
                      src="/icons/send-pack-to-friend.svg"
                      alt="Send pack to a friend"
                      width={20}
                      height={20}
                      className="pack-action-icon"
                    />
                  </div>

                  {/* Question Pack Rectangle */}
                  <div className="pack-rectangle">
                    <svg className="pack-svg" width="852" height="207" viewBox="0 0 852 207" xmlns="http://www.w3.org/2000/svg">
                      {/* Fill shapes without strokes */}
                      <polygon points="3,13 829,13 829,194 3,194" fill="#FFFFFF"/>
                      <polygon points="3,13 15,3 841,3 829,13" fill="#FFFFFF"/>
                      <polygon points="829,13 841,3 841,182 829,194" fill="#FFFFFF"/>

                      {/* Clean outline strokes */}
                      <path d="M 3,194 L 3,13 L 15,3 L 841,3 L 841,182 L 829,194 Z"
                            fill="none" stroke="#000000" strokeWidth="2"/>
                      <line x1="3" y1="13" x2="829" y2="13" stroke="#000000" strokeWidth="2"/>
                      <line x1="829" y1="13" x2="829" y2="194" stroke="#000000" strokeWidth="2"/>
                      <line x1="829" y1="13" x2="841" y2="3" stroke="#000000" strokeWidth="2"/>
                    </svg>
                    <div className="pack-content">
                      <div className="pack-info">
                        <div className="pack-title">
                          {pack.name}
                        </div>
                        <div className="pack-category">
                          {pack.subject} • Created {new Date(pack.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Practice/Review Mode Buttons */}
                      <div className="pack-buttons">
                        <Link href={`/view-pack/${pack.id}`} className="pack-button">
                          View Pack
                        </Link>

                        <Link href={`/practice-session/${pack.id}`} className="pack-button">
                          Practice
                        </Link>

                        <Link href={`/review/${pack.id}`} className="pack-button">
                          Review
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Saved Content */}
          {activeTab === 'Saved' && (
            <div style={{ marginBottom: '40px' }}>
              <h3 className="section-title">
                All Practice Packs
              </h3>

              {/* Loading State */}
              {loading ? (
                <div className="default-message">
                  Loading your practice packs...
                </div>
              ) : (
                <>
                  {/* All Packs List */}
                  {questionPacks.map((pack) => (
                    <div key={pack.id} className="pack-item">
                      {/* Share and Send options above each pack */}
                      <div className="pack-actions">
                        <Image
                          src="/icons/share-question-pack.svg"
                          alt="Share question pack"
                          width={20}
                          height={20}
                          className="pack-action-icon"
                        />
                        <Image
                          src="/icons/send-pack-to-friend.svg"
                          alt="Send pack to a friend"
                          width={20}
                          height={20}
                          className="pack-action-icon"
                        />
                      </div>

                      {/* Question Pack Rectangle */}
                      <div className="pack-rectangle">
                        <svg className="pack-svg" width="852" height="207" viewBox="0 0 852 207" xmlns="http://www.w3.org/2000/svg">
                          {/* Fill shapes without strokes */}
                          <polygon points="3,13 829,13 829,194 3,194" fill="#FFFFFF"/>
                          <polygon points="3,13 15,3 841,3 829,13" fill="#FFFFFF"/>
                          <polygon points="829,13 841,3 841,182 829,194" fill="#FFFFFF"/>

                          {/* Clean outline strokes */}
                          <path d="M 3,194 L 3,13 L 15,3 L 841,3 L 841,182 L 829,194 Z"
                                fill="none" stroke="#000000" strokeWidth="2"/>
                          <line x1="3" y1="13" x2="829" y2="13" stroke="#000000" strokeWidth="2"/>
                          <line x1="829" y1="13" x2="829" y2="194" stroke="#000000" strokeWidth="2"/>
                          <line x1="829" y1="13" x2="841" y2="3" stroke="#000000" strokeWidth="2"/>
                        </svg>
                        <div className="pack-content">
                          <div className="pack-info">
                            <div className="pack-title">
                              {pack.name}
                            </div>
                            <div className="pack-category">
                              {pack.subject} • Created {new Date(pack.created_at).toLocaleDateString()}
                            </div>
                          </div>

                          {/* Practice/Review Mode Buttons */}
                          <div className="pack-buttons">
                            <Link href={`/view-pack/${pack.id}`} className="pack-button">
                              View Pack
                            </Link>

                            <Link href={`/practice-session/${pack.id}`} className="pack-button">
                              Practice
                            </Link>

                            <Link href={`/review/${pack.id}`} className="pack-button">
                              Review
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Default messages when no subject is selected */}
          {activeTab === 'A Level' && !selectedSubject && (
            <div className="default-message">
              Hover over A Level to select a subject
            </div>
          )}

          {activeTab === 'Admissions' && !selectedAdmissionSubject && (
            <div className="default-message">
              Hover over Admissions to select a subject (TSA available)
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
