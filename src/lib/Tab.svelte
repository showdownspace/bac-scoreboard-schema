<script lang="ts">
  import type { Challenge } from "./types";

  export let challenge: Challenge;
</script>

<li class="nav-item challenge-tab" role="presentation">
  <button
    class="nav-link"
    id="challenge{challenge.id}-tab"
    data-bs-toggle="tab"
    data-bs-target="#challenge{challenge.id}"
    type="button"
    role="tab"
  >
    {challenge.name}
  </button>
</li>
