<script lang="ts">
  import type { Challenge, Progress, SortedTeam, Submission } from "./types";

  export let team: SortedTeam[number];
  export let challenge: Challenge;
  export let submissions: Submission[];
  export let progresses: Progress[];

  const submission = submissions.find(
    (s) =>
      s.teamId === team.id &&
      s.challengeId === challenge.id &&
      s.status === "accepted"
  );

  // Find progress
  const progress = progresses.find(
    (p) => p.teamId === team.id && p.challengeId === challenge.id
  );
</script>

<td class="text-center {submission ? 'completed' : progress ? 'partial' : ''}">
  {#if submission}
    {submission.score}
  {:else if progress}
    {progress.progress}%
  {/if}
</td>

<style>
  td {
    width: 6.4 rem;
  }

  td.completed {
    font-weight: bold;
  }

  td.partial {
    color: #666;
  }
</style>
