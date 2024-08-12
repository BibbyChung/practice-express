<script lang="ts">
  import { map, scan, switchMap, takeUntil, tap } from 'rxjs'
  import { onMount } from 'svelte'
  import { getObservable, getObserverSubscribe, getSubject } from '../lib/services/layout.service'
  import { fromFetch } from 'rxjs/fetch'

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

  //   const wsResultStart$ = btnWSStart$.pipe(
  //     switchMap(() =>
  //       getObservable((ob) => {
  //         const sub = trpcWS.chat.getChatNameInfo.subscribe(
  //           "client001",
  //           getObserverSubscribe(ob)
  //         );
  //         return () => {
  //           sub.unsubscribe();
  //         };
  //       }).pipe(takeUntil(btnWSStop$))
  //     ),
  //     scan((pre, v) => {
  //       return `${pre} <br />
  // ${JSON.stringify(v)}`;
  //     }, "")
  //   );

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
  <div style="display: flex; gap: 6px;">
    <button on:click|preventDefault={() => btnWSStart$.next(true)}>trpc-ws start</button>
    <button on:click|preventDefault={() => btnWSStop$.next(true)}>trpc-ws stop</button>
  </div>
  <!-- {#if $wsResultStart$}
    <div>
      result1: {@html $wsResultStart$}
    </div>
  {/if} -->
</main>

<style>
</style>
