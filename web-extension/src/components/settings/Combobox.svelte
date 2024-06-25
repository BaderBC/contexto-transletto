<script context="module" lang="ts">
  export interface ComboboxItem {
    value: string;
    label: string;
  }
</script>

<script lang="ts">
  import '../app.pcss';

  import Check from 'svelte-radix/Check.svelte';
  import CaretSort from 'svelte-radix/CaretSort.svelte';
  import * as Command from '$lib/ui/command';
  import * as Popover from '$lib/ui/popover';
  import { Button } from '$lib/ui/button';
  import { cn } from '$lib/utils';
  import { tick } from 'svelte';
  import { clickBeforeClosingModal } from '../stores/clickBeforeClosingModalStore';

  export let items: ComboboxItem[];
  export let searchBarPlaceholder: string = undefined;
  export let defaultSelectedValue: string = 'Select an item...';

  let open = false;
  let value = '';

  $: selectedValue =
    items.find((f) => f.value === value)?.label || defaultSelectedValue;

  // We want to refocus the trigger button when the user selects
  // an item from the list so users can continue navigating the
  // rest of the form with the keyboard.
  function closeAndFocusTrigger(triggerId: string) {
    clickBeforeClosingModal.value++;
    open = false;
    tick().then(() => {
      document.getElementById(triggerId)?.focus();
    });
  }
</script>

<Popover.Root bind:open let:ids>
  <Popover.Trigger asChild let:builder>
    <Button
      builders={[builder]}
      variant="outline"
      role="combobox"
      aria-expanded={open}
      class="w-[100%] justify-between"
    >
      {selectedValue}
      <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </Popover.Trigger>
  <Popover.Content class="w-[300px] p-0" on:click={(e) => e.stopPropagation()}>
    <Command.Root>
      {#if (searchBarPlaceholder)}
        <Command.Input placeholder={searchBarPlaceholder} class="h-9" />
        <Command.Empty>No such item found.</Command.Empty>
      {/if}
      <Command.Group>
        {#each items as item}
          <Command.Item
            value={item.value}
            onSelect={(currentValue) => {
              value = currentValue;
              closeAndFocusTrigger(ids.trigger);
            }}
          >
            <Check
              class={cn(
                "mr-2 h-4 w-4",
                value !== item.value && "text-transparent"
              )}
            />
            {item.label}
          </Command.Item>
        {/each}
      </Command.Group>
    </Command.Root>
  </Popover.Content>
</Popover.Root>
