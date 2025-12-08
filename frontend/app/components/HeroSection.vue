<template>
  <section class="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 class="text-4xl md:text-5xl font-bold mb-4">Welcome to Our Store</h2>
      <p class="text-xl text-blue-100 mb-8">Discover amazing products at great prices</p>
      <NuxtLink to="/products">
        <Button class="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold">
          Shop Now
        </Button>
      </NuxtLink>
    </div>
  </section>
</template>