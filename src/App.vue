<template>
  <v-app>
    <SideBar v-if="showSidebar" />
    <v-app-bar app>
      <v-toolbar-title>Dashboard</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import SideBar from './components/SideBar.vue';

export default {
  components: {
    SideBar,
  },
  setup() {
    const route = useRoute();
    const showSidebar = computed(() => route.name !== 'Login');
    return {
      showSidebar,
    };
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>