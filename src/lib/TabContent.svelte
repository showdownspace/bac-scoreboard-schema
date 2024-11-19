<script lang="ts">
  import TableBody from "./TableBody.svelte";
  import type { Challenge, Submission, Team } from "./types";

  export let challenge: Challenge;
  export let submissions: Submission[];
  export let teams: Team[];

  function getRevelantSubmissions(submissions: Submission[]) {
    return submissions
      .filter((s) => s.challengeId === challenge.id && s.status === "accepted")
      .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));
  }

  $: revelantSubmissions = getRevelantSubmissions(submissions);
</script>

<div
  class="tab-pane fade challenge-content"
  id="challenge{challenge.id}"
  role="tabpanel"
>
  <h3>{challenge.name}</h3>
  <div class="table-responsive">
    <table class="table table-sm" id="challenge{challenge.id}Table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Team</th>
          <th>Score</th>
          <th>Penalty</th>
          <th>Submitted At</th>
        </tr>
      </thead>
      <tbody>
        <TableBody {revelantSubmissions} {teams} />
      </tbody>
    </table>
  </div>
</div>
