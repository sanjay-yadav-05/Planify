import { useToast as useToastOriginal } from "@/components/ui/use-toast"

// Re-export the toast hook to avoid circular dependencies
export const useToast = useToastOriginal
export { toast } from "@/components/ui/use-toast"

