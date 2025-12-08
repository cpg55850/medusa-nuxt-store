<template>
  <div class="min-h-screen bg-gray-50">
    <HeaderSection />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          We're passionate about bringing you the best products with exceptional service and quality.
        </p>
      </div>

      <!-- Story Section -->
      <div class="bg-white rounded-xl shadow-md p-8 mb-12">
        <div class="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p class="text-gray-600 mb-4">
              Founded with a vision to revolutionize online shopping, we've been dedicated to providing
              high-quality products that make a difference in people's lives.
            </p>
            <p class="text-gray-600 mb-4">
              What started as a small passion project has grown into a trusted brand serving customers
              worldwide. Every product we offer is carefully selected to meet our high standards of
              quality and sustainability.
            </p>
            <p class="text-gray-600">
              We believe in transparency, ethical sourcing, and putting our customers first in everything we do.
            </p>
          </div>
          <div
            class="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
            <svg class="w-32 h-32 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Values Section -->
      <div class="mb-12">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-8">Our Values</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white rounded-lg shadow-md p-6 text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Quality First</h3>
            <p class="text-gray-600">
              We never compromise on quality. Every product is thoroughly tested and vetted.
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6 text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Sustainability</h3>
            <p class="text-gray-600">
              We're committed to eco-friendly practices and sustainable sourcing.
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-md p-6 text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Customer Focus</h3>
            <p class="text-gray-600">
              Your satisfaction is our priority. We're here to help every step of the way.
            </p>
          </div>
        </div>
      </div>

      <!-- Team Section -->
      <div class="bg-white rounded-xl shadow-md p-8">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-8">Meet Our Team</h2>
        <div class="grid md:grid-cols-4 gap-6">
          <div v-for="i in 4" :key="i" class="text-center">
            <div
              class="w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Team Member</h3>
            <p class="text-sm text-gray-600">Position</p>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-center text-white">
        <h2 class="text-3xl font-bold mb-4">Ready to Shop?</h2>
        <p class="text-lg mb-6 opacity-90">
          Explore our curated collection of premium products.
        </p>
        <NuxtLink to="/"
          class="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Browse Products
        </NuxtLink>
      </div>
    </main>

    <FooterSection />
  </div>
</template>