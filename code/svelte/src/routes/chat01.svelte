<script lang="ts">
  import { filter, scan, startWith, switchMap, tap } from 'rxjs'
  import { onMount } from 'svelte'
  import { disconnectIO, getIO } from '../lib/common/io'
  import { getObservable, getSubject } from '../lib/services/layout.service'

  type msgType = {
    userId: string
    msg: string
  }

  export let roomId: string = '01'
  let inputMsgRef: HTMLInputElement
  let inputUserIdRef: HTMLInputElement

  const isReady$ = getSubject<boolean>()
  const formSubmit$ = getSubject<boolean>()

  const sendMsgSub = formSubmit$
    .pipe(
      filter(() => inputMsgRef.value.length > 0 && inputUserIdRef.value.length > 0),
      tap(() => {
        const io = getIO(roomId)
        io.emit('msg', {
          userId: inputUserIdRef.value,
          msg: inputMsgRef.value,
        })
        inputMsgRef.value = ''
      })
    )
    .subscribe()

  onMount(() => {
    isReady$.next(true)
    return () => {
      sendMsgSub.unsubscribe()
    }
  })

  const receiveMsg$ = isReady$.pipe(
    switchMap(() =>
      getObservable<msgType>((ob) => {
        getIO(roomId).on('msg', (msgInfo) => {
          ob.next(msgInfo)
        })
      })
    ),
    scan((acc, cur) => {
      return [...acc, cur]
    }, [] as msgType[]),
    startWith([])
  )

  onMount(() => {
    return () => {
      disconnectIO(roomId)
    }
  })
</script>

<div class="flex flex-row items-end h-[calc(100vh_-_8vh)]">
  <div class="w-full">
    {#each $receiveMsg$ as item}
      {#if item.userId === inputUserIdRef.value}
        <div class="p-4 flex gap-4 items-center flex-row-reverse">
          <span>{item.userId}</span>
          <span class="bg-gray-400 rounded-full inline-block py-2 px-8">
            {item.msg}
          </span>
        </div>
      {:else}
        <div class="p-4 flex gap-4 items-center">
          <span>{item.userId}</span>
          <span class="bg-gray-400 rounded-full inline-block py-2 px-8">
            {item.msg}
          </span>
        </div>
      {/if}
    {/each}
    <form class="flex w-full" on:submit|preventDefault={() => formSubmit$.next(true)}>
      <input bind:this={inputMsgRef} type="text" class="flex-grow p-4" />
      <input
        bind:this={inputUserIdRef}
        placeholder="user id"
        type="text"
        class="w-32 bg-slate-500 p-4"
        value="bb01"
      />
      <button on:click|preventDefault={() => formSubmit$.next(true)} class="button">
        submit (roomId={roomId})
      </button>
    </form>
  </div>
</div>

<!-- markup (zero or more items) goes here -->

<style>
  /* your styles go here */
</style>
