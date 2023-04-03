<template>
  <div class="app-container">
    <example-form :is-edit="false" />
  </div>
</template>

<script>
import ExampleForm from './components/exampleForm'

export default {
  components: { ExampleForm }
}
</script>
