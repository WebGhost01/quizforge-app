import { useQueryClient } from "@tanstack/react-query";
import {
  useListQuizzes as useBaseListQuizzes,
  useGetQuiz as useBaseGetQuiz,
  useCreateQuiz as useBaseCreateQuiz,
  useUpdateQuiz as useBaseUpdateQuiz,
  useDeleteQuiz as useBaseDeleteQuiz,
  useCreateQuizQuestion as useBaseCreateQuizQuestion,
  useDeleteQuizQuestion as useBaseDeleteQuizQuestion,
  useSubmitQuizAttempt as useBaseSubmitQuizAttempt,
  useListQuizAttempts as useBaseListQuizAttempts,
  getListQuizzesQueryKey,
  getGetQuizQueryKey,
  getListQuizAttemptsQueryKey
} from "@workspace/api-client-react";

export function useListQuizzes() {
  return useBaseListQuizzes();
}

export function useGetQuiz(id: number) {
  return useBaseGetQuiz(id, { query: { enabled: !!id } });
}

export function useCreateQuiz() {
  const qc = useQueryClient();
  return useBaseCreateQuiz({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListQuizzesQueryKey() })
    }
  });
}

export function useUpdateQuiz() {
  const qc = useQueryClient();
  return useBaseUpdateQuiz({
    mutation: {
      onSuccess: (_, variables) => {
        qc.invalidateQueries({ queryKey: getListQuizzesQueryKey() });
        qc.invalidateQueries({ queryKey: getGetQuizQueryKey(variables.id) });
      }
    }
  });
}

export function useDeleteQuiz() {
  const qc = useQueryClient();
  return useBaseDeleteQuiz({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListQuizzesQueryKey() })
    }
  });
}

export function useCreateQuizQuestion(quizId: number) {
  const qc = useQueryClient();
  return useBaseCreateQuizQuestion({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getGetQuizQueryKey(quizId) })
    }
  });
}

export function useDeleteQuizQuestion(quizId: number) {
  const qc = useQueryClient();
  return useBaseDeleteQuizQuestion({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getGetQuizQueryKey(quizId) })
    }
  });
}

export function useSubmitQuizAttempt(quizId: number) {
  const qc = useQueryClient();
  return useBaseSubmitQuizAttempt({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getListQuizAttemptsQueryKey(quizId) });
      }
    }
  });
}

export function useListQuizAttempts(quizId: number) {
  return useBaseListQuizAttempts(quizId, { query: { enabled: !!quizId } });
}
