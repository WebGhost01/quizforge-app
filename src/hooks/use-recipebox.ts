import { useQueryClient } from "@tanstack/react-query";
import {
  useListRecipes as useBaseListRecipes,
  useGetRecipe as useBaseGetRecipe,
  useCreateRecipe as useBaseCreateRecipe,
  useUpdateRecipe as useBaseUpdateRecipe,
  useDeleteRecipe as useBaseDeleteRecipe,
  getListRecipesQueryKey,
  getGetRecipeQueryKey
} from "@workspace/api-client-react";

export function useListRecipes() {
  return useBaseListRecipes({});
}

export function useGetRecipe(id: number) {
  return useBaseGetRecipe(id, { query: { enabled: !!id } });
}

export function useCreateRecipe() {
  const qc = useQueryClient();
  return useBaseCreateRecipe({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListRecipesQueryKey() })
    }
  });
}

export function useUpdateRecipe() {
  const qc = useQueryClient();
  return useBaseUpdateRecipe({
    mutation: {
      onSuccess: (_, variables) => {
        qc.invalidateQueries({ queryKey: getListRecipesQueryKey() });
        qc.invalidateQueries({ queryKey: getGetRecipeQueryKey(variables.id) });
      }
    }
  });
}

export function useDeleteRecipe() {
  const qc = useQueryClient();
  return useBaseDeleteRecipe({
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: getListRecipesQueryKey() })
    }
  });
}
