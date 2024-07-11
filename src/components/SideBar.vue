<template>
  <v-navigation-drawer app>
    <v-list dense>
      <v-list-item-group v-model="selectedItem">
        <v-list-item v-for="(item, index) in items" :key="index" :to="item.route" tag="router-link" active-class="v-list-item--active" @click="selectItem(index)">
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      selectedItem: 1, // Default to "Races" which is at index 1
      items: [
        { title: 'Submissions', route: '/submissions' },
        { title: 'Races', route: '/dashboard' },
        { title: 'Users', route: '/users' },
        { title: 'Feed', route: '/feed' },
        { title: 'Registrations', route: '/registrations' },
      ],
    };
  },
  methods: {
    selectItem(index) {
      this.selectedItem = index;
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>