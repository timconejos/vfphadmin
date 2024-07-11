<template>
    <v-app>
      <v-main>
        <v-container>
          <v-row>
            <v-col>
              <v-card>
                <v-card-title class="headline">Registrations</v-card-title>
                <v-text-field v-model="search" label="Search" append-icon="mdi-magnify" @keyup="searchRegistrations"></v-text-field>
                <v-tabs v-model="activeTab" background-color="primary" dark>
                  <v-tab value="non">Non-Approved</v-tab>
                  <v-tab value="all">All Registrations</v-tab>
                </v-tabs>
                <v-tabs-window v-model="activeTab">
                    <v-tabs-window-item value="non">
                    <v-data-table :headers="headers" :items="nonApprovedRegistrations" item-key="id">
                      <template v-slot:[`item.actions`]="{ item }">
                        <v-btn color="blue darken-1" @click="viewRegistration(item)">View</v-btn>
                        <v-btn color="green darken-1" @click="confirmApprove(item.registration.id)">Approve</v-btn>
                      </template>
                    </v-data-table>
                    </v-tabs-window-item>
                    <v-tabs-window-item value="all">
                    <v-data-table :headers="headers" :items="allRegistrations" item-key="id">
                      <template v-slot:[`item.actions`]="{ item }">
                        <v-btn color="blue darken-1" @click="viewRegistration(item)">View</v-btn>
                      </template>
                    </v-data-table>
                  </v-tabs-window-item>
                </v-tabs-window>
              </v-card>
            </v-col>
          </v-row>
  
          <!-- View Registration Dialog -->
          <v-dialog v-model="viewDialog" max-width="600px">
            <v-card>
              <v-card-title class="headline">Registration Details</v-card-title>
              <v-card-text>
                <v-list dense>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Registration ID</v-list-item-title>
                      <v-list-item-subtitle>{{ selectedRegistration.id }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>User ID</v-list-item-title>
                      <v-list-item-subtitle>{{ selectedRegistration.username }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Race ID</v-list-item-title>
                      <v-list-item-subtitle>{{ selectedRegistration.raceId }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Race Type</v-list-item-title>
                      <v-list-item-subtitle>{{ selectedRegistration.racetype }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Contact Number</v-list-item-title>
                      <v-list-item-subtitle>{{ selectedRegistration.contactNumber }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>T-Shirt Size</v-list-item-title>
                      <v-list-item-subtitle>{{ selectedRegistration.tshirtSize }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Race Distance</v-list-item-title>
                      <v-list-item-subtitle>{{ selectedRegistration.raceDistance }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Reference Number</v-list-item-title>
                      <v-list-item-subtitle>{{ selectedRegistration.referenceNumber }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Agreed to Terms</v-list-item-title>
                      <v-list-item-subtitle>{{ selectedRegistration.agreedToTerms }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Approved</v-list-item-title>
                      <v-list-item-subtitle>{{ selectedRegistration.approved }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Distance Progress</v-list-item-title>
                      <v-list-item-subtitle>{{ selectedRegistration.distanceProgress }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>Registration Date</v-list-item-title>
                      <v-list-item-subtitle>{{ selectedRegistration.registrationDate }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeViewDialog">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
  
          <!-- Confirm Approve Dialog -->
          <v-dialog v-model="confirmDialog" max-width="400px">
            <v-card>
              <v-card-title class="headline">Confirm Approve</v-card-title>
              <v-card-text>Are you sure you want to approve this registration?</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeConfirmDialog">Cancel</v-btn>
                <v-btn color="green darken-1" text @click="approveRegistration(confirmRegistrationId)">Approve</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script>
  import axios from '../axios';
  
  export default {
    data() {
      return {
        activeTab: 0,
        search: '',
        nonApprovedRegistrations: [],
        allRegistrations: [],
        confirmDialog: false,
        confirmRegistrationId: null,
        viewDialog: false,
        selectedRegistration: {},
        headers: [
          { title: 'Registration ID', value: 'registration.id' },
          { title: 'User Name', value: 'user.username' },
          { title: 'User Email', value: 'user.email' },
          { title: 'Race', value: 'race.raceName' },
          { title: 'Race Type', value: 'registration.racetype' },
          { title: 'Contact Number', value: 'registration.contactNumber' },
          { title: 'T-Shirt Size', value: 'registration.tshirtSize' },
          { title: 'Race Distance', value: 'registration.raceDistance' },
          { title: 'Registration Date', value: 'registration.registrationDate' },
          { title: 'Actions', value: 'actions', sortable: false },
        ],
      };
    },
    created() {
      this.fetchNonApprovedRegistrations();
      this.fetchAllRegistrations();
    },
    methods: {
      fetchNonApprovedRegistrations() {
        axios.get('/api/registrations/non-approved').then(response => {
          this.nonApprovedRegistrations = response.data;
        });
      },
      fetchAllRegistrations() {
        axios.get('/api/registrations/all').then(response => {
          this.allRegistrations = response.data;
        });
      },
      searchRegistrations() {
        // Add your search logic here, this is a simple example
        const query = this.search.toLowerCase();
        this.nonApprovedRegistrations = this.nonApprovedRegistrations.filter(registration =>
          Object.values(registration).some(value =>
            String(value).toLowerCase().includes(query)
          )
        );
        this.allRegistrations = this.allRegistrations.filter(registration =>
          Object.values(registration).some(value =>
            String(value).toLowerCase().includes(query)
          )
        );
      },
      viewRegistration(item) {
        this.selectedRegistration = item;
        this.viewDialog = true;
      },
      closeViewDialog() {
        this.viewDialog = false;
        this.selectedRegistration = {};
      },
      confirmApprove(registrationId) {
        this.confirmRegistrationId = registrationId;
        this.confirmDialog = true;
      },
      closeConfirmDialog() {
        this.confirmDialog = false;
      },
      approveRegistration(registrationId) {
        axios.post(`/api/registrations/approve/${registrationId}`).then(() => {
          this.fetchNonApprovedRegistrations();
          this.fetchAllRegistrations();
          this.closeConfirmDialog();
        }).catch(error => {
          console.error('There was an error approving the registration!', error);
        });
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add any custom styles here */
  </style>
  ``