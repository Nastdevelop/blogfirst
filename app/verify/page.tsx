import { Suspense } from "react";
import VerifyClient from "./verifyClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyClient />
    </Suspense>
  );
}