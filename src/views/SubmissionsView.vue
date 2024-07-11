<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title class="headline">Submissions</v-card-title>
              <v-tabs v-model="activeTab" background-color="primary" dark>
                <v-tab value="non">Non-Approved</v-tab>
                <v-tab value="all">All Submissions</v-tab>
              </v-tabs>
              <v-tabs-window v-model="activeTab">
                <v-tabs-window-item value="non">
                  <v-data-table :headers="headers" :items="nonApprovedSubmissions" item-key="submissionId">
                    <template v-slot:[`item.actions`]="{ item }">
                      <v-btn color="blue darken-1" @click="viewSubmission(item)">View</v-btn>
                      <v-btn color="green darken-1" @click="confirmApprove(item.submissionId)">Approve</v-btn>
                    </template>
                  </v-data-table>
                </v-tabs-window-item>
                <v-tabs-window-item value="all">
                  <v-data-table :headers="headers" :items="allSubmissions" item-key="submissionId">
                    <template v-slot:[`item.actions`]="{ item }">
                      <v-btn color="blue darken-1" @click="viewSubmission(item)">View</v-btn>
                    </template>
                  </v-data-table>
                </v-tabs-window-item>
              </v-tabs-window>
            </v-card>
          </v-col>
        </v-row>

        <!-- View Submission Dialog -->
        <v-dialog v-model="viewDialog" max-width="600px">
          <v-card>
            <v-card-title class="headline">Submission Details</v-card-title>
            <v-card-text>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Submission ID</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedSubmission.submissionId }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Username</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedSubmission.user.username }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Email</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedSubmission.user.email }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Race Name</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedSubmission.raceName }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Distance (KM)</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedSubmission.distanceKm }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Location</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedSubmission.location }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>Submission Date</v-list-item-title>
                    <v-list-item-subtitle>{{ selectedSubmission.submissionDate }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="selectedSubmission.submissionFilename">
                  <v-list-item-content>
                    <v-list-item-title>Submission Proof</v-list-item-title>
                    <v-img :src="submissionImageUrl" :width="500" ></v-img>
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
            <v-card-text>Are you sure you want to approve this submission?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeConfirmDialog">Cancel</v-btn>
              <v-btn color="green darken-1" text @click="approveSubmission(confirmSubmissionId)">Approve</v-btn>
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
      activeTab: 'non',
      nonApprovedSubmissions: [],
      allSubmissions: [],
      confirmDialog: false,
      confirmSubmissionId: null,
      viewDialog: false,
      selectedSubmission: {},
      submissionImageUrl: '',
      raceNames: '',
      headers: [
        { title: 'Submission ID', value: 'submissionId' },
        { title: 'Username', value: 'userName' },
        { title: 'Email', value: 'userEmail ' },
        { title: 'Race Name', value: 'raceNames' },
        { title: 'Distance (KM)', value: 'distanceKm' },
        { title: 'Location', value: 'location' },
        { title: 'Submission Date', value: 'submissionDate' },
        { title: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
  created() {
    this.fetchNonApprovedSubmissions();
    this.fetchAllSubmissions();
  },
  methods: {
    fetchNonApprovedSubmissions() {
      axios.get('/submissions/non-approved').then(response => {
        this.nonApprovedSubmissions = response.data;
      });
    },
    fetchAllSubmissions() {
      axios.get('/submissions/all').then(response => {
        this.allSubmissions = response.data;
      });
    },
    viewSubmission(item) {
      this.selectedSubmission = item;
      if (item.submissionFilepath) {
        this.fetchSubmissionImage(item.submissionFilepath);
      }
      this.viewDialog = true;
    },
    fetchSubmissionImage(filename) {
      axios.get(`/submissions/proofs/${filename}`, { responseType: 'blob' })
        .then(response => {
          const url = URL.createObjectURL(new Blob([response.data]));
          this.submissionImageUrl = url;
        })
        .catch(error => {
          console.error('There was an error fetching the image!', error);
        });
    },
    closeViewDialog() {
      this.viewDialog = false;
      this.selectedSubmission = {
        user: {}
      };
      this.submissionImageUrl = '';
    },
    confirmApprove(submissionId) {
      this.confirmSubmissionId = submissionId;
      this.confirmDialog = true;
    },
    closeConfirmDialog() {
      this.confirmDialog = false;
    },
    approveSubmission(submissionId) {
      axios.post(`/submissions/approve/${submissionId}`).then(() => {
        this.fetchNonApprovedSubmissions();
        this.fetchAllSubmissions();
        this.closeConfirmDialog();
      }).catch(error => {
        console.error('There was an error approving the submission!', error);
      });
    },
  },
};
</script>

<style scoped>
/* Add any custom styles here */
</style>