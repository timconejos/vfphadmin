<template>
  <v-app>
    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title class="headline">Dashboard</v-card-title>
              <v-card-actions>
                <v-btn color="primary" @click="openAddDialog">Add Race</v-btn>
              </v-card-actions>
              <v-data-table :headers="headers" :items="races" item-key="raceId">
                <template v-slot:[`item.actions`]="{ item }">
                  <v-btn color="blue darken-1" @click="openEditDialog(item)">Edit</v-btn>
                  <v-btn color="red darken-1" @click="confirmDelete(item.raceId)">Delete</v-btn>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>

        <!-- Add/Edit Race Dialog -->
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">{{ isEdit ? 'Edit Race' : 'Add Race' }}</span>
            </v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field v-model="formData.raceName" label="Race Name" required></v-text-field>
                <v-text-field v-model="formData.location" label="Location" required></v-text-field>
                <v-textarea v-model="formData.description" label="Description"></v-textarea>
                <v-text-field v-model="formData.startDate" label="Start Date" type="date" required></v-text-field>
                <v-text-field v-model="formData.endDate" label="End Date" type="date" required></v-text-field>
                <v-file-input v-model="formData.racePicture" label="Race Picture" accept="image/*"></v-file-input>
                <v-divider></v-divider>
                <h3>Racetypes</h3>
                <div v-for="(racetype, index) in formData.racetypes" :key="index" style="margin-bottom: 10px;">
                  <v-text-field v-model="racetype.name" label="Name" required></v-text-field>
                  <v-text-field v-model="racetype.price" label="Price" type="number" required></v-text-field>
                  <v-btn color="red darken-1" @click="removeRacetype(index)">Remove</v-btn>
                </div>
                <v-btn color="green darken-1" @click="addRacetype">Add Racetype</v-btn>
                <v-divider></v-divider>
                <h3>Race Distances (KM)</h3>
                <div v-for="(distance, index) in formData.distances" :key="index" style="margin-bottom: 10px;">
                  <v-text-field v-model="formData.distances[index]" label="Distance" type="number" required></v-text-field>
                  <v-btn color="red darken-1" @click="removeDistance(index)">Remove</v-btn>
                </div>
                <v-btn color="green darken-1" @click="addDistance">Add Distance</v-btn>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="confirmSaveRace">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Confirm Add/Edit Dialog -->
        <v-dialog v-model="confirmDialog" max-width="400px">
          <v-card>
            <v-card-title class="headline">Confirm</v-card-title>
            <v-card-text>Are you sure you want to {{ isEdit ? 'edit' : 'add' }} this race?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeConfirmDialog">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="saveRace">Confirm</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Confirm Delete Dialog -->
        <v-dialog v-model="confirmDeleteDialog" max-width="400px">
          <v-card>
            <v-card-title class="headline">Confirm Delete</v-card-title>
            <v-card-text>Are you sure you want to delete this race?</v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeConfirmDeleteDialog">Cancel</v-btn>
              <v-btn color="red darken-1" text @click="deleteRace(confirmDeleteRaceId)">Delete</v-btn>
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
      races: [],
      dialog: false,
      confirmDialog: false,
      confirmDeleteDialog: false,
      isEdit: false,
      confirmDeleteRaceId: null,
      formData: {
        raceId: null,
        raceName: '',
        location: '',
        description: '',
        startDate: '',
        endDate: '',
        racePicture: null,
        racePicturePath: '',
        racetypes: [
          { name: 'Medal Only', price: null },
          { name: 'Shirt Only', price: null },
          { name: 'Medal + Shirt', price: null },
          { name: 'Digital Only', price: null },
        ],
        distances: [],
      },
      headers: [
        { title: 'Race Name', value: 'raceName' },
        { title: 'Start Date', value: 'startDate' },
        { title: 'End Date', value: 'endDate' },
        { title: 'Distances', value: 'distances' },
        { title: 'Actions', value: 'actions', sortable: false },
      ],
    };
  },
  created() {
    this.fetchRaces();
  },
  methods: {
    fetchRaces() {
      axios.get('/races').then(response => {
        this.races = response.data.map(race => ({
          ...race,
          distances: race.distances ? race.distances.split(',').join(',') : ''
        }));
        this.races.forEach(race => {
          this.fetchImage(race);
        });
      });
    },
    fetchImage(race) {
      axios.get(`/images/${race.racePicturePath}`, { responseType: 'blob' })
        .then(response => {
          const url = URL.createObjectURL(new Blob([response.data]));
          race.racePicturePath = url;
        })
        .catch(error => {
          console.error('There was an error fetching the image!', error);
        });
    },
    openAddDialog() {
      this.isEdit = false;
      this.formData = {
        raceId: null,
        raceName: '',
        location: '',
        description: '',
        startDate: '',
        endDate: '',
        racePicture: null,
        racePicturePath: '',
        racetypes: [
          { name: 'Medal Only', price: null },
          { name: 'Shirt Only', price: null },
          { name: 'Medal + Shirt', price: null },
          { name: 'Digital Only', price: null },
        ],
        distances: [],
      };
      this.dialog = true;
    },
    openEditDialog(race) {
      this.isEdit = true;
      this.formData = {
        ...race,
        racePicture: null,
        distances: race.distances ? race.distances.split(',') : []
      };
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    confirmSaveRace() {
      this.confirmDialog = true;
    },
    closeConfirmDialog() {
      this.confirmDialog = false;
    },
    confirmDelete(raceId) {
      this.confirmDeleteRaceId = raceId;
      this.confirmDeleteDialog = true;
    },
    closeConfirmDeleteDialog() {
      this.confirmDeleteDialog = false;
    },
    addRacetype() {
      this.formData.racetypes.push({ name: '', price: null });
    },
    removeRacetype(index) {
      this.formData.racetypes.splice(index, 1);
    },
    addDistance() {
      this.formData.distances.push('');
    },
    removeDistance(index) {
      this.formData.distances.splice(index, 1);
    },
    saveRace() {
      if (this.formData.distances.length === 0) {
        alert('Please add at least one distance.');
        return;
      }

      let formData = new FormData();
      formData.append('raceName', this.formData.raceName);
      formData.append('location', this.formData.location);
      formData.append('description', this.formData.description);
      formData.append('startDate', this.formData.startDate);
      formData.append('endDate', this.formData.endDate);

      const racetypesData = this.formData.racetypes
        .map(rt => `${rt.name},${rt.price}`)
        .join(';');

      const distancesData = this.formData.distances.join(',');

      formData.append('racetypes', racetypesData);
      formData.append('distances', distancesData);

      if (this.formData.racePicture) {
        formData.append('image', this.formData.racePicture);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (this.isEdit) {
        axios.put(`/races/${this.formData.raceId}`, formData, config)
          .then(() => {
            this.fetchRaces();
            this.closeDialog();
            this.closeConfirmDialog();
          })
          .catch(error => {
            console.error("There was an error!", error);
          });
      } else {
        axios.post('/races/upload', formData, config)
          .then(() => {
            this.fetchRaces();
            this.closeDialog();
            this.closeConfirmDialog();
          })
          .catch(error => {
            console.error("There was an error!", error);
          });
      }
    },
    deleteRace(raceId) {
      axios.delete(`/races/${raceId}`)
        .then(() => {
          this.fetchRaces();
          this.closeConfirmDeleteDialog();
        })
        .catch(error => {
          console.error("There was an error!", error);
        });
    },
  },
};
</script>