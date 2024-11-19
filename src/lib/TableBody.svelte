<script lang="ts">
  import type { Submission, Team } from "./types";

  export let revelantSubmissions: Submission[];
  export let teams: Team[];
</script>

{#each revelantSubmissions as sub, index}
  <tr>
    <td>{index + 1}</td>
    <td>{teams.find((t) => t.id === sub.teamId)?.name ?? "undefined"}</td>
    <td>{sub.score}</td>
    <td>{sub.penalty}</td>
    <td>{new Date(sub.submittedAt).toLocaleString()}</td>
  </tr>
{/each}
