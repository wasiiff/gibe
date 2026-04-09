import { connection } from "next/server";

import { StudioShell } from "@/components/game-studio/studio-shell";
import { requireSession } from "@/lib/session";

export default async function NewStudioPage() {
  await connection();
  await requireSession();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-6 lg:px-8 lg:py-8">
      <StudioShell initialGame={null} />
    </div>
  );
}
