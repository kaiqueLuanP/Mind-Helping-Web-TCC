import { createFileRoute } from "@tanstack/react-router";
import ResetPasswordForm from "@/components/ResetPasswordForm";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      email: (search.email as string) || "",
    };
  },
});

function ResetPasswordPage() {
  const { email } = Route.useSearch();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ResetPasswordForm email={email} />
    </div>
  );
}
