/**
 * Basic ErrorMessage Component
 * Used to display individual field errors.
 */
export const FieldErrorMessage = ({ message }: { message: string }) => {
  if (!message) {
    return null;
  }

  return (
    <p style="color: red; font-size: 0.875rem; margin-top: 0.25rem;">
      {message}
    </p>
  );
};
