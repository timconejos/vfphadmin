<template>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card>
            <v-card-title class="headline">Login</v-card-title>
            <v-card-text>
              <v-form>
                <v-text-field label="Username" v-model="email"></v-text-field>
                <v-text-field label="Password" v-model="password" type="password"></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="login">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: '',
      };
    },
    methods: {
      login() {
        // Hardcoded credentials
        const hardcodedEmail = 'admin';
        const hardcodedPassword = 'password';
  
        if (this.email === hardcodedEmail && this.password === hardcodedPassword) {
          localStorage.setItem('authenticated', 'true');
          this.$router.push('/dashboard');
        } else {
          alert('Invalid credentials. Please try again.');
        }
      },
    },
  };
  </script>