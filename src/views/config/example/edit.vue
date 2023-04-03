<template>
  <div class="app-container">
    <example-form :is-edit="true" />
  </div>
</template>

<script>
import ExampleForm from './components/exampleForm'

export default {
  components: { ExampleForm }
}
</script>
