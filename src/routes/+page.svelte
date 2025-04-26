<script lang="ts">
  import { onMount } from "svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as Card from "$lib/components/ui/card/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Label } from "$lib/components/ui/label/index.js";

  let backgroundImage = "";

  onMount(() => {
    const updateBackground = async() => {
      const isMobile = window.innerWidth <= 768;
      backgroundImage = isMobile
      ? (await import('$lib/images/m_login.jpg')).default
      : (await import('$lib/images/login.jpg')).default
    }

    updateBackground();
    window.addEventListener("resize", updateBackground);

    return () => window.removeEventListener("resize", updateBackground);
  });
</script>

<div
  class="flex items-center justify-center h-screen bg-cover bg-center transition-all duration-500"
  style="background-image: url('{backgroundImage}')"
>
  <Card.Root class="w-full max-w-sm mx-5">
    <Card.Header>
      <Card.Title class="text-2xl text-center">ENTRE</Card.Title>
      <!-- <Card.Description>Enter your email below to login to your account.</Card.Description> -->
    </Card.Header>
    <Card.Content class="grid gap-4">
      <div class="grid gap-2">
        <Label for="email">Usuário</Label>
        <Input id="email" type="email" required />
      </div>
      <div class="grid gap-2">
        <Label for="password">Senha</Label>
        <Input id="password" type="password" required />
      </div>
    </Card.Content>
    <Card.Footer>
      <Button class="w-full">Sign in</Button>
    </Card.Footer>
  </Card.Root>
</div>
