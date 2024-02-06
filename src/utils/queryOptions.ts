import { queryClient } from "@/App"
import { useMutation } from "@tanstack/react-query"

export const useCreateInvoiceMutation = () => {
    return useMutation({
      // mutationKey: ['invoices', 'create'],
      mutationFn: async ()=>{},
      onSuccess: () => queryClient.invalidateQueries(),
    })
  }