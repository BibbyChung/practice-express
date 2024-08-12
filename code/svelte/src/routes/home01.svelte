<script lang="ts">
  import { map, switchMap, tap } from 'rxjs'
  import { fromFetch } from 'rxjs/fetch'
  import { onMount } from 'svelte'
  import { getSubject } from '../lib/services/layout.service'

  const btnGetUser$ = getSubject<boolean>()
  const btnWSStart$ = getSubject<boolean>()
  const btnWSStop$ = getSubject<boolean>()

  const domain = 'http://localhost:3000'

  const user$ = btnGetUser$.pipe(
    switchMap(() => {
      return fromFetch(`${domain}/user/123`).pipe(switchMap((rep) => rep.json()))
    }),
    tap(console.log),
    map((v) => JSON.stringify(v))
  )

  onMount(() => {
    return () => {}
  })
</script>

<main style="display: flex; flex-direction: column; gap: 6px;">
  <div>
    <button on:click|preventDefault={() => btnGetUser$.next(true)}>test api</button>
  </div>
  {#if $user$}
    <div>
      result0: {$user$}
    </div>
  {/if}
</main>

<style>
</style>
