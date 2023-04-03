<template>
  <div class="app-container">
    <activity-form :is-edit="true" />
  </div>
</template>

<script>
import ActivityForm from './components/activityForm'

export default {
  components: { ActivityForm }
}
</script>
