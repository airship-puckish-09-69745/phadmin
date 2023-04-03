<template>
  <div class="app-container">
    <activity-form :is-edit="false" />
  </div>
</template>

<script>
import ActivityForm from './components/activityForm'

export default {
  components: { ActivityForm }
}
</script>
