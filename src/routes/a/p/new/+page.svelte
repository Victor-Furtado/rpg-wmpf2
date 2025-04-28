<script lang="ts">
  import * as Alert from "$lib/components/ui/alert";
  import * as Carousel from "$lib/components/ui/carousel/index.js";
  import * as Drawer from "$lib/components/ui/drawer";
  import * as Select from "$lib/components/ui/select";
  import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
  import AIcon from "lucide-svelte/icons/person-standing";
  import BookOpen from "lucide-svelte/icons/book-open-check";
  import { Badge } from "$lib/components/ui/badge";
  import type { AResponse } from "$lib/types/pocketbase-types.js";
  import { attributeList, emptycharacter } from "$lib/utils.js";
  import Input from "$lib/components/ui/input/input.svelte";

  let { data } = $props();

  let aOpen = $state(false);
  let attrErr = $state<string | null>(null);
  let character = $state(emptycharacter);
  let aux = $state<any>({});

  const selectAncestry = (a: AResponse) => () => {
    character = emptycharacter;
    character.a = a.id;
    aux.a = a;
    aOpen = false;
    aux.boosts = a.boosts.split(",").map((boostStr) => {
      const boost = parseInt(boostStr);
      ++character.sheet.attributes[boost];
      return boost;
    });
    aux.flaws = a.flaws.split(",").map((flawStr) => {
      const flaw = parseInt(flawStr);
      --character.sheet.attributes[flaw];
      return flaw;
    });
  };

  const selectAttrA = (i: number) => (v: any) => {
    aux.boosts[i] = v.value;
    if (
      aux.boosts.some(
        (value: number, index: number) => aux.boosts.indexOf(value) !== index
      )
    ) {
      attrErr = "Ilegal: Atributos não podem se repetir";
    } else {
      attrErr = null;
    }
  };
</script>

{#await data}
  <section>
    <Skeleton class="w-full h-16 rounded-lg" />
  </section>
{:then data}
  {@const A = data.A}
  <section>
    <Alert.Root>
      <AIcon class="h-9 w-9" />
      <Alert.Title class="pl-3">Ancestralidade</Alert.Title>
      <Alert.Description class="pl-3"
        >Uma ancestralidade fornece melhorias de atributo (e talvez defeitos de
        atributo), Pontos de Vida, talentos de ancestralidade e às vezes
        habilidades adicionais.</Alert.Description
      >
    </Alert.Root>
    <div class="flex flex-col lg:flex-row gap-2">
      <Drawer.Root bind:open={aOpen}>
        {#if character.a === ""}
          <Drawer.Trigger
            class="w-full h-32 md:size-64 rounded-lg bg-gray-500 flex flex-col items-center justify-center cursor-pointer"
          >
            <h2 class="text-2xl font-bold text-center">
              Escolher ancestralidade
            </h2>
            <BookOpen class="h-12 w-12" />
          </Drawer.Trigger>
        {:else}
          <Drawer.Trigger
            class="w-full h-64 md:size-64 rounded-lg bg-gray-500 flex flex-col items-center justify-center cursor-pointer bg-cover bg-top bg-no-repeat"
            style="background-image: url('{aux.a?.image_url}')"
          >
            <div
              class="w-full h-full flex flex-col justify-end bg-gradient-to-t from-black via-black/50 to-transparent p-1"
            >
              <h4>{aux.a?.name}</h4>
            </div>
          </Drawer.Trigger>
        {/if}
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>Are you sure absolutely sure?</Drawer.Title>
            <Drawer.Description
              >This action cannot be undone.</Drawer.Description
            >
          </Drawer.Header>
          <Carousel.Root
            opts={{
              align: "start",
            }}
            class="w-11/12 m-auto"
          >
            <Carousel.Content>
              {#each A as a}
                <Carousel.Item
                  class="md:basis-1/3 lg:basis-1/4 xl:basis-1/6 h-96"
                >
                  <!-- svelte-ignore event_directive_deprecated -->
                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div
                    on:click={selectAncestry(a)}
                    class="size-full m-auto rounded-lg bg-cover bg-top bg-no-repeat bg-gray-500 cursor-pointer"
                    style="background-image: url('{a.image_url}')"
                  >
                    <div
                      class="h-full flex flex-col justify-end bg-gradient-to-t from-black via-black/50 to-transparent p-1"
                    >
                      <h4>{a.name}</h4>
                      <Badge variant="outline">{`Humanoide - ${a.size}`}</Badge>
                    </div>
                  </div>
                </Carousel.Item>
              {/each}
            </Carousel.Content>
            <Carousel.Previous />
            <Carousel.Next />
          </Carousel.Root>
          <Drawer.Footer>
            <Drawer.Close>Cancel</Drawer.Close>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Root>
      <div class="flex flex-col gap-2 p-4">
        {#if aux.a}
          {#if aux.a.boosts}
            <div class="flex items-center flex-col lg:flex-row gap-2">
              <h4>MELHORIAS:</h4>
              {#each aux.a.boosts.split(",") as boostStr, i}
                {@const boost = parseInt(boostStr)}
                {#if boost === 0}
                  <Select.Root
                    selected={aux.boosts[i]}
                    onSelectedChange={selectAttrA(i)}
                  >
                    <Select.Trigger class="w-48">
                      <Select.Value placeholder="ATRIBUTO LIVRE" />
                    </Select.Trigger>
                    <Select.Content>
                      {#each attributeList as attr, j}
                        <Select.Item value={j + 1}>{attr}</Select.Item>
                      {/each}
                    </Select.Content>
                  </Select.Root>
                {:else}
                  <Input class="flex-1" disabled value={attributeList[boost - 1]} />
                {/if}
              {/each}
            </div>
          {/if}
          <p class="text-red-500 text-sm">
            {attrErr}
          </p>
          {#if aux.a.flaws}
            <div class="flex items-center flex-col lg:flex-row gap-2">
              <h4>DEFEITOS:</h4>
              {#each aux.a.flaws.split(",") as flawStr}
                {@const flaw = parseInt(flawStr)}
                {#if flaw === 0}
                  <Select.Root>
                    <Select.Trigger class="w-48">
                      <Select.Value placeholder="ATRIBUTO LIVRE" />
                    </Select.Trigger>
                    <Select.Content>
                      {#each attributeList as attr, i}
                        <Select.Item value={i + 1}>{attr}</Select.Item>
                      {/each}
                    </Select.Content>
                  </Select.Root>
                {:else}
                  <Input class="flex-1" disabled value={attributeList[flaw - 1]} />
                {/if}
              {/each}
            </div>
          {/if}
        {/if}
      </div>
    </div>
  </section>
{/await}
<!-- <pre>{JSON.stringify(aux)}</pre> -->
