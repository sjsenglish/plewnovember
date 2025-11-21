import React, { useState, useMemo } from 'react';
import { Button } from '../ui/Button';
import { QuestionCardProps } from '@/types/question';
import { VideoModal } from '../VideoModal/VideoModal';
import styles from './QuestionCard.module.css';

// Convert Firebase Storage gs:// URLs to public download URLs
const getFirebaseImageUrl = (gsUrl: string): string => {
  if (!gsUrl || !gsUrl.startsWith('gs://')) return '';

  const urlParts = gsUrl.replace('gs://', '').split('/');
  const bucketName = urlParts[0];
  const filePath = urlParts.slice(1).join('/');
  const encodedPath = encodeURIComponent(filePath);

  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedPath}?alt=media`;
};

export const QuestionCard: React.FC<QuestionCardProps> = ({ hit }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handleAnswerClick = (letter: string) => {
    setSelectedAnswer(letter);
    setIsAnswerRevealed(true);
  };

  const handleShowAnswer = () => {
    setIsAnswerRevealed(true);
  };

  const handleVideoSolutionClick = () => {
    setIsVideoModalOpen(true);
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
  };

  const getOptionClass = (letter: string): string => {
    if (!isAnswerRevealed) return '';

    const isCorrect = letter === hit?.correct_answer;
    const isSelected = letter === selectedAnswer;

    if (isCorrect) return styles.optionCorrect;
    if (isSelected && !isCorrect) return styles.optionIncorrect;
    return '';
  };

  const getOptionStyle = (letter: string) => {
    const baseClass = styles.option;
    const answerClass = getOptionClass(letter);
    const noHoverClass = isAnswerRevealed ? styles.optionNoHover : '';

    return `${baseClass} ${answerClass} ${noHoverClass}`.trim();
  };

  // Get normalized data - memoized to prevent re-renders
  const normalizedData = useMemo(() => ({
    questionNumber: hit?.question_number || '',
    year: hit?.year,
    questionType: hit?.question_type,
    subType: Array.isArray(hit?.sub_types) ? hit.sub_types[0] : hit?.sub_types,
    filters: hit?.sub_types ? (Array.isArray(hit.sub_types) ? hit.sub_types : [hit.sub_types]) : [],
    questionContent: hit?.question_content || hit?.question_text,
    imageUrl: hit?.imageFile || hit?.imageUrl,
    questionText: hit?.question || hit?.question_text,
    videoUrl: hit?.videoSolutionLink || hit?.video_solution_url_1
  }), [hit]);

  return (
    <article className={styles.questionCard}>
      <header className={styles.questionHeader}>
        <div className={styles.questionInfo}>
          <span className={styles.questionNumber}>
            Question {normalizedData.questionNumber}
          </span>
          {normalizedData.year && <span className={styles.yearBadge}>{normalizedData.year}</span>}
        </div>
        <div className={styles.filterButtons}>
          {normalizedData.questionType && (
            <Button variant="filter" size="sm">{normalizedData.questionType}</Button>
          )}
          {normalizedData.subType && (
            <Button variant="filter" size="sm"
              style={{ backgroundColor: 'var(--color-secondary-light)' }}>
              {normalizedData.subType}
            </Button>
          )}
          {normalizedData.filters && normalizedData.filters.length > 0 && (
            <Button variant="filter" size="sm"
              style={{ backgroundColor: 'var(--color-primary-lighter)' }}>
              {normalizedData.filters[0]}
            </Button>
          )}
        </div>
      </header>

      <div className={styles.questionContent}>
        {/* Show question content */}
        {normalizedData.questionContent && (
          <p className={styles.questionPassage}>
            {normalizedData.questionContent}
          </p>
        )}

        {/* Show question image if available */}
        {normalizedData.imageUrl && (
          <div className={styles.questionImageContainer}>
            <img
              src={getFirebaseImageUrl(normalizedData.imageUrl)}
              alt="Question diagram"
              className={styles.questionImage}
              onError={(e) => {
                console.warn('Failed to load question image:', normalizedData.imageUrl);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Show question text */}
        {normalizedData.questionText && (
          <div className={styles.questionText}>
            {normalizedData.questionText}
          </div>
        )}

        {/* Show answer options */}
        {hit?.options && hit.options.length > 0 && (
          <div className={styles.answerOptions}>
            {hit.options.map((option, index) => {
              const letter = String.fromCharCode(65 + index); // Convert 0->A, 1->B, etc.
              const optionText = typeof option === 'string' ? option : option.text;
              return (
                <div
                  key={index}
                  onClick={() => handleAnswerClick(letter)}
                  className={getOptionStyle(letter)}
                >
                  <span className={styles.optionLetter}>{letter}</span>
                  <span className={styles.optionText}>{optionText}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className={styles.actionButtons}>
          {/* Show Answer button */}
          <Button
            variant="secondary"
            size="md"
            className={styles.showAnswerBtn}
            onClick={handleShowAnswer}
          >
            Show Answer
          </Button>

          {/* Video Solution button - only show when video is available */}
          {normalizedData.videoUrl && (
            <Button
              variant="primary"
              size="md"
              onClick={handleVideoSolutionClick}
            >
              Video Solution
            </Button>
          )}
        </div>
      </div>

      {/* Video Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideoModal}
        videoUrl={normalizedData.videoUrl}
      />
    </article>
  );
};
