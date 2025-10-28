import type { MalaysianState, Question } from '@/types';

// Import state-specific questions
import { perlisQuestions } from './perlis';
import { kedahQuestions } from './kedah';
import { pulauPinangQuestions } from './pulau-pinang';
import { perakQuestions } from './perak';
import { selangorQuestions } from './selangor';
import { kualaLumpurQuestions } from './kuala-lumpur';
import { negeriSembilanQuestions } from './negeri-sembilan';
import { melakaQuestions } from './melaka';
import { johorQuestions } from './johor';
import { pahangQuestions } from './pahang';
import { terengganuQuestions } from './terengganu';
import { kelantanQuestions } from './kelantan';
import { sabahQuestions } from './sabah';
import { sarawakQuestions } from './sarawak';

/**
 * Get questions for a specific state
 */
export function getQuestionsForState(state: MalaysianState): Question[] {
  const questionsMap: Record<string, Question[]> = {
    perlis: perlisQuestions,
    kedah: kedahQuestions,
    'pulau-pinang': pulauPinangQuestions,
    perak: perakQuestions,
    selangor: selangorQuestions,
    'kuala-lumpur': kualaLumpurQuestions,
    'negeri-sembilan': negeriSembilanQuestions,
    melaka: melakaQuestions,
    johor: johorQuestions,
    pahang: pahangQuestions,
    terengganu: terengganuQuestions,
    kelantan: kelantanQuestions,
    sabah: sabahQuestions,
    sarawak: sarawakQuestions,
  };

  return questionsMap[state] || [];
}

/**
 * Get all questions
 */
export function getAllQuestions(): Question[] {
  return [
    ...perlisQuestions,
    ...kedahQuestions,
    ...pulauPinangQuestions,
    ...perakQuestions,
    ...selangorQuestions,
    ...kualaLumpurQuestions,
    ...negeriSembilanQuestions,
    ...melakaQuestions,
    ...johorQuestions,
    ...pahangQuestions,
    ...terengganuQuestions,
    ...kelantanQuestions,
    ...sabahQuestions,
    ...sarawakQuestions,
  ];
}
