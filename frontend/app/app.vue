<script setup lang="ts">
const client = useMedusaClient();
const { products } = await client.store.product.list();
</script>

<template>
  <h1 class="text-3xl font-bold underline">Hello world!</h1>

  <ul>
    <li v-for="product in products" :key="product.id" class="my-2 p-4 border rounded">
      <h2 class="text-xl font-semibold">{{ product.title }}</h2>
      <p class="text-gray-600">{{ product.description }}</p>
      <p class="text-green-600 font-bold mt-2">${{ (product.variants[0]?.price || 0) / 100 }}</p>
    </li>
  </ul>

  <!-- <h2 class="mt-4 font-semibold">Client Info:</h2>
  <pre class="bg-gray-100 p-4 rounded overflow-x-auto">
    {{ JSON.stringify(client, null, 2) }}
  </pre> -->

</template>