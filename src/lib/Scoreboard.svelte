<script lang="ts">
  import type { ScoreboardSchema } from "./types";

  export let data: ScoreboardSchema;

  $: ({ challenges, progress, submissions, teams } = data);
</script>
