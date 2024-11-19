<script lang="ts">
  import DashboardCell from "./DashboardCell.svelte";
  import type { Challenge, SortedTeam, Submission, Progress } from "./types";

  export let team: SortedTeam[number];
  export let challenges: Challenge[];
  export let submissions: Submission[];
  export let progresses: Progress[];
</script>

<tr>
  <td>{team.name}</td>

  {#each challenges as challenge}
    <DashboardCell {team} {challenge} {submissions} {progresses} />
  {/each}

  <td class="total-cell">{team.totalScore}</td>
</tr>

<style>
  .total-cell {
    font-weight: "bold";
    text-align: "right";
  }
</style>
