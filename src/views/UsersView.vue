<template>
    <v-container>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title class="headline">Users</v-card-title>
            <v-card-text>
              <v-data-table :headers="headers" :items="users" item-key="id">
                <template v-slot:[`item.actions`]="{ item }">
                  <v-btn color="blue darken-1" @click="openViewDialog(item)">View</v-btn>
                  <v-btn color="red darken-1" @click="banUser(item.id)">Ban</v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- View User Dialog -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">View User</span>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Username</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedUser.username }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Email</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedUser.email }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Role</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedUser.role }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Enabled</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedUser.enabled ? 'Yes' : 'No' }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Register Date</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedUser.registerDate }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Last Login Date</v-list-item-title>
                  <v-list-item-subtitle>{{ selectedUser.loginDate }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeDialog">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  import axios from '../axios';
  
  export default {
    data() {
      return {
        users: [],
        dialog: false,
        selectedUser: {},
        headers: [
          { text: 'Username', value: 'username' },
          { text: 'Email', value: 'email' },
          { text: 'Role', value: 'role' },
          { text: 'Enabled', value: 'enabled' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
      };
    },
    created() {
      this.fetchUsers();
    },
    methods: {
      fetchUsers() {
        axios.get('/users')
          .then(response => {
            this.users = response.data;
          })
          .catch(error => {
            console.error("There was an error fetching the users!", error);
          });
      },
      openViewDialog(user) {
        this.selectedUser = user;
        this.dialog = true;
      },
      closeDialog() {
        this.dialog = false;
      },
      banUser(userId) {
        axios.put(`/users/${userId}/disable`)
          .then(() => {
            this.fetchUsers();
          })
          .catch(error => {
            console.error("There was an error banning the user!", error);
          });
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add any custom styles here */
  </style>