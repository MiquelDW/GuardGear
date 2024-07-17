import { Suspense } from "react";
import ThankYouPage from "./ThankYouPage";

export default function ThankYou() {
  return (
    // display fallback UI until the children have finished loading
    // the hook "useSearchParams" inside the "ThankYouPage" component expects to be wrapped in a <Suspense> component
    <Suspense>
      <ThankYouPage />
    </Suspense>
  );
}
