<script lang="ts">
  import { onMount } from "svelte";
  import DashboardRow from "./lib/DashboardRow.svelte";
  import Tab from "./lib/Tab.svelte";
  import TabContent from "./lib/TabContent.svelte";
  import type {
    Challenge,
    Progress,
    ScoreboardSchema,
    SortedTeam,
    Submission,
    Team,
    TeamScore,
  } from "./lib/types";

  let challenges: Challenge[] = [];
  let progress: Progress[] = [];
  let submissions: Submission[] = [];
  let teams: Team[] = [];

  let teamScores: TeamScore = {};
  let sortedTeams: SortedTeam = [];

  function computeTeamScore() {
    const newTeamScores: TeamScore = {};
    teams.forEach((team) => {
      newTeamScores[team.id] = {
        id: team.id,
        name: team.name,
        totalScore: 0,
        challenges: {},
      };
    });

    challenges.forEach((challenge) => {
      const relevantSubmissions = submissions
        .filter(
          (s) => s.challengeId === challenge.id && s.status === "accepted"
        )
        .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));

      // Update team scores
      relevantSubmissions.forEach((sub) => {
        if (sub.status === "accepted") {
          newTeamScores[sub.teamId].totalScore += sub.score;
        }
      });
    });

    return newTeamScores;
  }

  let errorMessage = "";

  async function loadData(firstLoad = true) {
    console.log("ping");
    const url = (document.getElementById("jsonUrl") as HTMLInputElement).value;

    try {
      const currentTab = document
        .querySelector(".nav-link.active")
        ?.getAttribute("data-bs-target");

      const response = await fetch(url);
      const data = (await response.json()) as ScoreboardSchema;
      // createChallengeTabs(data);
      // displayScoreboard(data);

      // Update
      challenges = data.challenges;
      progress = data.progress;
      submissions = data.submissions;
      teams = data.teams;

      teamScores = computeTeamScore();

      sortedTeams = Object.values(teamScores).sort(
        (a, b) => b.totalScore - a.totalScore
      );

      if (firstLoad) {
        // Use setTimeout to make it works
        setTimeout(() => {
          // Switch to first challenge tab after loading
          (
            document.querySelector(
              '#scoreTabs .nav-link[data-bs-target="#challenge1"]'
            ) as HTMLButtonElement
          )?.click();
        }, 100);
      } else {
        // Switch back to the current tab
        (
          document.querySelector(
            `#scoreTabs .nav-link[data-bs-target="${currentTab}"]`
          ) as HTMLButtonElement
        )?.click();
      }

      errorMessage = "";
    } catch (error) {
      errorMessage = `Error loading data: ${error}`;
    }
  }

  let intervalId = 0;

  function setRefreshInterval() {
    const intervalInput = document.getElementById(
      "resetInterval"
    ) as HTMLInputElement;

    const interval = parseInt(intervalInput.value);

    if (interval >= 1000) {
      if (intervalId) {
        clearInterval(intervalId);
      }

      intervalId = setInterval(() => {
        loadData(false);
      }, interval);
    } else {
      intervalInput.value = "1000";
    }
  }

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("url")) {
      const url = params.get("url")!;
      (document.getElementById("jsonUrl") as HTMLInputElement).value = url;
    }
    loadData(true);
    setRefreshInterval();
  });
</script>

<main class="container my-4">
  {#if errorMessage}
    <div class="alert alert-danger" role="alert">
      {errorMessage}
    </div>
  {/if}

  <div class="d-flex">
    <h1>BAC Scoreboard</h1>
    <button
      class="btn btn-primary rounded mx-4"
      on:click={() => loadData(false)}
    >
      Reload Data
    </button>
  </div>

  <ul class="nav nav-tabs mb-3" id="scoreTabs" role="tablist">
    <li class="nav-item" role="presentation">
      <button
        class="nav-link active"
        id="load-tab"
        data-bs-toggle="tab"
        data-bs-target="#load"
        type="button"
        role="tab"
      >
        Load Data
      </button>
    </li>
    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
        id="dashboard-tab"
        data-bs-toggle="tab"
        data-bs-target="#dashboard"
        type="button"
        role="tab"
      >
        Dashboard
      </button>
    </li>

    {#each challenges as challenge}
      <Tab {challenge} />
    {/each}

    <li class="nav-item" role="presentation">
      <button
        class="nav-link"
        id="final-tab"
        data-bs-toggle="tab"
        data-bs-target="#final"
        type="button"
        role="tab"
      >
        Final Scoreboard
      </button>
    </li>
  </ul>

  <div class="tab-content" id="scoreTabContent">
    <!-- Load Data Tab -->
    <div class="tab-pane fade show active" id="load" role="tabpanel">
      <div class="mb-4">
        <label for="jsonUrl" class="form-label">Enter JSON URL:</label>
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            id="jsonUrl"
            value="/example.json"
          />
          <button class="btn btn-primary" on:click={() => loadData(true)}>
            Load
          </button>
        </div>
      </div>

      <div class="mb-4">
        <label for="resetInterval" class="form-label"
          >Refresh Interval (ms):</label
        >
        <div class="input-group">
          <input
            type="number"
            class="form-control"
            id="resetInterval"
            value="10000"
          />
          <button class="btn btn-primary" on:click={() => setRefreshInterval()}>
            Set Interval
          </button>
        </div>
      </div>
    </div>

    <!-- Dashboard Tab -->
    <div class="tab-pane fade" id="dashboard" role="tabpanel">
      <div class="table-responsive">
        <table class="table table-sm table-bordered" id="dashboardTable">
          <thead>
            <tr>
              <th>Team</th>
              {#each challenges as challenge}
                <th class="dashboard-th-ws">{challenge.name}</th>
              {/each}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {#each sortedTeams as team}
              <DashboardRow
                {team}
                {challenges}
                {submissions}
                progresses={progress}
              />
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Final Scoreboard Tab -->
    <div class="tab-pane fade" id="final" role="tabpanel">
      <div class="table-responsive">
        <table class="table table-striped" id="finalScoreboard">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>Total Score</th>
            </tr>
          </thead>
          <tbody>
            {#each sortedTeams as team, index}
              <tr>
                <td>{index + 1}</td>
                <td>{team.name}</td>
                <td>{team.totalScore}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Challenge tabs will be added here dynamically -->
    {#each challenges as challenge}
      <TabContent {challenge} {submissions} {teams} />
    {/each}
  </div>
</main>

<style>
  .dashboard-th-ws {
    font-family: "Work Sans";
    text-align: center;
  }
</style>
